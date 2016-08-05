import React, { PropTypes } from 'react'
import { extent, max, interpolateHcl } from 'd3'

import { setScale } from '../util/d3'
import { spreadRelated } from '../util/react'
import Chart from '../Chart'
import Axis from '../Axis'
import Tooltip from '../Tooltip'
import Heatmap from '../Heatmap'
import Legend from '../Legend'

class HeatmapChart extends React.Component {
  constructor (props) {
    super(props)
    this.xScale = setScale(props.xScaleType)
    this.yScale = setScale(props.yScaleType)
    this.colorScale = setScale('qunatile')

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
    this.tip.destroy()
  }

  updateDomain (props, state) {
    if (props.data.length > 0 && props.data[0].bins.length > 0) {
      // If xDomain is not predefined
      // NOTE: When determining domain for x the first bin is Used
      // Each bin should have matching x domain keys
      let xDomain = props.xDomain
      if (xDomain.length === 0) {
        // NOTE: Computing offset so proper xDomain is given for time scales
        // Nth bin has a start time of it's key; so it's 'end time'
        // must be taken into consideration
        let offset = props.data[0].bins[1][props.xAccessor.key] -
          props.data[0].bins[0][props.xAccessor.key]
        if (this.xScale.type === 'ordinalBand') {
          xDomain = props.data[0].bins.map((d) => d[props.xAccessor.key])
        } else {
          xDomain = extent(props.data[0].bins, (d) => d[props.xAccessor.key])
          xDomain[1] = xDomain[1] + offset
        }
      }

      // If yDomain is not predefined
      let yDomain = props.yDomain
      if (yDomain.length === 0) {
        // NOTE: Computing offset so proper xDomain is given for time scales
        // Nth bin has a start time of it's key; so it's 'end time'
        // must be taken into consideration
        // let offset = props.data[1][props.yAccessor.key] -
          // props.data[0][props.yAccessor.key]
        if (this.yScale.type === 'ordinalBand') {
          yDomain = props.data.map((d) => d[props.yAccessor.key])
        } else {
          yDomain = [0.000001, max(props.data, (d) => d[props.yAccessor.key])]
          // yDomain[1] = yDomain[1] + offset
        }
      }

      // Update scale if domains are new
      if (xDomain !== this.xDomain) {
        this.xScale.domain(xDomain)
        this.xDomain = xDomain
      }

      if (yDomain !== this.yDomain) {
        this.yScale.domain(yDomain)
        this.yDomain = yDomain
      }

      // Generate color scale
      let yMax = max(props.data, (d, i) => {
        return max(d.bins, (e, j) => e[props.xAccessor.value])
      })

      let tempColorScale = setScale('linear')
        .domain([0, yMax])
        .range([props.minColor, props.maxColor])
        .interpolate(interpolateHcl)

      let colorDomain = [0, 1]
      let colorRange = [props.minColor]
      let colorDomainBand = yMax / (props.numColorCat - 1)
      for (var i = 2; i < props.numColorCat + 1; i++) {
        let value = colorDomain[i - 1] + colorDomainBand
        if (i === 2) value--
        colorDomain.push(value)
        colorRange.push(tempColorScale(value))
      }

      this.colorScale
        .domain(colorDomain)
        .range(colorRange)
    }
  }

  updateRange (props, state) {
    this.yScale.range([this.refs.chart.chartHeight, 0])
    if (props.yAxis.innerPadding && /ordinal/.test(this.yScale.type)) {
      this.yScale.paddingInner(props.yAxis.innerPadding)
    }

    if (props.yAxis.outerPadding && /ordinal/.test(this.yScale.type)) {
      this.yScale.paddingOuter(props.yAxis.outerPadding)
    }

    this.xScale.range([0, this.refs.chart.chartWidth])
    if (props.xAxis.innerPadding && /ordinal/.test(this.xScale.type)) {
      this.xScale.paddingInner(props.xAxis.innerPadding)
    }

    if (props.xAxis.outerPadding && /ordinal/.test(this.xScale.type)) {
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
        <Heatmap className='heatmap' {...spreadRelated(Heatmap, props)}
          xScale={this.xScale} yScale={this.yScale} colorScale={this.colorScale}
          onEnter={this.onEnter} onLeave={this.onLeave} onClick={this.onClick} />
        <Axis className='x axis' {...props.xAxis} scale={this.xScale} />
        <Axis className='y axis' {...props.yAxis} scale={this.yScale} />
        <Legend colorScale={this.colorScale} />
      </Chart>
    )
  }
}

HeatmapChart.defaultProps = {
  // Premade default
  data: [],
  xDomain: [],
  yDomain: [],
  // Spread chart default
  ...Chart.defaultProps,
  // Spread heatmap default
  ...Heatmap.defaultProps,
  xAxis: {
    type: 'x',
    orient: 'bottom',
    innerPadding: null,
    outerPadding: null
  },
  yAxis: {
    type: 'y',
    orient: 'left',
    innerPadding: null,
    outerPadding: null
  }
}

HeatmapChart.propTypes = {
  ...Heatmap.propTypes,
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

export default HeatmapChart
