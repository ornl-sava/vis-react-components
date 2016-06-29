import React from 'react'

import { Chart, Scatterplot } from '../src'
import { linearOrdinalScatterplotData, linearLinearScatterplotData, ordinalLinearScatterplotData, ordinalOrdinalScatterplotData } from './data/exampleData'

const commonProps = {
  width: 800,
  height: 300
}

const chartProps1 = {
  title: 'Linear over Linear',
  className: 'scatter2',
  xScaleType: 'linear',
  yScaleType: 'linear',
  data: linearLinearScatterplotData
}

const chartProps2 = {
  title: 'Linear over Ordinal',
  className: 'scatter1',
  xScaleType: 'linear',
  yScaleType: 'ordinalPoint',
  data: linearOrdinalScatterplotData
}

const chartProps3 = {
  title: 'Ordinal over Ordinal',
  className: 'scatter4',
  xScaleType: 'ordinalPoint',
  yScaleType: 'ordinalPoint',
  data: ordinalOrdinalScatterplotData
}

const chartProps4 = {
  title: 'Ordinal over Linear',
  className: 'scatter3',
  xScaleType: 'ordinalPoint',
  yScaleType: 'linear',
  data: ordinalLinearScatterplotData
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
