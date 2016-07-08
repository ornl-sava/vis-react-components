import React from 'react'
import debounce from 'lodash.debounce'

import { ScatterHeatmapHybrid } from '../src'

var exampleData = []
var now = +new Date()
var endTime = now - 30 * 1000
for (let i = 0; i < 1000; i++) {
  exampleData.push({
    time: endTime + Math.sin(i) * 30 * 1000,
    score: Math.random() * 6,
    id: i
  })
}

class ScatterHeatmapExample extends React.Component {
  constructor (props) {
    super(props)

    this.handleResize = this.handleResize.bind(this)
  }

  handleResize () {
    this.refs.chart.resizeChart()
    this.refs.chart.updateChart()
  }

  componentWillUnmount () {
    window.removeEventListener('resize', null)
  }

  componentDidMount () {
    window.addEventListener('resize', debounce(this.handleResize, 500))
  }

  render () {
    return (
      <ScatterHeatmapHybrid
        ref='chart'
        startTime={now}
        clsName={'ScatterHeatmapHybrid'}
        height={600}
        idAccessor={'id'}
        xAccessor={'time'}
        yAccessor={'score'}
        xLabel={'Event Time'}
        yLabel={'Score'}
        yDomain={[0, 6]}
        timeWindow={30 * 1000}
        heatmapVertDivisions={12}
        heatmapHorzDivisions={10}
        data={exampleData} />
    )
  }
}

export default ScatterHeatmapExample
