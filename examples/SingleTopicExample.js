// import React from 'react'
import React, { PropTypes } from 'react'
import { format, scaleLinear, scaleOrdinal, schemeCategory20, select } from 'd3'
import cloud from '../examples/data/for-hci/cloud2'
import { HeatmapChart, HistogramChart } from '../src'
import {linearOrdinalHeatmapData, temporalHistogramData} from './data/exampleData'

import topics from './data/topic-lane-sample/topics-sample.json'
// import lanes from '../examples/data/topic-lane-sample/sets-sample.json'
// import eTopics from './data/for-hci/enduring-topics-listed.json'

// GETTING TOPIC MEMBER DATA OVER TIME
const topicN = Math.floor(Math.random() * topics.length)
let avgMem = new Array(4).fill(0)
let temporalData = []
let bins = []
for (let i = 0; i < 4; i++) { bins.push([]) }
console.log('bins', bins)
topics[topicN]._source.bins.map((d, i) => {
  bins[0].push({ x: d.end, y: d.avg_composite_score })
  avgMem[0] += d.avg_composite_score
  bins[1].push({ x: d.end, y: d.avg_anomaly_score })
  avgMem[1] += d.avg_anomaly_score
  bins[2].push({ x: d.end, y: Math.random() * 200 })
  avgMem[2] += Math.random() * 200
  bins[3].push({ x: d.end, y: d.members.length })
  avgMem[3] += d.members.length
})
// ////////////////////////////

// HISTOGRAM DATA
console.log('STE-tHD', temporalHistogramData)
for (let i = 0; i < 4; i++) {
  avgMem[i] /= topics[topicN]._source.bins.length
  let hData = [{name: 'Topic ' + topicN, type: 'two', bins: bins[i]}]
  hData.map((histogram) => {
    let transformedObj = {name: histogram.name, type: histogram.type}
    transformedObj.bins = histogram.bins.map((bin) => {
      return {
        x: new Date(bin.x),
        y: bin.y
      }
    })
    temporalData.push([transformedObj])
  })
}
console.log('temD', temporalData)

const toolTipFunction = (tooltipData) => {
  let d = tooltipData
  let total = tooltipData.stackCounts.reduce((prev, count) => {
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

/* const color = d3.scaleLinear()
.domain([0, 100])
.range(['#E4E4E4', '#5D5D5D'])*/

const onBarClick = function (clickEvent) {
  console.groupCollapsed('Bar ' + this.props.data.x)
  console.log(clickEvent.target)
  console.log(this.props)
  console.groupEnd()
}

// HEATMAP CHART PROPS
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
      format(',')(d.value)
  }

  return toolTip
}
// ////////////////////////////

const words = ['hello', 'more', 'bear', 'snake', 'turutle', 'data']

class SingleTopicExample extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      loading: true,
      status: '',
      clickArray: []
    }
    this.cloud = cloud
    this.header3 = () => {
      return ([
        <span className='chart-title'>Temporal Histogram</span>
      ])
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
    let data = topics[topicN]._source.common_events
    let eList = []
    for (let i = 0; i < data.length; i++) {
      eList.push(<text key={'EventList-' + i} className='summaryVal' > {data[i]} </text>)
      eList.push(<br key={'break-' + i} />)
    }
    return (
      <g key='list'>
        <text key={'EventList'} className='summaryVal' fontSize='20px' ><b><u>Event List :</u></b></text><br />
        {eList}
      </g>
    )
  }
  eventListFreq () {
    let freqColor = scaleLinear()
      .domain([40, 100])
      .range(['#2375B9', '#0F2B42'])
    let data = topics[topicN]._source.common_events.map((d) => {
      return {text: d, freq: Math.random() * 40 + 10}
    })
    let eList = []
    for (let i = 0; i < data.length; i++) {
      eList.push(<text key={'EventListFreq-' + i} className='summaryVal' style={{fontSize: data[i].freq + 'px', fontFamily: 'Impact', color: freqColor(data[i].freq)}}> {data[i].text} </text>)
      eList.push(<br key={'breakFreq-' + i} />)
    }
    return (
      <g key='listFreq'>
        <text key={'EventListFreq'} className='summaryVal' fontSize='20px' ><b><u>Event List :</u></b></text><br />
        {eList}
      </g>
    )
  }
  exWords () {
    let w = 600
    let h = 450
    let root = this.refs.root
    let fill = scaleOrdinal(schemeCategory20)
    let draw = (words) => {
      console.log('drawing')
      select(root).append('svg')
        .attr('width', w)
        .attr('height', h)
        .append('g')
        .attr('transform', 'translate(' + w / 2 + ',' + h / 2 + ')')
        .selectAll('text')
        .data(words)
        .enter().append('text')
        .style('font-size', (d) => { return d.size + 'px' })
        .style('font-family', 'Impact')
        .style('fill', (d, i) => { return fill(i) })
        .attr('text-anchor', 'middle')
        .attr('transform', (d) => {
          return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')'
        })
        .text((d) => { return d.text })
    }
    // console.log(eTopics[0][24])
    // d.split(/:|-/)[1]
    let layout = cloud()
      .size([w, h])
      .words(words.map((d) => {
        return {text: d, size: 10 + Math.random() * 90, test: 'haha'}
      }))
      .padding(5)
      .rotate(() => { return ~~0 })
      .font('Impact')
      .fontSize((d) => {
        return d.size
      })
      .on('end', (d) => {
        draw(d)
      })
      .start()
    console.log('kysf', layout)
  }
  render () {
    let eventList = this.eventList()
    let eventListFreq = this.eventListFreq()
    // this.makeCircle()
    // this.exWords()
    // console.log('eList', this.eventList())
    // let {className, ...props} = this.props
    return (
      <div className='details-page col-md-12'>
        <div className='row'>
          <div className='col-md-12'>
            <h3>
              <span className='title'>{'TOPIC ID:' + topicN}</span>
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
            {eventListFreq}
          </div>
          <div className='col-md-2'>
            <text key={'AVG_C'} className='summaryTitle' fontSize='20px' ><b>{'Average Composite Score: ' + avgMem[0].toFixed(2)}</b></text><br />
            <HistogramChart header={this.header3} xScaleType='time'
              width={800} height={200} data={temporalData[0]} tipFunction={toolTipFunction}
              addOverlay onClick={onBarClick} />
          </div>
          <div className='col-md-2'>
            <text key={'AVG_A'} className='summaryTitle' fontSize='20px' ><b>{'Average Anomaly Score: ' + avgMem[1].toFixed(2)}</b></text><br />
            <HistogramChart header={this.header3} xScaleType='time'
              width={800} height={200} data={temporalData[1]} tipFunction={toolTipFunction}
              addOverlay onClick={onBarClick} />
          </div>
          <div className='col-md-2'>
            <text key={'AVG_I'} className='summaryTitle' fontSize='20px' ><b>{'Average Interesting Score: ' + avgMem[2].toFixed(2)}</b></text><br />
            <HistogramChart header={this.header3} xScaleType='time'
              width={800} height={200} data={temporalData[2]} tipFunction={toolTipFunction}
              addOverlay onClick={onBarClick} />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-5'>
            {eventList}
            <br />
            <br />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-5'>
            <HeatmapChart {...chartCommon} {...chartProps4} {...heatmapProps4} tipFunction={toolTipFunction1} />
          </div>
          <div className='col-md-2'>
            <text key={'numMembers'} className='summaryTitle' fontSize='20px' ><b>{'Average Members: ' + Math.floor(avgMem[3])}</b></text><br />
            <HistogramChart header={this.header3} xScaleType='time'
              width={800} height={200} data={temporalData[3]} tipFunction={toolTipFunction}
              addOverlay onClick={onBarClick} />
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
