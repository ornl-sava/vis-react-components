import React from 'react'
import debounce from 'lodash.debounce'

import { HybridScatterHeatmapChart, ScatterHeatmapHybrid } from '../src'

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

var exampleData2 = []
var now2 = +new Date()
var endTime2 = now2 - 20 * 1000
var slice = (now2 - endTime2) / 11
for (let i = 1; i < 6; i++) {
  let datum = {}
  datum.key = i
  datum.value = 0
  datum.bins = []
  for (let j = 1; j < 12; j++) {
    let key = endTime2 + (j - 1) * slice
    let value = Math.floor(Math.random() * 10)
    let data = []
    for (let k = 0; k < value; k++) {
      let point = {
        x: (endTime2 + (j - 1) * slice) + Math.floor(Math.random() * slice),
        y: (i - 1) + Math.random() * 1
      }
      data.push(point)
    }

    datum.value += value
    datum.bins.push({
      data,
      key,
      value
    })
  }
  exampleData2.push(datum)
}

class ScatterHeatmapExample extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      now: now2,
      data: exampleData2
    }

    this.handleResize = debounce(this.handleResize.bind(this), 500)
    this.shiftDataPoints = this.shiftDataPoints.bind(this)
  }

  handleResize () {
    this.refs.chart.resizeChart()
    this.refs.chart.updateChart()
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize, false)
    this.update = null
  }

  shiftDataPoints () {
    this.now = +new Date()
    var endTime = this.now - 20 * 1000
    var slice = (this.now - endTime) / 11
    for (let i = 0; i < this.state.data.length; i++) {
      for (let j = 0; j < this.state.data[i].bins.length; j++) {
        this.state.data[i].bins[j].key = endTime + j * slice
        for (let k = 0; k < this.state.data[i].bins[j].data.length; k++) {
          this.state.data[i].bins[j].data[k].x += 10
        }
      }
    }
    return this.state.data
  }

  componentDidMount () {
    window.addEventListener('resize', this.handleResize, false)
    this.update = () => {
      setTimeout(() => {
        if (this.update !== null) {
          this.setState({
            data: this.shiftDataPoints(),
            now: this.now
          }, () => {
            if (this.update !== null) {
              this.update()
            }
          })
        }
      }, 10)
    }
    // this.update()
  }

  render () {
    return (
      <div>
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
          heatmapHorzDivisions={5}
          data={exampleData} />
        <HybridScatterHeatmapChart
          className='Hybrid'
          height={600}
          startTime={this.state.now}
          timeWindow={20 * 1000}
          data={this.state.data} />
      </div>

    )
  }
}

export default ScatterHeatmapExample
