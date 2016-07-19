import React, { PropTypes } from 'react'
import { ascending, set, min, max, extent, range } from 'd3'

import { setScale } from './util/d3'

// NOTE: This component was built around data that was not concise.
// Flip flopping key used was required. Once data is changed,
// code will be fixed
class Circumshaker extends React.Component {
  constructor (props) {
    super(props)

    this.graph = {}

    this.depth = 0
    this.radius = 0
    this.nodeSizeScale = setScale('linear')

    this.generateGraph = this.generateGraph.bind(this)

    this.onClick = this.onClick.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.onLeave = this.onLeave.bind(this)
    this.getDatum = this.getDatum.bind(this)

    this.generateGraph(props)
  }

  // Update the domain for the shared scale
  componentWillReceiveProps (nextProps) {
    this.generateGraph(nextProps)
  }

  generateGraph (props) {
    if (Object.keys(props.data).length > 0) {
      let graph = this.graph

      // Instantiate nodes and links
      graph.nodes = []
      graph.links = []

      // Helper to generate graph's links and nodes
      const generateGraph = (data, depth = 0, parent = null) => {
        // Create node
        // TODO: Used some passed down prop to determine key, value used
        let node = (depth !== 0)
          ? {key: data.key_as_string, value: data.doc_count, depth: depth}
          : {key: data.source_ip, value: data.dest_ip.length, depth: 0}
        node.data = data

        // Find possible duplicates
        let duplicate = (graph.nodes.filter((d) => d.key === node.key))

        // Don't add duplicate nodes
        if (duplicate.length === 0) {
          graph.nodes.push(node)
        } else {
          // If duplicate, set node to the duplicate
          // This is to make sure the link is established with the correct node
          node = duplicate[0]
        }

        // Create Link
        let link = {
          source: parent,
          target: node
        }

        // Don't push link if it links to nothing
        if (parent !== null) {
          graph.links.push(link)
        }

        // To ensure next alternating path is taken during traversal
        // TODO: used some passed down prop to determine alternation
        let prop = null
        if (data.hasOwnProperty('dest_ip')) {
          prop = 'dest_ip'
        } else if (data.hasOwnProperty('source_ip')) {
          prop = 'source_ip'
        }

        // Continue traversing data
        if (prop !== null) {
          data[prop].forEach((d) => {
            generateGraph(d, depth + 1, node)
          })
        }
      }

      // Populate graph
      generateGraph(props.data)

      // Sort nodes and set parents to null
      graph.nodes
        .sort((a, b) => {
          if (a.depth !== b.depth) {
            return ascending(a.depth, b.depth)
          } else {
            let aKids = graph.links.filter((d) => {
              return d.source === a
            }).length
            let bKids = graph.links.filter((d) => {
              return d.source === b
            }).length

            return bKids - aKids
          }
        })
        .forEach((d) => {
          d.parent = null
        })

      // Function to get leafs of a given subtree
      const getNumLeafs = (_node) => {
        let leafs = set()

        const getNumLeafsHelper = (_links) => {
          _links.forEach((g) => {
            let children = graph.links.filter((h) => {
              return g.target === h.source
            })

            if (children.length === 0 && !leafs.has(g.target.key)) {
              leafs.add(g.target.key)
            } else {
              getNumLeafsHelper(children)
            }
          })
        }

        // Count leaves
        getNumLeafsHelper(graph.links.filter((g) => {
          // Only count leaves that don't already have parents
          return g.source === _node && g.target.parent === null
        }))

        return leafs.size()
      }

      // Find number of leafs for subtree
      graph.nodes.forEach((d) => {
        // Set number of leafs for subtree
        d.leafs = getNumLeafs(d)

        // Claim children for node d
        // NOTE: This is ensure propering drawing during render
        graph.links.filter((g) => {
          return g.source === d && g.target.parent === null
        }).forEach((g) => {
          g.target.parent = d
        })
      })

      // Determine maximum depth allowed for rendering
      this.depth = Math.min(max(this.graph.nodes, (d) => d.depth), props.maxDepth)

      // Determine radius
      // NOTE: This is used as more of a radius 'band'
      this.radius = min([props.chartWidth, props.chartHeight]) /
        (this.depth) / 2

      // Determine properties used for each node during drawing
      // Properties determined are as follows
      // (x, y) - coordinate of where to palce node
      // degree - degree of where to map node to polar coordiante system
      // startAngle - used to help determine next degree used for children
      // wedge - degree 'space' allotted for a node
      // radius - radius used for drawing node
      graph.nodes.forEach((d, i) => {
        d.x = props.chartWidth / 2
        d.y = props.chartHeight / 2
        d.degree = 0
        d.startAngle = 0
        d.wedge = 360

        if (d.depth !== 0) {
          let parent = d.parent
          let leafs = d.leafs
          let totalLeafs = parent.leafs

          if (leafs === 0) {
            let siblings = graph.nodes.filter((g) => g.parent === parent)
            let siblingTotalLeafCount = 0
            let numberOfSiblingsWithNoLeafs = 0
            siblings.forEach((g) => {
              if (g.leafs === 0) {
                numberOfSiblingsWithNoLeafs += 1
              } else {
                siblingTotalLeafCount += g.leafs
              }
            })

            d.wedge = (parent.wedge - (siblingTotalLeafCount / totalLeafs * parent.wedge)) /
              numberOfSiblingsWithNoLeafs
          } else {
            d.wedge = leafs / totalLeafs * parent.wedge
          }

          d.degree = parent.startAngle + d.wedge / 2
          d.startAngle = parent.startAngle
          parent.startAngle += d.wedge
        }

        let r = this.radius * d.depth
        d.x += r * Math.cos(d.degree * (Math.PI / 180))
        d.y += r * Math.sin(d.degree * (Math.PI / 180))
      })

      // Find max node size if not predefined
      let maxSize = props.nodeMaxSize !== null
      ? props.nodeMaxSize
      : graph.nodes.reduce((prev, curr) => {
        let r = this.radius * curr.depth
        let theta = curr.startAngle > curr.degree
          ? curr.startAngle - curr.degree
          : curr.degree - curr.startAngle
        theta *= (Math.PI / 180)
        let arcLength = r * theta
        return prev < arcLength || arcLength === 0 ? prev : arcLength
      }, Math.Infinity)

      // Create scale that determines node size
      this.nodeSizeScale
        .range([props.nodeMinSize, maxSize])
        .domain(extent(this.graph.nodes, (d) => {
          return this.graph.links.filter((g) => {
            return g.source === d || g.target === d
          }).length
        }))
    }
  }

  onClick (event) {
    let target = event.target
    this.props.onClick(event, this.getDatum(target))
  }

  onEnter (event) {
    let target = event.target
    this.props.onEnter(event, this.getDatum(target))

    // Only display linking paths
    let nodeIndex = target.getAttribute('data-nodeIndex')
    let gNode = this.graph.nodes[nodeIndex]
    this.graph.links.forEach((d, i) => {
      d.display = (d.source === gNode || d.target === gNode)
        ? 'block'
        : 'none'
    })
    // NOTE: This might not be the most efficient
    // look into betters way sometime
    this.forceUpdate()
  }

  onLeave (event) {
    let target = event.target
    this.props.onLeave(event, this.getDatum(target))

    // Display all paths once again
    this.graph.links.forEach((d, i) => {
      d.display = 'block'
    })
    // NOTE: This might not be the most efficient ... may need better way
    this.forceUpdate()
  }

  getDatum (target) {
    let label = target.getAttribute('data-nodeKey')
    let count = target.getAttribute('data-nodeValue')
    return {
      label,
      count
    }
  }

  render () {
    let {chartWidth, chartHeight} = this.props

    const det = (a, b, c) => {
      return ((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x))
    }

    // Helper to create link paths
    const path = (d) => {
      let depth = Math.min(d.source.depth, d.target.depth)
      let r = this.radius * depth + this.radius / 2
      let root = {
        x: chartWidth / 2,
        y: chartHeight / 2
      }
      let sweep = det(d.source, d.target, root) <= 0 ? 0 : 1
      let arc = 'L ' + d.target.x + ',' + d.target.y
      if (d.source.depth !== 0) {
        arc = 'A ' + r + ',' + r + ' ' +
          0 + ' ' + 0 + ',' + sweep + ' ' +
          d.target.x + ',' + d.target.y
      }
      return 'M ' + d.source.x + ',' + d.source.y + ' ' + arc
    }

    return (
      <g className={this.props.className}>
        {range(1, this.depth + 1, 1).map((d, i) => {
          let cocentricCircleProps = {
            className: 'cocentricCircle',
            key: i,
            r: this.radius * d,
            cx: chartWidth / 2,
            cy: chartHeight / 2
          }
          return (
            <circle {...cocentricCircleProps} />
          )
        })}
        {this.graph.links.map((d, i) => {
          let linkProps = {
            className: 'link',
            key: i,
            display: (typeof d.display === 'undefined')
              ? 'block'
              : d.display,
            d: path(d)
          }
          return (
            <path {...linkProps} />
          )
        })}
        {this.graph.nodes.map((d, i) => {
          let nodeProps = {
            'data-nodeIndex': i,
            'data-nodeKey': d.key,
            'data-nodeValue': d.value,
            onMouseEnter: this.onEnter,
            onMouseLeave: this.onLeave,
            onClick: this.onClick,
            className: 'node',
            key: i,
            r: this.nodeSizeScale(this.graph.links.filter((g) => {
              return g.source === d || g.target === d
            }).length),
            cx: d.x,
            cy: d.y
          }
          return (
            <circle {...nodeProps} />
          )
        })}
      </g>
    )
  }
}

Circumshaker.defaultProps = {
  nodeMinSize: 8,
  nodeMaxSize: null,
  maxDepth: 3,
  labelField: 'label',
  data: {},
  onClick: () => {},
  onEnter: () => {},
  onLeave: () => {}
}

Circumshaker.propTypes = {
  nodeMinSize: PropTypes.number,
  nodeMaxSize: PropTypes.number,
  maxDepth: PropTypes.number,
  labelField: PropTypes.string,
  chartHeight: PropTypes.number,
  chartWidth: PropTypes.number,
  className: PropTypes.string,
  data: PropTypes.object,
  onClick: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func
}

export default Circumshaker
