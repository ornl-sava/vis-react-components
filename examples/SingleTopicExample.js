// import React from 'react'
import React, { PropTypes } from 'react'
import { format, scaleLinear, scaleOrdinal, schemeCategory20, select } from 'd3'
// import {cloud} from '../examples/data/for-hci/cloud'
import cloud from '../examples/data/for-hci/cloud2'
// import ReactDom from 'react-dom'
// import {Chart} from '../src'
import eTopics from '../examples/data/for-hci/enduring-topics-listed.json'
import { HeatmapChart, HistogramChart } from '../src'
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

const words = ['hello', 'more', 'bear', 'snake', 'turutle', 'data']

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
    '</span>Total: ' + format(',')(total) +
    '<br /><small>'
  toolTip += d.stackCounts.reduceRight((prev, count, index) => {
    return prev + d.stackNames[index] + ' : ' + format(',')(count) + '<br />'
  }, '')
  toolTip += '</small>'
  return toolTip
}

let wor = [
  {text: 'guns', 'freq': 94}, {text: 'potato', 'freq': 5}, {text: 'Mr.A', 'freq': 73}, {text: 'shooting', 'freq': 17},
  {text: 'Mr.B', 'freq': 47}, {text: 'sale', 'freq': 8}, {text: 'plane', 'freq': 27}, {text: 'driver', 'freq': 32},
  {text: 'killed', 'freq': 41}, {text: 'email', 'freq': 86}, {text: 'gang', 'freq': 98}, {text: 'informant', 'freq': 64}]
  .map((d, i) => {
    return {text: d.text, size: d.freq * 2, index: i}
  })
console.log(wor)

/* const color = d3.scaleLinear()
.domain([0, 100])
.range(['#E4E4E4', '#5D5D5D'])*/

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
  eventListFreq () {
    let freqColor = scaleLinear()
      .domain([40, 100])
      .range(['#2375B9', '#0F2B42'])
    let data = eTopics[0][24].map((d) => {
      return {text: d, freq: Math.random() * 40 + 10}
    })
    let eList = []
    for (let i = 0; i < data.length; i++) {
      eList.push(<text key={'EventList-' + i} className='summaryVal' style={{fontSize: data[i].freq + 'px', fontFamily: 'Impact', color: freqColor(data[i].freq)}}> {data[i].text} </text>)
      eList.push(<br />)
    }
    return (
      <g key='list'>
        <text key={'EventList'} className='summaryVal' fontSize='20px' ><b><u>Event List :</u></b></text><br />
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
    // this.makeCircle()
    // this.exWords()
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
            {this.eventListFreq()}
          </div>
          <div className='col-md-2'>
            <text key={'AVG_P'} className='summaryTitle' fontSize='20px' ><b>{'Average Priority Score: ' + Math.random()}</b></text><br />
            <HistogramChart header={this.header3} xScaleType='time'
              width={800} height={200} data={temporalData} tipFunction={toolTipFunction}
              addOverlay onClick={onBarClick} />
          </div>
          <div className='col-md-2'>
            <text key={'AVG_A'} className='summaryTitle' fontSize='20px' ><b>{'Average Anomaly Score: ' + Math.random()}</b></text><br />
            <HistogramChart header={this.header3} xScaleType='time'
              width={800} height={200} data={temporalData} tipFunction={toolTipFunction}
              addOverlay onClick={onBarClick} />
          </div>
          <div className='col-md-2'>
            <text key={'AVG_I'} className='summaryTitle' fontSize='20px' ><b>{'Average Interesting Score: ' + Math.random()}</b></text><br />
            <HistogramChart header={this.header3} xScaleType='time'
              width={800} height={200} data={temporalData} tipFunction={toolTipFunction}
              addOverlay onClick={onBarClick} />
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
            <HeatmapChart {...chartCommon} {...chartProps4} {...heatmapProps4} tipFunction={toolTipFunction1} />
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
