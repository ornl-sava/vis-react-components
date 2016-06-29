import React from 'react'

import { Chart, Scatterplot } from '../src'
import { linearOrdinalScatterplotData, linearLinearScatterplotData, ordinalLinearScatterplotData, ordinalOrdinalScatterplotData } from './data/exampleData'

const commonProps = {
  width: 800,
  height: 300
}

const chartProps1 = {
  className: 'scatter1',
  xScaleType: 'linear',
  yScaleType: 'ordinalPoint',
  data: linearOrdinalScatterplotData
}

const chartProps2 = {
  className: 'scatter2',
  xScaleType: 'linear',
  yScaleType: 'linear',
  data: linearLinearScatterplotData
}

const chartProps3 = {
  className: 'scatter3',
  xScaleType: 'ordinalPoint',
  yScaleType: 'linear',
  data: ordinalLinearScatterplotData
}

const chartProps4 = {
  className: 'scatter4',
  xScaleType: 'ordinalPoint',
  yScaleType: 'ordinalPoint',
  data: ordinalOrdinalScatterplotData
}

class ScatterplotExample extends React.Component {
  render () {
    return (
      <div className='col-md-12'>
        <div className='row'>
          <div className='col-md-6'>
            <Chart {...commonProps} {...chartProps1}>
              <Scatterplot />
            </Chart>
          </div>
          <div className='col-md-6'>
            <Chart {...commonProps} {...chartProps2}>
              <Scatterplot />
            </Chart>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-6'>
            <Chart {...commonProps} {...chartProps3}>
              <Scatterplot />
            </Chart>
          </div>
          <div className='col-md-6'>
            <Chart {...commonProps} {...chartProps4}>
              <Scatterplot />
            </Chart>
          </div>
        </div>
      </div>
    )
  }
}

export default ScatterplotExample
