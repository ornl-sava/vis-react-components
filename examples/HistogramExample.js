import React from 'react'
import d3 from 'd3'

import { Chart, Histogram } from '../src'
import { histogramData, temporalHistogramData, stackedHistogramData } from './data/exampleData'

// Tooltipdata is an object currently defined in the component
// Properties for Histogram tooltipData are :
//    label : string
//    statckCounts: int[]
//    stackNames : string[]
//    xPos: int
//    yPos: int
const temporalData = temporalHistogramData.map((histogram) => {
  let transformedObj = {name: histogram.name, type: histogram.type}
  transformedObj.bins = histogram.bins.map((bin) => {
    return {
      x: new Date(bin.x),
      y: bin.y
    }
  })
  return transformedObj
})

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

const onBarClick = function (clickEvent) {
  console.groupCollapsed('Bar ' + this.props.data.x)
  console.log(clickEvent.target)
  console.log(this.props)
  console.groupEnd()
}

class HistogramExample extends React.Component {
  constructor (props) {
    super(props)

    let id = 'histogram_endpoint'
    let sortBy = JSON.parse(localStorage.getItem(id + '_sortBy'))
    let sortOrder = JSON.parse(localStorage.getItem(id + '_sortOrder'))
    let yScaleType = JSON.parse(localStorage.getItem(id + '_yScaleType'))

    this.state = {
      sortBy: (sortBy === 'Default') ? null : sortBy,
      sortOrder: (sortOrder === 'Default') ? null : sortOrder,
      sortTypes: ['two'],
      yScaleType: (yScaleType === 'Default') ? null : yScaleType
    }

    this.settings = {
      title: 'Options',
      options: [
        {
          type: 'dropdown',
          label: 'Scale Type: ',
          options: [
            'Default', 'Linear', 'Log', 'Power'
          ],
          defaultSelected: () => {
            let defaultValue = this.state.yScaleType
            return defaultValue === null ? 'Default' : defaultValue.charAt(0).toUpperCase() + defaultValue.slice(1)
          },
          onChange: (value) => {
            localStorage.setItem(id + '_yScaleType', JSON.stringify(value.toLowerCase()))
            this.setState({
              yScaleType: value.toLowerCase()
            })
          }
        }, {
          type: 'dropdown',
          label: 'Sort By: ',
          options: [
            'Default', 'Document Count', 'Key'
          ],
          defaultSelected: () => {
            let defaultValue = this.state.sortBy
            return defaultValue === null
              ? 'Default'
              : defaultValue === 'x'
                ? 'Key'
                : 'Document Count'
          },
          onChange: (value) => {
            let newValue = value === 'Default'
              ? null
              : value === 'Key'
                ? 'x'
                : 'y'
            localStorage.setItem(id + '_sortBy', JSON.stringify(newValue))
            this.setState({
              sortBy: newValue
            })
          }
        }, {
          type: 'dropdown',
          label: 'Sort Order: ',
          options: [
            'Default', 'Ascending', 'Descending'
          ],
          defaultSelected: () => {
            let defaultValue = this.state.sortOrder
            return defaultValue === null ? 'Default' : defaultValue.charAt(0).toUpperCase() + defaultValue.slice(1)
          },
          onChange: (value) => {
            let newValue = value === 'Default'
              ? null
              : value
            localStorage.setItem(id + '_sortOrder', JSON.stringify(newValue === null ? null : newValue.toLowerCase()))
            this.setState({
              sortOrder: newValue === null ? null : newValue.toLowerCase()
            })
          }
        }
      ]
    }
  }

  render () {
    return (
      <div>
        <div>
          <Chart title='Histogram - Layered bars based on data order' width={800} height={200} data={histogramData} {...this.state} settings={this.settings} tipFunction={toolTipFunction}>
            <Histogram padding={0.0} outerPadding={0.0} addOverlay xAccessor='key'yAccessor='count' onBarClick={onBarClick} />
          </Chart>
        </div>
        <div>
          <Chart title='Stacked Histogram - Stacked bars based on data order' width={800} height={200} sortBy={'y'} sortOrder={'Ascending'} data={stackedHistogramData} tipFunction={toolTipFunction}>
            <Histogram type='stacked' addOverlay />
          </Chart>
        </div>
        <div>
          <Chart title='Temporal Histogram' xScaleType='temporal' width={800} height={200} data={temporalData} tipFunction={toolTipFunction}>
            <Histogram padding={0.0} outerPadding={0.0} addOverlay onBarClick={onBarClick} />
          </Chart>
        </div>
      </div>
    )
  }
}

export default HistogramExample
