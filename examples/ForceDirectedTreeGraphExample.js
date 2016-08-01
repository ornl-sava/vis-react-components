import React from 'react'
// import { format } from 'd3'
import * as d3 from 'd3'
import Chart from '../src/Chart'

import ForceDirectedGraphTree from '../src/ForceDirectedGraphTree.js'

import eTopics from '../examples/data/for-hci/enduring-topics-listed.json'
import storyData from '../examples/data/for-hci/stories.json'

// DISPLAYS INFO OF SVG OBJECT THAT MOUSE IS ON
// USED IN THE COMPONENT ALONGSIDE THE TOOLTIP MODULE
const toolTipFunction = (tooltipData) => {
  let d = tooltipData
  var toolTip =
    '<span class="title">' + d.label + '</span>' +
    '</span>Number of Topics: ' + d3.format(',')(d.counts) +
    '<br /><small>'
  return toolTip
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
    let sArr = story.concat(index).slice(0)
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
        prevStory: s, // don't think I'll be using this
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

const nData = 3

let makeTreeData = () => {
  let ind = 0
  let treeList = {hour: -1, children: [], index: ind++, events: 'root-', id: ind}
  for (let i = 0; i < nData; i++) {
    treeList.children.push(Object.assign({}, {hour: i, children: [], index: ind++, events: 'parent-', id: ind}))
  }
  aList.map((d, i) => {
    if (d.hour < nData) {
      treeList.children[d.hour].children.push(Object.assign({}, {
        hour: d.hour, events: d.events, index: ind++, id: ind
      }))
    }
  })
  return treeList
}

const treeChartProps = {
  tipFunction: toolTipFunction,
  data: makeTreeData()
}

class TopicsContainer extends React.Component {
  render () {
    return (
      <div>
        {<Chart className='col-md-12' tipFunction={toolTipFunction} yAxis={false} xAxis={false} height={1000} >
          <ForceDirectedGraphTree {...treeChartProps} />
        </Chart>}
      </div>
    )
  }
}

export default TopicsContainer
