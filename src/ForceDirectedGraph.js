import React, { PropTypes } from 'react'
import { setScale } from './util/d3'
import * as d3 from 'd3'

class ForceDirectedGraph extends React.Component {
  constructor (props) {
    super(props)

    this.colScale = d3.scaleOrdinal(d3.schemeCategory10)
    this.xScale = setScale('ordinalBand')

    this.aList = props.adjacencyList

    this.nodes = []
    this.links = []
    this.simData = []

    this.updateDR = this.updateDR.bind(this)
    this.updateDR(props)

    this.onClick = this.onClick.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.onLeave = this.onLeave.bind(this)
  }

  shouldComponentUpdate (nextProps, nextState) {
    // makeCircles
    // let's simulate
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

  /* letsSimulate (props) {
   let ticked = (d, i) => {
    this.simData(i) = {
      x1:
      y1:
      x2:
      y2:

    }
    //  link
    //      .attr("x1", function(d) { return d.source.x; })
    //      .attr("y1", function(d) { return d.source.y; })
    //      .attr("x2", function(d) { return d.target.x; })
    //      .attr("y2", function(d) { return d.target.y; });
    //  node
    //      .attr("cx", function(d) { return d.x; })
    //      .attr("cy", function(d) { return d.y; });
   }

    let simulation = d3.forceSimulation()
      .force('link', d3.forceLink())
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(props.width / 2, props.height / 2))

    simulation
       .nodes(this.nodes)
       .on('tick', (d, i) => { ticked(d, i) })

    simulation.force('link')
       .links(this.links)
  }*/

  makeCircles (props) {
    let nodes = []
    let links = []
    this.aList.map((d, i) => {
      if (d.hour < props.numTData) {
        let circleProps = {
          'data-id': d.topicID,
          'r': props.radius,
          'cx': Math.random() * this.xScale.bandwidth() + this.xScale(d.hour),
          'cy': Math.random() * props.chartHeight,
          'fill': this.colScale(d.hour)
          // 'onMouseEnter': this.onEnter,
          // 'onMouseLeave': this.onLeave,
          // 'onClick': this.onClick
        }
        nodes.push(
          <circle key={'cir-id' + i + '-hr-' + d.hour} {...circleProps} />
        )
      }
    })
    this.aList.map((data, index) => {
      if (data.hour < props.numTData) {
        return data.story.map((d) => {
          if (d > index && d < nodes.length) {
            let lineData = {
              x1: nodes[index].props.cx,
              y1: nodes[index].props.cy,
              x2: nodes[d].props.cx,
              y2: nodes[d].props.cy,
              style: {stroke: '#cdd5e4', strokeWidth: 2}
            }
            links.push(
              <line key={'line-id' + links.length} {...lineData} />
            )
          }
        })
      }
    })
    this.nodes = nodes
    this.links = links
    this.simData = new Array(this.nodes.length)
    return (
      <g>
        {links}
        {nodes}
      </g>
    )
  }

  render () {
    let props = this.props
    return (
      <g className={props.className + 'fdg'}>
        {this.makeCircles(props)}
      </g>
    )
  }
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

ForceDirectedGraph.defaultProps = {
  xAccessor: 'x',
  yAccessor: 'y',
  radius: 5,
  onClick: () => {},
  onEnter: () => {},
  onLeave: () => {},
  className: ''
}

export default ForceDirectedGraph
