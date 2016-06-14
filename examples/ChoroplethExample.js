import React from 'react'
import { Chart, Choropleth } from '../main'

const exampleData = []
class ChoroplethExample extends React.Component {
  render () {
    return (
      <Chart width={800} height={600} data={exampleData} >
        <Choropleth />
      </Chart>
    )
  }
}

export default ChoroplethExample
