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
    this.setState({selectedTopics: this.checkMatch(toolTipData.label)})
  }
  _onLeave (toolTipData, svgElement) {
    let props = this.props
    props.onLeave(toolTipData, svgElement)
    this.setState({selectedTopics: []})
  }
  _onClick () {
    // I thought I could call the other onClick and do something with it
    // but I wouldn't know when to call this to call the other one...
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
    this.statArr = []
    this.prefScale = d3.scale.category20()
    this.bins = []
  }
  shouldComponentUpdate (nextProps, nextState) {
    if (this.props.data.length <= 0) {
      console.log('probNoDataWillRProps')
      this.setState({dataUp: 1})
    }
    console.log('sCU')
    return true
    // return nextProps.data.length !== this.props.data.length || nextProps.loading !== this.props.loading
  }
  componentWillUpdate (nextProps) {
    // nextProps.colorView.state
    // this.setState[{dataUp: 0}]
  }
  componentWillReceiveProps (nextProps) {
    let xDomain = Object.keys(nextProps.data)
    console.log(xDomain)
    this.props.xScale.domain(xDomain)
    this.props.yScale.domain([nextProps.maxTopics + 2, 0.00001])
    this.statArr = new Array(nextProps.data.length)
    for (let i = 0; i < nextProps.data.length; i++) {
      this.statArr[i] = new Array(nextProps.data[i].length)
    }
    // console.log('statArr' + this.statArr)
    this.prefScale.domain(nextProps.colorDomain)
    // console.log('topFlowPref', nextProps.colorDomain)
    // console.log('nProps', nextProps)
    this.bins = this.initTopics(nextProps)
  }
  componentWillMount () {
    // console.log('willMountChartHeight', this.props.chartHeight)
  }
  // React LifeCycle method - called after initial render
  componentDidMount () {
    // console.log('didMountChartHeight', this.props.chartHeight)
    /* if (this.props.data.length <= 0) {
      console.log('probNoDataDidMount')
      this.setState({dataUp: 1})
    } */
  }
  componentWillUnmount () {
  }

  addOverlay (barData) {
    // console.log('addOverlayBarData', barData)
    if (barData.data.length <= 0) {
      barData.data[0] = 'EMPTY'
    }
    let overlayObj = Object.assign({}, barData)
    // console.log('addOverlayBarDataName', barData)
    overlayObj.className = 'overlay'
    overlayObj.key = overlayObj.className
    overlayObj.y = 1
    overlayObj.tooltipData = {}
    overlayObj.tooltipData.label = barData.data[0]
    overlayObj.tooltipData.counts = barData.data.length
    // console.log(overlayObj)
    // barData = {0: barData, 1: overlayObj}
    return overlayObj
    // console.log('addOverlayBarData', barData)
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
    let barHeight = 20
    // let selLines = []
    // just checking if ordinal without checking
    // might not need to do this, assuming it's always ordinal
    if (typeof props.xScale.rangePoints === 'function') {
      props.xScale.rangeRoundBands([0, props.chartWidth], props.padding, props.outerPadding)
    }
    let svgTopicBars = props.data.map((dataArr, index) => {
      return dataArr.map((data, i) => {
        if (data[0] == null) {
          data[0] = 'EMPTY'
        }
        // use yScale if want them all starting at top
        let posY = this.props.yScale(i)
        // use this if want them uniformly spread
        // let posY = this.props.chartHeight / dataArr.length * i
        let posX = props.xScale(index)
        let fontSize = 12
        // It seems like class name does not like :
        let cName = data[0].toString().split(/:|-/, 1) + '-' + i.toString()
        // check to see if same topic in previous timeSteps
        let dataMatch = []
        if (index + 1 < props.data.length) {
          for (let k in props.data[index + 1]) {
            // if (!this.props.data[index + 1].hasOwnProperty(k)) continue
            if (props.data[index + 1][k][0] === data[0]) {
              dataMatch = [{x: posX + barWidth, y: posY + barHeight / 2}, {x: props.xScale(index + 1), y: this.props.yScale(k) + barHeight / 2}]
              // next topic happened
              this.statArr[index + 1][k] = ' happened'
              // if current topic happened
              if (this.statArr[index][i] === ' happened') {
                this.statArr[index][i] = ' continue'
              } else {
                this.statArr[index][i] = ' enter'
              }
            }
          }
          // if no match made then the topic is exiting
          if (this.statArr[index][i] !== ' continue' && this.statArr[index][i] !== ' enter') {
            this.statArr[index][i] = ' exit'
          }
        }
        // assuming the first batch of topics are entering...
        /* if (index === 0) {
          stat = ' enter'
          this.statArr[index][i] = ' enter'
        } */
        let topicColor = {stroke: this.prefScale(data[0].split(/:|-/, 1)[0])}
        let linePath = () => {
          if (dataMatch[0] != null) {
            if (this.props.lineType === 'curved') {
              return (<path className={cName + ' lineMatch'} d={diagMaker(dataMatch)} style={topicColor}></path>)
            } else {
              return (<path className={cName + ' lineMatch'} d={lineMaker(dataMatch)} style={topicColor}></path>)
            }
          }
        }
        cName += this.statArr[index][i]
        if (this.state.currentID === data[0]) {
          cName += ' Selected'
          topicColor = {stroke: '#e67300'}
          // comment these out to get rid of the order that the selected line is rendered
          // still testing cause it is coming out pixelated
          // selLines.push(linePath())
          // linePath = () => { }
        }
        let text = this.trimText(data[0], barWidth, fontSize)
        // console.log(text)
        let barTxtStyle = this.buildAText(fontSize.toString() + 'px', 'black')
        // console.log('barIs', bar)
        // console.log('namePref', data[0].split(/:|-/, 1))
        let bar = this.buildABar(data, cName, text, barHeight, barWidth, posX, posY, topicColor, barTxtStyle)
        let barOverlay = null
        if (props.addOverlay) {
          barOverlay = this.addOverlay(bar)
          // console.log('barOverlay', barOverlay)
        }
        return (
          <g>
            <g>
              <TextBar {...bar} tooltipData={barOverlay.tooltipData} onEnter={this.onEnter} onLeave={this.onLeave} />
            </g>
            <g key={'line_' + index.toString()}>
              {linePath()}
            </g>
          </g>
        )
      })
    })
    return svgTopicBars
  }
  renderTopics () {
    // use boolean array to filter selected objects
    // console.log('svgTopBars', this.bins[0][0].props.children[0].props.children)
    // console.log('TFclickArray', this.props.clickArray)
    let svgBins = this.bins.map((bars, i) => {
      return bars.map((barD, index) => {
        let topName = barD.props.children[0].props.children.props.className.split(/:|-/, 1)
        let yPos = 0
        let xPos = 0
        let iName = index.toString() + '-' + i.toString
        let check = this.props.clickArray
        if (check[topName[0].toString()] || this.props.clickArray == null) {
          return (
            <g className='bin' key={this.props.className + '-' + iName} transform={'translate(' + xPos + ',' + yPos + ')'}>
              {barD}
            </g>
          )
        } else {
          return (
            null
          )
        }
      })
    })
    console.log('rLines', this.state.selectedTopics)
    return (
      <g>
        {svgBins}
        {this.state.selectedTopics}
      </g>
    )
  }
  checkMatch (topicName) {
    let matchedBars = []
    for (let index = 0; index < this.props.data.length; index++) {
      for (let i = 0; i < this.props.data[index].length; i++) {
        if (this.props.data[index][i][0] === topicName) {
          let iName = index.toString() + '-' + i.toString
          let keyName = this.props.className + '-' + iName + '-selected'
          // console.log('matchPRops', this.bins[index][i].props.children[0].props.children)
          // let bData = this.bins[index][i].props.children[0].props.children[0].props
          // let tData = this.bins[index][i].props.children[0].props.children[1]
          let Data = this.bins[index][i].props.children[0].props.children.props
          Data.barStyle.stroke = 'orange'
          console.log('data', Data)
          let lData = []
          console.log('linePath', this.bins[index][i].props.children[1].props.children)
          if (this.bins[index][i].props.children[1].props.children != null) {
            lData = this.bins[index][i].props.children[1].props.children.props
          }
          // <TextBar {...Data} style={{stroke: 'orange'}} key={keyName + '-bar'} />
          let currBar = () => {
            return (
              <g className='barTopic.Selected' key={keyName}>
                <TextBar {...Data} key={keyName + '-bar'} />
                <path className='lineMatch Selected' d={lData.d} key={keyName + '-paths'} style={{stroke: 'orange'}}></path>
              </g>
            )
          }
          matchedBars.push(currBar())
        }
      }
    }
    console.log('matchedBars', matchedBars)
    return (
      <g className='barTopic.Selected' key='selected'>
        {matchedBars}
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
    // console.log('renderChartHeight', this.props.chartHeight)
    // console.log('renderHeight', this.props.height)
    console.log('dataLength', this.props.data.length)
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

TopicFlow.defaultProps = {
  addOverlay: true,
  data: [],
  padding: 0.4,
  outerPadding: 0.4,
  width: 400,
  height: 250,
  rangePadding: 25,
  chartHeight: 0,
  chartWidth: 0,
  barHeight: 20,
  maxTopics: 60,
  lineType: 'curved',
  clickArray: []
}

TopicFlow.propTypes = {
  addOverlay: PropTypes.bool,
  className: PropTypes.string.isRequired,
  height: PropTypes.number,
  loading: PropTypes.bool,
  padding: PropTypes.number.isRequired,
  outerPadding: PropTypes.number.isRequired,
  xDomain: PropTypes.array,
  xScale: PropTypes.any,
  yScale: PropTypes.any,
  rangePadding: PropTypes.number,
  data: PropTypes.object,
  status: PropTypes.string,
  tipFunction: PropTypes.func,
  chartHeight: PropTypes.number.isRequired,
  chartWidth: PropTypes.number.isRequired,
  numTData: PropTypes.number.isRequired,
  barHeight: PropTypes.number.isRequired,
  maxTopics: PropTypes.number.isRequired,
  statArr: PropTypes.array,
  colorDomain: PropTypes.array,
  colorScale: PropTypes.func,
  lineType: PropTypes.string.isRequired,
  clickArray: PropTypes.array.isRequired
}

export default TopicFlow
