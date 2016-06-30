import React, { PropTypes, Children, cloneElement } from 'react'
import debounce from 'lodash.debounce'
import d3 from 'd3'
import d3Tip from 'd3-tip'

import Axis from './Axis'
import Legend from './Legend'
import Settings from './Settings'

class Chart extends React.Component {
  _onEnter (tooltipData, svgElement) {
    if (tooltipData && this.tip) {
      this.tip.show(tooltipData, svgElement)
    }
  }
  _onLeave (tooltipData, svgElement) {
    if (tooltipData && this.tip) {
      this.tip.hide(tooltipData, svgElement)
    }
  }
  constructor (props) {
    super(props)
    this.onEnter = this._onEnter.bind(this)
    this.onLeave = this._onLeave.bind(this)
    this.tip = props.tipFunction ? d3Tip().attr('class', 'd3-tip').html(props.tipFunction) : props.tipFunction
    this.setScale = this.setScale.bind(this)
    this.state = {
      chartWidth: props.width,
      chartHeight: props.width
    }

    this.xScale = this.setScale(this.props.xScaleType, [0, this.state.chartWidth])
    this.yScale = this.setScale(this.props.yScaleType, [this.state.chartHeight, 0])
  }

  setScale (scaleType, range) {
    // Setup xScale
    let scale = null
    if (/ordinal/.test(scaleType)) {
      scale = d3.scale.ordinal()
      if (scaleType === 'ordinalBand') {
        scale.rangeRoundBands(range)
      } else {
        scale.rangePoints(range)
      }
    } else if (scaleType === 'temporal') {
      scale = d3.time.scale.utc()
    } else if (scaleType === 'log') {
      scale = d3.scale.log()
    } else if (scaleType === 'power') {
      scale = d3.scale.pow().exponent(0.5)
    } else {
      scaleType = 'linear'
      scale = d3.scale.linear()
    }
    scale.type = scaleType
    return scale
  }

  shouldComponentUpdate (nextProps, nextState) {
    let newData = nextProps.data.length !== this.props.data.length
    let loading = nextProps.loading !== this.props.loading
    let newSettings = nextProps.settings !== this.props.settings
    let newSortBy = nextProps.sortBy !== this.props.sortBy
    let newSortOrder = nextProps.sortOrder !== this.props.sortOrder
    let newSortTypes = nextProps.sortTypes !== this.props.sortTypes
    let newXScale = nextProps.xScaleType !== this.props.xScaleType
    let newYScale = nextProps.yScaleType !== this.props.yScaleType
    if (newXScale) {
      this.xScale = this.setScale(nextProps.xScaleType, [0, nextState.chartWidth])
      this.resizeChart()
    }
    if (newYScale) {
      this.yScale = this.setScale(nextProps.yScaleType, [nextState.chartHeight, 0])
      this.resizeChart()
    }
    return newData || loading || newYScale || newSettings || newSortBy || newSortOrder || newSortTypes
  }
  componentWillUpdate (nextProps) {
  }
  componentWillReceiveProps (nextProps) {
  }
  // React LifeCycle method - called after initial render
  componentDidMount () {
    this._handleResize = debounce(this.resizeChart.bind(this), 500)
    window.addEventListener('resize', this._handleResize, false)
    this.resizeChart()
    if (this.tip) {
      d3.select(this.refs.svgRoot).call(this.tip)
    }
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this._handleResize, false)
  }
  resizeChart () {
    let props = this.props
    let rootRect = this.refs.rootElement.getBoundingClientRect()
    let svg = d3.select(this.refs.svgRoot)
    // let container = d3.select(this.refs.container)
    let chartWidth = props.width === 0 ? rootRect.width - props.margin.left - props.margin.right : Math.min((rootRect.width - props.margin.left - props.margin.right), (props.width - props.margin.left - props.margin.right))
    let chartHeight = props.height - props.margin.top - props.margin.bottom
    svg.attr('width', props.width === 0 ? rootRect.width : props.width)
      .attr('height', props.height)

    // container.select('.reset')
    //   .attr('x', chartWidth - 40)
    //   .attr('y', -props.margin.top + 1)
    if (props.yScaleType === 'ordinalBand') {
      this.yScale.rangeRoundBands([chartHeight, 0])
    } else if (props.yScaleType === 'ordinalPoint') {
      this.yScale.rangePoints([chartHeight, 0])
    } else {
      this.yScale.range([chartHeight, 0])
    }

    if (props.xScaleType === 'ordinalBand') {
      this.xScale.rangeRoundBands([0, chartWidth])
    } else if (props.xScaleType === 'ordinalPoint') {
      this.xScale.rangePoints([0, chartWidth])
    } else {
      this.xScale.range([0, chartWidth])
    }

    this.setState({chartWidth, chartHeight}, () => { this.forceUpdate() })
  }

  // We can pass down properties from Chart to children React components
  renderChild () {
    return cloneElement(Children.only(this.props.children), {
      data: this.props.data,
      loading: this.props.loading,
      status: this.props.status,
      chartWidth: this.state.chartWidth,
      chartHeight: this.state.chartHeight,
      ref: 'child',
      xScale: this.xScale,
      yScale: this.yScale,
      sortBy: this.props.sortBy,
      sortOrder: this.props.sortOrder,
      sortTypes: this.props.sortTypes,
      onEnter: this.onEnter,
      onLeave: this.onLeave
    })
  }
  render () {
    let props = this.props
    let margin = props.margin
    let left = props.margin.left
    let top = props.margin.top
    let child = this.renderChild()
    return (
      <div ref='rootElement' className={props.className} style={{position: 'relative'}}>
        <svg ref='svgRoot'>
          <defs>
            <clipPath id='clip'>
              <rect width={this.state.chartWidth} height={this.state.chartHeight} />
            </clipPath>
          </defs>
          <g ref='container' className='container' transform={'translate(' + left + ',' + top + ')'}>
            <g className='component' clipPath={props.clipPath ? 'url(#clip)' : ''}>
              {child}
            </g>
            <g className='chart-title'>
              <text y={-props.margin.top + 1} dy='0.71em'>{props.title.replace(/_/g, ' ')}</text>
            </g>
            {props.xAxis
              ? <Axis className='x axis' margin={margin} {...props.xAxis} data={props.data} scale={this.xScale} {...this.state} />
              : undefined
            }
            {props.yAxis
              ? <Axis className='y axis' margin={margin} {...props.yAxis} data={props.data} scale={this.yScale} {...this.state} />
              : undefined
            }
            {props.legend && props.data.length > 0
              ? <Legend margin={margin} scaleAccessor={props.scaleAccessor} width={this.state.chartWidth} height={this.state.chartHeight} component={this.refs.child} />
              : undefined
            }
          </g>
        </svg>
        {props.settings
          ? <Settings settings={props.settings} chart={this} />
          : undefined
        }
      </div>
    )
  }
}

Chart.defaultProps = {
  sortBy: null,
  sortOrder: null,
  sortTypes: [],
  className: '',
  settings: false,
  clipPath: false,
  data: {},
  title: '',
  xAxis: {
    type: 'x',
    orient: 'bottom',
    tickValues: false
  },
  yAxis: {
    type: 'y',
    orient: 'left'
  },
  legend: false,
  margin: {top: 15, right: 10, bottom: 20, left: 80},
  width: 0,
  height: 250,
  rangePadding: 25,
  xScaleType: 'ordinalBand',
  yScaleType: 'linear',
  tipFunction: null
}

Chart.propTypes = {
  title: PropTypes.string,
  clipPath: PropTypes.bool,
  scaleAccessor: PropTypes.string,
  sortBy: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]),
  sortOrder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]),
  sortTypes: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool
  ]),
  settings: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool
  ]),
  xAxis: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool
  ]),
  yAxis: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool
  ]),
  legend: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool
  ]),
  children: PropTypes.any,
  className: PropTypes.string,
  loading: PropTypes.bool,
  margin: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
  xScaleType: PropTypes.string,
  xDomain: PropTypes.array,
  yScaleType: PropTypes.string,
  rangePadding: PropTypes.number,
  data: PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.array
  ]),
  status: PropTypes.string,
  tipFunction: PropTypes.func
}

export default Chart
