import React from 'react'

import SummaryTimelineChart from '../src/premade/SummaryTimelineChart'

import { summaryTimelineData } from './data/exampleData'

const getTemporalSelection = (selection) => {
  return summaryTimelineData.map((bin) => {
    let selected = true
    let dateX = new Date(bin.date)
    if (selection.length === 2 && (dateX < selection[0] || dateX >= selection[1])) {
      selected = false
    }

    return {
      date: dateX,
      avg: bin.avg,
      innerRangeMin: bin.innerRangeMin,
      innerRangeMax: bin.innerRangeMax,
      outerRangeMin: bin.outerRangeMin,
      outerRangeMax: bin.outerRangeMax,
      opacityValue: bin.avg,
      className: selected ? 'selected' : null
    }
  })
}

const chartCommon = {
  margin: { top: 10, right: 10, bottom: 50, left: 50 },
  height: 150
}

const chartProps0 = {
  header: () => {
    return ([
      <span className='chart-title'>Summary Timeline Default Settings</span>
    ])
  }
}

const chartProps1 = {
  header: () => {
    return ([
      <span className='chart-title'>Summary Timeline Variant 1</span>
    ])
  },
  // data: testData,
  bgColor: 'green',
  range1FillColor: 'orange',
  range2FillColor: 'red',
  meanFillColor: 'blue',
  meanCircleRadius: 1.5,
  useOpacityScale: false,
  showRange2Area: false,
  showRange1Area: true
}

const chartProps2 = {
  header: () => {
    return ([
      <span className='chart-title'>Summary Timeline Variant 2</span>
    ])
  },
  // data: testData,
  bgColor: 'green',
  range1FillColor: '#9ecae1',
  range2FillColor: '#c6dbef',
  meanFillColor: 'black',
  meanCircleRadius: 1.0,
  showRange1Area: true,
  showRange2Area: true
}

class SummaryTimelineExample extends React.Component {
  constructor (props) {
    super(props)

    this.onBrush = this._onBrush.bind(this)
    this.brushedVals = []
    this.data = getTemporalSelection(this.brushedVals)
  }

  _onBrush (brushedVals) {
    console.log('SummaryTimelineExample._onBrush() called')
    this.brushedVals = brushedVals
    this.data = getTemporalSelection(this.brushedVals)
    this.forceUpdate()
    console.log(this.data)
  }

  render () {
    return (
      <div className='col-md-12'>
        <div className='row'>
          <div className='col-md-12'>
            <SummaryTimelineChart {...chartCommon} {...chartProps0} data={this.data} />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <SummaryTimelineChart {...chartCommon} {...chartProps1} data={this.data} />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <SummaryTimelineChart {...chartCommon} {...chartProps2} data={this.data}
              brushed onBrush={this.onBrush} />
          </div>
        </div>
      </div>
    )
  }
}

export default SummaryTimelineExample
