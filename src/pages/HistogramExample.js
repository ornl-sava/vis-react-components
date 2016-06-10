import React from 'react'

import Chart from '../components/Chart'
import Histogram from '../components/Histogram'

const exampleData = [
  {
    name: 'One',
    type: 'one',
    bins: [
      {x: 'A', y: 600},
      {x: 'B', y: 450},
      {x: 'C', y: 130},
      {x: 'D', y: 900},
      {x: 'E', y: 220},
      {x: 'F', y: 690},
      {x: 'G', y: 415},
      {x: 'H', y: 105},
      {x: 'I', y: 760},
      {x: 'J', y: 300}
    ]
  },
  {
    name: 'Two',
    type: 'two',
    bins: [
      {x: 'A', y: 200},
      {x: 'B', y: 150},
      {x: 'C', y: 10},
      {x: 'D', y: 300},
      {x: 'E', y: 200},
      {x: 'F', y: 0},
      {x: 'G', y: 285},
      {x: 'H', y: 88},
      {x: 'I', y: 580},
      {x: 'J', y: 20}
    ]
  }
]

class HistogramExample extends React.Component {
  render () {
    return (
      <div>
        <div>
          <Chart width={400} height={200} data={exampleData} >
            <Histogram addOverlay={false} />
          </Chart>
        </div>
        <div>
          <Chart width={400} height={200} data={exampleData} >
            <Histogram type='stacked' addOverlay={false} />
          </Chart>
        </div>
      </div>
    )
  }
}

export default HistogramExample
