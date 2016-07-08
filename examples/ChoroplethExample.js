import React from 'react'
import * as d3 from 'd3'

import { Chart, Choropleth } from '../src'
import { choroplethData } from './data/exampleData'
import map from './data/world-110.json'

const toolTipFunction = (d) => {
  var toolTip =
    '<span class="title">' + d.key + '</span>' +
    d3.format(',')(d.value)
  return toolTip
}

class ChoroplethExample extends React.Component {
  render () {
    map.objects.countries.geometries.forEach((d, i) => {
      if (d.id === 'ATA') {
        map.objects.countries.geometries.splice(i, 1)
      }
    })
    return (
      <Chart height={600} className='ChoroplethExample'
        margin={{top: 15, right: 10, bottom: 40, left: 80}}
        tipFunction={toolTipFunction} data={choroplethData}
        xAxis={false} yAxis={false} legend scaleAccessor='selectedColorScale'>
        <Choropleth valueField='y' keyField='x' selectedField='className' selectedValue='selected' map={map} />
      </Chart>
    )
  }
}

export default ChoroplethExample
