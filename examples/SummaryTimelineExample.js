import React from 'react'

import { timeParse } from 'd3'

import SummaryTimelineChart from '../src/premade/SummaryTimelineChart'

let testData = [
  {
    date: '2017-03-15T00:00:00Z',
    mean: 0.4838268258884837,
    stdevMin: -0.5997606958217658,
    stdevMax: 1.5674143475987332,
    min: -1.5997606958217658,
    max: 2.914435740768514
  },
  {
    date: '2017-03-16T00:00:00Z',
    mean: 0.6498042770734018,
    stdevMin: -0.3501957229265982,
    stdevMax: 1.6498042770734018,
    min: -1.3501957229265982,
    max: 2.6767602566667934
  },
  {
    date: '2017-03-17T00:00:00Z',
    mean: 0.39657698918555845,
    stdevMin: -0.6034230108144416,
    stdevMax: 1.3965769891855584,
    min: -1.6034230108144416,
    max: 2.3965769891855584
  },
  {
    date: '2017-03-18T00:00:00Z',
    mean: 0.4849612531449654,
    stdevMin: -0.5150387468550346,
    stdevMax: 1.4849612531449654,
    min: -1.5150387468550346,
    max: 2.4849612531449656
  }
]

var parseTime = timeParse('%Y-%m-%dT%H:%M:%SZ')
testData.map((d) => { d.date = parseTime(d.date) })

const chartCommon = {
  margin: {top: 10, right: 10, bottom: 50, left: 50},
  height: 150
}

class SummaryTimelineExample extends React.Component {
  constructor (props) {
    super()
    this.data = testData
  }

  render () {
    return (
      <div className='col-md-12'>
        <div className='row'>
          <div className='col-md-12'>
            <SummaryTimelineChart {...chartCommon} data={this.data} />
          </div>
        </div>
      </div>
    )
  }
}

export default SummaryTimelineExample
