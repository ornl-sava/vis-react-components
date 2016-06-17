import React from 'react'
import d3 from 'd3'

import { Chart, Heatmap } from '../src'

import exampleData from './data/heatmap.json'
let data = exampleData.data

const toolTipFunction = (d) => {
  let toolTip = '<span> No Data </span>'

  if (d.value > 0) {
    toolTip =
      '<span class="title">' + d.key + '</span>' +
      d3.format('n')(d.value)
  }

  return toolTip
}

// Setup custom tick values to be used
let yTickValues = []
data.forEach((d) => {
  yTickValues.push(d.key_as_string)
})

// NOTE: Padding with empty data to keep heatmap more generic
let numBins = 10
if (data.length < numBins) {
  let n = data.length
  for (let i = n; i < numBins; i++) {
    data.push({
      bins: [],
      key: ' '.repeat(i),
      key_as_string: ' '.repeat(i),
      doc_count: 0
    })
  }
}

// NOTE: Chart specific props (need specific x/y axis setup)
const chartProps = {
  className: 'col-lg-3',
  margin: {top: 15, right: 15, bottom: 50, left: 110},
  width: 800,
  height: 300,
  data: data,
  xScaleType: 'temporal',
  yScaleType: 'ordinal',
  yAxis: {
    type: 'y',
    tickValues: yTickValues,
    orient: 'left'
  },
  xAxis: {
    type: 'x',
    tickCount: data[0].bins.length,
    tickFormat: (d, i) => {
      if (i === 1 ||
          i === data[0].bins.length ||
          i === Math.floor(data[0].bins.length / 2) + 1) {
        let timeFormat = d3.time.format.utc('%H:%M')
        return timeFormat(d)
      } else {
        return ''
      }
    },
    orient: 'bottom'
  },
  legend: true
}

// NOTE: These are props specific to heatmap container (could be sneakily passed down as chart props too)
const heatmapProps = {
  labelField: 'key_as_string',
  xKeyField: 'key',
  xValueField: 'doc_count',
  yKeyField: 'key_as_string',
  yValueField: 'doc_count'
}

class HeatmapExample extends React.Component {
  render () {
    return (
      <Chart {...chartProps} tipFunction={toolTipFunction}>
        <Heatmap {...heatmapProps} />
      </Chart>
    )
  }
}

export default HeatmapExample
