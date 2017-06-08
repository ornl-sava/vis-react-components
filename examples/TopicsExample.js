import React from 'react'
import { NavLink } from 'react-router-dom'

import TopicsChart from '../src/premade/TopicsChart'
import StoryViewerExample from './StoryViewerExample'

// import {fakePrefixes, fakeData} from '../examples/data/for-hci/hciFakeData'
// import {prefixes, topData, aList} from '../examples/data/for-hci/hciData'
import {prefixes} from '../examples/data/for-hci/hciData'
import topics from '../examples/data/topic-lane-sample/topics-sample_v01.json'
import topics2 from './data/topic-lane-sample/topics-sample_v02.json'
// import lanes from '../examples/data/topic-lane-sample/sets-sample.json'

// console.log(topics)

// console.log('TE-topics', topics.length)
// console.log('TE-lanes', lanes.length)

// const chartProps = {
//   tipFunction: toolTipFunction,
//   data: allData,
//   adjacencyList: aList,
//   colorDomain: prefixes,
//   numTData: nData
// }

class TopicsContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: topics,
      initBins: topics2.data
    }
    this.chartProps = {
      // tipFunction: toolTipFunction,
      links: [],
      timeBins: [],
      colorDomain: prefixes,
      numTData: 5,
      onBarClick: this._onBarClick.bind(this)
    }

    this.timeBins = []
    this.links = []

    this.initStart = new Date(this.state.data[0]._source.bins[0].start)

    this.timeUnit = 1 * 1000 * 60 * 60
    // this.refineData(this.chartProps)
    this.refineData2(this.chartProps)
  }
  _onBarClick (event, data) {
    console.log('GOTO', data)
  }

  refineData2 (props) {
    // console.log('rD-d', this.state.initBins)
    let timeBins = []
    let topicMap = {}
    let links = []
    // get time steps
    for (let i = 0; i < this.state.initBins.length - 1; i++) {
      if (this.state.initBins[i].start !== this.state.initBins[i + 1].start) {
        timeBins.push({time: this.state.initBins[i].start, topics: []})
      }
    }
    // add last time step
    timeBins.push({time: this.state.initBins[this.state.initBins.length - 1].end, topics: []})
    // sort in case out of order
    timeBins.sort((a, b) => {
      return a.time - b.time
    })
    // console.log('timeBins', timeBins)
    this.state.initBins.map((data, index) => {
      let i = (new Date(data.start).getTime() - new Date(timeBins[0].time).getTime()) / this.timeUnit
      // console.log('i', i)
      data.events = data.common_events
      timeBins[i].topics.push(data)
      if (topicMap[data.topic] == null) { topicMap[data.topic] = [] }
      topicMap[data.topic].push(data)
    })
    timeBins.map((da, ind) => {
      da.topics.map((data, index) => {
        // console.log('dMap', topicMap[data.topic], data.topic)
        let target = null
        data.story = topicMap[data.topic].filter((d, i) => {
          return d.start !== data.start
        })
        topicMap[data.topic].map((d, i) => {
          if (data.end === d.start) {
            target = d
            // console.log('target', target)
          }
        })
        if (target != null) {
          links.push({source: data, target: target})
        }
      })
    })
    // console.log('timeBinsAfter', timeBins, topicMap, links)
    props.timeBins = timeBins
    props.links = links
  }

  refineData (props) {
    this.story = []
    let link = []
    let story = []
    let nodes = []
    let timeBins = []
    this.state.data.map((data, index) => {
      let bins = data._source.bins
      let tConnect = []
      // console.log('TE-binLength', bins.length, '-numData', props.numTData)
      bins.map((d, i) => {
        // console.log('timeSTop', timeStop, '-dStart-', new Date(d.start).getTime())
        if (index === 0) { timeBins.push({startTime: d.start, topics: []}) }
        // CHECKS NEXT TIME STEP FOR CONNECTION
        if (i < (bins.length - 1)) {
          let timeDiff = new Date(bins[i + 1].end) - new Date(d.end)
          if (timeDiff / 1000 / 60 / 60 === 1) {
            link.push({source: nodes.length, target: nodes.length + 1})
          }
        }
        tConnect.push(nodes.length)
        story.push(tConnect)
        nodes.push(Object.assign({}, d, {topicID: data._id, events: data._source.common_events, story: [], fullStory: []}))
      })
    })
    this.links = link.map((data, index) => {
      return { source: nodes[data.source], target: nodes[data.target] }
    })
    // console.log('TE-props.links', this.links)
    // let topicSS = topics[0]._source
    // console.log('TE-nodes', nodes)
    nodes.map((data, index) => {
      let i = (new Date(data.start) - this.initStart) / this.timeUnit
      // let nStory = []
      for (let j = 0; j < story[index].length; j++) {
        let d = story[index][j]
        if (d !== index) {
          data.story.push(nodes[d])
          data.fullStory.push(nodes[d])
        }
      }
      timeBins[i].topics.push(data)
    })
    this.timeBins = timeBins
    // console.log('timeBins', this.timeBins)
  }
  getData (chartProps) {
    // CHECK TO SEE IF NUMBER OF TIMESTEPS EXCEEDS DATA
    if (chartProps.numTData > this.timeBins.length) { chartProps.numTData = this.timeBins.length }
    // REMOVES OUT OF RANGE BINS
    let timeStop = this.initStart.getTime() + (chartProps.numTData - 1) * this.timeUnit
    chartProps.timeBins = this.timeBins.filter((d, i) => {
      return i < chartProps.numTData
    })
    // REMOVING THE STORY OF NODES THAT DO NOT FIT TIME STEP RANGE
    // MIGHT BE A BETTER WAY...
    chartProps.timeBins.map((d, i) => {
      d.topics.map((data, index) => {
        // console.log('tD', d)
        data.story = data.fullStory.filter((da) => {
          return new Date(da.start).getTime() <= timeStop
        })
      })
    })
    console.log('chatime', chartProps.timeBins[0], '-', this.timeBins[0])
    chartProps.links = this.links.filter((d, i) => {
      return (new Date(d.source.start).getTime() && new Date(d.target.start).getTime()) <= timeStop
    })
  }
  render () {
    // this.getData(this.chartProps)
    return (
      <div className={'col-md-12'}>
        <TopicsChart {...this.chartProps} />
        <div className='row' >
          <StoryViewerExample colorDomain={prefixes} />
        </div>
        <li><NavLink to='/id' activeClassName='active'>SingleTopic</NavLink></li>
      </div>
    )
  }
}

// TopicsContainer.defaultProps = {
//
// }
//
// TopicsContainer.propTypes = {
//   tipFunction: PropTypes.function,
//   links: PropTypes.array,
//   timeBins: PropTypes.array,
//   colorDomain: PropTypes.array,
//   numTData: PropTypes.number
// }

export default TopicsContainer
