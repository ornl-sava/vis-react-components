import React from 'react'
import { format } from 'd3'
import { Link } from 'react-router'

import TopicsChart from '../src/premade/TopicsChart'
import StoryViewerExample from './StoryViewerExample'

import topicData from './data/topics.json'
import eTopics from '../examples/data/for-hci/enduring-topics-listed.json'
import storyData from '../examples/data/for-hci/stories.json'
import eventNames from '../examples/data/for-hci/enduring-22-model.json'

// DISPLAYS INFO OF SVG OBJECT THAT MOUSE IS ON
const toolTipFunction = (tooltipData) => {
  let d = tooltipData
  var toolTip =
    '<span class="title">' + d.label + '</span>' +
    '</span>Number of Topics: ' + format(',')(d.counts) +
    '<br /><small>'
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
    let piece = adjList[index].story
    let sArr = story.concat(index)
    // if there is a story go to it
    if (piece[0] != null) {
      // update the stories
      return tuneIn(adjList, sArr, piece[0])
    } else {
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
  // LOOKS FOR A STORY THAT HAS AN INDEX GREATER THAN CURRENT
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
    if (d.story[0] != null) {
      // CHECK TO SEE IF STORY FILLED ALREADY
      if (checkGreater(d.story, i)) {
        // LOOPING THROUGH STORIES
        d.story.map((sD, sI) => {
          // CYCLES FOR ALL THE STORIES OF THAT TOPIC
          let newS = tuneIn(adjacencyList, [i], sD)
          for (let j = 0; j < newS.length; j++) {
            let s = newS[j]
            let newSCopy = JSON.parse(JSON.stringify(newS))
            newSCopy.splice(j, 1)
            adjacencyList[s].story = newSCopy
          }
        })
      }
    }
  }
  // console.log('topicsList', topics)
  // console.log('adjacencyList', adjacencyList)
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
  return comData
}

const nData = 7
const fakeData = allDataComb(nData)
const allData = tData(nData, 0)

const chartProps = {
  tipFunction: toolTipFunction,
  data: allData,
  adjacencyList: aList,
  colorDomain: prefixes,
  numTData: nData
}

class TopicsContainer extends React.Component {
  render () {
    console.log('realData', allData)
    console.log('fakeData', fakeData)
    console.log(aList)
    return (
      <div className={'col-md-12'}>
        <TopicsChart {...chartProps} />
        {/* <div className='row' >
          <Chart className='col-md-12' {...props} {...this.state} tipFunction={this.toolTipFunction} yAxis={false} xAxis={false} height={1000} margin={{top: 40, right: 10, bottom: 10, left: 80}} width={5000}>
            <StoryViewer className='col-md-12' {...props} clickArray={this.state.clickArray} colorView={this.refs.colorView} />
          </Chart>
        </div>*/}
        <div className='row' >
          <StoryViewerExample colorDomain={prefixes} />
        </div>
        <li><Link to='/id' activeClassName='active'>SingleTopic</Link></li>
      </div>
    )
  }
}

export default TopicsContainer
