import React, { PropTypes } from 'react'
import d3 from 'd3'

const binByNumeric = (data, accessor, range, numBins) => {
  var bins = []
  var step = (range[1] - range[0]) / numBins

  for (let i = 0; i < numBins; i++) {
    var bin = data.filter((d) => {
      return d[accessor] < (range[0] + ((i + 1) * step)) &&
        d[accessor] >= (range[0] + (i * step))
    })
    bin.key = i * step
    bin.step = step
    bin.count = bin.length
    bins.push(bin)
  }

  return bins
}

// Using file bound var so active heatmaps persist through view changes
var heatmap
export class HybridScatterHeatmap extends React.Component {
  constructor (props) {
    super(props)

    // Set default state
    this.state = {
      expandedSectionNumbers: [], // Section #s to divide at
      domainExpansionFactor: 1, // Factor of domain to be used
      rangeExpansionFactor: 2, // Factor to expand range by
      xScale: d3.time.scale().nice(d3.time.second, 0.5),
      scatterColorScale: d3.scale.linear(),
      heatmapColorScale: d3.scale.quantile(),
      yScale: d3.scale.linear()
    }

    // Use this to instead of 'var heatmap' to keep active heatmaps from persisting
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
    var root = this.refs.root

    // Create svg
    var svg = d3.select(root).append('svg')

    // Create chart
    var chart = svg.append('g')
      .attr('class', 'chart')

    // Resize Chart
    this.resizeChart()

    // Create title
    var header = chart.append('g')
        .attr('class', 'header')

    header.append('text')
        .attr('class', 'label time')
        .text('Displaying events from ' + d3.time.format('%x %X')(new Date(this.endTime)) + ' to ' +
          d3.time.format('%x %X')(new Date(this.props.startTime)))

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
      .interpolate(d3.interpolateHcl)

    // Create color scale for heatmap
    let colors = []
    let tempColorScale = d3.scale.linear()
      .domain([0, this.props.numColorCat])
      .range([this.props.minHeatmapColor, this.props.maxHeatmapColor])

    d3.range(this.props.numColorCat).map((d) => {
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
    var root = this.refs.root
    var chart = d3.select(root).select('svg').select('.chart')
    var scatterData = chart.select('.scatter.data')

    // Flatten and filter heatmap
    var data = heatmap.reduce((a, b) => {
      return a.concat(b.filter((d) => {
        return d.active
      }))
    }, []).reduce((a, b) => {
      return a.concat(b)
    }, [])

    // Bind subset of data for scatter
    var points = scatterData.selectAll('.point')
      .data(data, (d, i) => d[this.props.idAccessor])

    // Enter
    points.enter().append('circle')
      .attr('class', 'point')
      .attr('r', 4)
      .attr('cy', (d) => this.state.yScale(d[this.props.yAccessor]))
      .attr('cx', (d) => this.state.xScale(d[this.props.xAccessor]))
      .style('fill', (d, i) => this.state.scatterColorScale(d[this.props.yAccessor]))
      .on('click.scatter.' + this.props.clsName, (d, i) => this.props.scatterOnClick(d, i))
      .on('mouseover.scatter.' + this.props.clsName, (d, i) => this.props.scatterOnMouseOver(d, i))
      .on('mouseout.scatter.' + this.props.clsName, (d, i) => this.props.scatterOnMouseOut(d, i))

    // Update
    points
      .style('fill', (d, i) => this.state.scatterColorScale(d[this.props.yAccessor]))
      .attr('cx', (d) => this.state.xScale(d[this.props.xAccessor]))

    // Exit
    points.exit().remove()
  }

  updateHeatmap () {
    var root = this.refs.root
    var chart = d3.select(root).select('svg').select('.chart')
    var heatmapData = chart.select('.heatmap.data')

    // Rebin heatmap
    var tempHeatmap = binByNumeric(this.props.data, 'score', [0, 6], this.props.heatmapVertDivisions).reverse()
    tempHeatmap.forEach((d, i, arr) => {
      arr[i] = binByNumeric(d, 'time', [this.endTime, this.props.startTime], this.props.heatmapHorzDivisions)
      arr[i].forEach((f, j) => {
        f.rowIndex = i
        f.yKey = d.key
        f.yStep = d.step
        f.active = (typeof heatmap === 'undefined') ? false
          : heatmap[i][j].active
      })
      arr[i].key = d.key
      arr[i].step = d.step
      arr[i].count = d.count
    })

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
    var rows = heatmapData.selectAll('.row')
      .data(heatmap, (d, i) => i)

    // Enter rows
    rows.enter().append('g')
      .attr('class', 'row')

    // Update rows
    rows
      .attr('transform', (d, i) => {
        var x = 0
        var y = this.state.yScale(d.key + d.step)
        return 'translate(' + x + ',' + y + ')'
      })

    // Exit rows
    rows.exit().remove()

    // Bind Bins
    var bins = rows.selectAll('.bin')
      .data((d) => d, (d, i) => i)

    var self = this

    // Enter Bins
    bins.enter().append('rect')
      .attr('opacity', (d, i) => {
        return 1 - heatmap[d.rowIndex][i].active
      })
      .attr('class', 'bin')
      .on('click.heatmap.' + this.props.clsName, function (d, i) { // Need to have reference to dynamic scope for access to d3 element, so no es6
        self.props.heatmapOnClick(d, i)
        var bin = d3.select(this)
        var opacity = bin.style('opacity')
        bin.style('opacity', 1 - opacity)
        heatmap[d.rowIndex][i].active = 1 - heatmap[d.rowIndex][i].active
        self.updateChart()
      })
      .on('mouseover.heatmap.' + this.props.clsName, (d, i) => this.props.heatmapOnMouseOver(d, i))
      .on('mouseout.heatmap.' + this.props.clsName, (d, i) => this.props.heatmapOnMouseOut(d, i))

    // Update Bins
    bins.transition().duration(100)
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
        var color = (d.count) ? this.state.heatmapColorScale(d.count)
          : this.props.minHeatmapColor
        return color
      })

    // Exit Bins
    bins.exit().remove()

    var heatmapHeightBand = (this.props.height - this.props.margin.top - this.props.margin.bottom) /
      this.props.heatmapVertDivisions

    // Create clickable markers to expand entire column
    var columnMarkers = heatmapData.selectAll('.markerCol')
      .data(heatmap[0], (d, i) => i)

    columnMarkers.enter().append('rect')
      .attr('class', 'markerCol')
      .on('click.markerCol', (d, i) => {
        if (d3.event.shiftKey) {
          // Iterate over the columns corresponding bins and flip their activity
          for (let row = 0; row < this.props.heatmapVertDivisions; row++) {
            heatmap[row][i].active = 1 - heatmap[row][i].active
            d3.select(bins[row][i])
              .style('opacity', 1 - heatmap[row][i].active)
          }
          self.updateChart()
        } else {
          let index = this.state.expandedSectionNumbers.indexOf(i)
          let toExpand = null
          if (index > -1) {
            toExpand = this.state.expandedSectionNumbers
            toExpand.splice(index, 1)
          } else {
            var chartWidth = root.offsetWidth - this.props.margin.left - this.props.margin.right
            var originalBlockSize = chartWidth * (1 / this.props.heatmapHorzDivisions)
            var expandedBlockSize = originalBlockSize * this.state.rangeExpansionFactor
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
            self.resizeChart()
          })
        }
      })

    columnMarkers.transition().duration(100)
      .attr('x', (d, i) => {
        return this.state.xScale(this.endTime + d.key)
      })
      .attr('y', (d, i) => {
        return -(heatmapHeightBand / 4) - 3
      })
      .attr('fill', (d, i) => {
        var count = 0
        for (let row = 0; row < this.props.heatmapVertDivisions; row++) {
          count += heatmap[row][i].count
        }
        var color = this.state.heatmapColorScale(count)
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
    var colorDomain = [0, 8]
    if (typeof heatmap !== 'undefined') {
      colorDomain.concat(heatmap.reduce((a, b) => {
        return a.concat(b)
      }, []).map((d) => {
        return d.length
      }))
    }

    this.state.heatmapColorScale
      .domain(colorDomain)
  }

  updateAxes () {
    var root = this.refs.root
    var svg = d3.select(root).select('svg')
    var chart = svg.select('.chart')

    chart.select('.header .time')
      .text('Displaying events from ' + d3.time.format('%x %X')(new Date(this.endTime)) + ' to ' +
        d3.time.format('%x %X')(new Date(this.props.startTime)))

    chart.select('.x.axis')
      .call(d3.svg.axis().orient('bottom').scale(this.state.xScale).ticks(5).tickFormat((a) => {
        var format = d3.time.format('%I:%M:%S')
        return format(a)
      }))

    chart.select('.y.axis')
      .call(d3.svg.axis().orient('left').scale(this.state.yScale))
  }

  resizeChart () {
    var root = this.refs.root
    var svg = d3.select(root).select('svg')
    var chart = svg.select('.chart')

    var chartWidth = root.offsetWidth - this.props.margin.left - this.props.margin.right
    var chartHeight = this.props.height - this.props.margin.top - this.props.margin.bottom

    // Check edge cases to find where to place mid points
    var originalBlockSize = chartWidth * (1 / this.props.heatmapHorzDivisions)
    var expandedBlockSize = originalBlockSize * this.state.rangeExpansionFactor
    var newBlockSize = (chartWidth - (this.state.expandedSectionNumbers.length * expandedBlockSize)) / (this.props.heatmapHorzDivisions - this.state.expandedSectionNumbers.length)
    var xRange = [0]

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
        .attr({
          'y': -this.props.margin.top + 1,
          'dy': '0.71em'
        })
        .style({
          'text-anchor': 'start'
        })

    chart.select('.header .reset')
        .attr({
          'x': chartWidth,
          'y': -this.props.margin.top + 1,
          'dy': '0.71em'
        })
        .style({
          'text-anchor': 'end'
        })

    chart.select('.x.axis')
        .attr('transform', 'translate(0,' + chartHeight + ')')
        .call(d3.svg.axis().orient('bottom').scale(this.state.xScale))
      .select('.label')
        .attr('x', chartWidth)
        .attr('y', -6)

    chart.select('.y.axis')
        .call(d3.svg.axis().orient('left').scale(this.state.yScale))
      .select('.label')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.35em')

    svg
      .attr('width', chartWidth + this.props.margin.left + this.props.margin.right)
      .attr('height', chartHeight + this.props.margin.top + this.props.margin.bottom)

    this.updateChart()
  }

  componentWillUnmount () {}

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
  width: PropTypes.number,
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
  heatmapHorzDivisions: PropTypes.number,
  updateInterval: PropTypes.number
}

// Set default props
HybridScatterHeatmap.defaultProps = {
  startTime: +new Date(),
  timeWindow: 20 * 1000,
  heatmapVertDivisions: 4,
  heatmapHorzDivisions: 4,
  updateInterval: 0,
  minHeatmapColor: '#ffffff',
  maxHeatmapColor: '#08306b',
  numColorCat: 11,
  minScatterColor: '#e5f5e0',
  maxScatterColor: '#00441b',
  margin: {top: 30, right: 5, bottom: 20, left: 50},
  width: 400,
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
