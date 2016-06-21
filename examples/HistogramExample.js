import React from 'react'
import d3 from 'd3'

import { Chart, Histogram } from '../src'
import { histogramData, stackedHistogramData } from './data/exampleData'

// Tooltipdata is an object currently defined in the component
// Properties for Histogram tooltipData are :
//    label : string
//    statckCounts: int[]
//    stackNames : string[]
//    xPos: int
//    yPos: int

const settings = {
  title: 'Options',
  options: [
    {
      type: 'dropdown',
      label: 'Scale Type: ',
      options: [
        'Linear', 'Log', 'Power'
      ],
      defaultSelected: (chart) => {
        let value = chart.state.yScaleType
        return value.charAt(0).toUpperCase() + value.slice(1)
      },
      onChange: (value, chart) => {
        chart.setState({
          yScaleType: value.toLowerCase()
        })
      }
    }, {
      type: 'dropdown',
      label: 'Sort By: ',
      options: [
        'Document Count', 'Key'
      ],
      defaultSelected: (chart) => {
        let histogram = chart.refs.child
        if (typeof histogram === 'undefined') {
          return 'Key'
        }
        let value = histogram.state.sortBy === 'x'
          ? 'Key'
          : 'Document Count'
        return value
      },
      onChange: (value, chart) => {
        let histogram = chart.refs.child
        let newValue = value === 'Key'
          ? 'x'
          : 'y'
        histogram.setState({
          sortBy: newValue
        }, chart.forceUpdate())
      }
    }, {
      type: 'dropdown',
      label: 'Sort Order: ',
      options: [
        'Ascending', 'Descending'
      ],
      defaultSelected: (chart) => {
        let histogram = chart.refs.child
        if (typeof histogram === 'undefined') {
          return 'Key'
        }
        return histogram.state.sortOrder
      },
      onChange: (value, chart) => {
        let histogram = chart.refs.child
        histogram.setState({
          sortOrder: value
        }, chart.forceUpdate())
      }
    }
  ]
}

const toolTipFunction = (tooltipData) => {
  let d = tooltipData
  let total = tooltipData.stackCounts.reduce((prev, count) => {
    return prev + count
  }, 0)
  let toolTip =
    '<span class="title">' + d.label + '</span>' +
    '</span>Total: ' + d3.format('n')(total) +
    '<br /><small>'
  toolTip += d.stackCounts.reduceRight((prev, count, index) => {
    return prev + d.stackNames[index] + ' : ' + d3.format('n')(count) + '<br />'
  }, '')
  toolTip += '</small>'
  return toolTip
}

class HistogramExample extends React.Component {
  render () {
    return (
      <div>
        <div></div>
        <div>
          <Chart title='Histogram' width={800} height={200} data={histogramData} settings={settings} tipFunction={toolTipFunction}>
            <Histogram addOverlay />
          </Chart>
        </div>
        <div>
          <Chart title='Stacked Histogram' width={800} height={200} data={stackedHistogramData} tipFunction={toolTipFunction}>
            <Histogram type='stacked' addOverlay />
          </Chart>
        </div>
      </div>
    )
  }
}

export default HistogramExample
