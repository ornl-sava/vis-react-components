import React, { PropTypes } from 'react'
// import Bar from './Bar'
import TextBar from './TextBar'
import d3 from 'd3'

const lineMaker = d3.svg.line()
  .x((d) => {
    return d.x
  })
  .y((d) => {
    return d.y
  })

const diagMaker = d3.svg.diagonal()
  .source((d) => {
    return {'x': d[0].y, 'y': d[0].x}
  })
  .target((d) => {
    return {'x': d[1].y, 'y': d[1].x}
  })
  .projection((d) => {
    return [d.y, d.x]
  })

class TopicFlow extends React.Component {
  // grabbing onEnter and Leave functions from chart and making new set of rules
  _onEnter (toolTipData, svgElement) {
    let props = this.props
    props.onEnter(toolTipData, svgElement)
    this.setState({selectedTopics: toolTipData.label, move: false})
  }
  _onLeave (toolTipData, svgElement) {
    let props = this.props
    props.onLeave(toolTipData, svgElement)
    this.setState({selectedTopics: [], move: false})
  }
  _onClick () {
    // I thought I could call the other onClick and do something with it
    // but I wouldn't know when to call this to call the other one...
    console.log('moving')
    // this.moveTopics()
    this.setState({moveX: this.state.moveX - 50, move: true})
  }
  constructor (props) {
    super(props)
    this.state = {
      dataUp: 0,
      currentID: [],
      selectedTopics: [],
      moveX: 0,
      move: false
    }
    this.onEnter = this._onEnter.bind(this)
    this.onLeave = this._onLeave.bind(this)
    this.onClick = this._onClick.bind(this)
    this.statArr = []
    this.prefScale = d3.scale.category20()
    this.bins = []
    this.lineData = []
    this.barData = []
    this.topics = []
    this.barWidth = 0
  }
  shouldComponentUpdate (nextProps, nextState) {
    if (this.props.data.length <= 0) {
      console.log('probNoDataWillRProps')
      this.setState({dataUp: 1})
    }
    return true
    // return nextProps.data.length !== this.props.data.length || nextProps.loading !== this.props.loading
  }
  componentWillUpdate (nextProps) {
    // nextProps.colorView.state
    // this.setState[{dataUp: 0}]
  }
  componentWillReceiveProps (nextProps) {
    let xDomain = Object.keys(nextProps.data)
    this.props.xScale.domain(xDomain)
    this.props.yScale.domain([nextProps.maxTopics + 2, 0.00001])
    this.statArr = new Array(nextProps.data.length)
    for (let i = 0; i < nextProps.data.length; i++) {
      this.statArr[i] = new Array(nextProps.data[i].length)
    }
    this.prefScale.domain(nextProps.colorDomain)
    this.bins = this.initTopics(nextProps)
  }
  componentWillMount () {
    // console.log('willMountChartHeight', this.props.chartHeight)
  }
  // React LifeCycle method - called after initial render
  componentDidMount () {
  }
  componentWillUnmount () {
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
    let paddedWidth = props.chartWidth * (1 - props.padding).toFixed(2)
    let barWidth = Math.ceil(paddedWidth / (props.numTData + (props.outerPadding * 2)))
    this.barWidth = barWidth
    let barHeight = 20
    let barData = []
    let lineData = []
    // CHECKING IF ORDINAL WHICH IT SHOULD ALWAYS BE, GET RID OF
    if (typeof props.xScale.rangePoints === 'function') {
      props.xScale.rangeRoundBands([0, props.chartWidth], props.padding, props.outerPadding)
    }
    // GETTING TOPIC BAR INFORMATION
    console.log('dataAAA', props.data)
    let svgTopicBars = props.data.map((dataArr, index) => {
      console.log('dataArr.length', dataArr)
      return Object.keys(dataArr).map((key, i) => {
        let data = dataArr[key].events
        console.log('HOUR', dataArr[key].hour)
        if (data[0] == null) {
          data[0] = 'EMPTY'
        }
        let posY = this.props.yScale(i)
        let posX = props.xScale(index)
        let fontSize = 12
        // CLASSNAME NEEDS SIMPLE NAMES
        let cName = data[0].toString().split(/:|-/, 1) + '-' + i.toString()
        let topicColor = {stroke: this.prefScale(data[0].split(/:|-/, 1)[0])}
        cName += this.statArr[index][i]
        if (this.state.currentID === data[0]) {
          cName += ' Selected'
          topicColor = {stroke: '#e67300'}
        }
        // TRIMMING TEXT IF BEYOND BARS
        let text = this.trimText(data[0], barWidth, fontSize)
        // SETTING TEXT STYLE
        let barTxtStyle = this.buildAText(fontSize.toString() + 'px', 'black')
        let bar = this.buildABar(data, cName, text, barHeight, barWidth, posX, posY, topicColor, barTxtStyle)
        bar.tooltipData = {label: bar.data[0], counts: bar.data.length, story: dataArr[key].story, topicID: dataArr[key].topicID, hour: dataArr[key].hour}
        barData.push(bar)
      })
    })
    barData.map((data, index) => {
      let hour = data.tooltipData.hour
      console.log('index', index, 'hour', hour)
    })
    // GETTING CONNECTING LINE INFORMATION (EDGES)
    barData.map((data, index) => {
      let story = data.tooltipData.story
      let hour = data.tooltipData.hour
      let dataMatch = []
      console.log('hour', hour, 'story', story, 'id', data.tooltipData.topicID)
      if (story[0] != null) {
        // console.log('story', story)
        let prevTopic = barData.filter((prData, prInd) => {
          if (prData.tooltipData.hour === (hour - 1) && prData.tooltipData.topicID === story[0]) {
            return true
          } else { return false }
        })
        console.log('prevTopic', prevTopic)
        if (prevTopic[0] != null) {
          // console.log('prevTopicNot', prevTopic[0])
          // console.log('prevTopicX', prevTopic[0].x)
          dataMatch = [{x: data.x, y: data.y + barHeight / 2}, {x: prevTopic[0].x + barWidth, y: prevTopic[0].y + barHeight / 2}]
          if (this.props.lineType === 'curved') {
            lineData.push(diagMaker(dataMatch))
          } else { lineData.push(lineMaker(dataMatch)) }
        }
      }
    })
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
        if (this.state.selectedTopics.toString() === this.barData[i].data[0].toString()) {
          nData = JSON.parse(JSON.stringify(this.barData[i]))
          nData.sel = true
          nData.barStyle.stroke = '#00ccff'
          nData.barStyle.strokeWidth = 8
        }
      }
      let cData = (data) => {
        return (
          <g className='bin' key={key}>
            <TextBar {...data} onEnter={this.onEnter} onLeave={this.onLeave} />
            <path className={data.data[0] + ' lineMatch -' + i} d={this.lineData[i]} style={data.barStyle} ></path>
          </g>
        )
      }
      if (this.props.clickArray[this.barData[i].data[0].toString().split(/:|-/, 1)]) {
        if (nData.sel) {
          svgBins.push(cData(nData))
        } else {
          svgBins.unshift(cData(this.barData[i]))
        }
      } else {
        // this greys the topic bars instead of not rendering
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
      <g transform={'translate(' + this.state.moveX + ',' + 0 + ')'} onClick={this.onClick}>
        {this.topics}
      </g>
    )
  }

  // gives text if loading data
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
    if (this.state.move) {
      renderEl = this.moveTopics()
    } else {
      if (this.props.data.length <= 0) {
        console.log('probably no data')
        renderEl = this.renderLoadAnimation(this.props)
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
  clickArray: []
}

TopicFlow.propTypes = {
  className: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  padding: PropTypes.number.isRequired,
  outerPadding: PropTypes.number.isRequired,
  xScale: PropTypes.any,
  yScale: PropTypes.any,
  data: PropTypes.any.isRequired,
  status: PropTypes.string,
  chartHeight: PropTypes.number.isRequired,
  chartWidth: PropTypes.number.isRequired,
  numTData: PropTypes.number.isRequired,
  barHeight: PropTypes.number.isRequired,
  maxTopics: PropTypes.number.isRequired,
  colorDomain: PropTypes.array,
  lineType: PropTypes.string.isRequired,
  clickArray: PropTypes.any.isRequired
}

export default TopicFlow
