import React, { PropTypes } from 'react'
import { extent } from 'd3'

import { setScale, isOrdinalScale } from '../util/d3'
import { spreadRelated } from '../util/react'
import Chart from '../Chart'
import Axis from '../Axis'
import Tooltip from '../Tooltip'
import Scatterplot from '../Scatterplot'

class ScatterplotChart extends React.Component {
  constructor (props) {
    super(props)
    this.xScale = setScale(props.xScaleType)
    this.yScale = setScale(props.yScaleType)

    this.xDomain = this.props.xDomain
    this.yDomain = this.props.yDomain

    this.onClick = this.onClick.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.onLeave = this.onLeave.bind(this)
    this.onResize = this.onResize.bind(this)

    this.updateDomain = this.updateDomain.bind(this)
    this.updateRange = this.updateRange.bind(this)

    this.tip = props.tipFunction
      ? new Tooltip().attr('className', 'd3-tip').html(props.tipFunction)
      : props.tipFunction

    this.updateDomain(props, this.state)
  }

  componentWillReceiveProps (nextProps) {
    this.updateDomain(nextProps, this.state)
  }

  componentWillUnmount () {
    if (this.props.tipFunction) {
      this.tip.destroy()
    }
  }

  updateDomain (props, state) {
    if (props.data.length > 0) {
      let xDomain = this.xDomain
      if (xDomain.length === 0) {
        if (this.xScale.type === 'band') {
          xDomain = props.data.map((d) => d[props.xAccessor])
        } else {
          xDomain = extent(props.data, (d) => d[props.xAccessor])
        }
      }

      let yDomain = this.yDomain
      if (yDomain.length === 0) {
        if (this.yScale.type === 'band') {
          yDomain = props.data.map((d) => d[props.yAccessor])
        } else {
          yDomain = extent(props.data, (d) => d[props.yAccessor])
        }
      }

      this.xScale.domain(xDomain)
      this.yScale.domain(yDomain)
    }
  }

  updateRange (props, state) {
    this.yScale.range([this.refs.chart.chartHeight, 0])
    if (props.yAxis.innerPadding && isOrdinalScale(this.yScale.type)) {
      this.yScale.paddingInner(props.yAxis.innerPadding)
    }

    if (props.yAxis.outerPadding && isOrdinalScale(this.yScale.type)) {
      this.yScale.paddingOuter(props.yAxis.outerPadding)
    }

    this.xScale.range([0, this.refs.chart.chartWidth])
    if (props.xAxis.innerPadding && isOrdinalScale(this.xScale.type)) {
      this.xScale.paddingInner(props.xAxis.innerPadding)
    }

    if (props.xAxis.outerPadding && isOrdinalScale(this.xScale.type)) {
      this.xScale.paddingOuter(props.xAxis.outerPadding)
    }
  }

  onClick (event, data) {
    this.props.onClick(event, data)
  }

  onEnter (event, data) {
    if (data && this.tip) {
      this.tip.show(event, data)
    }
    this.props.onEnter(event, data)
  }

  onLeave (event, data) {
    if (data && this.tip) {
      this.tip.hide(event, data)
    }
    this.props.onLeave(event, data)
  }

  onResize () {
    this.updateRange(this.props, this.state)
  }

  render () {
    let props = this.props
    return (
      <Chart ref='chart' {...spreadRelated(Chart, props)} resizeHandler={this.onResize}>
        <Scatterplot className='scatterplot' {...spreadRelated(Scatterplot, props)}
          xScale={this.xScale} yScale={this.yScale}
          onEnter={this.onEnter} onLeave={this.onLeave} />
        <Axis className='x axis' {...props.xAxis} scale={this.xScale} />
        <Axis className='y axis' {...props.yAxis} scale={this.yScale} />
      </Chart>
    )
  }
}

ScatterplotChart.defaultProps = {
  // Premade default
  data: [],
  xDomain: [],
  yDomain: [],
  // Spread chart default
  ...Chart.defaultProps,
  // Spread scatterplot default
  ...Scatterplot.defaultProps,
  xAxis: {
    type: 'x',
    orient: 'bottom',
    innerPadding: null,
    outerPadding: null,
    animationDuration: 500
  },
  yAxis: {
    type: 'y',
    orient: 'left',
    innerPadding: null,
    outerPadding: null,
    animationDuration: 500
  }
}

ScatterplotChart.propTypes = {
  ...Scatterplot.propTypes,
  ...Chart.propTypes,
  onClick: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  tipFunction: PropTypes.func,
  xScaleType: PropTypes.string,
  yScaleType: PropTypes.string,
  xDomain: PropTypes.array,
  yDomain: PropTypes.array,
  xAccessor: PropTypes.any,
  yAccessor: PropTypes.any,
  xAxis: PropTypes.object,
  yAxis: PropTypes.object
}

export default ScatterplotChart
