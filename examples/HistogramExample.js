import React from 'react'
import { Chart, Histogram } from '../src'
import { histogramData, stackedHistogramData } from './exampleData'
import d3 from 'd3'

// Tooltipdata is an object currently defined in the component
// Properties for Histogram tooltipData are :
//    label : string
//    statckCounts: int[]
//    stackNames : string[]
//    xPos: int
//    yPos: int

const settings = {
  title: '',
  options: [
    {
      type: 'dropdown',
      label: 'Y Scale Type: ',
      options: [
        'linear', 'log'
      ],
      defaultSelected: (chart) => {
        return chart.props.yScaleType
      },
      onChange: (value, chart) => {
        chart.setState({
          yScaleType: value
        }, () => {
          chart.resizeChart()
        })
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
          <Chart title='Histogram' width={800} height={200} data={histogramData} tipFunction={toolTipFunction} settings={settings}>
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
