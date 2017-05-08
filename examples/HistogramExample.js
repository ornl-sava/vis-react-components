import React from 'react'
import { format } from 'd3-format'

import { HistogramChart, Settings } from '../src'
import { randomStackedHistogramData, histogramData, temporalHistogramData, stackedHistogramData } from './data/exampleData'

// Tooltipdata is an object currently defined in the component
// Properties for Histogram tooltipData are :
//    label : string
//    statckCounts: int[]
//    stackNames : string[]
//    xPos: int
//    yPos: int
const getTemporalSelection = (selection) => {
  return temporalHistogramData.map((histogram) => {
    let transformedObj = {name: histogram.name, type: histogram.type}
    transformedObj.bins = histogram.bins.map((bin) => {
      let selected = true
      let dateX = new Date(bin.x)
      if (selection.length === 2 && (dateX < selection[0] || dateX >= selection[1])) {
        selected = false
      }
      return {
        y: dateX,
        x: bin.y,
        className: selected ? 'selected' : null
      }
    })
    return transformedObj
  })
}

const toolTipFunction = (d) => {
  if (!d || !d.stackCounts) return null
  let total = d.stackCounts.reduce((prev, count) => {
    return prev + count
  }, 0)
  let toolTip =
    '<span class="title">' + d.label + '</span>' +
    '</span>Total: ' + format(',')(total) +
    '<br /><small>'
  toolTip += d.stackCounts.reduceRight((prev, count, index) => {
    return prev + d.stackNames[index] + ' : ' + format(',')(count) + '<br />'
  }, '')
  toolTip += '</small>'
  return toolTip
}

const onBarClick = (event, data) => {
  console.groupCollapsed('Bar ' + data.label)
  console.log(event.target)
  console.log(data)
  console.groupEnd()
}

class HistogramExample extends React.Component {
  constructor (props) {
    super(props)

    this.onChart1Enter = this.onChart1Enter.bind(this)
    this.onChart1Leave = this.onChart1Leave.bind(this)
    this.onBrush = this._onBrush.bind(this)
    this.brushedVals = []
    this.temporalData = getTemporalSelection(this.brushedVals)

    let id = 'histogram_endpoint'
    let sortBy = JSON.parse(localStorage.getItem(id + '_sortBy'))
    let sortOrder = JSON.parse(localStorage.getItem(id + '_sortOrder'))
    let yScaleType = JSON.parse(localStorage.getItem(id + '_yScaleType'))

    this.state = {
      sortBy: (sortBy === 'Default') ? null : sortBy,
      sortOrder: (sortOrder === 'Default') ? null : sortOrder,
      sortTypes: ['two'],
      yScaleType: (yScaleType === 'Default' || !yScaleType) ? 'linear' : yScaleType,
      chart1xAxis: {
        type: 'x',
        orient: 'bottom'
      },
      randomData: randomStackedHistogramData()
    }

    this.settings = {
      title: 'Options',
      options: [
        {
          type: 'dropdown',
          label: 'Scale Type: ',
          options: [
            'Default', 'Linear', 'Log', 'Pow'
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

    this.header1 = () => {
      return ([
        <span className='chart-title'>Histogram - Layered bars based on data order</span>,
        <Settings settings={this.settings} />
      ])
    }

    this.header2 = () => {
      return ([
        <span className='chart-title'>Stacked Histogram - Stacked bars based on data order</span>
      ])
    }

    this.header3 = () => {
      return ([
        <span className='chart-title'>Temporal Histogram - Brush selection</span>
      ])
    }

    this.header4 = () => {
      return ([
        <span className='chart-title'>Animated Stacked Histogram</span>
      ])
    }
  }
  _onBrush (brushedVals) {
    // console.log('On brush called')
    this.brushedVals = brushedVals
    this.temporalData = getTemporalSelection(this.brushedVals)
    this.forceUpdate()
  }
  onChart1Enter (event, data) {
    this.setState({
      xAxis: {
        type: 'x',
        orient: 'bottom',
        tickValues: [data.label]
      }
    })
  }

  onChart1Leave (event, data) {
    this.setState({
      xAxis: {
        type: 'x',
        orient: 'bottom'
      }
    })
  }

  componentDidMount () {
    this.createRandomData = () => {
      setTimeout(() => {
        if (this.createRandomData !== null) {
          this.setState({
            randomData: randomStackedHistogramData()
          }, () => {
            if (this.createRandomData !== null) {
              this.createRandomData()
            }
          })
        }
      }, 5000)
    }
    this.createRandomData()
  }

  componentWillUnmount () {
    this.createRandomData = null
  }

  render () {
    return (
      <div>
        <div>
          <HistogramChart header={this.header1} width={800} height={200}
            data={histogramData} {...this.state} tipFunction={toolTipFunction}
            onEnter={this.onChart1Enter} onLeave={this.onChart1Leave}
            addOverlay xAccessor='key' yAccessor='count' onClick={onBarClick} />
        </div>
        <div>
          <HistogramChart
            width={800} height={200}
            sortBy={'y'} sortOrder={'Ascending'}
            xAxis={{
              type: 'x',
              orient: 'bottom',
              innerPadding: 0.2,
              outerPadding: 0.4,
              tickStyle: (tick, d, i) => {
                if (d === 'Bin 5') {
                  tick.style('fill', 'orange')
                }
              }
            }}
            data={stackedHistogramData} tipFunction={toolTipFunction}
            type='stacked' addOverlay
            />
        </div>
        <div>
          <HistogramChart header={this.header3} xScaleType='time'
            width={800} height={200} data={this.temporalData} tipFunction={toolTipFunction}
            addOverlay brushed onBrush={this.onBrush} />
        </div>
        <div>
          <HistogramChart
            header={this.header4} width={800} height={200} type='stacked'
            data={this.state.randomData} tipFunction={toolTipFunction} />
        </div>
      </div>
    )
  }
}

export default HistogramExample
