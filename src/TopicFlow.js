import React, { PropTypes } from 'react'
import * as d3 from 'd3'
import { setScale } from './util/d3'

import TextBar from './TextBar'

const lineMaker = (d) => {
  d3.line()
  .x((d) => {
    return d.x
  })
  .y((d) => {
    return d.y
  })
}

const diagMaker = (d) => {
  return ('M' + d[1].x + ',' + d[1].y +
  'C' + (d[1].x + d[0].x) / 2 + ',' + d[1].y +
  ' ' + (d[1].x + d[0].x) / 2 + ',' + d[0].y +
  ' ' + d[0].x + ',' + d[0].y)
}

class TopicFlow extends React.Component {
  // grabbing onEnter and Leave functions from chart and making new set of rules
  _onEnter (toolTipData, svgElement) {
    this.props.onEnter(toolTipData, svgElement)
    this.setState({selectedTopics: toolTipData.label, move: false, selectedT: toolTipData.story.concat(toolTipData.adjI)})
  }
  _onLeave (toolTipData, svgElement) {
    this.props.onLeave(toolTipData, svgElement)
    this.setState({selectedTopics: [], move: false, selectedT: []})
  }
  _onClick () {
    console.log('moving')
    // this.moveTopics()
    this.setState({moveX: this.state.moveX - 50, move: true})
  }
  _onBarClick (tooltipData) {
  }
  constructor (props) {
    super(props)
    this.state = {
      dataUp: false,
      currentID: [],
      selectedTopics: [],
      selectedT: [],
      moveX: 0,
      move: false
    }
    this.xScale = setScale('ordinalBand')
    this.yScale = setScale('ordinalBand')
    this.prefScale = d3.scaleOrdinal(d3.schemeCategory20)

    this.updateDomain = this.updateDomain.bind(this)
    this.updateRange = this.updateRange.bind(this)

    this.updateDomain(props)
    this.updateRange(props)

    this.onEnter = this._onEnter.bind(this)
    this.onLeave = this._onLeave.bind(this)
    this.onClick = this._onClick.bind(this)
    this.onBarClick = this._onBarClick.bind(this)
    this.lineData = []
    this.barData = []
    this.topics = []
    this.barWidth = 0
    this.bins = this.initTopics(props)
  }
  shouldComponentUpdate (nextProps, nextState) {
    if (this.props.data.length <= 0) {
      console.log('probNoDataWillRProps')
      this.setState({dataUp: 1})
    }
    return true
    // return nextProps.data.length !== this.props.data.length || nextProps.loading !== this.props.loading
  }
  componentWillReceiveProps (nextProps) {
    this.bins = this.initTopics(nextProps)
  }
  updateDomain (props) {
    let xDomain = Object.keys(props.data)
    this.xScale
      .domain(xDomain)
    this.yScale
      .domain(d3.range(-1, props.maxTopics + 2, 1))
  }
  updateRange (props) {
    this.xScale
      .range([0, props.chartHeight])
    this.yScale
      .range([0, props.chartHeight])
    this.prefScale.domain(props.colorDomain)
  }
  buildABar (bin, name, text, height, width, x, y, barStyle, txtStyle) {
    return {
      className: name,
      text: text,
      height: height,
      data: bin,
      width: width,
      rx: height / 4,
      ry: height / 4,
      x: x,
      y: y,
      barStyle: barStyle,
      textStyle: txtStyle
    }
  }

  buildAText (fontSize, color) {
    return {
      textAnchor: 'start',
      fontSize: fontSize,
      width: '10px'
    }
  }

  trimText (text, width, fontSize) {
    let ell = '...'
    let buff = 1.5
    text.toString()
    // console.log('textLength', text.length)
    // 12 is the supposed font size of the text
    if (text.length > width / fontSize * buff) {
      return text.slice(0, width / fontSize * buff - ell.length) + ell
      // return text.substring(0, width / 12 - ell.length * buff) + ell
    }
    return text
  }

  initTopics (props) {
    console.log('initTopics')
    // XSCALE IS ORDINAL
    this.xScale.range([0, props.chartWidth])
    this.xScale.paddingInner(props.outerPadding)
    this.xScale.paddingOuter(props.padding)
    let barWidth = this.xScale.bandwidth()
    this.barWidth = barWidth
    let barHeight = 20
    let barData = []
    let lineData = []
    // GETTING TOPIC BAR INFORMATION
    let svgTopicBars = props.adjacencyList.map((dataArr, i) => {
      if (dataArr.hour < props.numTData) {
        let data = dataArr.events
        if (data[0] == null) {
          data[0] = 'EMPTY'
        }
        let posY = this.yScale(dataArr.topicID)
        let posX = this.xScale(dataArr.hour)
        let fontSize = 12
        // CLASSNAME NEEDS SIMPLE NAMES
        let cName = data[0].toString().split(/:|-/, 1) + '-' + i.toString()
        let topicColor = {stroke: this.prefScale(data[0].split(/:|-/, 1)[0])}
        if (this.state.currentID === data[0]) {
          cName += ' Selected'
          topicColor = {stroke: '#e67300'}
        }
        // TRIMMING TEXT IF BEYOND BARS
        let text = this.trimText(data[0], barWidth, fontSize)
        // SETTING TEXT STYLE
        let barTxtStyle = this.buildAText(fontSize.toString() + 'px', 'black')
        let bar = this.buildABar(data, cName, text, barHeight, barWidth, posX, posY, topicColor, barTxtStyle)
        bar.tooltipData = {label: bar.data[0], counts: bar.data.length, story: dataArr.story, topicID: dataArr.topicID, hour: dataArr.hour, prevStory: dataArr.prevStory, adjI: i}
        barData.push(bar)
      }
    })
    // console.log('TF-BarData', barData)
    // GETTING CONNECTING LINE INFORMATION (EDGES)
    barData.map((data, index) => {
      let story = data.tooltipData.prevStory
      // let hour = data.tooltipData.hour
      let dataMatch = []
      // console.log('hour', hour, 'story', story, 'id', data.tooltipData.topicID)
      if (story[0] != null) {
        let arrIndex = []
        story.map((s, i) => {
          dataMatch = [{x: data.x, y: data.y + barHeight / 2}, {x: barData[s].x + barWidth, y: barData[s].y + barHeight / 2}]
          if (this.props.lineType === 'curved') {
            arrIndex = lineData.push(diagMaker(dataMatch))
          } else { arrIndex = lineData.push(lineMaker(dataMatch)) }
          data.tooltipData.lineIndex = arrIndex - 1
        })
      }
    })
    // console.log('TF-lineData', lineData)
    this.barData = barData
    this.lineData = lineData
    return svgTopicBars
  }
  renderTopics () {
    let svgBins = []
    for (let i = 0; i < this.barData.length; i++) {
      let key = 'bar-' + i
      let nData = []
      if (this.state.selectedTopics[0] != null) {
        // if (this.state.selectedTopics.toString() === this.barData[i].data[0].toString())
        // console.log(this.state.selectedT)
        if (this.state.selectedT.indexOf(i) >= 0) {
          nData = JSON.parse(JSON.stringify(this.barData[i]))
          nData.sel = true
          nData.barStyle.stroke = '#00ccff'
          nData.barStyle.strokeWidth = 8
        }
      }
      let cData = (data) => {
        let lineInfo = []
        if (data.tooltipData.lineIndex != null) {
          lineInfo = (
            <path className={data.data[0] + ' lineMatch -' + i} d={this.lineData[data.tooltipData.lineIndex]} style={data.barStyle} ></path>
          )
        }
        return (
          <g className='bin' key={key}>
            <TextBar {...data} onEnter={this.onEnter} onLeave={this.onLeave} onClick={this.onClick} />
            {lineInfo}
          </g>
        )
      }
      // IF TOPICS SELECTED BY LEGEND KEY
      if (this.props.clickArray[this.barData[i].data[0].toString().split(/:|-/, 1)]) {
        if (nData.sel) {
          // PUSHES MOUSED OVER TOPICS TO THE FRONT
          svgBins.push(cData(nData))
        } else {
          svgBins.unshift(cData(this.barData[i]))
        }
      } else {
        // GREYS OUT TOPIC BARS NOT SELECTED BY LEGEND KEY
        nData = JSON.parse(JSON.stringify(this.barData[i]))
        nData.barStyle.stroke = '#e2e2eb'
        nData.barStyle.strokeOpacity = 0.6
        nData.textStyle.fill = '#e2e2eb'
        nData.textStyle.fillOpacity = 0.6
        // console.log('nData', nData)
        svgBins.unshift(cData(nData))
      }
    }
    return (
      <g>
        {svgBins}
      </g>
    )
  }
  moveTopics () {
    return (
      <g className='topicFlow' transform={'translate(' + this.state.moveX + ',' + 0 + ')'} >
        {this.topics}
      </g>
    )
  }
  render () {
    let renderEl = null
    if (this.state.move) {
      renderEl = this.moveTopics()
    } else {
      if (this.props.data.length <= 0) {
        console.log('probably no data')
        renderEl = <g></g>
      } else {
        this.topics = this.renderTopics()
        renderEl = this.moveTopics()
      }
    }
    return renderEl
  }
}

TopicFlow.defaultProps = {
  data: [],
  padding: 0.4,
  outerPadding: 0.4,
  chartHeight: 0,
  chartWidth: 0,
  barHeight: 20,
  maxTopics: 60,
  lineType: 'curved',
  clickArray: [],
  adjacencyList: [],
  onEnter: () => {},
  onLeave: () => {}
}

TopicFlow.propTypes = {
  loading: PropTypes.bool,
  padding: PropTypes.number.isRequired,
  outerPadding: PropTypes.number.isRequired,
  data: PropTypes.any.isRequired,
  status: PropTypes.string,
  chartHeight: PropTypes.number.isRequired,
  chartWidth: PropTypes.number.isRequired,
  numTData: PropTypes.number.isRequired,
  barHeight: PropTypes.number.isRequired,
  maxTopics: PropTypes.number.isRequired,
  colorDomain: PropTypes.array,
  lineType: PropTypes.string.isRequired,
  clickArray: PropTypes.any.isRequired,
  adjacencyList: PropTypes.array.isRequired,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func
}

export default TopicFlow
