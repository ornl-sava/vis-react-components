import React, { PropTypes } from 'react'
import { setScale } from './util/d3'
import * as d3 from 'd3'
import Tooltip from './Tooltip'

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

    this.falseStart(props)
    // console.log('FDG-c-nodes', this.links[0].source.x)

    this.simulation = d3.forceSimulation()
    this.setSim(props)

    this.onDClick = this.onDClick.bind(this)
    this.simOn = false

    this.tip = props.tipFunction
      ? new Tooltip().attr('className', 'd3-tip').html(props.tipFunction)
      : props.tipFunction
    this.onEnter = this.onEnter.bind(this)
    this.onLeave = this.onLeave.bind(this)

    this.pos = new Array(2)
    this.nodePos = new Array(2)
    this.isDrag = false
    this.onDrag = this.onDrag.bind(this)
    this.onDragStart = this.onDragStart.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
  }

  shouldComponentUpdate (nextProps, nextState) {
    // need to have a catch for if the props change rather than state...
    return true
  }

  onDClick (event) {
    if (this.state.simOn) {
      console.log('FDG-onDC-simOn')
      this.simOn = true
      this.setSim(this.props)
      this.simulation.restart()
    } else {
      console.log('FDG-onDC-simOff')
      this.simOn = false
      this.simulation.stop()
      this.falseStart(this.props)
    }
  }

  onEnter (event) {
    let target = this.getDatum(event.target)
    let tooltipD = {label: 'Hour-' + target.hour, counts: target.events.length}
    if (target && this.props.tipFunction) {
      this.tip.show(event, tooltipD)
    }
    this.props.onEnter(event, target)
  }
  onLeave (event) {
    let target = this.getDatum(event.target)
    let tooltipD = {label: 'Hour-' + target.hour, counts: target.events.length}
    if (target && this.props.tipFunction) {
      this.tip.hide(event, tooltipD)
    }
    this.props.onLeave(event, target)
  }

  onDragStart (event) {
    // console.log('FFG-oDStart-HERE')
    this.simulation.stop()
    this.pos = [event.clientX, event.clientY]
    this.isDrag = true
    let i = this.getIndex(event.target)
    let pos = [this.nodes[i].x, this.nodes[i].y]
    pos = pos.slice(0)
    // console.log('FFG-oDStart-i', i)
    this.nodes[i].fx = this.nodePos[0] = pos[0]
    this.nodes[i].fy = this.nodePos[1] = pos[1]
    this.simulation.alphaTarget(0.3).restart()
  }
  onDrag (event) {
    if (this.isDrag) {
      let i = this.getIndex(event.target)
      this.nodes[i].fx = (event.clientX - this.pos[0]) + this.nodePos[0]
      this.nodes[i].fy = (event.clientY - this.pos[1]) + this.nodePos[1]
      // console.log('FFG-oD', event.clientX, event.clientY)
    }
  }
  onDragEnd (event) {
    this.isDrag = false
    this.pos = [0, 0]
    // console.log('FFG-oDE')
    let i = this.getIndex(event.target)
    this.nodes[i].fx = null
    this.nodes[i].fy = null
    this.simulation.alphaTarget(0)
  }

  updateDR (props) {
    this.colScale.domain(d3.range(0, props.numTData, 1))
    this.xScale
      .domain(d3.range(0, props.numTData, 1))
      .range([0, props.chartWidth])
      .padding(0.2)
  }

  getIndex (target) {
    return target.getAttribute('data-id')
  }

  getDatum (target) {
    let i = target.getAttribute('data-id')
    return this.nodes[i]
  }

  setSim (props) {
    this.simulation
      // .alphaTarget(0.4) // animation will not stop if the target is not 0
      // .alphaDecay(0.1) // slower start
      .alphaMin(0.01)
      .force('link', d3.forceLink().id(function (d, i) { return i }))
      .force('charge', d3.forceManyBody().strength(-30).distanceMax(500))
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

  falseStart (props) {
    this.nodes.map((d, i) => {
      d.x = Math.random() * this.xScale.bandwidth() + this.xScale(d.hour)
      d.y = Math.random() * props.chartHeight
    })
    this.links.map((d, i) => {
      d.source = this.nodes[d.source]
      d.target = this.nodes[d.target]
    })
    // this.setState({nodes: this.nodes, links: this.links})
  }

  drawSim (props) {
    // console.log('FDG-draw-props', props)
    let nodeList = []
    let linkList = []
    // console.log('FDG-draw-state', this.state)
    // console.log('FDG-draw-radius', props.radius)
    let events = {
      'onMouseMove': this.onDrag,
      'onMouseDown': this.onDragStart,
      'onMouseUp': this.onDragEnd,
      'onMouseEnter': this.onEnter,
      'onMouseLeave': this.onLeave
    }
    this.state.nodes.map((d, i) => {
      let circleProps = {
        'data-id': i,
        'r': props.radius,
        'cx': d.x,
        'cy': d.y,
        'fill': this.colScale(d.hour),
        'events': d.events,
        'hour': d.hour
      }
      nodeList.push(
        <circle key={'cir-id' + i + '-hr-' + d.hour} {...events} {...circleProps} />
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

  render () {
    // console.log('FDG-r')
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
  radius: 7,
  onClick: () => {},
  onEnter: () => {},
  onLeave: () => {},
  className: '',
  tipFunction: () => {}
}

ForceDirectedGraph.propTypes = {
  chartHeight: PropTypes.number,
  chartWidth: PropTypes.number,
  className: PropTypes.string,
  radius: PropTypes.number,
  adjacencyList: PropTypes.any,
  tipFunction: PropTypes.func,
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
