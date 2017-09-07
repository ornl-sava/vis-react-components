import React from 'react'
import PropTypes from 'prop-types'
import { scaleOrdinal, schemeCategory20, range } from 'd3'
import { setScale } from './util/d3'

import TextBar from './TextBar'

const layout = (initRowNum, maxColLength, data) => {
  let numCol = data.length / initRowNum
  numCol = Math.ceil(numCol)
  // if the number of columns in row exceeds max re-run with more rows
  if (numCol > maxColLength) {
    let newInit = initRowNum + 1
    return layout(newInit, maxColLength, data.length)
  }
  // setting up array with row column information
  let rowData = []
  for (let i = 0; i < data.length; i += numCol) {
    if (i + numCol > data.length) {
      rowData.push(data.length - i)
    } else {
      rowData.push(numCol)
    }
  }
  let cIndex = 0
  let outData = []
  for (let i = 0; i < rowData.length; i++) {
    outData.push([])
    for (let j = 0; j < rowData[i]; j++) {
      // outData[i].push('pot' + cIndex)
      outData[i].push(data[cIndex])
      cIndex++
    }
  }
  return outData
}

class ColorView extends React.Component {
  // grabbing onEnter and Leave functions from chart and making new set of rules
  _onEnter (toolTipData, svgElement) {
  }
  _onLeave (toolTipData, svgElement) {
  }
  _onClick (toolTipData) {
    // console.log('clicked', toolTipData)
    let index = toolTipData.label
    let newClickArray = Object.assign({}, this.clickArray)
    if (index === 'CLEAR') {
      for (let i in newClickArray) {
        newClickArray[i] = false
      }
      this.colorDomain[toolTipData.counts] = 'ALL'
    } else if (index === 'ALL') {
      for (let i in newClickArray) {
        newClickArray[i] = true
      }
      this.colorDomain[toolTipData.counts] = 'CLEAR'
    } else {
      newClickArray[index] = !newClickArray[index]
    }
    this.props.onBarClick(newClickArray)
  }
  constructor (props) {
    super(props)
    this.state = {
      dataUp: 0,
      currentID: []
    }
    if (props.spread === 'vertical') {
      this.xScale = setScale('band')
      this.yScale = setScale('band')
    } else {
      this.xScale = setScale('ordinal')
      this.yScale = setScale('ordinal')
    }

    this.updateDR = this.updateDR.bind(this)

    this.onEnter = this._onEnter.bind(this)
    this.onLeave = this._onLeave.bind(this)
    this.prefScale = scaleOrdinal(schemeCategory20)
    this.onClick = this._onClick.bind(this)

    this.rData = []
    // this.colorDomain = JSON.parse(JSON.stringify(this.props.colorDomain))
    // this.colorDomain.push('CLEAR')

    this.colorDomain = props.colorDomain.concat(['OTHER', 'CLEAR'])
    this.clickArray = Object.assign(props.clickArray, {OTHER: true})

    // this.updateDR(props)
  }
  shouldComponentUpdate (nextProps, nextState) {
    if (this.props.colorDomain == null) {
      console.log('probNoDataWillRProps')
      this.setState({dataUp: 1})
    }
    return true
  }
  componentWillUpdate (nextProps) {
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.colorDomain !== this.props.colorDomain) {
      this.colorDomain = nextProps.colorDomain.concat(['OTHER', 'CLEAR'])
      this.clickArray = Object.assign(nextProps.clickArray, {OTHER: true})
    } else {
      this.clickArray = Object.assign(nextProps.clickArray)
    }
    // this.updateDR(nextProps)
  }
  componentWillMount () {
    // console.log('willMountChartHeight', this.props.height)
  }
  // React LifeCycle method - called after initial render
  componentDidMount () {
    // console.log('didMountChartHeight', this.props.height)
    if (this.props.colorDomain == null) {
      console.log('probNoDataDidMount')
    }
  }
  componentWillUnmount () {
  }
  updateDR () {
    this.prefScale.domain(this.props.colorDomain)
    if (this.props.spread === 'vertical') {
      this.xScale.domain([0, 1])
      this.yScale
        .domain(range(this.props.colorDomain.length + 2, -1, -1))
        .range([this.props.height, 0])
    } else {
      this.rData = layout(2, 10, this.props.colorDomain)
      this.yScale.domain(Object.keys(this.rData))
      this.yScale.rangeRoundBands([0, this.props.height], this.props.padding, this.props.outerPadding)
    }
  }
  // add tool tip data here later so I don't have to call it in set up
  buildABar (bin, text, height, width, x, y, barStyle, txtStyle) {
    return {
      className: text,
      text: text,
      height: height,
      data: bin,
      width: width,
      rx: height / 4,
      ry: height / 4,
      x: x,
      y: y,
      barStyle: barStyle,
      textStyle: txtStyle,
      stroke: 'black',
      strokeWidth: '2px'
    }
  }

  buildAText (fontSize, color) {
    return {
      textAnchor: 'middle',
      fontSize: fontSize,
      width: '10px'
    }
  }

  trimText (text, width, fontSize) {
    let ell = '...'
    let buff = 0.95
    text.toString()
    // 12 is the supposed font size of the text
    if (text.length > width / fontSize * buff) {
      return text.slice(0, width / fontSize * buff - ell.length) + ell
    }
    return text
  }

  renderTopics () {
    let colorBars = []
    if (this.props.spread === 'vertical') {
      let barHeight = this.yScale(1) - this.yScale(0)
      let barWidth = this.props.width * 0.9
      let fontSize = barHeight * 0.8
      let barTxtStyle = this.buildAText(fontSize.toString() + 'px', 'black')
      // checking if ordinal or not
      if (typeof this.xScale.rangePoints === 'function') {
        this.xScale.rangeRoundBands([0, this.props.width], this.props.padding, this.props.outerPadding)
      } else {
        this.xScale.range([0, this.props.width])
      }
      colorBars = this.colorDomain.map((data, index) => {
        if (data[0] == null) {
          data[0] = 'EMPTY'
        }
        let posY = this.yScale(index)
        let posX = (this.props.width - barWidth) / 2
        let cName = data + '-' + index.toString()
        let color = '#ecf2f9'
        if (data === 'CLEAR') {
          posY = this.yScale(index + 1)
          color = 'red'
        } else if (data === 'ALL') {
          posY = this.yScale(index + 1)
          color = 'green'
        } else if (this.props.clickArray[data]) {
          color = this.prefScale(data)
        }
        let barStyle = {fill: color, fillOpacity: 0.5}
        let text = this.trimText(data, barWidth, fontSize)
        let bar = this.buildABar(cName, text, barHeight, barWidth, posX, posY, barStyle, barTxtStyle)
        bar.tooltipData = {label: data, counts: index}
        return (
          <TextBar {...bar} onClick={this.onClick} onEnter={this.onEnter} onLeave={this.onLeave} style={bar.barStyle} />
        )
      })
    } else {
      let paddedHeight = this.props.height * (1.0 - this.props.padding).toFixed(2)
      let barHeight = Math.floor(paddedHeight / (this.rData.length + (this.props.outerPadding * 2)))
      let fontSize = barHeight * 0.4
      let barTxtStyle = this.buildAText(fontSize.toString() + 'px', 'black')
      colorBars = this.rData.map((arr, index) => {
        this.xScale.domain(Object.keys(arr))
        this.xScale.rangeRoundBands([0, this.props.width], this.props.padding, this.props.outerPadding)
        let paddedWidth = this.props.width * (1.0 - this.props.padding).toFixed(2)
        let barWidth = Math.floor(paddedWidth / (arr.length + (this.props.outerPadding * 2)))
        return arr.map((title, i) => {
          let posY = this.yScale(index)
          let posX = this.xScale(i)
          let cName = title + '-r' + index.toString() + '-c' + i.toString()
          let text = this.trimText(title, barWidth, fontSize)
          let color = '#ecf2f9'
          if (this.props.clickArray[title]) {
            color = this.prefScale(title)
          }
          let barStyle = {fill: color}
          let bar = this.buildABar(cName, text, barHeight, barWidth, posX, posY, barStyle, barTxtStyle)
          bar.tooltipData = {label: title, counts: index}
          return (
            <TextBar {...bar} onClick={this.onClick} onEnter={this.onEnter} onLeave={this.onLeave} style={bar.barStyle} />
          )
        })
      })
    }
    let svgBins = colorBars.map((barD, index) => {
      let yPos = 0
      let xPos = 0
      return (
        <g className='bin' key={this.props.className + '-' + index.toString() + '-' + this.props.spread} transform={'translate(' + xPos + ',' + yPos + ')'}>
          {barD}
        </g>
      )
    })
    return (
      <g className='colorView' >
        {svgBins}
      </g>
    )
  }
  render () {
    let renderEl = null
    if (this.props.colorDomain.length <= 0) {
      console.log('no data')
    } else {
      this.updateDR()
      renderEl = this.renderTopics(this.props)
    }
    return renderEl
  }
}

ColorView.defaultProps = {
  colorDomain: [],
  spread: 'vertical',
  padding: 0.1,
  outerPadding: 0.4,
  chartHeight: 0,
  chartWidth: 0
}

ColorView.propTypes = {
  className: PropTypes.string,
  colorDomain: PropTypes.array,
  onBarClick: PropTypes.func,
  clickArray: PropTypes.any.isRequired,
  spread: PropTypes.string.isRequired,
  padding: PropTypes.number.isRequired,
  outerPadding: PropTypes.number.isRequired,
  chartHeight: PropTypes.number.isRequired,
  chartWidth: PropTypes.number.isRequired
}

export default ColorView
