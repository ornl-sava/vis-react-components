import React from 'react'

import { Chart, Scatterplot } from '../src'

const linearLinear = [
  {
    'x': 'one fish',
    'y': 1
  },
  {
    'x': 'two fish',
    'y': 2
  },
  {
    'x': 'red fish',
    'y': 3
  },
  {
    'x': 'blue fish',
    'y': 4
  },
  {
    'x': 'no fish',
    'y': 5
  }
]

const chartProps = {
  width: 800,
  height: 300,
  xScaleType: 'ordinalPoint',
  data: linearLinear
}

class ScatterplotExample extends React.Component {
  render () {
    return (
      <Chart {...chartProps}>
        <Scatterplot />
      </Chart>
    )
  }
}

export default ScatterplotExample
