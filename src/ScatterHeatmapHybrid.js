import React from 'react'
import PropTypes from 'prop-types'
import { easeLinear, scaleLinear, scaleQuantile, scaleTime, timeSecond, select, timeFormat, interpolateHcl, range, axisBottom, axisLeft } from 'd3'

const binByNumeric = (data, accessor, range, numBins) => {
  let bins = []
  let step = (range[1] - range[0]) / numBins

  for (let i = 0; i < numBins; i++) {
    let bin = []
    for (let j = 0; j < data.length; j++) {
      if (data[j][accessor] < (range[0] + ((i + 1) * step)) &&
          data[j][accessor] >= (range[0] + (i * step))) {
        bin.push(data[j])
      }
    }
    bin.key = i * step
    bin.step = step
    bin.count = bin.length
    bins.push(bin)
  }

  return bins
}

// Using file bound let so active heatmaps persist through view changes
let heatmap
export class HybridScatterHeatmap extends React.Component {
  constructor (props) {
    super(props)

    // Set default state
    this.state = {
      expandedSectionNumbers: [], // Section #s to divide at
      domainExpansionFactor: 1, // Factor of domain to be used
      rangeExpansionFactor: 2, // Factor to expand range by
      xScale: scaleTime().nice(timeSecond, 1),
      yScale: scaleLinear(),
      scatterColorScale: scaleLinear(),
      heatmapColorScale: scaleQuantile()
    }

    // Use this to instead of 'let heatmap' to keep active heatmaps from persisting
    // this.heatmap = undefined

    this.endTime = this.props.startTime - this.props.timeWindow

    this.createChart = this.createChart.bind(this)
    this.updateChart = this.updateChart.bind(this)
    this.resizeChart = this.resizeChart.bind(this)
    this.updateScales = this.updateScales.bind(this)
    this.updateAxes = this.updateAxes.bind(this)
    this.updateScatter = this.updateScatter.bind(this)
    this.updateHeatmap = this.updateHeatmap.bind(this)
  }

  createChart () {
    // Get root
    let root = this.refs.root

    // Create svg
    let svg = select(root).append('svg')

    // Create chart
    let chart = svg.append('g')
      .attr('class', 'chart')

    // Resize Chart
    this.resizeChart()

    // Create title
    let header = chart.append('g')
      .attr('class', 'header')

    header.append('text')
      .attr('class', 'label time')
      .text('Displaying events from ' + timeFormat('%x %X')(new Date(this.endTime)) + ' to ' +
          timeFormat('%x %X')(new Date(this.props.startTime)))

    header.append('text')
      .attr('class', 'label reset')
      .text('reset')
      .on('click', () => {
        // Set heatmap data to inactive
        for (let i = 0; i < this.props.heatmapHorzDivisions; i++) {
          for (let j = 0; j < this.props.heatmapVertDivisions; j++) {
            heatmap[j][i].active = 0
          }
        }
        // Remove expanded columns
        this.setState({
          expandedSectionNumbers: []
        }, () => {
          this.resizeChart()
        })
      })

    // Create container for heatmap bins
    chart.append('g')
      .attr('class', 'heatmap data')

    // Create x axis
    chart.append('g')
      .attr('class', 'x axis')
      .append('text')
      .attr('class', 'label')
      .text(this.props.xLabel)

    // Create y axis
    chart.append('g')
      .attr('class', 'y axis')
      .append('text')
      .attr('class', 'label')
      .text(this.props.yLabel)

    // Create data container for scatter points
    chart.append('g')
      .attr('class', 'scatter data')

    // Create color scale for scatter
    this.state.scatterColorScale
      .domain(this.props.yDomain)
      .range([this.props.minScatterColor, this.props.maxScatterColor])
      .interpolate(interpolateHcl)

    // Create color scale for heatmap
    let colors = []
    let tempColorScale = scaleLinear()
      .domain([0, this.props.numColorCat])
      .range([this.props.minHeatmapColor, this.props.maxHeatmapColor])

    range(this.props.numColorCat).map((d) => {
      colors.push(tempColorScale(d))
    })

    this.state.heatmapColorScale
      .range(colors)
  }

  updateChart () {
    this.updateScales()
    this.updateAxes()
    this.updateHeatmap()
    this.updateScatter()
    // console.log(this.state.xScale.domain(), this.state.xScale.range())
  }

  updateScatter () {
    let root = this.refs.root
    let chart = select(root).select('svg').select('.chart')
    let scatterData = chart.select('.scatter.data')

    // Flatten and filter heatmap
    let data = []
    for (let i = 0; i < heatmap.length; i++) {
      for (let j = 0; j < heatmap[i].length; j++) {
        if (heatmap[i][j].active) {
          for (let k = 0; k < heatmap[i][j].length; k++) {
            data.push(heatmap[i][j][k])
          }
        }
      }
    }

    // Bind subset of data for scatter
    let points = scatterData.selectAll('.point')
      .data(data, (d, i) => d[this.props.idAccessor])

    // Exit
    points.exit().remove()

    // Enter + Update
    points
      .enter().append('circle')
      .attr('class', 'point')
      .attr('r', 4)
      .attr('cy', (d) => this.state.yScale(d[this.props.yAccessor]))
      .attr('cx', (d) => this.state.xScale(d[this.props.xAccessor]))
      .style('fill', (d, i) => this.state.scatterColorScale(d[this.props.yAccessor]))
      .on('click.scatter.' + this.props.clsName, (d, i) => this.props.scatterOnClick(d, i))
      .on('mouseover.scatter.' + this.props.clsName, (d, i) => this.props.scatterOnMouseOver(d, i))
      .on('mouseout.scatter.' + this.props.clsName, (d, i) => this.props.scatterOnMouseOut(d, i))
      .merge(points).transition().duration(100).ease(easeLinear)
      .style('fill', (d, i) => this.state.scatterColorScale(d[this.props.yAccessor]))
      .attr('cx', (d) => this.state.xScale(d[this.props.xAccessor]))
  }

  updateHeatmap () {
    let root = this.refs.root
    let chart = select(root).select('svg').select('.chart')
    let heatmapData = chart.select('.heatmap.data')

    // Rebin heatmap
    let tempHeatmap = binByNumeric(this.props.data, 'score', [0, 6], this.props.heatmapVertDivisions).reverse()
    for (let i = 0; i < tempHeatmap.length; i++) {
      let d = tempHeatmap[i]
      tempHeatmap[i] = binByNumeric(d, 'time', [this.endTime, this.props.startTime], this.props.heatmapHorzDivisions)
      for (let j = 0; j < tempHeatmap[i].length; j++) {
        tempHeatmap[i][j].rowIndex = i
        tempHeatmap[i][j].yKey = d.key
        tempHeatmap[i][j].yStep = d.step
        tempHeatmap[i][j].active = (typeof heatmap === 'undefined')
          ? false
          : heatmap[i][j].active
      }
      tempHeatmap[i].key = d.key
      tempHeatmap[i].step = d.step
      tempHeatmap[i].count = d.count
    }

    heatmap = tempHeatmap

    // Helper function to obtain the height of a single bin
    const binHeight = (d) => {
      let low = this.state.yScale(d.yKey)
      let high = this.state.yScale(d.yKey - d.yStep)
      return (high - low >= 0) ? high - low : this.state.yScale(this.props.yDomain[1] - d.yStep)
    }

    const binWidth = (d) => {
      // Keep in sync by using already defined endTime above
      // console.log(this.endTime, d.key, d.step)
      let low = this.state.xScale(this.endTime + d.key)
      let high = this.state.xScale(this.endTime + d.key + d.step)
      return high - low
    }

    // Bind subset of data for heatmap
    let rows = heatmapData.selectAll('.row')
      .data(heatmap, (d, i) => i)

    // Exit rows
    rows.exit().remove()

    // Enter + Update rows
    rows = rows
      .enter().append('g')
      .attr('class', 'row')
      .merge(rows)
      .attr('transform', (d, i) => {
        let x = 0
        let y = this.state.yScale(d.key + d.step)
        return 'translate(' + x + ',' + y + ')'
      })

    // Bind Bins
    var bins = rows.selectAll('.bin')
      .data((d) => d, (d, i) => i)

    // Exit Bins
    bins.exit().remove()

    // Enter + Update Bins
    bins
      .enter().append('rect')
      .attr('class', 'bin')
      .on('click.heatmap.' + this.props.clsName, function (d, i) { // Need to have reference to dynamic scope for access to d3 element, so no es6
        this.props.heatmapOnClick(d, i)
        heatmap[d.rowIndex][i].active = 1 - heatmap[d.rowIndex][i].active
        this.updateChart()
      })
      .on('mouseover.heatmap.' + this.props.clsName, (d, i) => this.props.heatmapOnMouseOver(d, i))
      .on('mouseout.heatmap.' + this.props.clsName, (d, i) => this.props.heatmapOnMouseOut(d, i))
      .merge(bins)
      .transition().duration(400).ease(easeLinear)
      .attr('opacity', (d, i) => {
        return heatmap[d.rowIndex][i].active ? 0 : 1
      })
      .attr('x', (d) => {
        return this.state.xScale(this.endTime + d.key)
      })
      .attr('y', 0)
      .attr('width', (d) => {
        return binWidth(d)
      })
      .attr('height', (d) => {
        return binHeight(d)
      })
      .attr('fill', (d) => {
        let color = (d.count) ? this.state.heatmapColorScale(d.count)
          : this.props.minHeatmapColor
        return color
      })

    let heatmapHeightBand = (this.props.height - this.props.margin.top - this.props.margin.bottom) /
      this.props.heatmapVertDivisions

    // Create clickable markers to expand entire column
    let columnMarkers = heatmapData.selectAll('.markerCol')
      .data(heatmap[0], (d, i) => i)

    columnMarkers
      .enter().append('rect')
      .attr('class', 'markerCol')
      .on('click.markerCol', (d, i) => {
        // Normal click: toggle expansion and activity
        // Shift click: just toggle expansion
        // Alt click: just toggle activity
        if (event.altKey || !event.shiftKey) {
          // Iterate over the columns corresponding bins and flip their activity
          for (let row = 0; row < this.props.heatmapVertDivisions; row++) {
            heatmap[row][i].active = 1 - heatmap[row][i].active
          }
          this.updateChart()
        }
        if (event.shiftKey || !event.altKey) {
          let index = this.state.expandedSectionNumbers.indexOf(i)
          let toExpand = null
          if (index > -1) {
            toExpand = this.state.expandedSectionNumbers
            toExpand.splice(index, 1)
          } else {
            let chartWidth = root.offsetWidth - this.props.margin.left - this.props.margin.right
            let originalBlockSize = chartWidth * (1 / this.props.heatmapHorzDivisions)
            let expandedBlockSize = originalBlockSize * this.state.rangeExpansionFactor
            let pending = (this.state.expandedSectionNumbers.length + 1) * expandedBlockSize
            if (pending >= chartWidth || this.state.expandedSectionNumbers.length + 1 === this.props.heatmapHorzDivisions) {
              toExpand = this.state.expandedSectionNumbers
            } else {
              toExpand = this.state.expandedSectionNumbers
                .concat(i)
                .sort((a, b) => {
                  return a - b
                })
            }
          }
          this.setState({
            expandedSectionNumbers: toExpand
          }, () => {
            this.resizeChart()
          })
        }
      })
      .merge(columnMarkers).transition().duration(400).ease(easeLinear)
      .attr('x', (d, i) => {
        return this.state.xScale(this.endTime + d.key)
      })
      .attr('y', (d, i) => {
        return -(heatmapHeightBand / 4) - 3
      })
      .attr('fill', (d, i) => {
        let count = 0
        for (let row = 0; row < this.props.heatmapVertDivisions; row++) {
          count += heatmap[row][i].count
        }
        let color = this.state.heatmapColorScale(count)
        return color
      })
      .attr('width', (d) => binWidth(d))
      .attr('height', () => heatmapHeightBand / 4)
  }

  updateScales () {
    let props = this.props

    let originalTimeSlice = this.props.timeWindow / this.props.heatmapHorzDivisions
    let expandedTimeSlice = originalTimeSlice * this.state.domainExpansionFactor

    // Compute new end time
    let timeWindow = 0
    for (let i = 0; i < this.props.heatmapHorzDivisions; i++) {
      if (this.state.expandedSectionNumbers.indexOf(i) > -1) {
        timeWindow += expandedTimeSlice
      } else {
        timeWindow += originalTimeSlice
      }
    }

    // console.log(timeWindow / 1000, originalTimeSlice, expandedTimeSlice)
    this.endTime = this.props.startTime - timeWindow

    let xDomain = [this.endTime]
    for (let i = 0; i < this.props.heatmapHorzDivisions - 1; i++) {
      let previous = xDomain[xDomain.length - 1]
      if (this.state.expandedSectionNumbers.indexOf(i) > -1) {
        xDomain.push(previous + expandedTimeSlice)
      } else {
        xDomain.push(previous + originalTimeSlice)
      }
    }
    xDomain.push(this.props.startTime)

    // Update window of time x scale
    this.state.xScale
      .domain(xDomain)

    // Update y scale domain
    this.state.yScale
      .domain(props.yDomain)

    // Update scatter color scale
    this.state.scatterColorScale
      .domain(props.yDomain)

    // Update heatmap color scale
    let colorDomain = [0, 1]
    if (typeof heatmap !== 'undefined' && heatmap) {
      for (let i = 0; i < heatmap.length; i++) {
        for (let j = 0; j < heatmap[i].length; j++) {
          colorDomain.push(heatmap[i][j].count)
        }
      }
    }

    this.state.heatmapColorScale
      .domain(colorDomain)
  }

  updateAxes () {
    let root = this.refs.root
    let svg = select(root).select('svg')
    let chart = svg.select('.chart')

    chart.select('.header .time')
      .text('Displaying events from ' + timeFormat('%x %X')(new Date(this.endTime)) + ' to ' +
      timeFormat('%x %X')(new Date(this.props.startTime)))

    chart.select('.x.axis')
      .call(axisBottom().scale(this.state.xScale).ticks(5).tickFormat((a) => {
        let format = timeFormat('%I:%M:%S')
        return format(a)
      }))

    chart.select('.y.axis')
      .call(axisLeft().scale(this.state.yScale))
  }

  resizeChart () {
    let root = this.refs.root
    let svg = select(root).select('svg')
    let chart = svg.select('.chart')

    let chartWidth = root.offsetWidth - this.props.margin.left - this.props.margin.right
    let chartHeight = this.props.height - this.props.margin.top - this.props.margin.bottom

    // Check edge cases to find where to place mid points
    let originalBlockSize = chartWidth * (1 / this.props.heatmapHorzDivisions)
    let expandedBlockSize = originalBlockSize * this.state.rangeExpansionFactor
    let newBlockSize = (chartWidth - (this.state.expandedSectionNumbers.length * expandedBlockSize)) / (this.props.heatmapHorzDivisions - this.state.expandedSectionNumbers.length)
    let xRange = [0]

    for (let i = 0; i < this.props.heatmapHorzDivisions - 1; i++) {
      let previous = xRange[xRange.length - 1]
      if (this.state.expandedSectionNumbers.indexOf(i) > -1) {
        xRange.push(previous + expandedBlockSize)
      } else {
        xRange.push(previous + newBlockSize)
      }
    }

    xRange.push(chartWidth)
    this.state.xScale.range(xRange)

    this.state.yScale.range([chartHeight, 0])
    chart
      .attr('transform', 'translate(' + this.props.margin.left +
        ',' + this.props.margin.top + ')')

    chart
      .select('.header .time')
      .attr('y', -this.props.margin.top + 1)
      .attr('dy', '0.71em')
      .style('text-anchor', 'start')

    chart.select('.header .reset')
      .attr('x', chartWidth)
      .attr('y', -this.props.margin.top + 1)
      .attr('dy', '0.71em')
      .style('text-anchor', 'end')

    chart.select('.x.axis')
      .attr('transform', 'translate(0,' + chartHeight + ')')
      .call(axisBottom().scale(this.state.xScale))
      .select('.label')
      .attr('x', chartWidth)
      .attr('y', -6)

    chart.select('.y.axis')
      .call(axisLeft().scale(this.state.yScale))
      .select('.label')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.35em')

    svg
      .attr('width', chartWidth + this.props.margin.left + this.props.margin.right)
      .attr('height', chartHeight + this.props.margin.top + this.props.margin.bottom)

    this.updateChart()
  }

  componentWillUnmount () {
    let root = this.refs.root
    select(root).selectAll('*').remove()
  }

  componentDidMount () {
    this.createChart()
    this.resizeChart()
  }

  shouldComponentUpdate () {
    this.updateChart()
    return false
  }

  render () {
    return (
      <div ref='root' className={this.props.clsName} />
    )
  }
}

HybridScatterHeatmap.propTypes = {
  clsName: PropTypes.string.isRequired,
  margin: PropTypes.object,
  height: PropTypes.number,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  scatterOnClick: PropTypes.func,
  scatterOnMouseOver: PropTypes.func,
  scatterOnMouseOut: PropTypes.func,
  heatmapOnClick: PropTypes.func,
  heatmapOnMouseOver: PropTypes.func,
  heatmapOnMouseOut: PropTypes.func,
  idAccessor: PropTypes.string,
  xAccessor: PropTypes.string.isRequired,
  yAccessor: PropTypes.string.isRequired,
  minScatterColor: PropTypes.any,
  maxScatterColor: PropTypes.any,
  minHeatmapColor: PropTypes.any,
  maxHeatmapColor: PropTypes.any,
  numColorCat: PropTypes.number,
  yDomain: PropTypes.array.isRequired,
  data: PropTypes.array,
  startTime: PropTypes.number,
  timeWindow: PropTypes.number,
  heatmapVertDivisions: PropTypes.number,
  heatmapHorzDivisions: PropTypes.number
}

// Set default props
HybridScatterHeatmap.defaultProps = {
  startTime: +new Date(),
  timeWindow: 20 * 1000,
  heatmapVertDivisions: 4,
  heatmapHorzDivisions: 4,
  minHeatmapColor: '#eff3ff',
  maxHeatmapColor: '#2171b5',
  numColorCat: 11,
  minScatterColor: '#F1F5E9',
  maxScatterColor: '#7C9B27',
  margin: { top: 30, right: 5, bottom: 20, left: 50 },
  height: 250,
  idAccessor: 'uuid',
  xLabel: 'x',
  yLabel: 'y',
  scatterOnClick: () => {},
  scatterOnMouseOver: () => {},
  scatterOnMouseOut: () => {},
  heatmapOnClick: () => {},
  heatmapOnMouseOver: () => {},
  heatmapOnMouseOut: () => {}
}

export default HybridScatterHeatmap
