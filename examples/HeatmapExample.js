import React from 'react'
import d3 from 'd3'

import { Chart, Heatmap } from '../src'

// import exampleData from './data/heatmap.json'
import { ordinalHeatmapData, linearHeatmapData } from './data/exampleData'

const toolTipFunction1 = (d) => {
  let toolTip = '<span> No Data </span>'

  if (d.value > 0) {
    toolTip =
      '<span class="title">' + d.key + '</span>' +
      d3.format('n')(d.value)
  }

  return toolTip
}

const chartProps1 = {
  className: 'col-lg-3',
  margin: {top: 15, right: 15, bottom: 50, left: 110},
  width: 800,
  height: 300,
  data: ordinalHeatmapData,
  xScaleType: 'linear',
  yScaleType: 'ordinalBand',
  yAxis: {
    type: 'y',
    orient: 'left'
  },
  xAxis: {
    type: 'x',
    tickCount: ordinalHeatmapData[0].bins.length,
    orient: 'bottom'
  },
  legend: true
}

const heatmapProps1 = {
  labelField: 'key',
  numColorCat: 17
}

// Setup custom tick values to be used
// let yTickValues = []
// linearHeatmapData.forEach((d) => {
//   yTickValues.push(d.key)
// })

// NOTE: Padding wlinearHeatmapDataith empty data to keep heatmap more generic
// let numBins = 10
// if (linearHeatmapData.length < numBins) {
//   let n = linearHeatmapData.length
//   for (let i = n; i < numBins; i++) {
//     linearHeatmapData.push({
//       bins: [],
//       key: ' '.repeat(i),
//       value: 0
//     })
//   }
// }

const toolTipFunction2 = (d) => {
  let toolTip = '<span> No Data </span>'

  if (d.value > 0) {
    toolTip =
      '<span class="title">' + new Date(+d.key) + '</span>' +
      d3.format('n')(d.value)
  }

  return toolTip
}

const chartProps2 = {
  className: 'col-lg-3',
  margin: {top: 15, right: 15, bottom: 50, left: 110},
  width: 800,
  height: 300,
  data: linearHeatmapData,
  xScaleType: 'temporal',
  yScaleType: 'linear',
  yAxis: {
    type: 'y',
    tickCount: linearHeatmapData[0].bins.length,
    orient: 'left'
  },
  xAxis: {
    type: 'x',
    tickCount: linearHeatmapData[0].bins.length,
    orient: 'bottom'
  },
  legend: true
}

const heatmapProps2 = {
  labelField: 'key',
  yAccessor: {
    key: 'key',
    value: 'key'
  },
  numColorCat: 17,
  maxColor: '#7C9B27',
  minColor: '#F1F5E9'
}

class HeatmapExample extends React.Component {
  render () {
    return (
      <div>
        <Chart {...chartProps1} tipFunction={toolTipFunction1}>
          <Heatmap {...heatmapProps1} />
        </Chart>
        <Chart {...chartProps2} tipFunction={toolTipFunction2}>
          <Heatmap {...heatmapProps2} />
        </Chart>
      </div>
    )
  }
}

export default HeatmapExample
