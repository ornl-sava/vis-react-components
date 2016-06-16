import React from 'react'
import { Chart, Heatmap } from '../src'

const exampleData = []
class HeatmapExample extends React.Component {
  render () {
    return (
      <Chart width={800} height={600} data={exampleData} >
        <Heatmap />
      </Chart>
    )
  }
}

export default HeatmapExample
