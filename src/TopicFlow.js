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
  _onEnter (event, data) {
    this.props.onEnter(event, data)
    data.bar._barStyle = data.bar.barStyle
    data.bar.barStyle = {stroke: '#00ccff', strokeWidth: 7}
    data.bar.className = data.bar.className + ' selected '
    data.story.map((d, i) => {
      d.bar._barStyle = d.bar.barStyle
      d.bar.barStyle = {stroke: '#00ccff', strokeWidth: 7}
      d.bar.className = d.bar.className + ' selected '
    })
    this.forceUpdate()
    // this.setState({selectedTopics: toolTipData.label, selectedT: toolTipData.story.concat(toolTipData.adjI)})
  }
  _onLeave (event, data) {
    this.props.onLeave(event, data)
    data.bar.barStyle = data.bar._barStyle
    data.bar.className = data.bar.className.replace('selected ', '')
    data.story.map((d, i) => {
      d.bar.barStyle = d.bar._barStyle
      d.bar.className = d.bar.className.replace('selected ', '')
    })
    this.forceUpdate()
    // this.setState({selectedTopics: [], selectedT: []})
  }
  // _onClick () {
  //   // console.log('moving')
  //   // this.moveTopics()
  //   // this.moveX += 50
  //   // this.refs.svgBins.style.transform = 'translate(' + this.moveX + ',' + 0 + ')'
  // }
  _onBarClick (event, data) {
    // console.log('click', data)
    this.props.onBarClick(event, data)
  }
  constructor (props) {
    super(props)
    this.state = {
      dataUp: false,
      currentID: [],
      selectedTopics: [],
      selectedT: []
    }
    this.xScale = setScale('band')
    this.yScale = setScale('band')
    this.prefScale = d3.scaleOrdinal(d3.schemeCategory20)

    this.updateDomain = this.updateDomain.bind(this)
    this.updateRange = this.updateRange.bind(this)

    this.updateDomain(props)
    this.updateRange(props)

    this.onEnter = this._onEnter.bind(this)
    this.onLeave = this._onLeave.bind(this)
    // this.onClick = this._onClick.bind(this)
    this.onBarClick = this._onBarClick.bind(this)
    this.lineData = []
    this.barData = []
    this.topics = []
    this.barWidth = 0

    this.moveX = 0

    this.initTopics(props)
  }
  componentWillReceiveProps (nextProps) {
    // console.log('TF-nextProps', nextProps)
    if (nextProps.clickArray !== this.props.clickArray) {
      this.deActivate(nextProps)
    } else {
      this.initTopics(nextProps)
    }
  }
  updateDomain (props) {
    let yDomain = []
    props.timeBins.map((data, index) => {
      if (data.topics.length > yDomain.length) {
        yDomain = d3.range(0, data.topics.length, 1)
      }
    })
    let xDomain = Object.keys(props.timeBins)
    // console.log('TF-xDomain', xDomain)
    this.xScale
      .domain(xDomain)
    this.yScale
      .domain(yDomain)
    this.prefScale.domain(props.colorDomain)
  }
  updateRange (props) {
    this.xScale
      .range([0, props.chartWidth])
      .paddingInner(props.padding)
      .paddingOuter(props.outerPadding)
    this.yScale
      .range([0, props.chartHeight])
  }
  buildABar (bin, cName, text, height, width, x, y, barStyle, txtStyle, id) {
    return {
      className: cName,
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
      'data-id': id
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
    // console.log('initTopics')
    let barWidth = this.xScale.bandwidth()
    this.barWidth = barWidth
    let barHeight = props.barHeight
    let barBuff = barHeight / 2
    let barData = []
    let lineData = []
    // GETTING TOPIC BAR INFORMATION
    let svgTopicBars = props.timeBins.map((dataArr, i) => {
      let y = 0
      dataArr.topics.map((data, index) => {
        let events = data.events
        if (events == null) {
          events = ['EMPTY']
        }
        y = (barHeight + barBuff) * index
        let posX = this.xScale(i)
        let fontSize = 12
        // CLASSNAME NEEDS SIMPLE NAMES
        let prefix = events[0].toString().split(/:|-/, 1)[0]
        let cName = prefix + '-' + i.toString()
        let barStyle = {stroke: this.prefScale(prefix), strokeWidth: 3}
        // TRIMMING TEXT IF BEYOND BARS
        let text = this.trimText(events[0], barWidth, fontSize)
        // SETTING TEXT STYLE
        let barTxtStyle = this.buildAText(fontSize.toString() + 'px', 'black')
        let bar = this.buildABar(data, cName, text, barHeight, barWidth, posX, y, barStyle, barTxtStyle, [i, index])
        // bar.tooltipData = {label: events[0], counts: events.length, story: dataArr.story, topicID: dataArr.topicID, hour: dataArr.hour, prevStory: dataArr.prevStory, adjI: i}
        barData.push(bar)
        data.bar = bar
        data.bar._barStyle = barStyle
        data.bar._textStyle = barTxtStyle
        // console.log('indPref', props.colorDomain.indexOf(prefix[0]), '-', prefix)
        if (props.colorDomain.indexOf(prefix) < 0 || prefix === 'EMPTY') {
          data.bar.prefix = 'OTHER'
        } else { data.bar.prefix = prefix }
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
  deActivate (props) {
    console.log('here', props)
    props.timeBins.map((d, i) => {
      console.log(d)
      d.topics.map((da, ind) => {
        // console.log('da')
        let data = da.bar
        // console.log('ppr', data.prefix)
        if (!props.clickArray[data.prefix]) {
          data.barStyle = {stroke: '#e2e2eb', strokeOpacity: 0.6, strokeWidth: 3}
          data.textStyle = {fill: '#e2e2eb', fillOpacity: 0.6}
        } else {
          data.barStyle = data._barStyle
          data.textStyle = data._textStyle
        }
      })
    })
  }
  renderTopics (props) {
    // console.log('TF-rT', props.timeBins)
    let svgBins = []

    let cData = (data, key) => {
      let lineInfo = []
      if (data.line != null) {
        lineInfo = (
          <path className={'lineMatch ' + data.bar.className + ' barTopic'} d={data.line} style={data.bar.barStyle} />
        )
      }
      return (
        <g className='bin' key={key}>
          <TextBar {...data.bar} onEnter={this.onEnter} onLeave={this.onLeave} onClick={this.onBarClick} />
          {lineInfo}
        </g>
      )
    }

    props.timeBins.map((data, index) => {
      data.topics.map((d, i) => {
        let nData = []
        let key = 'bar-' + index + '-' + i
        // if (this.props.clickArray[d.events[0].toString().split(/:|-/, 1)]) {
        if (nData.sel) {
          // PUSHES MOUSED OVER TOPICS TO THE FRONT
          // FIX!!!
          svgBins.push(cData(nData, key))
        } else {
          svgBins.unshift(cData(d, key))
        }
      })
    })
    return (
      <g ref='svgBins' >
        {svgBins}
      </g>
    )
  }
  render () {
    let renderEl = null
    if (this.props.timeBins.length <= 0) {
      console.log('probably no data')
      renderEl = <g />
    } else {
      renderEl = this.topics = this.renderTopics(this.props)
      // renderEl = this.moveTopics()
    }
    return renderEl
  }
}

TopicFlow.defaultProps = {
  data: [],
  padding: 0.4,
  outerPadding: 0.1,
  chartHeight: 0,
  chartWidth: 0,
  barHeight: 20,
  maxTopics: 60,
  lineType: 'curved',
  clickArray: [],
  onEnter: () => {},
  onLeave: () => {},
  onBarClick: () => {}
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
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  onBarClick: PropTypes.func,
  timeBins: PropTypes.array,
  links: PropTypes.array
}

export default TopicFlow
