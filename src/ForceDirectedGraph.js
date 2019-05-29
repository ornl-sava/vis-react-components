import React from 'react'
import PropTypes from 'prop-types'
import { setScale } from './util/d3'
import * as d3 from 'd3'
import Tooltip from './Tooltip'

const bezierLine = (node1, node2) => {
  return ('M' + node1.x + ',' + node1.y +
  'S' + node1.x + ',' + (node1.y + node2.y) / 2 +
  ' ' + node2.x + ',' + node2.y)
}

class ForceDirectedGraph extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      nodes: props.nodes,
      links: props.links
    }
    console.warn('ForceDirectedGraph needs to be updated, so that the linter will work')

    this.colScale = d3.scaleOrdinal(d3.schemeCategory10)
    this.xScale = setScale('band')

    this.updateDR = this.updateDR.bind(this)
    this.updateDR(props)

    this.nodes = []
    this.links = []
    this.falseStart(props)
    // this.reSet(props)
    this.nodes.map((d, i) => {
      d.key = i
    })
    // console.log('FDG-c-nodes', this.links[0].source.x)

    this.simulation = d3.forceSimulation()
    this.drag = d3.drag()
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
    this.remNodes = this.remNodes.bind(this)
  }

  componentWillMount () {
    // using the nodes with the x and y values attached in falseStart
    this.setState({ nodes: this.nodes, links: this.links })
  }

  componentDidMount () {
    // console.log('fsdmfh', d3.select(this.refs.circ).selectAll('circle'))
    // d3.select(this.refs.circ).selectAll('circle').call(this.drag)
    //   .filter(function (d, i) {
    //     console.log(d3.select(this).select('circle'))
    //     d3.select(this).select('circle').call(this.drag)
    //   })
  }

  componentWillReceiveProps (nextProps) {
    // console.log('thi', this.props, nextProps)
    if (nextProps.nodes.length !== this.props.nodes.length) {
      this.simulation.stop()
      this.simOn = false
      this.updateDR(nextProps)
      nextProps.nodes.map((d, i) => {
        d.key = i
      })
      this.falseStart(nextProps)
      this.setState({ nodes: this.nodes, links: this.links })
      this.setSim(nextProps)
      this.simulation.alpha(1).restart()
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextState !== this.state || nextProps.nodes.length !== this.props.nodes.length) {
      return true
    } else { return false }
  }

  componentWillUnmount () {
    this.simulation.stop()
  }

  onDClick (event) {
    if (this.simOn) {
      // console.log('FDG-onDC-simOn')
      this.simOn = false
      // both don't need to be on... play with alpha
      this.setSim(this.props)
      this.simulation.restart()
      this.isDrag = false
    } else {
      // console.log('FDG-onDC-simOff', this.links)
      this.simOn = true
      this.isDrag = false
      this.setState({ nodes: this.nodes, links: this.links })
      this.simulation.stop()
      this.falseStart(this.props)
    }
  }

  onEnter (event) {
    let target = this.getDatum(event.target)
    let type = 'Node '
    if (target.events.indexOf('parent-') >= 0) {
      type = 'Parent'
    }
    let tooltipD = { label: type + target.index + ' at Hour ' + target.hour, counts: target.events.length }
    if (target && this.props.tipFunction) {
      this.tip.show(event, tooltipD)
    }
    this.props.onEnter(event, target)
  }
  onLeave (event) {
    let target = this.getDatum(event.target)
    let tooltipD = { label: 'Hour-' + target.hour, counts: target.events.length }
    if (target && this.props.tipFunction) {
      this.tip.hide(event, tooltipD)
    }
    this.props.onLeave(event, target)
  }

  onDragStart (event) {
    // console.log('FFG-oDStart-HERE')
    this.isDrag = true
    this.simulation.stop()

    let target = this.getDatum(event.target)
    this.node = target
    let test = true
    if (test) {
    // if (target.events.indexOf('parent-') >= 0) {
      this.remNodes(target, this.props)
      this.reSet(this.props)
      this.setSim(this.props)
      this.isDrag = false
    } else {
      this.pos = [event.clientX, event.clientY]
      let i = this.getIndex(event.target)
      let pos = [this.nodes[i].x, this.nodes[i].y]
      pos = pos.slice(0)
      // console.log('FFG-oDStart-i', i)
      this.nodes[i].fx = this.nodePos[0] = pos[0]
      this.nodes[i].fy = this.nodePos[1] = pos[1]
    }
    this.simulation.alpha(0.1).alphaTarget(0.01).restart()
  }
  onDrag (event) {
    if (this.isDrag) {
      let target = this.getDatum(event.target)
      let tooltipD = { label: ' ', counts: target.events.length }
      let i = this.getIndex(event.target)
      this.nodes[i].fx = (event.clientX - this.pos[0]) + this.nodePos[0]
      this.nodes[i].fy = (event.clientY - this.pos[1]) + this.nodePos[1]
      // hiding tool tip on drag
      if (target && this.props.tipFunction) {
        this.tip.hide(event, tooltipD)
      }
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

  remNodes (target, props) {
    let links = props.adjacencyList[target.index]
    if (links.length > 1) {
      links.map((d, i) => {
        if (props.adjacencyList[d].length <= 1) {
          props.nodes[d].active = !props.nodes[d].active
        }
      })
    }
    // else {
    //   target.active = false
    // }
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
    let initTime = Date.now()
    let tickCount = 1
    this.simulation
      // .alphaTarget(0.4) // animation will not stop if the target is not 0
      // .alphaDecay(0.1) // slower start
      .alphaMin(props.alphaMin)
      .force('link', d3.forceLink().id(function (d, i) { return i }))
      .force('charge', d3.forceManyBody().strength(-100).distanceMax(500).distanceMin(5))
      .force('center', d3.forceCenter(props.chartWidth / 2, props.chartHeight / 2))

    this.simulation
      .nodes(this.nodes)
      .on('tick', (d, i) => {
        if (props.timeMax != null) {
          // console.log('FDG-sS-timeStop')
          if ((props.timeMax + initTime) < Date.now()) {
            this.simulation.stop()
            if (props.isStatic) { this.setState({ nodes: this.nodes, links: this.links }) }
          }
        } else if (props.tickMax != null) {
          // console.log('FDG-sS-tickStop')
          if (tickCount > props.tickMax) {
            this.simulation.stop()
            if (props.isStatic) { this.setState({ nodes: this.nodes, links: this.links }) }
          }
        }
        if (this.simulation.alpha() <= this.simulation.alphaMin()) {
          // console.log('FDG-sS-alphaStop')
          this.simulation.stop()
          if (props.isStatic) {
            // props.getSimInfo(Date.now() - initTime, tickCount)
            this.setState({ nodes: this.nodes, links: this.links })
          }
          // props.getSimInfo(Date.now() - initTime, tickCount)
        }
        if (!props.isStatic) { this.setState({ nodes: this.nodes, links: this.links }) }
        props.getSimInfo(Date.now() - initTime, tickCount)
        tickCount++
      })

    this.simulation.force('link')
      .links(this.links)

    // let root = this.refs.root
    // let svg = d3.select(root).append('svg')
    // this.drag
    //   .subject(this.nodes)
    //   .on('start', (d) => { console.log('dragStart', d) })
    //   .on('drag', () => {
    //     console.log('dragging')
    //     this.drag.subject(this.node)
    //     this.node.fx = d3.event.x
    //     this.node.fy = d3.event.y
    //     console.log(this.node)
    //   })
    //   .on('end', () => { console.log('dragEnd') })
  }

  falseStart (props) {
    let links = []
    let nodes = []
    // console.log('FDG-fS-', props.adjacencyList)
    props.nodes.map((d, i) => {
      if (d.active || d.active == null) {
        d.x = Math.random() * this.xScale.bandwidth() + this.xScale(d.hour)
        d.y = Math.random() * props.chartHeight
        d.active = true
        if (props.adjacencyList[i].length !== null) {
          props.adjacencyList[i].map((data, index) => {
            if (data > i) {
              links.push({ source: props.nodes[i], target: props.nodes[data], value: 0 })
            }
          })
        }
        nodes.push(d)
      }
    })
    // console.log('FDG-fS-nodes' n)
    this.nodes = nodes
    this.links = links
  }
  // might get rid of since it is so similar to falseStart
  reSet (props) {
    let links = []
    let nodes = []
    props.nodes.map((d, i) => {
      if (d.active || d.active == null) {
        if (props.adjacencyList[i].length !== null) {
          props.adjacencyList[i].map((data) => {
            if (data > i && props.nodes[data].active) {
              links.push({ source: props.nodes[i], target: props.nodes[data], value: 0 })
            }
          })
        }
        nodes.push(d)
      }
    })
    this.nodes = nodes
    this.links = links
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
        'data-events': d.events,
        'data-hour': d.hour
      }
      nodeList.push(
        <circle key={'cir-id' + d.key + '-hr-' + d.hour} {...events} {...circleProps} />
      )
      // console.log(d3.select(nodeList[i]).call(this.drag))
    })
    this.state.links.map((data, index) => {
      if (props.isCurved) {
        linkList.push(
          <path key={'line-id-' + linkList.length} className='lineMatch' d={bezierLine(data.source, data.target)} style={{ stroke: '#cdd5e4', strokeWidth: 2 }} />
        )
      } else {
        let lineData = {
          x1: data.source.x,
          y1: data.source.y,
          x2: data.target.x,
          y2: data.target.y,
          style: { stroke: '#cdd5e4', strokeWidth: 2 },
          data: data
        }
        linkList.push(
          <line key={'line-id' + linkList.length} {...lineData} />
        )
      }
    })
    return (
      <g onDoubleClick={this.onDClick}>
        {linkList}
        <g ref='circ'>
          {nodeList}
        </g>
      </g>
    )
  }

  render () {
    // console.log('FDG-r')
    let el = null
    let props = this.props
    el = this.drawSim(props)
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
  tipFunction: () => {},
  isCurved: true,
  alphaMin: 0.01,
  getSimInfo: () => {},
  isStatic: false
}
// The following proptyes are needed for the linter
// They have been commented out for expediency
// ForceDirectedGraph.propTypes = {
//   chartHeight: PropTypes.number,
//   chartWidth: PropTypes.number,
//   className: PropTypes.string,
//   radius: PropTypes.number,
//   adjacencyList: PropTypes.any,
//   tipFunction: PropTypes.func,
//   nodes: PropTypes.array.isRequired,
//   links: PropTypes.array.isRequired,
//   data: PropTypes.array,
//   onClick: PropTypes.func,
//   onEnter: PropTypes.func,
//   onLeave: PropTypes.func,
//   isCurved: PropTypes.bool,
//   alphaMin: PropTypes.number,
//   timeMax: PropTypes.number,
//   tickMax: PropTypes.number,
//   getSimInfo: PropTypes.func,
//   isStatic: PropTypes.bool
// }

ForceDirectedGraph.propTypes = {
  tipFunction: PropTypes.func,
  nodes: PropTypes.array.isRequired,
  links: PropTypes.array.isRequired,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func
}

export default ForceDirectedGraph
