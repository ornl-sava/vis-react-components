import React from 'react'
import { Chart, Scatterplot } from '../main'

const exampleData = []
class ScatterplotExample extends React.Component {
  render () {
    return (
      <Chart width={800} height={600} data={exampleData} >
        <Scatterplot />
      </Chart>
    )
  }
}

export default ScatterplotExample
