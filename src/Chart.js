import React, { PropTypes, Children, cloneElement } from 'react'
import debounce from 'lodash.debounce'
import d3 from 'd3'
import d3Tip from 'd3-tip'

import Axis from './Axis'
import Legend from './Legend'

class Chart extends React.Component {
  _onEnter (tooltipData, svgElement) {
    this.tip.show(tooltipData, svgElement)
  }
  _onLeave (tooltipData, svgElement) {
    this.tip.hide(tooltipData, svgElement)
  }
  constructor (props) {
    super(props)
    // Setup yScale
    if (props.yScaleType === 'ordinal') {
      this.yScale = d3.scale.ordinal()
      this.yScale.rangeRoundBands([props.height, 0])
    } else if (props.yScaleType === 'temporal') {
      this.yScale = d3.time.scale.utc()
    } else {
      this.yScale = d3.scale.linear()
    }

    // Setup xScale
    if (props.xScaleType === 'ordinal') {
      this.xScale = d3.scale.ordinal()
      this.xScale.rangeRoundBands([0, props.height])
    } else if (props.xScaleType === 'temporal') {
      this.xScale = d3.time.scale.utc()
    } else {
      this.xScale = d3.scale.linear()
    }

    this.onEnter = this._onEnter.bind(this)
    this.onLeave = this._onLeave.bind(this)
    this.tip = d3Tip().attr('class', 'd3-tip').html(props.tipFunction)
    this.state = {chartWidth: 0, chartHeight: 0}
  }
  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.data.length !== this.props.data.length || nextProps.loading !== this.props.loading
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
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this._handleResize, false)
  }
  resizeChart () {
    let props = this.props
    let rootRect = this.refs.rootElement.getBoundingClientRect()
    let svg = d3.select(this.refs.svgRoot)
    let container = d3.select(this.refs.container)
    let chartWidth = rootRect.width - props.margin.left - props.margin.right
    let chartHeight = props.height - props.margin.top - props.margin.bottom
    svg.attr('width', rootRect.width)
      .attr('height', props.height)
    svg.call(this.tip)

    container.select('.reset')
      .attr('x', chartWidth - 40)
      .attr('y', -props.margin.top + 1)
    if (props.yScaleType === 'ordinal') {
      this.yScale.rangeRoundBands([chartHeight, 0])
    } else {
      this.yScale.range([chartHeight, 0])
    }

    if (props.xScaleType === 'ordinal') {
      this.xScale.rangeRoundBands([0, chartWidth])
    } else {
      this.xScale.range([0, chartWidth])
    }

    this.setState({chartWidth, chartHeight})
    this.forceUpdate()
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
      xScaleType: this.props.xScaleType,
      yScale: this.yScale,
      yScaleType: this.props.yScaleType,
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
      <div ref='rootElement' className={props.className}>
        <svg ref='svgRoot'>
          <g ref='container' className='container' transform={'translate(' + left + ',' + top + ')'}>
            {child}
            <g className='axis'>
              <text y={-props.margin.top + 1} dy='0.71em'>{props.title.replace(/_/g, ' ')}</text>
              <text className='reset' y={-props.margin.top + 1} x={this.state.chartWidth - 20} dy='0.71em'>reset</text>
            </g>
            {props.xAxis
              ? <Axis className='x axis' margin={margin} {...props.xAxis} data={props.data} scale={this.xScale} {...this.state} />
              : undefined
            }
            {props.yAxis
              ? <Axis className='y axis' margin={margin} {...props.yAxis} data={props.data} scale={this.yScale} {...this.state} />
              : undefined
            }
            {props.legend
              ? <Legend margin={margin} width={this.state.chartWidth} height={this.state.chartHeight} colorScale={this.refs.child.state.colorScale} />
              : undefined
            }
          </g>
        </svg>
      </div>
    )
  }
}

Chart.defaultProps = {
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
  width: 400,
  height: 250,
  rangePadding: 25,
  xScaleType: 'ordinal',
  yScaleType: 'linear',
  tipFunction: (d) => { console.log(d) }
}

Chart.propTypes = {
  title: PropTypes.string,
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
  className: PropTypes.string.isRequired,
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
