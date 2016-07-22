import React, { PropTypes } from 'react'

import Bar from './Bar'
import BrushX from './BrushX'

// Copied from http://stackoverflow.com/questions/4492678/swap-rows-with-columns-transposition-of-a-matrix-in-javascript
// Used that version to be concise
// need to test with jagged arrays
const transpose = (a) => {
  return a[0].map(function (_, c) { return a.map(function (r) { return r[c] }) })
}

class Histogram extends React.Component {
  constructor (props) {
    super(props)
    this.onMouseLeave = this._onMouseLeave.bind(this)
    this.renderBars = this.renderBars.bind(this)
  }
  _onMouseLeave (event) {
    console.log('mouse leave')
    this.props.onLeave(event, {})
  }
  getOverlay (barData) {
    let props = this.props
    let overlayData = []
    for (let i = 0; i < barData.length; i++) {
      let overlayObj = Object.assign({}, barData[i][0])
      overlayObj.className = '_overlay'
      overlayObj.brushed = props.brushed
      overlayObj.key = overlayObj.className + '-' + overlayObj.data[props.xAccessor]
      overlayObj[props.yAccessor] = 1
      overlayObj.tooltipData = {}
      overlayObj.data.y = barData[i].reduce((prev, curr) => { return prev + curr.data[props.yAccessor] }, 0)
      overlayObj.tooltipData.label = barData[i][0].data[props.xAccessor]
      overlayObj.tooltipData.stackNames = barData[i].map((bar) => { return bar.name })
      overlayObj.tooltipData.stackCounts = barData[i].map((bar) => { return bar.data[props.yAccessor] })
      overlayObj.tooltipData.yPos = barData[i][0][props.yAccessor]
      overlayObj.tooltipData.xPos = props.xScale(barData[i][0].data[props.xAccessor])
      overlayObj.height = props.yScale.range()[0]
      overlayData.push(overlayObj)
    }
    let overlayBins = overlayData.map((overlayObj, i) => {
      let yPos = 0
      let xPos = props.xScale(barData[i][0].data[props.xAccessor])
      return (
        <g className='overlay-bin' key={'overlay-' + i.toString()} transform={'translate(' + xPos + ',' + yPos + ')'}>
          <Bar {...overlayObj} onEnter={props.onEnter} />
        </g>
      )
    })

    return overlayBins
  }

  buildABar (bin, name, type, height, width, y) {
    let props = this.props
    let keyVal = type.toString() + '-' + bin[props.xAccessor].toString()
    return {
      name,
      className: bin.className ? type + ' ' + bin.className : type,
      key: keyVal,
      height: height,
      data: {x: bin[props.xAccessor], y: bin[props.yAccessor], ...bin},
      width: width,
      y: y
    }
  }

  renderBars () {
    let {chartWidth, chartHeight, ...props} = this.props
    let numBins = props.data[0].bins.length
    let barWidth = /ordinal/.test(props.xScale.type)
      ? props.xScale.bandwidth()
      : chartWidth / numBins

    let barData = transpose(props.data.map((histogram, index) => {
      return histogram.bins.map((bin) => {
        let scaledY = chartHeight - props.yScale(bin[props.yAccessor])
        let barHeight = bin[props.yAccessor] > 0 ? Math.max(Math.floor(scaledY), 5) : 0
        let yPos = chartHeight - barHeight
        return this.buildABar(bin, props.data[index].name, props.data[index].type, barHeight, barWidth, yPos)
      })
    }))
    let overlayBins = []
    if (props.addOverlay === true) {
      overlayBins = this.getOverlay(barData)
    }
    let svgBars = barData.map((dataArr, index) => {
      return dataArr.map((data, barIndex) => {
        if (!data) { return null }
        // If we are a stacked bar chart we need to reference the previously stored
        // calculation for 'y' in barData. Can't easily calculate this above
        if (props.type === 'stacked' && barIndex > 0 && data.className !== '_overlay') {
          data[props.yAccessor] = dataArr[barIndex - 1][props.yAccessor] - data.height
        }
        return (
          <Bar {...data} onClick={props.onClick} onEnter={props.onEnter} />
        )
      })
    })

    let svgBins = svgBars.map((bars, i) => {
      let yPos = 0
      let xPos = props.xScale(barData[i][0].data[props.xAccessor])
      if (xPos == null) { // also catches undefined
        xPos = 0
      }
      return (
        <g className='bin' key={props.className + '-' + i.toString()} transform={'translate(' + xPos + ',' + yPos + ')'}>
          {bars}
        </g>
      )
    })

    let el = <g>
      <g>{svgBins}</g>
      {overlayBins}
    </g>
    // let el = <g>{svgBins}</g>
    if (barData.length > 1 && props.brushed) {
      let interval = Math.abs(barData[1][0].data[props.xAccessor] - barData[0][0].data[props.xAccessor])
      el = <g onMouseLeave={this.onMouseLeave}>
        <BrushX width={props.xScale.range()[1]} height={props.yScale.range()[0]} interval={interval} scale={props.xScale}>
          {svgBins}
        </BrushX>
        {overlayBins}
      </g>
    }
    return el
  }

  render () {
    if (this.props.data.length > 0) {
      return this.renderBars()
    } else {
      return (<g />)
    }
  }
}

Histogram.defaultProps = {
  addOverlay: true,
  data: [],
  xAccessor: 'x',
  yAccessor: 'y',
  onClick: () => {},
  onEnter: () => {},
  onLeave: () => {}
}

Histogram.propTypes = {
  addOverlay: PropTypes.bool,
  brushed: PropTypes.bool,
  chartHeight: PropTypes.number,
  chartWidth: PropTypes.number,
  className: PropTypes.string,
  data: PropTypes.array,
  onClick: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  type: PropTypes.string,
  xAccessor: PropTypes.string.isRequired,
  xScale: PropTypes.any,
  yAccessor: PropTypes.string.isRequired,
  yScale: PropTypes.any
}

export default Histogram
