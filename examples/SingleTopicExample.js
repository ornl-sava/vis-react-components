// import React from 'react'
import React, { PropTypes } from 'react'
import * as d3 from 'd3'
// import ReactDom from 'react-dom'
// import {Chart} from '../src'
import eTopics from '../examples/data/for-hci/enduring-topics-listed.json'
import { Chart, Heatmap, Histogram } from '../src'
import {linearOrdinalHeatmapData, temporalHistogramData} from './data/exampleData'

const chartProps4 = {
  title: 'Topic Frequency',
  data: linearOrdinalHeatmapData,
  xScaleType: 'ordinalBand',
  yScaleType: 'linear',
  yAxis: {
    type: 'y',
    tickCount: linearOrdinalHeatmapData[0].bins.length,
    orient: 'left'
  }
}

const heatmapProps4 = {
  labelField: 'key',
  yAccessor: {
    key: 'key',
    value: 'value'
  },
  numColorCat: 17,
  minColor: '#EFEDF5',
  maxColor: '#756BB1'
}

const chartCommon = {
  margin: {top: 15, right: 5, bottom: 50, left: 15},
  height: 250,
  legend: true
}

const toolTipFunction1 = (d) => {
  let toolTip = '<span> No Data </span>'

  if (d.value > 0) {
    toolTip =
      '<span class="title">' + d.key + '</span>' +
      d3.format(',')(d.value)
  }

  return toolTip
}

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
    '</span>Total: ' + d3.format(',')(total) +
    '<br /><small>'
  toolTip += d.stackCounts.reduceRight((prev, count, index) => {
    return prev + d.stackNames[index] + ' : ' + d3.format(',')(count) + '<br />'
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

class SingleTopicExample extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      loading: true,
      status: '',
      clickArray: []
    }
  }
  componentWillMount () {
    // console.log('topicData', topicData)
  }
  componentDidMount () {
    this.fetchData(this.props)
  }
  shouldComponentUpdate (nextProps, nextState) {
    return true
  }
  componentWillReceiveProps (nextProps) {
    this.setState({loading: true})
    return true
  }
  fetchData (nextProps) {
    this.setState({loading: false, status: 'OK'})
  }
  eventList () {
    let data = eTopics[0][24]
    let eList = []
    for (let i = 0; i < data.length; i++) {
      eList.push(<text key={'EventList-' + i} className='summaryVal' > {eTopics[0][24][i]} </text>)
      eList.push(<br />)
    }
    return (
      <g key='list'>
        <text key={'EventList'} className='summaryVal' fontSize='20px' ><b><u>Event List :</u></b></text><br />
        {eList}
      </g>
    )
  }
  makeCircle () {
    // Get root
    let root = this.refs.root
    // Create svg
    let svg = d3.select(root).append('svg')
    // TRYING D3
    // ReactDom.findDOMNode(this)
    let circle = svg.append('circle')
      .attr('r', function (d) { return 60 })
      .style('fill', function (d) { return 'blue' })
    console.log('circle', circle)
  }
  makeWordCloud () {
  }
  render () {
    this.makeCircle()
    this.makeWordCloud
    console.log('eList', this.eventList())
    // let {className, ...props} = this.props
    return (
      <div className='details-page col-md-12'>
        <div className='row'>
          <div className='col-md-12'>
            <h3>
              <span className='title'>{'TOPIC ID:' + Math.floor(Math.random() * 300)}</span>
            </h3>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-5'>
            <span className='summaryTitle'><b>start: </b></span>
            <span className='summaryVal'>{'2015-04-24T09:00:00Z'}</span><br />
            <span className='summaryTitle'><b>end: </b></span>
            <span className='summaryVal'>{'2015-04-24T09:00:00Z'}</span><br />
            <span className='summaryTitle'><b>interval: </b></span>
            <span className='summaryVal'>{'1 min'}</span><br /><br />
            <div ref='root' className={'wordCloud'} />
          </div>
          <div className='col-md-2'>
            <text key={'AVG_P'} className='summaryTitle' fontSize='20px' ><b>{'Average Priority Score'}</b></text><br />
            <Chart xScaleType='temporal' width={800} height={200} data={temporalData} tipFunction={toolTipFunction}>
              <Histogram addOverlay onBarClick={onBarClick} />
            </Chart>
          </div>
          <div className='col-md-2'>
            <text key={'AVG_A'} className='summaryTitle' fontSize='20px' ><b>{'Average Anomaly Score'}</b></text><br />
            <Chart xScaleType='temporal' width={800} height={200} data={temporalData} tipFunction={toolTipFunction}>
              <Histogram addOverlay onBarClick={onBarClick} />
            </Chart>
          </div>
          <div className='col-md-2'>
            <text key={'AVG_I'} className='summaryTitle' fontSize='20px' ><b>{'Average Interesting Score'}</b></text><br />
            <Chart xScaleType='temporal' width={800} height={200} data={temporalData} tipFunction={toolTipFunction}>
              <Histogram addOverlay onBarClick={onBarClick} />
            </Chart>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-5'>
            {this.eventList()}
            <br />
            <br />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-11'>
            <Chart {...chartCommon} {...chartProps4} tipFunction={toolTipFunction1}>
              <Heatmap {...heatmapProps4} />
            </Chart>
          </div>
        </div>
      </div>
      )
  }
}

SingleTopicExample.defaultProps = {
  url: '',
  className: 'col-md-12'
}
SingleTopicExample.propTypes = {
  className: PropTypes.string,
  url: PropTypes.string
}

export default SingleTopicExample
