import React from 'react'
// import { format } from 'd3'
import * as d3 from 'd3'
import Chart from '../src/Chart'
import { NavLink } from 'react-router-dom'

import ForceDirectedGraph from '../src/ForceDirectedGraph.js'

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

class TopicsContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      chartData: {},
      simInfo: null
    }
    this.buttons = [
      '<',
      '>'
    ]
    this.forwardClick = this.forwardClick.bind(this)
    this.backClick = this.backClick.bind(this)
    this.nData = nData

    this.nodes = []
    this.links = []

    this.alphaMin = 0.01
    this.getSimInfo = this.getSimInfo.bind(this)

    // this.chartData = this.getData()
  }

  componentWillMount () {
    this.setState({chartData: this.getData(this.nData)})
  }

  componentWillUpdate (nextState) {
    // if (this.state.nData !== nextState.nData) {
    //   this.chartData = this.getData()
    // }
  }

  forwardClick () {
    console.log('fo', this.state)
    let num = this.nData + 1
    if (num >= storyData.length + 1) {
      num = 1
    }
    console.log('FDGE-fClick', num)
    this.nData = num
    this.setState({ chartData: this.getData(num) })
  }
  backClick () {
    console.log('ba', this.state)
    let num = this.nData - 1
    if (num < 1) {
      num = (storyData.length + 1) - 1
    }
    console.log('FDGE-bClick', num)
    this.nData = num
    this.setState({ chartData: this.getData(num) })
  }

  getData (numData) {
    let nodes = []
    aList.map((d, i) => {
      if (d.hour < numData) {
        nodes.push({
          events: d.events,
          hour: d.hour,
          ind: i + numData,
          id: i + numData
        })
      }
    })
    for (let i = numData - 1; i >= 0; i--) {
      nodes.unshift({
        events: 'parent- ' + i,
        hour: i,
        ind: i,
        id: i
      })
    }
    this.nodes = nodes

    let links = []
    aList.map((data, index) => {
      if (data.hour < numData) {
        links.push({
          source: data.hour,
          target: index + numData,
          value: 1000
        })
        return data.story.map((d) => {
          // The node is at a hour greater than the current node
          // The node is within the current batch of nodes being viewed
          if ((d + numData) > (index + numData) && (d + numData) < nodes.length) {
          // seperated topics
          // if (false) {
          // only direct connections
          // if (aList[d + this.state.nData].hour === data.hour + 1 && (d + this.state.nData) < nodes.length) {
            links.push({
              source: index + numData,
              target: d + numData,
              value: d - index
            })
          }
        })
      }
    })

    let list = []
    for (let i = 0; i < nodes.length; i++) { list.push([]) }
    links.map((data, index) => {
      list[data.source].push(data.target)
      list[data.target].push(data.source)
    })
    this.links = links

    let chartProps = {
      tipFunction: toolTipFunction,
      adjacencyList: list,
      numTData: numData,
      nodes: nodes,
      links: links,
      alphaMin: this.alphaMin,
      getSimInfo: this.getSimInfo,
      isStatic: true,
      timeMax: 15 * 1000
      // tickMax: 150
    }
    console.log('FDGE-nodes', nodes)
    return chartProps
  }
  getText () {
    return (
      <g className={'dataInfo'} >
        <span className={'info'} ><b>node count: </b>{this.nodes.length}</span><br />
        <span className={'info'} ><b>link count: </b>{this.links.length}</span><br />
        <span className={'info'} ><b>hour count: </b>{this.nData}</span><br /><br />
      </g>
    )
  }
  getSimInfo (timeCount, tickCount) {
    let simInfo = (
      <g className={'simInfo'} >
        <span className={'info'} ><b>min alpha: </b>{this.alphaMin}</span><br />
        <span className={'info'} ><b>{'time(ms): '}</b>{timeCount}</span><br />
        <span className={'info'} ><b>tick count: </b>{tickCount}</span><br />
      </g>
    )
    this.setState({simInfo: simInfo})
  }

  render () {
    // let chartData = this.getData()
    return (
      <div className='row' >
        <div className='col-md-1'>
          <g>
            <button onClick={this.backClick} >{this.buttons[0]}</button>
            <button onClick={this.forwardClick} >{this.buttons[1]}</button>
            <br /><br />
          </g>
          {this.getText()}
          {this.state.simInfo}
        </div>
        <Chart className='col-md-11' tipFunction={toolTipFunction} yAxis={false} xAxis={false} height={1000} margin={{top: 40, right: 10, bottom: 10, left: 80}}>
          <ForceDirectedGraph {...this.state.chartData} />
        </Chart>
        <li><NavLink to='/forceDirectedTree' activeClassName='active'>SingleTopic</NavLink></li>
      </div>
    )
  }
}

export default TopicsContainer
