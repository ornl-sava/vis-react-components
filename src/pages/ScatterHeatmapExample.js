import React from 'react'
import debounce from 'lodash.debounce'

import ScatterHeatmapHybrid from '../components/ScatterHeatmapHybrid'

var exampleData = []
var currentTime = +new Date()
for (let i = 0; i < 1000; i++) {
  let datum = {
    time: currentTime - Math.sin(i) * 30 * 1000,
    score: Math.sin(3 * i) * 6,
    id: i
  }
  exampleData.push(datum)
}

class ScatterplotExample extends React.Component {
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
    clearInterval(this.state.timer)
  }

  componentDidMount () {
    window.addEventListener('resize', debounce(this.handleResize, 500))
  }

  render () {
    return (
      <ScatterHeatmapHybrid
        ref='chart'
        startTime={currentTime}
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

export default ScatterplotExample
