import React from 'react'
import d3 from 'd3'

import { Chart, Heatmap } from '../src'

import { ordinalLinearHeatmapData, linearTemporalHeatmapData, ordinalOrdinalHeatmapData, linearOrdinalHeatmapData } from './data/exampleData'

const toolTipFunction1 = (d) => {
  let toolTip = '<span> No Data </span>'

  if (d.value > 0) {
    toolTip =
      '<span class="title">' + d.key + '</span>' +
      d3.format('n')(d.value)
  }

  return toolTip
}

const toolTipFunction2 = (d) => {
  let toolTip = '<span> No Data </span>'
  let timeFormat = d3.time.format('%c')
  if (d.value > 0) {
    toolTip =
      '<span class="title">' + timeFormat(new Date(+d.key)) + '</span>' +
      d3.format('n')(d.value)
  }

  return toolTip
}

const chartCommon = {
  margin: {top: 15, right: 15, bottom: 50, left: 110},
  height: 300,
  legend: true
}

const chartProps1 = {
  title: 'Linear over Ordinal',
  data: ordinalLinearHeatmapData,
  xScaleType: 'linear',
  yScaleType: 'ordinalBand',
  yAxis: {
    type: 'y',
    orient: 'left'
  },
  xAxis: {
    type: 'x',
    tickCount: ordinalLinearHeatmapData[0].bins.length,
    orient: 'bottom'
  }
}

const heatmapProps1 = {
  labelField: 'key',
  numColorCat: 17
}

const chartProps2 = {
  title: 'Temporal over Linear',
  data: linearTemporalHeatmapData,
  xScaleType: 'temporal',
  yScaleType: 'linear',
  yAxis: {
    type: 'y',
    tickCount: linearTemporalHeatmapData[0].bins.length,
    orient: 'left'
  },
  xAxis: {
    type: 'x',
    tickCount: linearTemporalHeatmapData[0].bins.length + 1,
    tickValues: linearTemporalHeatmapData[0].bins.map((d) => new Date(d.key)),
    tickFormat: (d, i) => {
      let timeFormat = d3.time.format('%X')
      return timeFormat(d)
    },
    orient: 'bottom'
  }
}

const heatmapProps2 = {
  labelField: 'key',
  numColorCat: 17,
  minColor: '#F1F5E9',
  maxColor: '#7C9B27'
}

const chartProps3 = {
  title: 'Ordinal over Ordinal',
  data: ordinalOrdinalHeatmapData,
  xScaleType: 'ordinalBand',
  yScaleType: 'ordinalBand'
}

const heatmapProps3 = {
  labelField: 'key',
  yAccessor: {
    key: 'key',
    value: 'value'
  },
  numColorCat: 17,
  minColor: '#FEE6CE',
  maxColor: '#E6550D'
}

const chartProps4 = {
  title: 'Ordinal over Linear',
  data: linearOrdinalHeatmapData,
  xScaleType: 'ordinalBand',
  yScaleType: 'linear',
  yAxis: {
    type: 'y',
    tickCount: linearOrdinalHeatmapData[0].bins.length,
    orient: 'left'
  }
}

const heatmapProps4 = {
  labelField: 'key',
  yAccessor: {
    key: 'key',
    value: 'value'
  },
  numColorCat: 17,
  minColor: '#EFEDF5',
  maxColor: '#756BB1'
}

class HeatmapExample extends React.Component {
  render () {
    return (
      <div className='col-md-12'>
        <div className='row'>
          <div className='col-md-6'>
            <Chart {...chartCommon} {...chartProps1} tipFunction={toolTipFunction1}>
              <Heatmap {...heatmapProps1} />
            </Chart>
          </div>
          <div className='col-md-6'>
            <Chart {...chartCommon} {...chartProps2} tipFunction={toolTipFunction2}>
              <Heatmap {...heatmapProps2} />
            </Chart>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-6'>
            <Chart {...chartCommon} {...chartProps3} tipFunction={toolTipFunction1}>
              <Heatmap {...heatmapProps3} />
            </Chart>
          </div>
          <div className='col-md-6'>
            <Chart {...chartCommon} {...chartProps4} tipFunction={toolTipFunction1}>
              <Heatmap {...heatmapProps4} />
            </Chart>
          </div>
        </div>
      </div>
    )
  }
}

export default HeatmapExample
