import React from 'react'
import d3 from 'd3'

import { Chart, Choropleth } from '../src'
import map from './data/world-110.json'

const toolTipFunction = (d) => {
  var toolTip =
    '<span class="title">' + d.key + '</span>' +
    d3.format('n')(d.value[0]) + ' / ' +
    d3.format('n')(d.value[1])
  return toolTip
}

const exampleData = [{
  'name': 'source_country',
  'type': 'visible',
  'bins': [{
    'key': 'ZZZ',
    'doc_count': 24339172
  }, {
    'key': 'USA',
    'doc_count': 19048722
  }, {
    'key': 'RUS',
    'doc_count': 192522
  }, {
    'key': 'UKR',
    'doc_count': 55523
  }, {
    'key': 'KOR',
    'doc_count': 49735
  }, {
    'key': 'JPN',
    'doc_count': 46541
  }, {
    'key': 'DEU',
    'doc_count': 43628
  }, {
    'key': 'POL',
    'doc_count': 40430
  }, {
    'key': 'FRA',
    'doc_count': 38320
  }, {
    'key': 'CHN',
    'doc_count': 37651
  }, {
    'key': 'NLD',
    'doc_count': 25563
  }, {
    'key': 'BRA',
    'doc_count': 21034
  }, {
    'key': 'CAN',
    'doc_count': 20512
  }]
}, {
  'name': 'source_country',
  'type': 'selected',
  'bins': [{
    'key': 'ZZZ',
    'doc_count': 24339172
  }, {
    'key': 'USA',
    'doc_count': 19048722
  }, {
    'key': 'RUS',
    'doc_count': 192522
  }, {
    'key': 'UKR',
    'doc_count': 55523
  }, {
    'key': 'KOR',
    'doc_count': 49735
  }, {
    'key': 'JPN',
    'doc_count': 46541
  }, {
    'key': 'DEU',
    'doc_count': 43628
  }, {
    'key': 'POL',
    'doc_count': 40430
  }, {
    'key': 'FRA',
    'doc_count': 38320
  }, {
    'key': 'CHN',
    'doc_count': 37651
  }, {
    'key': 'NLD',
    'doc_count': 25563
  }, {
    'key': 'BRA',
    'doc_count': 21034
  }, {
    'key': 'CAN',
    'doc_count': 20512
  }]
}]

class ChoroplethExample extends React.Component {
  render () {
    return (
      <Chart width={800} height={600} className='ChoroplethExample'
        margin={{top: 15, right: 10, bottom: 40, left: 80}}
        tipFunction={toolTipFunction} data={exampleData}
        xAxis={false} yAxis={false} legend>
        <Choropleth valueField='doc_count' map={map} />
      </Chart>
    )
  }
}

export default ChoroplethExample
