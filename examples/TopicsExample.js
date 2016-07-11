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
import eventNames from '../examples/data/for-hci/enduring-22-model.json'

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
  // GET THE PREFIXES
  let fData = data.map((arr, i) => {
    if (arr == null) {
      arr = 'EMPTY'
    }
    let arrPref = arr.split(/:|-/, 1)
    return arrPref[0]
  })
  // FILTER OUT REPEATS
  let noRepeats = fData.filter((arr, i) => {
    return fData.indexOf(arr) === i
  })
  // IF NO EMPTY PREFIX, ADD
  if (noRepeats.indexOf('EMPTY') < 0) {
    noRepeats.push('EMPTY')
  }
  return noRepeats
}
const fakeEventNames = Object.keys(topicData).map(key => { return topicData[key][0] })
const fakePrefixes = getPrefixes(fakeEventNames)
console.log('oldPref', fakePrefixes)
const prefixes = getPrefixes(eventNames.column)

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
  // ADDING FIRST TIMESTEP
  newData.push([])
  let firstData = Object.keys(eTopics[0]).map((scrap, index) => {
    let data = eTopics[0][index]
    newData[0][index] = {events: data, story: [], topicID: index, hour: 0}
    return {events: data, story: []}
  })
  // ADDING REMAINING TIMESTEPS BY USING STORY DATA AS TOPIC FILTER
  let mapData = storyData.map((data, index) => {
    newData.push([])
    // console.log('data', newData[index])
    // GOING THROUGH TOPICS FOR TIMESTEP - INDEX
    return Object.keys(data).map((scrap, key) => {
      let sData = data[key]
      // FROM MERGE || NEW TOPIC [1][?]
      if (sData.length > 1 || sData[0][0] === 1) {
        // START STORY AT EMPTY
        let s = []
        // GOING THROUGH STORIES ([0||1][?], [0||1][?], [0||1][?])
        return sData.map((d, i) => {
          // console.log('hour', index + 1, 'topic', key, 'd', d)
          // IF STORY OF A MERGE TOPIC [0][?], GET STORY [?]
          if (d[0] === 0) {
            s.push(d[1])
            // IF THE PREVIOUS TIMESTEP DOES NOT INCLUDE TOPIC ADD
            if (newData[index][d[1]] == null) {
              let eventInfo = eTopics[index][d[1]]
              // IF THE EVENTS ARE NON-EXISTANT, MAKE IT EMPTY
              if (eventInfo == null) {
                eventInfo = 'EMPTY'
              }
              newData[index][d[1]] = {
                events: eventInfo,
                story: [],
                topicID: d[1],
                hour: index
              }
            }
          }
          // IF THE STORY IS NULL OR ON FIRST INDEX ADD INFO
          if (s[0] != null || i === 0) {
            let eventInfo = eTopics[index + 1][key]
            if (eventInfo == null) {
              eventInfo = 'EMPTY'
            }
            newData[index + 1][key] = {
              events: eventInfo,
              story: s,
              topicID: key,
              hour: index + 1
            }
          }
          return (
            newData[index + 1][key]
          )
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

const makeAdjacencyList = () => {
  let tuneIn = (adjList, story, index) => {
    // console.log('tInIndex', index, 'tInStory', story)
    // console.log(adjList)
    let piece = adjList[index].story
    let sArr = story.concat(index)
    // console.log('tIPiece', adjList[index].story, 'sArr', sArr)
    // if there is a story go to it
    if (piece[0] != null) {
      // update the stories
      // console.log('loop', sArr)
      return tuneIn(adjList, sArr, piece[0])
    } else {
      // console.log('finalsArr', sArr)
      return sArr
    }
  }
  let topics = setUpData()
  let adjacencyList = []
  topics.map((data, index) => {
    Object.keys(data).map((key, i) => {
      let d = data[key]
      let s = []
      // NEITHER NEW TOPIC OR HOUR 0
      if (d.story[0] != null) {
        // MIGHT HAVE MULTIPLE STORIES
        d.story.map((dStory, dI) => {
          // RIGHT NOW STORY IS ONLY PREVIOUS TOPIC INDEX
          adjacencyList.map((aLD, aLI) => {
            if (aLD.topicID === dStory && aLD.hour === index - 1) {
              s.push(aLI)
            }
          })
        })
      }
      adjacencyList.push({
        story: s,
        prevStory: s,
        events: d.events,
        topicID: i,
        hour: d.hour
      })
    })
  })
  let checkGreater = (arr, index) => {
    let notChecked = true
    arr.every((eD, eI) => {
      if (eD > index) {
        notChecked = false
      }
    })
    return notChecked
  }
  for (let i = adjacencyList.length - 1; i >= 0; i--) {
    let d = adjacencyList[i]
    // console.log('forD', d)
    // make check for if the story index is > than the current index
    // that way not doing extra work
    if (d.story[0] != null) {
      // DONT ADD STORIES IF ALREADY ADDED
      if (checkGreater(d.story, i)) {
        d.story.map((sD, sI) => {
          let newS = tuneIn(adjacencyList, [i], sD)
          for (let j = 0; j < newS.length; j++) {
            let s = newS[j]
            let newSCopy = JSON.parse(JSON.stringify(newS))
            newSCopy.splice(j, 1)
            // console.log('sIndex', s, 'copy', newSCopy)
            adjacencyList[s].story = newSCopy
            // console.log('adjListS', adjacencyList[s].story)
          }
        })
      }
    }
  }
  console.log('topicsList', topics)
  console.log('adjacencyList', adjacencyList)
  return adjacencyList
}
const aList = makeAdjacencyList()

const tData = (n, start) => {
  let num = n
  let topics = setUpData()
  if (n + start > topics.length - 1) {
    num = topics.length - 1 - start
  }
  let comData = []
  for (let i = 0; i < num; i++) {
    comData[i] = topics[start + i]
  }
  console.log('tData', comData)
  return comData
}

const nData = 7
const fakeData = allDataComb(nData)
const allData = tData(nData, 0)

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
    // this.props.adjacencyList = aList
    this.setState({data: allData, loading: false, status: 'OK'})
  }
  render () {
    console.log('realData', allData)
    console.log('fakeData', fakeData)
    console.log(aList)
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
        <div className='row' style={{overflow: 'scroll'}}>
          <Chart className='col-md-12' {...props} {...this.state} tipFunction={this.toolTipFunction} yAxis={false} xAxis={false} height={1000} margin={{top: 40, right: 10, bottom: 10, left: 80}} width={5000}>
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
  className: 'col-md-12',
  adjacencyList: aList
}
TopicsContainer.propTypes = {
  className: PropTypes.string,
  numTData: PropTypes.number,
  url: PropTypes.string,
  colorDomain: PropTypes.array,
  adjacencyList: PropTypes.array
}

export default TopicsContainer
