import React from 'react'
import { timeFormat } from 'd3-time-format'
import { format } from 'd3-format'

import { HeatmapChart } from '../src'

import { randomHeatmapData, ordinalLinearHeatmapData, linearTemporalHeatmapData, ordinalOrdinalHeatmapData, linearOrdinalHeatmapData } from './data/exampleData'

const toolTipFunction1 = (d) => {
  let toolTip = '<span> No Data </span>'

  if (d.value > 0) {
    toolTip =
      '<span class="title">' + d.key + '</span>' +
      format(',')(d.value)
  }

  return toolTip
}

const toolTipFunction2 = (d) => {
  let toolTip = '<span> No Data </span>'
  if (d.value > 0) {
    toolTip =
      '<span class="title">' + timeFormat('%c')(d.key) + '</span>' +
      format(',')(d.value)
  }

  return toolTip
}

const chartCommon = {
  margin: {top: 5, right: 5, bottom: 50, left: 50},
  height: 300
}

const chartProps1 = {
  header: () => {
    return ([
      <span className='chart-title'>Linear over Ordinal</span>
    ])
  },
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
//
const heatmapProps1 = {
  labelField: 'key',
  numColorCat: 17
}

const chartProps2 = {
  header: () => {
    return ([
      <span className='chart-title'>Temporal over Linear</span>
    ])
  },
  data: linearTemporalHeatmapData,
  xScaleType: 'time',
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
      return timeFormat('%X')(d)
    },
    orient: 'bottom'
  }
}

const heatmapProps2 = {
  labelField: 'key',
  numColorCat: 22,
  minColor: '#F1F5E9',
  maxColor: '#7C9B27'
}

const chartProps3 = {
  header: () => {
    return ([
      <span className='chart-title'>Ordinal over Ordinal</span>
    ])
  },
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
  header: () => {
    return ([
      <span className='chart-title'>Ordinal over Linear</span>
    ])
  },
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

const chartProps5 = {
  header: () => {
    return ([
      <span className='chart-title'>Animated</span>
    ])
  },
  xScaleType: 'linear',
  yScaleType: 'linear'
}

const heatmapProps5 = {
  labelField: 'key',
  yAccessor: {
    key: 'key',
    value: 'value'
  },
  numColorCat: 17,
  minColor: '#edf8b1',
  maxColor: '#2c7fb8'
}
console.log(heatmapProps5, chartProps5)
class HeatmapExample extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      randomData: randomHeatmapData()
    }
    console.log(this.state.randomData)
  }

  componentDidMount () {
    this.createRandomData = () => {
      setTimeout(() => {
        if (this.createRandomData !== null) {
          this.setState({
            randomData: randomHeatmapData()
          }, () => {
            if (this.createRandomData !== null) {
              this.createRandomData()
            }
          })
        }
      }, 2000)
    }
    this.createRandomData()
  }

  componentWillUnmount () {
    this.createRandomData = null
  }

  render () {
    return (
      <div className='col-md-12'>
        <div className='row'>
          <div className='col-md-6'>
            <HeatmapChart {...chartCommon} {...chartProps1} {...heatmapProps1} tipFunction={toolTipFunction1} />
          </div>
          <div className='col-md-6'>
            <HeatmapChart {...chartCommon} {...chartProps2} {...heatmapProps2} tipFunction={toolTipFunction2} />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-6'>
            <HeatmapChart {...chartCommon} {...chartProps3} {...heatmapProps3} tipFunction={toolTipFunction1} />
          </div>
          <div className='col-md-6'>
            <HeatmapChart {...chartCommon} {...chartProps4} {...heatmapProps4} tipFunction={toolTipFunction1} />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <HeatmapChart data={this.state.randomData} {...chartCommon} {...chartProps5} {...heatmapProps5} tipFunction={toolTipFunction1} />
          </div>
        </div>
      </div>
    )
  }
}

export default HeatmapExample
