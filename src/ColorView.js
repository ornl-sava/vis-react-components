import React, { PropTypes } from 'react'
import TextBar from './TextBar'
import d3 from 'd3'

class ColorView extends React.Component {
  // grabbing onEnter and Leave functions from chart and making new set of rules
  _onEnter (toolTipData, svgElement) {
  }
  _onLeave (toolTipData, svgElement) {
  }
  _onClick (toolTipData) {
    // console.log('clicked', toolTipData)
    let index = toolTipData.label
    let newClickArray = this.props.clickArray
    // might want to move this up and make constant?
    // used to check if all the topics are selected
    let checkClick = () => {
      for (let i in newClickArray) {
        if (!newClickArray[i]) {
          return false
        }
      }
      return true
    }
    // if all are clicked the resets it to the only the one being clicked
    // else toggle on / off
    if (checkClick()) {
      for (let i in newClickArray) {
        newClickArray[i] = false
      }
      newClickArray[index] = true
      console.log('sweet beAns!')
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
    this.onEnter = this._onEnter.bind(this)
    this.onLeave = this._onLeave.bind(this)
    this.prefScale = d3.scale.category20()
    this.onClick = this._onClick.bind(this)
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
    let xDomain = Object.keys(nextProps.data)
    console.log(xDomain)
    this.props.xScale.domain([0, 1])
    this.props.yScale.domain([nextProps.colorDomain.length + 2, 0.00001])
    this.prefScale.domain(nextProps.colorDomain)
    console.log('topFlowPref', nextProps.colorDomain)
    this.data = nextProps.colorDomain
  }
  componentWillMount () {
    // console.log('willMountChartHeight', this.props.chartHeight)
  }
  // React LifeCycle method - called after initial render
  componentDidMount () {
    // console.log('didMountChartHeight', this.props.chartHeight)
    if (this.props.colorDomain == null) {
      console.log('probNoDataDidMount')
      this.setState({dataUp: 1})
    }
  }
  componentWillUnmount () {
  }

  addOverlay (barData, index) {
    if (barData.data.length <= 0) {
      barData.data[0] = 'EMPTY'
    }
    let overlayObj = Object.assign({}, barData)
    // console.log('addOverlayBarDataName', barData)
    overlayObj.className = 'overlay'
    overlayObj.key = overlayObj.className
    overlayObj.y = 1
    overlayObj.tooltipData = {}
    overlayObj.tooltipData.label = barData.data
    overlayObj.tooltipData.counts = index
    return overlayObj
  }
  // add tool tip data here later so I don't have to call it in set up
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
    let buff = 1.5
    text.toString()
    // 12 is the supposed font size of the text
    if (text.length > width / fontSize * buff) {
      return text.slice(0, width / fontSize * buff - ell.length) + ell
    }
    return text
  }

  renderTopics (props) {
    let barWidth = props.chartWidth * 0.4
    let barHeight = props.yScale(1)
    // checking if ordinal or not
    if (typeof props.xScale.rangePoints === 'function') {
      props.xScale.rangeRoundBands([0, props.chartWidth], props.padding, props.outerPadding)
    } else {
      props.xScale.range([0, props.chartWidth])
    }
    let colorBars = this.props.colorDomain.map((data, index) => {
      if (data[0] == null) {
        data[0] = 'EMPTY'
      }
      let posY = this.props.yScale(index)
      let posX = props.xScale(0.2)
      let cName = data + '-' + index.toString()
      let color = '#ecf2f9'
      if (this.props.clickArray[data]) {
        color = this.prefScale(data)
      }
      let fontSize = barHeight * 0.8
      // let text = this.trimText(data, barWidth, fontSize)
      // console.log(text)
      let barTxtStyle = this.buildAText(fontSize.toString() + 'px', 'black')
      let barStyle = {fill: color}
      let bar = this.buildABar(data, cName, cName, barHeight, barWidth, posX, posY, barStyle, barTxtStyle)
      let barOverlay = null
      if (props.addOverlay) {
        barOverlay = this.addOverlay(bar, index)
      }
      return (
        <TextBar {...bar} onClick={this.onClick} tooltipData={barOverlay.tooltipData} onEnter={this.onEnter} onLeave={this.onLeave} />
      )
    })
    let svgBins = colorBars.map((barD, index) => {
      let yPos = 0
      let xPos = 0
      return (
        <g className='bin' key={props.className + '-' + index.toString()} transform={'translate(' + xPos + ',' + yPos + ')'}>
          {barD}
        </g>
      )
    })
    return (
      <g>
        {svgBins}
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
      renderEl = this.renderTopics(this.props)
    }
    return renderEl
  }
}

ColorView.defaultProps = {
  addOverlay: true,
  data: [],
  padding: 0.2,
  outerPadding: 0.4,
  width: 400,
  height: 250,
  rangePadding: 25,
  chartHeight: 0,
  chartWidth: 0,
  barHeight: 20,
  maxTopics: 60
}

ColorView.propTypes = {
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
  colorDomain: PropTypes.array,
  colorScale: PropTypes.func,
  onBarClick: PropTypes.func,
  clickArray: PropTypes.array.isRequired
}

export default ColorView
