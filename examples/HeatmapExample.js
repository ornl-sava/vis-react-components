import React from 'react'
import { Chart, Heatmap } from '../src'

const exampleData = []

const chartMargin = {top: 15, right: 15, bottom: 50, left: 100}
const heatmapProps = {
  className: 'col-lg-3',
  numBins: 10,
  height: 300,
  xScaleType: 'temporal',
  yScaleType: 'ordinal',
  labelField: 'key_as_string',
  xValueField: 'doc_count',
  yValueField: 'doc_count'
}

class HeatmapExample extends React.Component {
  render () {
    return (
      <Chart width={800} height={300} margin={chartMargin} data={exampleData} >
        <Heatmap {...heatmapProps} />
      </Chart>
    )
  }
}

export default HeatmapExample
