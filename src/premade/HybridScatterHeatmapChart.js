import React, { PropTypes } from 'react'
import { map, min, max, interpolateHcl } from 'd3'

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

    this.scatterMap = map()
    this.scatterKey = (d, i) => {
      return d[props.scatterXAccessor] + '-' + d[props.scatterYAccessor]
    }

    this.xScale = setScale(props.xScaleType)
    this.yScale = setScale(props.yScaleType)
    this.scatterColorScale = setScale('linear')
    this.heatmapColorScale = setScale('qunatile')

    this.state = {
      scatterData: [],
      expandedSectionNumbers: [], // Section #s to divide at
      domainExpansionFactor: 1, // Factor of domain to be used
      rangeExpansionFactor: 2 // Factor to expand range by
    }

    this.endTime = this.props.startTime - this.props.timeWindow

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
    this.generateColorScale(props, this.state)
  }

  shouldComponentUpdate (nextProps, nextState) {
    this.updateDomain(nextProps, nextState)
    this.updateRange(nextProps, nextState)
    this.generateColorScale(nextProps, nextState)
    return true
  }

  componentWillUnmount () {
    if (this.props.tipFunction) {
      this.tip.destroy()
    }
  }

  generateColorScale (props, state) {
    let yMax = max(props.data, (d, i) => {
      return max(d.bins, (e, j) => e[props.heatmapXAccessor.value])
    })

    let yMin = min(props.data, (d, i) => {
      return min(d.bins, (e, j) => e[props.heatmapXAccessor.value])
    })

    // Set scatter color scale
    this.scatterColorScale
      .domain([yMin, yMax])
      .range([props.scatterMinColor, props.scatterMaxColor])
      .interpolate(interpolateHcl)

    // Set heatmap color scale
    let tempColorScale = setScale('linear')
      .domain([0, yMax])
      .range([props.heatmapMinColor, props.heatmapMaxColor])
      .interpolate(interpolateHcl)

    let colorDomain = [0, 1]
    let colorRange = [props.heatmapMinColor]
    let colorDomainBand = yMax / (props.heatmapNumColorCat - 1)
    for (var i = 2; i < props.heatmapNumColorCat + 1; i++) {
      let value = colorDomain[i - 1] + colorDomainBand
      if (i === 2) value--
      colorDomain.push(value)
      colorRange.push(tempColorScale(value))
    }

    this.heatmapColorScale
      .domain(colorDomain)
      .range(colorRange)
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
    if (event.shiftKey) {
      let heatmap = this.refs.heatmap
      for (let i = 0; i < this.props.data.length; i++) {
        let bin = heatmap.refs[i + '-' + index]
        console.log(index, bin)
      }
    } else {
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
  }

  onHeatmapClick (event, data, index) {
    // Flip fill opacity
    let fillOpacity = event.target.getAttribute('fill-opacity') !== null
      ? 1 - event.target.getAttribute('fill-opacity')
      : 0
    event.target.setAttribute('fill-opacity', fillOpacity)

    // Add scatter data to map
    if (this.scatterMap.has(index)) {
      this.scatterMap.remove(index)
    } else {
      this.scatterMap.set(index, data.data)
    }

    // Turn scatter map into array
    let scatterData = []
    this.scatterMap.each((v, k) => {
      for (let i = 0; i < v.length; i++) {
        scatterData.push(v[i])
      }
    })

    this.setState({
      scatterData
    })

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
        <ColumnMarkers data={data} xAccessor={props.heatmapXAccessor}
          colorScale={this.heatmapColorScale} xScale={this.xScale} onClick={this.onColumnMarkerClick} />

        <Heatmap ref='heatmap' className='heatmap' data={data}
          xScale={this.xScale} yScale={this.yScale} colorScale={this.heatmapColorScale}
          xAccessor={props.heatmapXAccessor} yAccessor={props.heatmapYAccessor}
          onEnter={this.onHeatmapEnter} onLeave={this.onHeatmapLeave} onClick={this.onHeatmapClick} />

        <Scatterplot ref='scatter' className='scatter' data={this.state.scatterData} keyFunction={this.scatterKey}
          xScale={this.xScale} yScale={this.yScale} colorScale={this.scatterColorScale}
          xAccessor={props.scatterXAccessor} yAccessor={props.scatterYAccessor}
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
  scatterMinColor: '#F1F5E9',
  scatterMaxColor: '#7C9B27',
  heatmapMinColor: '#eff3ff',
  heatmapMaxColor: '#2171b5',
  heatmapNumColorCat: 11,
  heatmapXAccessor: Heatmap.defaultProps.xAccessor,
  heatmapYAccessor: Heatmap.defaultProps.yAccessor,
  scatterXAccessor: Scatterplot.defaultProps.xAccessor,
  scatterYAccessor: Scatterplot.defaultProps.yAccessor,
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
  // ...Heatmap.defaultProps,
  // ...Scatterplot.defaultProps,
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
  scatterMinColor: PropTypes.string,
  scatterMaxColor: PropTypes.string,
  heatmapMinColor: PropTypes.string,
  heatmapMaxColor: PropTypes.string,
  heatmapNumColorCat: PropTypes.number,
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
