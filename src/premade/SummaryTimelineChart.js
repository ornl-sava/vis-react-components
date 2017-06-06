import React from 'react'
import PropTypes from 'prop-types'
import { extent, min, max } from 'd3'

import { setScale, isOrdinalScale } from '../util/d3'
import { spreadRelated } from '../util/react'
import Chart from '../Chart'
import Axis from '../Axis'
import SummaryTimeline from '../SummaryTimeline'

class SummaryTimelineChart extends React.Component {
  constructor (props) {
    super(props)
    this.xScale = setScale(props.xScaleType)
    this.yScale = setScale(props.yScaleType)
    this.opacityScale = setScale('linear')

    this.xDomain = this.props.xDomain
    this.yDomain = this.props.yDomain

    this.onClick = this.onClick.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.onLeave = this.onLeave.bind(this)
    this.onResize = this.onResize.bind(this)

    this.updateDomain = this.updateDomain.bind(this)
    this.updateRange = this.updateRange.bind(this)

    this.updateDomain(props, this.state)
    this.updateColorScales(props, this.state)
  }

  componentWillReceiveProps (nextProps) {
    this.updateDomain(nextProps, this.state)
    this.updateColorScales(nextProps, this.state)
  }

  componentWillUnmount () {
    if (this.props.tipFunction) {
      this.tip.destroy()
    }
  }

  updateColorScales (props, state) {
    // var opacityScale = d3.scaleLinear()
    //   .domain([avgMin, avgMax])
    //   .range([0.20, 0.90])
    let opacityDomain = []
    let opacityRange = []

    if (props.data.length > 0) {
      var domainMin = min(props.data, (d) => { return d.opacityValue })
      var domainMax = max(props.data, (d) => { return d.opacityValue })
      opacityDomain = [domainMin, domainMax]
      opacityRange = [0.20, 0.90]
    }

    this.opacityScale
      .domain(opacityDomain)
      .range(opacityRange)

    // console.log('SummaryTimelineChart.updateColorScales()')
    // console.log('opacityDomain: ' + opacityDomain)
    // console.log('opacityScale: ' + this.opacityScale)
  }

  updateDomain (props, state) {
    if (props.data.length > 0) {
      this.xDomain = extent(props.data, (d) => { return d.date })
      let yMin = min(props.data, (d) => { return Math.min(d.innerRangeMin, d.outerRangeMin) })
      let yMax = max(props.data, (d) => { return Math.max(d.innerRangeMax, d.outerRangeMax) })
      this.yDomain = [yMin, yMax]

      this.xScale.domain(this.xDomain)
      this.yScale.domain(this.yDomain)
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
        <SummaryTimeline className='summaryTimeline' {...spreadRelated(SummaryTimeline, props)}
          opacityScale={this.opacityScale} />
        <Axis className='x axis' {...props.xAxis} scale={this.xScale} />
        <Axis className='y axis' {...props.yAxis} scale={this.yScale} />
      </Chart>
    )
  }
}

SummaryTimelineChart.defaultProps = {
  // Premade default
  data: [],
  xDomain: [],
  yDomain: [],
  // Spread chart default
  ...Chart.defaultProps,
  // Spread scatterplot default
  ...SummaryTimeline.defaultProps,
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
  },
  xScaleType: 'time',
  yScaleType: 'linear'
}

SummaryTimelineChart.propTypes = {
  ...SummaryTimeline.propTypes,
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

export default SummaryTimelineChart
