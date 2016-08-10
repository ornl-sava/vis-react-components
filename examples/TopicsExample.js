import React from 'react'
import { format } from 'd3'
import { Link } from 'react-router'

import TopicsChart from '../src/premade/TopicsChart'
import StoryViewerExample from './StoryViewerExample'

// import {fakePrefixes, fakeData} from '../examples/data/for-hci/hciFakeData'
// import {prefixes, topData, aList} from '../examples/data/for-hci/hciData'
import {prefixes} from '../examples/data/for-hci/hciData'
import topics from '../examples/data/topic-lane-sample/topics-sample.json'
import lanes from '../examples/data/topic-lane-sample/sets-sample.json'

// DISPLAYS INFO OF SVG OBJECT THAT MOUSE IS ON
const toolTipFunction = (tooltipData) => {
  let d = tooltipData
  var toolTip =
    '<span class="title">' + d.label + '</span>' +
    '</span>Number of Topics: ' + format(',')(d.counts) +
    '<br /><small>'
  return toolTip
}

// const nData = 7
// console.log('fake', fakePrefixes, fakeData(nData))

// trims the data by hours
// const tData = (n, start, data) => {
//   let num = n
//   let topics = data
//   if (n + start > topics.length - 1) {
//     num = topics.length - 1 - start
//   }
//   let comData = []
//   for (let i = 0; i < num; i++) {
//     comData[i] = topics[start + i]
//   }
//   return comData
// }

// const allData = tData(nData, 0, topData)
console.log(topics)

console.log('TE-topics', topics.length)
console.log('TE-lanes', lanes.length)

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
      data: topics
    }
    this.chartProps = {
      tipFunction: toolTipFunction,
      links: [],
      timeBins: [],
      colorDomain: prefixes,
      numTData: 5
    }

    this.timeBins = []
    this.links = []

    this.initStart = new Date(this.state.data[0]._source.bins[0].start)

    this.timeUnit = 1 * 1000 * 60 * 60
    this.refineData(this.chartProps)
  }

  refineData (props) {
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
        nodes.push(Object.assign({}, d, {topicID: data._id, events: data._source.common_events}))
      })
    })
    this.links = link.map((data, index) => {
      return { source: nodes[data.source], target: nodes[data.target] }
    })
    console.log('TE-props.links', this.links)
    // let topicSS = topics[0]._source
    // console.log('TE-nodes', nodes)
    nodes.map((data, index) => {
      let i = (new Date(data.start) - this.initStart) / this.timeUnit
      timeBins[i].topics.push(data)
    })
    this.timeBins = timeBins
    console.log('timeBins', this.timeBins)
  }
  getData (chartProps) {
    if (chartProps.numTData > this.timeBins.length) { chartProps.numTData = this.timeBins.length }
    let timeStop = this.initStart.getTime() + (chartProps.numTData - 1) * this.timeUnit
    chartProps.timeBins = this.timeBins.filter((d, i) => {
      return i < chartProps.numTData
    })
    chartProps.links = this.links.filter((d, i) => {
      return (new Date(d.source.start).getTime() && new Date(d.target.start).getTime()) <= timeStop
    })
  }
  render () {
    this.getData(this.chartProps)
    return (
      <div className={'col-md-12'}>
        <TopicsChart {...this.chartProps} />
        <div className='row' >
          <StoryViewerExample colorDomain={prefixes} />
        </div>
        <li><Link to='/id' activeClassName='active'>SingleTopic</Link></li>
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
