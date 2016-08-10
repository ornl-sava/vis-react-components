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

    this.initTopics(props)
  }
  componentWillReceiveProps (nextProps) {
    console.log('TF-nextProps', nextProps)
    this.initTopics(nextProps)
  }
  updateDomain (props) {
    let yDomain = []
    props.timeBins.map((data, index) => {
      if (data.topics.length > yDomain.length) {
        yDomain = d3.range(0, data.topics.length, 1)
      }
    })
    let xDomain = Object.keys(props.timeBins)
    this.xScale
      .domain(xDomain)
    this.yScale
      .domain(yDomain)
  }
  updateRange (props) {
    this.xScale
      .range([0, props.chartWidth])
      .paddingInner(props.outerPadding)
      .paddingOuter(props.padding)
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
    let barWidth = this.xScale.bandwidth()
    this.barWidth = barWidth
    let barHeight = 20
    let barBuff = barHeight / 2
    let barData = []
    let lineData = []
    // GETTING TOPIC BAR INFORMATION
    let svgTopicBars = props.timeBins.map((dataArr, i) => {
      let y = 0
      dataArr.topics.map((data, index) => {
        let events = data.events
        if (events[0] == null) {
          events[0] = 'EMPTY'
        }
        y = (barHeight + barBuff) * index
        let posX = this.xScale(i)
        let fontSize = 12
        // CLASSNAME NEEDS SIMPLE NAMES
        let cName = events[0].toString().split(/:|-/, 1) + '-' + i.toString()
        let topicColor = {stroke: this.prefScale(events[0].split(/:|-/, 1)[0])}
        // TRIMMING TEXT IF BEYOND BARS
        let text = this.trimText(events[0], barWidth, fontSize)
        // SETTING TEXT STYLE
        let barTxtStyle = this.buildAText(fontSize.toString() + 'px', 'black')
        let bar = this.buildABar(events, cName, text, barHeight, barWidth, posX, y, topicColor, barTxtStyle)
        bar.tooltipData = {label: events[0], counts: events.length, story: dataArr.story, topicID: dataArr.topicID, hour: dataArr.hour, prevStory: dataArr.prevStory, adjI: i}
        barData.push(bar)
        data.bar = bar
      })
    })
    // console.log('TF-BarData', barData)
    // console.log('TF-.bar', props.timeBins)
    // GETTING CONNECTING LINE INFORMATION (EDGES)
    props.links.map((data, index) => {
      let coor = [{x: data.source.bar.x + barWidth, y: data.source.bar.y + barHeight / 2}, {x: data.target.bar.x, y: data.target.bar.y + barHeight / 2}]
      if (this.props.lineType === 'curved') {
        lineData.push(diagMaker(coor))
        data.lineData = diagMaker(coor)
        data.source.line = diagMaker(coor)
      } else {
        lineData.push(lineMaker(coor))
        data.lineData = lineMaker(coor)
        data.source.line = diagMaker(coor)
      }
      // data.source.bar.tooltipData.lineIndex = 0
    })
    // console.log('TF-lineData', lineData)
    this.barData = barData
    this.lineData = lineData
    return svgTopicBars
  }
  renderTopics (props) {
    // console.log('TF-rT', props.timeBins)
    let svgBins = []

    let cData = (data, key) => {
      let lineInfo = []
      if (data.line != null) {
        lineInfo = (
          <path className={data.events[0] + ' lineMatch -' + key} d={data.line} style={data.bar.barStyle} ></path>
        )
      }
      return (
        <g className='bin' key={key}>
          <TextBar {...data.bar} onEnter={this.onEnter} onLeave={this.onLeave} onClick={this.onClick} />
          {lineInfo}
        </g>
      )
    }

    props.timeBins.map((data, index) => {
      data.topics.map((d, i) => {
        let nData = []
        let key = 'bar-' + index + '-' + i
        if (this.props.clickArray[d.events[0].toString().split(/:|-/, 1)]) {
          if (nData.sel) {
            // PUSHES MOUSED OVER TOPICS TO THE FRONT
            // FIX!!!
            svgBins.push(cData(nData, key))
          } else {
            svgBins.unshift(cData(d, key))
          }
        } else {
          // GREYS OUT TOPIC BARS NOT SELECTED BY LEGEND KEY
          nData = JSON.parse(JSON.stringify(d.bar[i]))
          nData.barStyle.stroke = '#e2e2eb'
          nData.barStyle.strokeOpacity = 0.6
          nData.textStyle.fill = '#e2e2eb'
          nData.textStyle.fillOpacity = 0.6
          // console.log('nData', nData)
          svgBins.unshift(cData(nData, key))
        }
      })
    })
      // for (let j = 0; j< this.barData.leng)
      //
      // let nData = []
      // // LOOKING TO SEE IF NEED TO HIGHLIGHT
      // if (this.state.selectedTopics[0] != null) {
      //   // if (this.state.selectedTopics.toString() === this.barData[i].data[0].toString())
      //   // console.log(this.state.selectedT)
      //   if (this.state.selectedT.indexOf(i) >= 0) {
      //     nData = JSON.parse(JSON.stringify(this.barData[i]))
      //     nData.sel = true
      //     nData.barStyle.stroke = '#00ccff'
      //     nData.barStyle.strokeWidth = 8
      //   }
      // }

      // IF TOPICS SELECTED BY LEGEND KEY
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
      if (this.props.timeBins.length <= 0) {
        console.log('probably no data')
        renderEl = <g></g>
      } else {
        this.topics = this.renderTopics(this.props)
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
  adjacencyList: PropTypes.array,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  timeBins: PropTypes.array,
  links: PropTypes.array
}

export default TopicFlow
