import React, { PropTypes } from 'react'
import d3 from 'd3'

import Bar from './Bar'

// Copied from http://stackoverflow.com/questions/4492678/swap-rows-with-columns-transposition-of-a-matrix-in-javascript
// Used that version to be concise
// need to test with jagged arrays
const transpose = (a) => {
  return a[0].map(function (_, c) { return a.map(function (r) { return r[c] }) })
}

class Histogram extends React.Component {
  constructor (props) {
    super(props)

    this.xDomain = []
    this.yDomain = [0.00001, 1]

    this.updateDomain(props, this.state)
  }
  // Update the domain for the shared scale
  componentWillReceiveProps (nextProps) {
    if (nextProps.data.length > 0) {
      this.updateDomain(nextProps, this.state)
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.data.length > 0 ||
      nextProps.sortBy !== this.props.sortBy ||
      nextProps.sortOrder !== this.props.sortOrder ||
      nextProps.sortTypes !== this.props.sortTypes) {
      this.updateDomain(nextProps, nextState)
    }
    return true
  }
  updateDomain (props, state) {
    let domainData = props.data
    if (props.sortBy !== null && props.sortOrder !== null) {
      // Simple deep copy of data to prevent mutation of props
      domainData = this.sortData(JSON.parse(JSON.stringify(props.data)), props, state)
    }

    let yMax = this.getMaxCount(props.data) * 1.1
    let xDomain = domainData[0].bins.map((bin) => bin.x)

    if (yMax !== this.props.yScale.domain()[1]) {
      this.props.yScale.domain([this.yDomain[0], yMax])
      this.yDomain = [this.yDomain[0], yMax]
    }
    if (xDomain[0] instanceof Date) {
      this.props.xScale.domain([
        xDomain[0],
        xDomain[xDomain.length - 1]
      ])
    } else {
      this.props.xScale.domain(xDomain)
    }
  }
  sortData (data, props, state) {
    // NOTE: This WILL mutate the prop
    // Sort first bin and then sort rest of bins accordingly
    let sortArr = []
    data[0].bins.sort((a, b) => {
      let i = 0
      if (props.sortBy === 'x') {
        i = props.sortOrder === 'Ascending'
          ? d3.ascending(a.x, b.x)
          : d3.descending(a.x, b.x)
      } else {
        let useBin = (props.sortTypes.indexOf(data[0].type) > -1 || props.sortTypes.length === 0)
        let ya = useBin ? a.y : 0
        let yb = useBin ? b.y : 0
        for (let j = 1; j < data.length; j++) {
          let useBin = (props.sortTypes.indexOf(data[j].type) > -1 || props.sortTypes.length === 0)
          if (useBin) {
            data[j].bins.forEach((d, i) => {
              if (d.x === a.x) {
                ya += d.y
              }
              if (d.x === b.x) {
                yb += d.y
              }
            })
          }
        }
        i = props.sortOrder === 'Ascending'
          ? ya - yb
          : yb - ya
      }
      sortArr.push(i)
      return i
    })
    // Sort rest of bins in same manner
    for (let i = 1; i < data.length; i++) {
      let j = 0
      data[i].bins.sort((a, b) => {
        return sortArr[j++]
      })
    }
    return data
  }
  getMaxCount (dataArr) {
    let max = 0
    if (this.props.type === 'stacked') {
      let x = dataArr.reduce((prev, datum, histogramIndex) => {
        if (histogramIndex > 0) {
          datum.bins.map((bin, index) => {
            prev[index] += bin.y
          })
        }
        return prev
      }, dataArr[0].bins.map((bin) => bin.y))
      max = Math.max(...x)
    } else {
      max = dataArr.reduce((oldMax, datum) => {
        let localMax = Math.max(...datum.bins.map((bin) => bin.y))
        return localMax > oldMax ? localMax : oldMax
      }, 0)
    }
    return max
  }
  addOverlay (barData) {
    for (let i = 0; i < barData.length; i++) {
      let overlayObj = Object.assign({}, barData[i][0])
      overlayObj.className = '_overlay'
      overlayObj.key = overlayObj.className + '-' + overlayObj.data.x
      overlayObj.y = 1
      overlayObj.tooltipData = {}
      overlayObj.tooltipData.label = barData[i][0].data.x
      overlayObj.tooltipData.stackNames = barData[i].reduce((prev, bar) => { return bar ? [bar.name].concat(prev) : [''].concat(prev) }, [])
      overlayObj.tooltipData.stackCounts = barData[i].reduce((prev, bar) => { return bar ? [bar.data.y].concat(prev) : [0].concat(prev) }, [])
      overlayObj.tooltipData.yPos = barData[i][0].y
      overlayObj.tooltipData.xPos = this.props.xScale(barData[i][0].data.x)
      overlayObj.height = this.props.yScale.range()[0]
      barData[i].push(overlayObj)
    }
  }
  buildABar (bin, name, type, height, width, y) {
    let keyVal = type.toString() + '-' + bin.x.toString()
    return {
      name,
      className: bin.className ? type + ' ' + bin.className : type,
      key: keyVal,
      height: height,
      data: bin,
      width: width,
      y: y
    }
  }
  renderHistogram () {
    let {chartWidth, chartHeight, ...props} = this.props
    let numBins = props.data[0].bins.length
    let paddedWidth = chartWidth * (1.0 - props.padding).toFixed(2)
    let barWidth = Math.floor(paddedWidth / (numBins + (props.outerPadding * 2)))
    if (typeof props.xScale.rangePoints === 'function') {
      props.xScale.rangeRoundBands([0, chartWidth], props.padding, props.outerPadding)
    } else {
      props.xScale.range([0, chartWidth])
    }

    let barData = transpose(props.data.map((histogram, index) => {
      return histogram.bins.map((bin) => {
        let scaledY = chartHeight - props.yScale(bin.y)
        let barHeight = bin.y > 0 ? Math.max(Math.floor(scaledY), 5) : 0
        let yPos = chartHeight - barHeight
        return this.buildABar(bin, props.data[index].name, props.data[index].type, barHeight, barWidth, yPos)
      })
    }))
    if (props.addOverlay === true) {
      this.addOverlay(barData)
    }
    let svgBars = barData.map((dataArr, index) => {
      return dataArr.map((data, barIndex) => {
        if (!data) { return null }
        // If we are a stacked bar chart we need to reference the previously stored
        // calculation for 'y' in barData. Can't easily calculate this above
        if (props.type === 'stacked' && barIndex > 0 && data.className !== '_overlay') {
          data.y = dataArr[barIndex - 1].y - data.height
        }
        return (<Bar {...data} onClick={props.onBarClick} onEnter={props.onEnter} onLeave={props.onLeave} />)
        // return (<Bar {...data} onClick={props.onBarClick} />)
      })
    })

    let svgBins = svgBars.map((bars, i) => {
      let yPos = 0
      let xPos = props.xScale(barData[i][0].data.x)
      if (xPos == null) { // also catches undefined
        xPos = 0
      }
      return (
        <g className='bin' key={props.className + '-' + i.toString()} transform={'translate(' + xPos + ',' + yPos + ')'}>
          {bars}
        </g>
      )
    })
    return (
      <g>
        {svgBins}
      </g>
    )
  }

  renderLoadAnimation (props) {
    let {chartWidth, chartHeight} = props
    let xPos = Math.floor(chartWidth / 2)
    let yPos = Math.floor(chartHeight / 2)
    let messageText = 'Loading data...'
    if (!props.loading) {
      if (props.status === 'Failed to fetch') {
        messageText = 'Can\'t connect to API URL'
      } else if (props.status !== 'OK') {
        messageText = 'Error retrieving data: ' + props.status
      } else {
        messageText = 'No data returned!'
      }
    }
    return (
      <g className='loading-message'>
        <text x={xPos} y={yPos}>{messageText}</text>
      </g>
    )
  }

  render () {
    let renderEl = null
    renderEl = this.renderLoadAnimation(this.props)
    if (this.props.data.length > 0) {
      renderEl = this.renderHistogram(this.props)
    }
    return renderEl
  }
}

Histogram.defaultProps = {
  addOverlay: true,
  padding: 0.2,
  outerPadding: 0.4,
  chartHeight: 0,
  chartWidth: 0,
  className: 'histogram',
  data: [],
  loading: false,
  status: '',
  type: '',
  onBarClick: () => {},
  onEnter: () => {},
  onLeave: () => {}
}

Histogram.propTypes = {
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
  addOverlay: PropTypes.bool,
  padding: PropTypes.number.isRequired,
  outerPadding: PropTypes.number.isRequired,
  chartHeight: PropTypes.number.isRequired,
  chartWidth: PropTypes.number.isRequired,
  className: PropTypes.string.isRequired,
  data: PropTypes.array,
  loading: PropTypes.bool,
  onBarClick: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  status: PropTypes.string,
  type: PropTypes.string,
  xScale: PropTypes.any,
  yScale: PropTypes.any
}

export default Histogram
