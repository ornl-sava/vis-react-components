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
    // console.log('clicked', tooltipData)
    let newID = this.state.currentID
    let { dataInd, index } = tooltipData
    newID[dataInd] = this.currData[dataInd][index]
    this.setState({currentID: newID})
  }
  _onMoveClick (tooltipData) {
    // console.log('moveClick', tooltipData)
    let sIndex = 0
    this.initTopics(this.props)
    if (tooltipData.label === 'back') {
      if (this.state.storyInd !== 0) {
        sIndex = this.state.storyInd - 1
      } else {
        sIndex = storyData.length - 1
      }
    } else if (tooltipData.label === 'forward') {
      if (this.state.storyInd !== storyData.length - 1) {
        sIndex = this.state.storyInd + 1
      } else {
        sIndex = 0
      }
    }
    this.setState({storyInd: sIndex, currentID: [[], [], []]})
  }
  _onDClick (tooltipData) {
    // console.log('doubleClicked', tooltipData)
    let newID = [[], [], []]
    let { dataInd, index } = tooltipData
    newID[dataInd] = this.currData[dataInd][index]
    // console.log('newID', this.barData[dataInd][index])
    this.barData[dataInd][index].story.map((sData) => {
      newID[sData.dataInd] = this.currData[sData.dataInd][sData.index]
    })
    this.setState({currentID: newID})
  }
  constructor (props) {
    super(props)
    this.state = {
      dataUp: 0,
      storyInd: 0,
      currentID: [[], [], []],
      selectedTopics: []
    }
    this.onEnter = this._onEnter.bind(this)
    this.onLeave = this._onLeave.bind(this)
    this.onClick = this._onClick.bind(this)
    this.onDoubleClick = this._onDClick.bind(this)
    this.onMoveClick = this._onMoveClick.bind(this)
    // might not need pref scale if not coloring bars
    this.prefScale = d3.scale.category20()
    this.lineData = []
    this.barData = []
    this.tType = ['hour-Curr-', 'enduring-Curr-', 'enduring-Prev-']
    this.currStory = []
    this.currData = []
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
    this.initTopics(nextProps)
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
    // console.log('storyData0', storyData[0])
    // setting current story
    this.currStory = storyData[this.state.storyInd]
    props.xScale.rangeRoundBands([0, props.chartWidth], props.padding, props.outerPadding)
    let timeStepBars = []
    console.log('zero', props.xScale(0))
    // setting up data for (ex: hr[01], end[01]. end[00])
    this.currData[0] = hrTopics[this.state.storyInd + 1]
    this.currData[1] = eTopics[this.state.storyInd + 1]
    this.currData[2] = eTopics[this.state.storyInd + 0]
    // cycling through data for particular story index
    for (let k = 0; k < 3; k++) {
      // making bar data for each data set
      let currBars = Object.keys(this.currData[k]).map((i) => {
        let data = this.currData[k][i]
        if (data[0] == null) {
          data[0] = 'EMPTY'
        }
        let posY = this.props.chartHeight / Object.keys(this.currData[k]).length * i
        let posX = props.xScale(k)
        let fontSize = 12
        let cName = this.tType[k] + (this.state.storyInd + 1).toString() + '-index-' + i
        let topicColor = {stroke: this.prefScale(data[0].split(/:|-/, 1)[0])}
        // console.log('tColor', topicColor)
        let text = this.trimText(data[0], barWidth, fontSize)
        let barTxtStyle = this.buildAText(fontSize.toString() + 'px', 'black')
        let bar = this.buildABar(data, cName, text, barHeight, barWidth, posX, posY, topicColor, barTxtStyle)
        // console.log('bData', bar)
        bar.tooltipData = {label: cName, counts: bar.data.length, dataInd: k, index: i}
        return bar
      })
      // adding bar data to all bar data
      timeStepBars.push(currBars)
    }
    // dataMatch = [{x: posX + barWidth, y: posY + barHeight / 2}, {x: props.xScale(index + 1), y: this.props.yScale(k) + barHeight / 2}]
    this.barData = timeStepBars
    let midBar = barHeight / 2
    // console.log('keys', Object.keys(currStory))
    let lineData = Object.keys(this.currStory).map((i) => {
      let data = this.currStory[i]
      let endCurr = timeStepBars[1][i]
      endCurr.story = []
      let matchBar = []
      return data.map((arr, index) => {
        let dataMatch = []
        if (arr[0] === 0) {
          // enduring (n-1)
          endCurr.story.push({dataInd: 2, index: arr[1]})
          matchBar = timeStepBars[2][arr[1]]
          dataMatch = [{x: endCurr.x + barWidth, y: endCurr.y + midBar}, {x: matchBar.x, y: matchBar.y + midBar}]
        } else if (arr[0] === 1) {
          // hr (n)
          endCurr.story.push({dataInd: 0, index: arr[1]})
          matchBar = timeStepBars[0][arr[1]]
          dataMatch = [{x: endCurr.x, y: endCurr.y + midBar}, {x: matchBar.x + barWidth, y: matchBar.y + midBar}]
        }
        matchBar.story = [{dataInd: 1, index: parseFloat(i)}]
        if (index !== 0) {
          let story = endCurr.story
          timeStepBars[story[0].dataInd][story[0].index].story.push(story[1])
          matchBar.story.push(story[0])
        }
        return diagMaker(dataMatch)
      })
    })
    this.lineData = lineData
    // setting up time moving
    let moveLabels = ['back', 'forward']
    let moveFontS = 20
    let moveBH = moveFontS + 10
    let moveStart = props.xScale(0) / 8
    let moveBW = (props.xScale(0) - moveStart) / 3
    let moveButt = moveLabels.map((label, i) => {
      let data = label
      let posY = 20
      let posX = moveStart + i * (moveBW + 20)
      let cName = label
      let color = {fill: 'grey', stroke: 'black'}
      // console.log('tColor', topicColor)
      let text = ''
      if (label === 'forward') { text = '>' } else { text = '<' }
      let barTxtStyle = this.buildAText(moveFontS.toString() + 'px', 'black')
      let bar = this.buildABar(data, cName, text, moveBH, moveBW, posX, posY, color, barTxtStyle)
      // console.log('bData', bar)
      bar.tooltipData = {label: cName, counts: 0}
      return (
        <TextBar key={'move' + label} {...bar} onClick={this.onMoveClick} />
      )
    })
    this.moveBars = (
      <g key={'movers'}>
        {moveButt}
        <text fontSize={moveFontS} x={moveStart} y={90} >{'hour' + (this.state.storyInd + 1).toString()}</text>
      </g>
    )
  }
  renderTopics () {
    // console.log('SVRenderID', this.state.currentID)
    let svgBins = this.barData.map((array, index) => {
      return array.map((data, i) => {
        let key = 'bar-' + i + index
        return (
          <g key={key}>
            <TextBar {...data} onEnter={this.onEnter} onLeave={this.onLeave} onClick={this.onClick} onDoubleClick={this.onDoubleClick} />
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
    let svgInfo = []
    for (let i = 0; i < 3; i++) {
      let startPos = 100 + (this.props.chartHeight - 100) / 3 * i
      let type = this.tType[i].toString().split(/-/, 1)
      if (i === 0 || i === 1) {
        type = type + ': ' + (this.state.storyInd + 1).toString()
      } else { type = type + ': ' + this.state.storyInd.toString() }
      console.log('type', type)
      let info = this.state.currentID[i].map((data, index) => {
        return (
          <text key={this.tType[i] + 'info-' + index} fontSize='30px' x={this.props.xScale(3) - this.props.xScale(0) / 2 + 10} y={startPos + 50 + index * 50} >{data}</text>
        )
      })
      svgInfo[i] = (
        <g key={'view' + i}>
          <text fontSize='100px' x={this.props.xScale(3) - this.props.xScale(0) / 2} y={startPos} >{type}</text>
          {info}
        </g>
      )
    }
    // {svgLines}
    // {svgInfo}
    return (
      <g className='bin'>
        {this.moveBars}
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
