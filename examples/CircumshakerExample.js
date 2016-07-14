import React from 'react'
import * as d3 from 'd3'

import { CircumshakerChart } from '../src'

const data = {
  'source_ip': '124.83.248.123',
  'dest_ip': [
    {
      'key': 2751196930,
      'key_as_string': '163.251.239.2',
      'doc_count': 5,
      'source_ip': [
        {
          'key': 1755075020,
          'key_as_string': '104.156.81.204',
          'doc_count': 2
        },
        {
          'key': 1758454856,
          'key_as_string': '104.207.228.72',
          'doc_count': 2
        },
        {
          'key': 1753404735,
          'key_as_string': '104.130.213.63',
          'doc_count': 1
        },
        {
          'key': 1753429508,
          'key_as_string': '104.131.54.4',
          'doc_count': 1
        },
        {
          'key': 1755076044,
          'key_as_string': '104.156.85.204',
          'doc_count': 1
        },
        {
          'key': 3494830881,
          'key_as_string': '208.78.227.33',
          'doc_count': 1
        }
      ]
    },
    {
      'key': 2751196932,
      'key_as_string': '163.251.239.4',
      'doc_count': 3,
      'source_ip': [
        {
          'key': 1747283813,
          'key_as_string': '104.37.111.101',
          'doc_count': 3
        },
        {
          'key': 1755075020,
          'key_as_string': '104.156.81.204',
          'doc_count': 1
        },
        {
          'key': 1755076044,
          'key_as_string': '104.156.85.204',
          'doc_count': 1
        },
        {
          'key': 1757415067,
          'key_as_string': '104.192.6.155',
          'doc_count': 1
        },
        {
          'key': 3107708684,
          'key_as_string': '185.59.223.12',
          'doc_count': 1
        }
      ]
    },
    {
      'key': 2751196931,
      'key_as_string': '163.251.239.3',
      'doc_count': 2,
      'source_ip': [
        {
          'key': 1753361025,
          'key_as_string': '104.130.42.129',
          'doc_count': 5
        },
        {
          'key': 1755075020,
          'key_as_string': '104.156.81.204',
          'doc_count': 2
        },
        {
          'key': 1755076044,
          'key_as_string': '104.156.85.204',
          'doc_count': 1
        },
        {
          'key': 3494830881,
          'key_as_string': '208.78.227.33',
          'doc_count': 1
        }
      ]
    },
    {
      'key': 2751135764,
      'key_as_string': '163.251.0.20',
      'doc_count': 1,
      'source_ip': []
    },
    {
      'key': 3444397697,
      'key_as_string': '205.77.86.129',
      'doc_count': 1,
      'source_ip': []
    }
  ],
  'took': 78
}

const toolTipFunction = (d) => {
  var toolTip =
    '<span class="title">' + d.label + '</span>' +
    d3.format(',')(d.count)
  return toolTip
}

const chartProps = {
  tipFunction: toolTipFunction,
  height: 800,
  data: data
}

class CircumshakerExample extends React.Component {
  render () {
    return (
      <CircumshakerChart {...chartProps} />
    )
  }
}

export default CircumshakerExample
