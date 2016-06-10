import React from 'react'

import Chart from '../components/Chart'
import Choropleth from '../components/Choropleth'

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
