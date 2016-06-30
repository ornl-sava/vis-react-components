import React from 'react'

import { Chart, Scatterplot } from '../src'
import { linearOrdinalScatterplotData, linearLinearScatterplotData, ordinalLinearScatterplotData, ordinalOrdinalScatterplotData } from './data/exampleData'

const toolTipFunction = (d) => {
  let toolTip = '<span> No Data </span>'

  toolTip =
    '<span class="title">' + d.key + '</span>' + (d.value)

  return toolTip
}

const commonProps = {
  tipFunction: toolTipFunction,
  margin: {top: 15, right: 5, bottom: 50, left: 15},
  clipPath: true,
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
              <Scatterplot radius={10} />
            </Chart>
          </div>
          <div className='col-md-6'>
            <Chart {...commonProps} {...chartProps2}>
              <Scatterplot radius={10} />
            </Chart>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-6'>
            <Chart {...commonProps} {...chartProps3}>
              <Scatterplot radius={10} />
            </Chart>
          </div>
          <div className='col-md-6'>
            <Chart {...commonProps} {...chartProps4}>
              <Scatterplot radius={10} />
            </Chart>
          </div>
        </div>
      </div>
    )
  }
}

export default ScatterplotExample
