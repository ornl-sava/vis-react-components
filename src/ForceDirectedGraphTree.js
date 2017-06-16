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
      nodes: [],
      links: []
    }

    this.nodes = []
    this.links = []
    this.data = props.data
    this.rootNode = d3.hierarchy(this.data, (d) => {
      for (let i = 0; i < props.childAccessors.length; i++) {
        let data = d[props.childAccessors[i]]
        if (data != null && typeof data === 'object') {
          return data
        }
      }
      return d.children
    })
      .sum((d) => { return d.value })
      .sort((a, b) => { return b.height - a.height || b.value - a.value })
    this.setTree(props)

    this.colScale = d3.scaleOrdinal(d3.schemeCategory10)
    this.xScale = setScale('band')

    this.updateDR = this.updateDR.bind(this)
    this.updateDR(props)

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
    this.onDragStart = this.onDragStart.bind(this)
    this.hidingNodes = []
  }

  componentWillMount () {
    // using the nodes with the x and y values attached in falseStart
    this.nodes.map((d, i) => {
      d.key = i
    })
    this.setState({nodes: this.nodes, links: this.links})
  }

  shouldComponentUpdate (nextProps, nextState) {
    // need to have a catch for if the props change rather than state...
    return true
  }

  componentWillUnmount () {
    this.simulation.stop()
  }

  onDClick (event) {
    if (this.simOn) {
      console.log('FDG-onDC-simOn')
      this.simOn = false
      // both don't need to be on... play with alpha
      this.setSim(this.props)
      this.simulation.restart()
      this.isDrag = false
    } else {
      console.log('FDG-onDC-simOff')
      this.simOn = true
      this.isDrag = false
      this.setState({nodes: this.nodes, links: this.links})
      this.simulation.stop()
      this.setTree(this.props)
    }
  }

  onEnter (event) {
    let target = this.getDatum(event.target)
    if (target && this.props.tipFunction) {
      this.tip.show(event, target)
    }
    this.props.onEnter(event, target)
  }
  onLeave (event) {
    let target = this.getDatum(event.target)
    let tooltipD = {}
    if (target && this.props.tipFunction) {
      this.tip.hide(event, tooltipD)
    }
    this.props.onLeave(event, target)
  }

  onDragStart (event) {
    // console.log('FFG-oDStart-HERE')
    this.simulation.stop()
    let target = this.getDatum(event.target)
    // let i = target.data.index
    if (target.children !== null) {
      target._children = target.children
      target.children = null
      // need to fix
      if (this.simOn) {
        this.setTree(this.props)
        this.setState({nodes: this.nodes, links: this.links})
      } else {
        this.reSet(this.props)
        this.setSim(this.props)
        this.simulation.alphaTarget(0.3).restart()
      }
    } else if (target.children === null) {
      target.children = target._children
      target._children = null
      if (this.simOn) {
        this.setTree(this.props)
        this.setState({nodes: this.nodes, links: this.links})
      } else {
        this.reSet(this.props)
        this.setSim(this.props)
        this.simulation.alphaTarget(0.3).restart()
      }
    }
  }

  updateDR (props) {
    this.colScale.domain(d3.range(0, props.numTData, 1))
    this.xScale
      .domain(d3.range(0, props.numTData, 1))
      .range([0, props.chartWidth])
      .padding(0.2)
  }

  getIndex (target) {
    return target.getAttribute('data-index')
  }

  getDatum (target) {
    let i = target.getAttribute('data-index')
    // console.log('FDGT-gD-i', i)
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
        this.simUpdate(d, i)
      })

    this.simulation.force('link')
      .links(this.links)
  }
  simUpdate (d, i) {
    this.setState({nodes: this.nodes, links: this.links})
  }

  setTree (props) {
    let tree = d3.tree().size([props.chartWidth, props.chartHeight])
    tree(this.rootNode)
    this.nodes = this.rootNode.descendants()
    this.links = this.rootNode.links()
    console.log('FDGT-nodes-', this.nodes.length, '-links-', this.links.length)
  }
  reSet () {
    this.nodes = this.rootNode.descendants()
    this.links = this.rootNode.links()
  }

  drawSim (props) {
    // console.log('FDG-draw-props', props)
    let nodeList = []
    let linkList = []
    // console.log('FDG-draw-state', this.state)
    // console.log('FDG-draw-radius', props.radius)
    let events = {
      'onMouseDown': this.onDragStart,
      'onMouseEnter': this.onEnter,
      'onMouseLeave': this.onLeave
    }
    this.state.nodes.map((d, i) => {
      let circleProps = {
        'data-key': d.key,
        'data-index': i,
        'r': props.radius,
        'cx': d.x,
        'cy': d.y,
        'fill': this.colScale(d.data.hour),
        'data-events': d.events,
        'data-hour': d.hour
      }
      let key = d.key
      if (key == null) { key = 'root' }
      nodeList.push(
        <circle key={'cir-id' + key + '-hr-' + d.hour} {...events} {...circleProps} />
      )
    })
    this.state.links.map((data, index) => {
      if (props.isCurved) {
        linkList.push(
          <path key={'line-id-' + linkList.length} className='lineMatch' d={bezierLine(data.source, data.target)} style={{stroke: '#cdd5e4', strokeWidth: 2}} />
        )
      } else {
        let lineData = {
          x1: data.source.x,
          y1: data.source.y,
          x2: data.target.x,
          y2: data.target.y,
          style: {stroke: '#cdd5e4', strokeWidth: 2},
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
        {nodeList}
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
  radius: 7,
  onClick: () => {},
  onEnter: () => {},
  onLeave: () => {},
  className: '',
  tipFunction: () => {},
  isCurved: true,
  childAccessors: []
}

// The following proptyes are needed for the linter
// They have been commented out for expediency
// ForceDirectedGraph.propTypes = {
//   chartHeight: PropTypes.number,
//   chartWidth: PropTypes.number,
//   className: PropTypes.string,
//   radius: PropTypes.number,
//   tipFunction: PropTypes.func,
//   xScale: PropTypes.any,
//   yScale: PropTypes.any,
//   data: PropTypes.object,
//   onClick: PropTypes.func,
//   onEnter: PropTypes.func,
//   onLeave: PropTypes.func,
//   isCurved: PropTypes.bool,
//   childAccessors: PropTypes.array
// }

ForceDirectedGraph.propTypes = {
  tipFunction: PropTypes.func,
  data: PropTypes.object,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  childAccessors: PropTypes.array
}

export default ForceDirectedGraph
