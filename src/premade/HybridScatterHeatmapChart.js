import React, { PropTypes } from 'react'
import { range, interpolateHcl } from 'd3'

import { setScale } from '../util/d3'
import { spreadRelated } from '../util/react'
import Chart from '../Chart'
import Axis from '../Axis'
import Tooltip from '../Tooltip'
import Heatmap from '../Heatmap'
import Scatterplot from '../Scatterplot'
import ColumnMarkers from '../ColumnMarkers'

class HybridScatterHeatmapChart extends React.Component {
  constructor (props) {
    super(props)

    this.xScale = setScale(props.xScaleType)
    this.yScale = setScale(props.yScaleType)

    this.state = {
      expandedSectionNumbers: [], // Section #s to divide at
      domainExpansionFactor: 1, // Factor of domain to be used
      rangeExpansionFactor: 2 // Factor to expand range by
    }

    this.endTime = this.props.startTime - this.props.timeWindow

    this.scatterColorScale = setScale(props.scatterColorScaleType)
    this.heatmapColorScale = setScale(props.heatmapColorScaleType)

    // Create color scale for scatter
    this.scatterColorScale
      .range(['#FFF', '#000'])
      .interpolate(interpolateHcl)

    // Create color scale for heatmap
    let colors = []
    let tempColorScale = setScale('linear')
      .range(['#FFF', '#000'])

    range(8).map((d) => {
      colors.push(tempColorScale(d))
    })

    this.heatmapColorScale
      .range(colors)

    this.onColumnMarkerClick = this.onColumnMarkerClick.bind(this)

    this.onHeatmapClick = this.onHeatmapClick.bind(this)
    this.onHeatmapEnter = this.onHeatmapEnter.bind(this)
    this.onHeatmapLeave = this.onHeatmapLeave.bind(this)

    this.onScatterplotClick = this.onScatterplotClick.bind(this)
    this.onScatterplotEnter = this.onScatterplotEnter.bind(this)
    this.onScatterplotLeave = this.onScatterplotLeave.bind(this)

    this.onResize = this.onResize.bind(this)

    this.updateDomain = this.updateDomain.bind(this)
    this.updateRange = this.updateRange.bind(this)

    this.tip = props.tipFunction
      ? new Tooltip().attr('className', 'd3-tip').html(props.tipFunction)
      : props.tipFunction

    this.updateDomain(props, this.state)
  }

  shouldComponentUpdate (nextProps, nextState) {
    this.updateDomain(nextProps, nextState)
    this.updateRange(nextProps, nextState)
    return true
  }

  componentWillUnmount () {
    if (this.props.tipFunction) {
      this.tip.destroy()
    }
  }

  updateDomain (props, state) {
    if (props.data.length > 0 && props.data[0].bins.length > 0) {
      let horzLength = props.data[0].bins.length
      let originalTimeSlice = props.timeWindow / horzLength
      let expandedTimeSlice = originalTimeSlice * state.domainExpansionFactor

      // Compute new end time
      let timeWindow = 0
      for (let i = 0; i < horzLength; i++) {
        if (state.expandedSectionNumbers.indexOf(i) > -1) {
          timeWindow += expandedTimeSlice
        } else {
          timeWindow += originalTimeSlice
        }
      }

      // console.log(timeWindow / 1000, originalTimeSlice, expandedTimeSlice)
      this.endTime = props.startTime - timeWindow

      let xDomain = [this.endTime]
      for (let i = 0; i < horzLength - 1; i++) {
        let previous = xDomain[xDomain.length - 1]
        if (state.expandedSectionNumbers.indexOf(i) > -1) {
          xDomain.push(previous + expandedTimeSlice)
        } else {
          xDomain.push(previous + originalTimeSlice)
        }
      }
      xDomain.push(props.startTime)

      // Update window of time x scale
      this.xScale
        .domain(xDomain)

      // Update y scale domain
      this.yScale
        .domain([0, 5])

      // Update scatter color scale
      this.scatterColorScale
        .domain([0, 6])

      // Update heatmap color scale
      let colorDomain = [0, 8]
      if (typeof this.heatmap !== 'undefined') {
        colorDomain.concat(this.heatmap.reduce((a, b) => {
          return a.concat(b)
        }, []).map((d) => {
          return d.length
        }))
      }

      this.heatmapColorScale
        .domain(colorDomain)
    }
  }

  updateRange (props, state) {
    let chartWidth = this.refs.chart.chartWidth
    let chartHeight = this.refs.chart.chartHeight
    let horzLength = props.data[0].bins.length

    let originalBlockSize = chartWidth * (1 / horzLength)
    let expandedBlockSize = originalBlockSize * state.rangeExpansionFactor
    let newBlockSize = (chartWidth - (state.expandedSectionNumbers.length * expandedBlockSize)) /
      (horzLength - state.expandedSectionNumbers.length)
    let xRange = [0]

    for (let i = 0; i < horzLength - 1; i++) {
      let previous = xRange[xRange.length - 1]
      if (state.expandedSectionNumbers.indexOf(i) > -1) {
        xRange.push(previous + expandedBlockSize)
      } else {
        xRange.push(previous + newBlockSize)
      }
    }
    xRange.push(chartWidth)

    this.xScale.range(xRange)
    this.yScale.range([chartHeight, 0])
  }

  // This onClick is private to premade
  onColumnMarkerClick (event, data, index) {
    let i = this.state.expandedSectionNumbers.indexOf(index)
    let toExpand = null
    if (i > -1) {
      toExpand = this.state.expandedSectionNumbers
      toExpand.splice(i, 1)
    } else {
      let chartWidth = this.refs.chart.chartWidth
      let horzLength = this.props.data[0].bins.length

      let originalBlockSize = chartWidth * (1 / horzLength)
      let expandedBlockSize = originalBlockSize * this.state.rangeExpansionFactor
      let pending = (this.state.expandedSectionNumbers.length + 1) * expandedBlockSize
      if (pending >= chartWidth || this.state.expandedSectionNumbers.length + 1 === horzLength) {
        toExpand = this.state.expandedSectionNumbers
      } else {
        toExpand = this.state.expandedSectionNumbers
          .concat(index)
          .sort((a, b) => {
            return a - b
          })
      }
    }
    this.setState({
      expandedSectionNumbers: toExpand
    })
  }

  onHeatmapClick (event, data, index) {
    this.props.onHeatmapClick(event, data, index)
  }

  onHeatmapEnter (event, data, index) {
    if (data && this.tip) {
      this.tip.show(event, data, index)
    }
    this.props.onHeatmapEnter(event, data, index)
  }

  onHeatmapLeave (event, data, index) {
    if (data && this.tip) {
      this.tip.hide(event, data, index)
    }
    this.props.onHeatmapLeave(event, data, index)
  }

  onScatterplotClick (event, data, index) {
    this.props.onScatterplotClick(event, data, index)
  }

  onScatterplotEnter (event, data, index) {
    if (data && this.tip) {
      this.tip.show(event, data, index)
    }
    this.props.onScatterplotEnter(event, data, index)
  }

  onScatterplotLeave (event, data, index) {
    if (data && this.tip) {
      this.tip.hide(event, data, index)
    }
    this.props.onScatterplotLeave(event, data, index)
  }

  onResize () {
    this.updateRange(this.props, this.state)
  }

  render () {
    let { data, ...props } = this.props
    return (
      <Chart ref='chart' {...spreadRelated(Chart, props)} resizeHandler={this.onResize}>
        <ColumnMarkers data={data} xScale={this.xScale} onClick={this.onColumnMarkerClick} />
        <Heatmap className='heatmap' {...spreadRelated(Heatmap, {})} data={data}
          xScale={this.xScale} yScale={this.yScale} colorScale={this.heatmapColorScale}
          onEnter={this.onHeatmapEnter} onLeave={this.onHeatmapLeave} onClick={this.onHeatmapClick} />
        <Scatterplot className='scatter' {...spreadRelated(Scatterplot, {})} data={[]}
          xScale={this.xScale} yScale={this.yScale}
          onEnter={this.onScatterplotEnter} onLeave={this.onScatterplotLeave} onClick={this.onScatterplotClick} />
        <Axis className='x axis' {...props.xAxis} scale={this.xScale} />
        <Axis className='y axis' {...props.yAxis} scale={this.yScale} />
      </Chart>
    )
  }
}

// Manually define and ovveride scatterplot/heatmap accessors
HybridScatterHeatmapChart.defaultProps = {
  // Premade default
  data: [],
  xDomain: [],
  yDomain: [],
  yScaleType: 'linear',
  xScaleType: 'time',
  onHeatmapClick: () => {},
  onHeatmapEnter: () => {},
  onHeatmapLeave: () => {},
  onScatterplotClick: () => {},
  onScatterplotEnter: () => {},
  onScatterplotLeave: () => {},
  // Spread chart default
  ...Chart.defaultProps,
  margin: {top: 20, right: 10, bottom: 20, left: 80},
  // Spread scatter & heatmap default
  ...Heatmap.defaultProps,
  ...Scatterplot.defaultProps,
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

HybridScatterHeatmapChart.propTypes = {
  startTime: PropTypes.number.isRequired,
  timeWindow: PropTypes.number.isRequired,
  ...Heatmap.propTypes,
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

export default HybridScatterHeatmapChart
