import React, { PropTypes } from 'react'
import { setScale } from './util/d3'
import * as d3 from 'd3'

class ForceDirectedGraph extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      nodes: JSON.parse(JSON.stringify(props.nodes)),
      links: JSON.parse(JSON.stringify(props.links))
    }

    this.nodes = props.nodes
    this.links = props.links

    this.colScale = d3.scaleOrdinal(d3.schemeCategory10)
    this.xScale = setScale('ordinalBand')

    this.aList = props.adjacencyList

    this.updateDR = this.updateDR.bind(this)
    this.updateDR(props)

    this.simulation = d3.forceSimulation()
    this.setSim(props)

    this.onClick = this.onClick.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.onLeave = this.onLeave.bind(this)
  }

  shouldComponentUpdate (nextProps, nextState) {
    // PUT SET SIM HERE
    // if props haven't changed...so this might not even be necesary?
    return false
  }

  onClick (event) {
    let target = event.target
    this.props.onClick(event, this.getDatum(target))
  }

  onEnter (event) {
    let target = event.target
    this.props.onEnter(event, this.getDatum(target))
  }

  onLeave (event) {
    let target = event.target
    this.props.onLeave(event, this.getDatum(target))
  }

  updateDR (props) {
    this.colScale.domain(d3.range(0, props.numTData, 1))
    this.xScale
      .domain(d3.range(0, props.numTData, 1))
      .range([0, props.chartWidth])
      .padding(0.2)
  }

  getDatum (target) {
    let i = target.getAttribute('data-id')
    return this.props.data[i]
  }

  draw (props) {
    console.log('FDG-draw-props', props)
    let nodeList = []
    let linkList = []
    console.log('FDG-draw-state', this.state)
    // console.log('FDG-draw-radius', props.radius)
    this.state.nodes.map((d, i) => {
      let circleProps = {
        'data-id': i,
        'r': props.radius,
        'cx': Math.random() * this.xScale.bandwidth() + this.xScale(d.hour),
        'cy': Math.random() * props.chartHeight,
        'fill': this.colScale(d.hour),
        'data-events': d.events
        // 'onMouseEnter': this.onEnter,
        // 'onMouseLeave': this.onLeave,
        // 'onClick': this.onClick
      }
      nodeList.push(
        <circle key={'cir-id' + i + '-hr-' + d.hour} {...circleProps} />
      )
    })
    this.state.links.map((data, index) => {
      let lineData = {
        x1: nodeList[data.source].props.cx,
        y1: nodeList[data.source].props.cy,
        x2: nodeList[data.target].props.cx,
        y2: nodeList[data.target].props.cy,
        style: {stroke: '#cdd5e4', strokeWidth: 2}
      }
      linkList.push(
        <line key={'line-id' + linkList.length} {...lineData} />
      )
    })
    return (
      <g>
        {linkList}
        {nodeList}
      </g>
    )
  }

  drawSim (props) {
    console.log('FDG-draw-props', props)
    let nodeList = []
    let linkList = []
    console.log('FDG-draw-state', this.state)
    // console.log('FDG-draw-radius', props.radius)
    this.state.nodes.map((d, i) => {
      let circleProps = {
        'data-id': i,
        'r': props.radius,
        'cx': d.x,
        'cy': d.y,
        'fill': this.colScale(d.hour),
        'data-events': d.events
        // 'onMouseEnter': this.onEnter,
        // 'onMouseLeave': this.onLeave,
        // 'onClick': this.onClick
      }
      nodeList.push(
        <circle key={'cir-id' + i + '-hr-' + d.hour} {...circleProps} />
      )
    })
    this.state.links.map((data, index) => {
      let lineData = {
        x1: data.source.x,
        y1: data.source.y,
        x2: data.target.x,
        y2: data.target.y,
        style: {stroke: '#cdd5e4', strokeWidth: 2}
      }
      linkList.push(
        <line key={'line-id' + linkList.length} {...lineData} />
      )
    })
    return (
      <g>
        {linkList}
        {nodeList}
      </g>
    )
  }

  setSim (props) {
    this.simulation
      .force('link', d3.forceLink().id(function (d, i) { return i }))
      .force('charge', d3.forceManyBody().strength(1))
      .force('center', d3.forceCenter(props.chartWidth / 2, props.chartHeight / 2))

    this.simulation
        .nodes(this.nodes)
        .on('tick', (d, i) => {
          // console.log('FDG-sS-on-d-this', d, '-', this)
          this.simUpdate(d, i)
        })

    this.simulation.force('link')
        .links(this.links)
  }

  simUpdate (d, i) {
    // console.log('FDG-sU-d-i', d, '-', i)
    // console.log('FDG-nodes', this.nodes)
    this.setState({nodes: this.nodes, links: this.links})
  }

  render () {
    console.log('FDG-r')
    let props = this.props
    let el = this.drawSim(props)
    return (
      <g className={props.className + 'fdg'}>
        {el}
      </g>
    )
  }
}

ForceDirectedGraph.defaultProps = {
  xAccessor: 'x',
  yAccessor: 'y',
  radius: 5,
  onClick: () => {},
  onEnter: () => {},
  onLeave: () => {},
  className: ''
}

ForceDirectedGraph.propTypes = {
  chartHeight: PropTypes.number,
  chartWidth: PropTypes.number,
  className: PropTypes.string,
  radius: PropTypes.number,
  adjacencyList: PropTypes.any,
  nodes: PropTypes.array.isRequired,
  links: PropTypes.array.isRequired,
  xScale: PropTypes.any,
  yScale: PropTypes.any,
  data: PropTypes.array,
  onClick: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func
}

export default ForceDirectedGraph
