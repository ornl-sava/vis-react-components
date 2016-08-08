import React from 'react'
import { format } from 'd3'
import { Link } from 'react-router'

import TopicsChart from '../src/premade/TopicsChart'
import StoryViewerExample from './StoryViewerExample'

// import {fakePrefixes, fakeData} from '../examples/data/for-hci/hciFakeData'
import {prefixes, topData, aList} from '../examples/data/for-hci/hciData'
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

const nData = 7
// console.log('fake', fakePrefixes, fakeData(nData))

// trims the data by hours
const tData = (n, start, data) => {
  let num = n
  let topics = data
  if (n + start > topics.length - 1) {
    num = topics.length - 1 - start
  }
  let comData = []
  for (let i = 0; i < num; i++) {
    comData[i] = topics[start + i]
  }
  return comData
}

const allData = tData(nData, 0, topData)

console.log('TE-topics', topics.length)
console.log('TE-lanes', lanes.length)

const data = () => {
  let tempData = []
  topics.map((data, index) => {
    let bins = data._source.bins
    bins.map((d, i) => {
      let link = null
      // CHECKS NEXT TIME STEP FOR CONNECTION
      if (i < (bins.length - 1)) {
        let timeDiff = new Date(bins[i + 1].end) - new Date(d.end)
        if (timeDiff / 1000 / 60 / 60 === 1) {
          console.log('TE-connection')
          link = {source: tempData.length, target: tempData.length + 1}
        }
      }
      tempData.push(Object.assign({}, d, {topicID: data._id, link: link}))
    })
  })
  return tempData
}
console.log('TE-data', data())

const chartProps = {
  tipFunction: toolTipFunction,
  data: allData,
  adjacencyList: aList,
  colorDomain: prefixes,
  numTData: nData
}

class TopicsContainer extends React.Component {
  render () {
    return (
      <div className={'col-md-12'}>
        <TopicsChart {...chartProps} />
        <div className='row' >
          <StoryViewerExample colorDomain={prefixes} />
        </div>
        <li><Link to='/id' activeClassName='active'>SingleTopic</Link></li>
      </div>
    )
  }
}

export default TopicsContainer
