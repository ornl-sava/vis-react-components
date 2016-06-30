import React, { PropTypes } from 'react'
// import Bar from './Bar'
import TextBar from './TextBar'
import d3 from 'd3'
import storyData from '../examples/data/for-hci/stories.json'
import eTopics from '../examples/data/for-hci/enduring-topics-listed.json'
import hrTopics from '../examples/data/for-hci/hourly-topics-listed.json'

/* const lineMaker = d3.svg.line()
  .x((d) => {
    return d.x
  })
  .y((d) => {
    return d.y
  }) */

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

class StoryViewer extends React.Component {
  // grabbing onEnter and Leave functions from chart and making new set of rules
  _onEnter (toolTipData, svgElement) {
    let props = this.props
    props.onEnter(toolTipData, svgElement)
    // this.setState({selectedTopics: toolTipData.label})
  }
  _onLeave (toolTipData, svgElement) {
    let props = this.props
    props.onLeave(toolTipData, svgElement)
    // this.setState({selectedTopics: []})
  }
  _onClick (tooltipData) {
    // show event list
    console.log(tooltipData)
    this.setState({currentID: tooltipData.label})
  }
  constructor (props) {
    super(props)
    this.state = {
      dataUp: 0,
      currentID: [],
      selectedTopics: []
    }
    this.onEnter = this._onEnter.bind(this)
    this.onLeave = this._onLeave.bind(this)
    this.onClick = this._onClick.bind(this)
    this.statArr = []
    this.prefScale = d3.scale.category20()
    this.bins = []
    this.lineData = []
    this.barData = []
    this.tType = ['hrCurr-', 'endCurr-', 'endPrev-']
  }
  shouldComponentUpdate (nextProps, nextState) {
    if (this.props.data.length <= 0) {
      console.log('SVprobNoDataWillRProps')
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
    let xDomain = [0, 1, 2, 3]
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
    let barWidth = Math.ceil(paddedWidth / (4 + (props.outerPadding * 2)))
    let barHeight = 20
    // let lineData = []
    let storyInd = 0
    console.log('storyData0', storyData[0])
    // setting current story
    let currStory = storyData[storyInd]
    props.xScale.rangeRoundBands([0, props.chartWidth], props.padding, props.outerPadding)
    let timeStepBars = []
    // setting up data for (ex: hr[01], end[01]. end[00])
    let currData = []
    currData[0] = hrTopics[storyInd + 1]
    currData[1] = eTopics[storyInd + 1]
    currData[2] = eTopics[storyInd + 0]
    // cycling through data for particular story index
    for (let k = 0; k < 3; k++) {
      // making bar data for each data set
      let currBars = Object.keys(currData[k]).map((i) => {
        let data = currData[k][i]
        if (data[0] == null) {
          data[0] = 'EMPTY'
        }
        let posY = this.props.chartHeight / Object.keys(currData[k]).length * i
        let posX = props.xScale(k)
        let fontSize = 12
        let cName = this.tType[k] + (storyInd + 1).toString() + '-index-' + i
        let topicColor = {stroke: this.prefScale(data[0].split(/:|-/, 1)[0])}
        let text = this.trimText(data[0], barWidth, fontSize)
        let barTxtStyle = this.buildAText(fontSize.toString() + 'px', 'black')
        let bar = this.buildABar(data, cName, text, barHeight, barWidth, posX, posY, topicColor, barTxtStyle)
        // console.log('bData', bar)
        bar.tooltipData = {label: cName, counts: bar.data.length}
        return bar
      })
      // adding bar data to all bar data
      timeStepBars.push(currBars)
    }
    // dataMatch = [{x: posX + barWidth, y: posY + barHeight / 2}, {x: props.xScale(index + 1), y: this.props.yScale(k) + barHeight / 2}]
    this.barData = timeStepBars
    let midBar = barHeight / 2
    console.log('keys', Object.keys(currStory))
    let lineData = Object.keys(currStory).map((i) => {
      let data = currStory[i]
      let endCurr = timeStepBars[1][i]
      let matchBar = []
      return data.map((arr, index) => {
        let dataMatch = []
        for (let j = 0; j < data.length; j++) {
          if (arr[0] === 0) {
            matchBar = timeStepBars[2][arr[1]]
            dataMatch = [{x: endCurr.x + barWidth, y: endCurr.y + midBar}, {x: matchBar.x, y: matchBar.y + midBar}]
          } else if (arr[0] === 1) {
            matchBar = timeStepBars[0][arr[1]]
            dataMatch = [{x: endCurr.x, y: endCurr.y + midBar}, {x: matchBar.x + barWidth, y: matchBar.y + midBar}]
          }
        }
        return diagMaker(dataMatch)
      })
    })
    console.log('lineData', lineData)
    this.lineData = lineData
  }
  renderTopics () {
    let svgBins = this.barData.map((array, index) => {
      return array.map((data, i) => {
        let key = 'bar-' + i + index
        return (
          <g key={key}>
            <TextBar {...data} onEnter={this.onEnter} onLeave={this.onLeave} onClick={this.onClick} />
          </g>
        )
      })
    })
    let svgLines = this.lineData.map((array, index) => {
      return array.map((data, i) => {
        let key = 'line-' + index + i
        return (
          <g key={key}>
            <path className={' lineMatch -' + index + i} d={array} style={{stroke: 'grey'}} ></path>
          </g>
        )
      })
    })
    let currIndex = this.state.currentID.toString().split(/-/)
    // can put a if statement here...to skip this should the index be empty
    let currData = []
    let dataI = []
    if (currIndex[0] === 'hrCurr') {
      dataI = 0
      currData = hrTopics[currIndex[1]][currIndex[3]]
    } else if (currIndex[0] === 'endPrev' || currIndex[0] === 'endCurr') {
      if (currIndex[0] === 'endPrev') { dataI = 1 } else { dataI = 2 }
      currData = eTopics[currIndex[1]][currIndex[3]]
    }
    let info = currData.map((data, index) => {
      return (
        <text fontSize='30px' x={this.props.xScale(3) + 10} y={100 + (this.props.chartHeight - 100) / 3 * dataI + 50 + index * 50} >{data}</text>
      )
    })
    console.log('this.tType', this.tType[0])
    let svgInfo = []
    for (let i = 0; i < 3; i++) {
      svgInfo[i] = (
        <g key={'view' + i}>
          <text fontSize='100px' x={this.props.xScale(3)} y={100 + (this.props.chartHeight - 100) / 3 * i} >{this.tType[i].toString()}</text>
          {info}
        </g>
      )
    }
    // {svgLines}
    return (
      <g className='bin'>
        {svgLines}
        {svgBins}
        {svgInfo}
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
    if (this.props.data.length <= 0) {
      console.log('probably no data')
      renderEl = this.renderLoadAnimation(this.props)
    } else {
      renderEl = this.renderTopics()
    }
    return renderEl
  }
}

StoryViewer.defaultProps = {
  data: [],
  padding: 0.4,
  outerPadding: 0.4,
  chartHeight: 0,
  chartWidth: 0,
  barHeight: 20,
  maxTopics: 60,
  lineType: 'curved'
}

StoryViewer.propTypes = {
  className: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  padding: PropTypes.number.isRequired,
  outerPadding: PropTypes.number.isRequired,
  xScale: PropTypes.any,
  yScale: PropTypes.any,
  data: PropTypes.any,
  status: PropTypes.string,
  chartHeight: PropTypes.number.isRequired,
  chartWidth: PropTypes.number.isRequired,
  barHeight: PropTypes.number.isRequired,
  maxTopics: PropTypes.number.isRequired,
  colorDomain: PropTypes.array,
  lineType: PropTypes.string.isRequired
}

export default StoryViewer
