import React, { PropTypes } from 'react'
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
    this.state = {
      xDomain: [],
      yDomain: [0.00001, 1]
    }
  }
  // Update the domain for the shared scale
  componentWillReceiveProps (nextProps) {
    if (nextProps.data.length > 0) {
      let yMax = this.getMaxCount(nextProps.data)
      let xDomain = nextProps.data[0].bins.map((bin) => bin.x.toString())
      if (yMax !== this.state.yDomain[1]) {
        this.props.yScale.domain([this.state.yDomain[0], yMax])
        this.setState({yDomain: [this.state.yDomain[0], yMax]})
      }
      if (xDomain !== this.state.xDomain) {
        this.props.xScale.domain(xDomain)
        this.setState({xDomain})
      }
    }
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
      overlayObj.className = 'overlay'
      overlayObj.key = overlayObj.className + '-' + overlayObj.data.x
      overlayObj.y = 1
      overlayObj.tooltipData = {}
      overlayObj.tooltipData.label = barData[i][0].data.x
      overlayObj.tooltipData.counts = barData[i].reduce((prev, bar) => { return bar ? [bar.data.y].concat(prev) : [0].concat(prev) }, [])
      overlayObj.tooltipData.yPos = barData[i][0].y
      overlayObj.tooltipData.xPos = this.props.xScale(barData[i][0].data.x)
      overlayObj.height = this.props.yScale.range()[0]
      // console.log(overlayObj)
      barData[i].push(overlayObj)
    }
  }
  buildABar (bin, name, type, height, width, y) {
    let keyVal = type.toString() + '-' + bin.x.toString()
    return {
      className: type.toString(),
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
    let paddedWidth = chartWidth * (1 - props.padding).toFixed(2)
    let barWidth = Math.ceil(paddedWidth / (numBins + (props.outerPadding * 2)))
    if (typeof props.xScale.rangePoints === 'function') {
      props.xScale.rangeRoundBands([0, chartWidth], props.padding, props.outerPadding)
    } else {
      props.xScale.range([0, chartWidth])
    }

    let barData = transpose(props.data.map((histogram, index) => {
      return histogram.bins.map((bin) => {
        let scaledY = chartHeight - props.yScale(bin.y)
        let barHeight = bin.y > 0 ? Math.max(Math.floor(scaledY), 3) : 0
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
        if (props.type === 'stacked' && barIndex > 0) {
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
