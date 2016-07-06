// import React from 'react'
import React, { PropTypes } from 'react'
import d3 from 'd3'
// import {Chart} from 'vis'
import {Chart} from '../src'
import TopicFlow from '../src/TopicFlow'
import ColorView from '../src/ColorView'
import topicData from './data/topics.json'
// import Tester from '../src/Tester'
import StoryViewer from '../src/StoryViewer'
import eTopics from '../examples/data/for-hci/enduring-topics-listed.json'
import storyData from '../examples/data/for-hci/stories.json'

const hTop = 60 * (20 + 15)

// when cursor over bar it spits out data
const toolTipFunction = (tooltipData) => {
  // console.log('toolFData', tooltipData)
  let d = tooltipData
  var toolTip =
    '<span class="title">' + d.label + '</span>' +
    d3.format('n')(d.counts)
  return toolTip
}

// gets unique prefixes
const getPrefixes = (data) => {
  // getting data in right format
  let fData = Object.keys(data).map(key => { return topicData[key][0] })
  fData = fData.map((arr, i) => {
    if (arr == null) {
      arr = 'EMPTY'
    }
    let arrPref = arr.split(/:|-/, 1)
    return arrPref[0]
  })
  return fData.filter((arr, i) => {
    return fData.indexOf(arr) === i
  })
}
const prefixes = getPrefixes(topicData)

// generates random data based on source
const getRandData = (topicData, amt) => {
  let dataArr = []
  let dataObj = {}
  for (let i = 0; i < amt; i++) {
    // gets random index of source data
    let rand = parseInt(Math.random() * Object.keys(topicData).length)
    if (dataArr.indexOf(rand) <= 0) {
      dataArr.push(rand)
    }
  }
  for (let i = 0; i < dataArr.length; i++) {
    dataObj[i] = topicData[dataArr[i]]
  }
  return dataObj
}

// combining the data into one obj
const allDataComb = (n) => {
  let numData = n
  let comData = []
  for (let i = 0; i < numData; i++) {
    if (i === 0) {
      comData[i] = Object.keys(topicData).map(key => { return topicData[key] })
    } else {
      // generates random number of topics between 15 and 45
      let amt = parseInt(Math.random() * 30 + 15)
      comData[i] = getRandData(topicData, amt)
      comData[i] = Object.keys(comData[i]).map(key => { return comData[i][key] })
    }
  }
  return comData
}

const setUpData = () => {
  let newData = []
  newData.push({})
  let firstData = Object.keys(eTopics[0]).map((scrap, index) => {
    let data = eTopics[0][index]
    newData[0][index] = {events: data, story: []}
    return {events: data, story: []}
  })
  let mapData = storyData.map((data, index) => {
    newData.push({})
    return Object.keys(data).map((scrap, key) => {
      let sData = data[key]
      // console.log(eTopics[index + 1])
      if (sData.length > 1 || sData[0][0] === 1) {
        return sData.map((d, i) => {
          // check if from merge or new topic formation (1)
          let s = []
          // check if from merge and connect to previous enduring (0)
          if (d[0] === 0) {
            s.push(d[1])
            newData[index + 1][key] = {events: eTopics[index + 1][key], story: s}
            return (
              {events: eTopics[index + 1], story: s}
            )
          }
        })
      }
    })
  })
  mapData.unshift(firstData)
  // using newData because this.topicData is returning undefined in some cases.
  // might be troublesome later on...
  mapData = newData
  return mapData
}

const tData = (n) => {
  let topics = setUpData()
  let comData = []
  for (let i = 0; i < n; i++) {
    comData[i] = topics[i]
  }
  // console.log('tData', comData)
  return comData
}

const nData = 7
const fakeData = allDataComb(nData)
const allData = tData(nData)

class TopicsContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      loading: true,
      status: '',
      clickArray: []
    }
    this.toolTipFunction = toolTipFunction
    this.onClick = this._onBarClick.bind(this)
    this.topicData = []
  }
  _onBarClick (toggleList) {
    // takes toggle list and updates clickArray state
    // console.log('toggleList', toggleList)
    this.setState({clickArray: toggleList}, () => {
      this.refs.updateChart.forceUpdate()
      this.refs.updateChart2.forceUpdate()
    })
  }
  componentWillMount () {
    // console.log('topicData', topicData)
  }
  componentDidMount () {
    let setClickArr = {}
    for (let i = 0; i < this.props.colorDomain.length; i++) {
      setClickArr[this.props.colorDomain[i]] = true
    }
    this.setState({clickArray: setClickArr})
    this.fetchData(this.props)
  }
  shouldComponentUpdate (nextProps, nextState) {
    // this.fetchData(nextProps)
    // return nextState.loading !== this.state.loading
    return true
  }
  componentWillReceiveProps (nextProps) {
    // this.fetchData(this.props)
    this.setState({loading: true})
    return true
  }
  fetchData (nextProps) {
    this.setState({data: [], loading: true, status: ''})
    // doesn't re-render if setting state twice
    // this would be where it updates data..
    // if the data didn't go beyond this ... loading wouldn't be set to false
    this.setState({data: fakeData, loading: false, status: 'OK'})
  }
  render () {
    console.log('realData', allData)
    console.log('fakeData', fakeData)
    // this.setUpData()
    let {className, ...props} = this.props
    return (
      <div className={className}>
        <div className='row' >
          <Chart className='col-md-2' ref='updateChart2'{...props} {...this.state} tipFunction={this.toolTipFunction} yAxis={false} xAxis={false} xScaleType='linear' height={600}>
            <ColorView className='col-md-2' {...props} clickArray={this.state.clickArray} ref='colorView' onBarClick={this.onClick} />
          </Chart>
          <Chart className='col-md-10' ref='updateChart' {...props} {...this.state} tipFunction={this.toolTipFunction} yAxis={false} xAxis={false} height={hTop}>
            <TopicFlow className='col-md-10' {...props} clickArray={this.state.clickArray} colorView={this.refs.colorView} onBarClick={this.onClick} />
          </Chart>
        </div>
        <div className='row' >
          <Chart className='col-md-12' {...props} {...this.state} tipFunction={this.toolTipFunction} yAxis={false} xAxis={false} height={1000} margin={{top: 40, right: 10, bottom: 10, left: 80}} >
            <StoryViewer className='col-md-12' {...props} clickArray={this.state.clickArray} colorView={this.refs.colorView} onBarClick={this.onClick} />
          </Chart>
        </div>
      </div>
    )
  }
}

TopicsContainer.defaultProps = {
  url: '',
  numTData: nData,
  colorDomain: prefixes,
  className: 'col-md-12'
}
TopicsContainer.propTypes = {
  className: PropTypes.string,
  numTData: PropTypes.number,
  url: PropTypes.string,
  colorDomain: PropTypes.array
}

export default TopicsContainer
