import React, { PropTypes } from 'react'
import ReactTransitionGroup from 'react-addons-transition-group'
import { scaleLinear, select, easeLinear, range, extent, max, min, set, ascending } from 'd3'

class Node extends React.Component {
  componentWillEnter (callback) {
    let node = select(this.refs.node)

    node.transition().duration(750).ease(easeLinear)
      .attr('cx', this.props.cx)
      .attr('cy', this.props.cy)
      .attr('r', this.props.r)
      .on('end', () => {
        callback()
      })
  }

  componentWillLeave (callback) {
    let node = select(this.refs.node)
    node.transition().duration(750).ease(easeLinear)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 0)
      .on('end', () => {
        callback()
      })
  }

  componentWillUpdate (nextProps) {
    let node = select(this.refs.node)
    let componentMoved = node.attr('cx') !== nextProps.cx &&
      node.attr('cy') !== nextProps.cy &&
      node.attr('r') !== nextProps.r
    // Check if leaving
    if (componentMoved) {
      node.transition().duration(750).ease(easeLinear)
        .attr('cx', nextProps.cx)
        .attr('cy', nextProps.cy)
        .attr('r', nextProps.r)
    }
  }

  render () {
    return (
      <circle
        ref='node'
        data-nodeIndex={this.props['data-nodeIndex']}
        data-nodeKey={this.props['data-nodeKey']}
        data-nodeValue={this.props['data-nodeValue']}
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
        className={this.props.className} />
    )
  }
}

Node.propTypes = {
  r: PropTypes.number,
  cx: PropTypes.number,
  cy: PropTypes.number,
  'data-nodeIndex': PropTypes.any,
  'data-nodeKey': PropTypes.any,
  'data-nodeValue': PropTypes.any,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  className: PropTypes.string
}

class Path extends React.Component {
  componentWillEnter (callback) {
    let path = select(this.refs.path)
    path.transition().duration(750).ease(easeLinear)
      .attr('stroke-opacity', 1)
      .on('end', () => {
        callback()
      })
  }

  componentWillLeave (callback) {
    let path = select(this.refs.path)
    path.transition().duration(750).ease(easeLinear)
      .style('stroke-opacity', 0)
      .on('end', () => {
        callback()
      })
  }

  render () {
    return (
      <path
        ref='path'
        d={this.props.d}
        className={this.props.className}
        display={this.props.display} />
    )
  }
}

Path.propTypes = {
  className: PropTypes.string,
  display: PropTypes.string,
  d: PropTypes.string
}

class Circumshaker extends React.Component {
  constructor (props) {
    super(props)

    this.graph = {
      nodes: [],
      links: []
    }

    this.depth = 0
    this.radius = 0
    this.nodeSizeScale = scaleLinear()

    this.onClick = this.onClick.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.onLeave = this.onLeave.bind(this)
    this.renderLoadAnimation = this.renderLoadAnimation.bind(this)
    this.renderCircumshaker = this.renderCircumshaker.bind(this)
  }

  // Update the domain for the shared scale
  componentWillReceiveProps (nextProps) {
    if (Object.keys(nextProps.data).length > 0) {
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
      generateGraph(nextProps.data)

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
      this.depth = Math.min(max(this.graph.nodes, (d) => d.depth), nextProps.maxDepth)

      // Determine radius
      // NOTE: This is used as more of a radius 'band'
      this.radius = min([nextProps.chartWidth, nextProps.chartHeight]) /
        (this.depth) / 2

      // Determine properties used for each node during drawing
      // Properties determined are as follows
      // (x, y) - coordinate of where to palce node
      // degree - degree of where to map node to polar coordiante system
      // startAngle - used to help determine next degree used for children
      // wedge - degree 'space' allotted for a node
      // radius - radius used for drawing node
      graph.nodes.forEach((d, i) => {
        d.x = nextProps.chartWidth / 2
        d.y = nextProps.chartHeight / 2
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
      let maxSize = nextProps.nodeMaxSize !== null
      ? nextProps.nodeMaxSize
      : Math.min(graph.nodes.reduce((prev, curr) => {
        let r = this.radius * curr.depth
        let theta = curr.startAngle > curr.degree
          ? curr.startAngle - curr.degree
          : curr.degree - curr.startAngle
        theta *= (Math.PI / 180)
        let arcLength = r * theta
        return prev < arcLength || arcLength === 0 ? prev : arcLength
      }, Math.Infinity), this.radius / 2)

      // Create scale that determines node size
      this.nodeSizeScale
        .range([nextProps.nodeMinSize, maxSize])
        .domain(extent(this.graph.nodes, (d) => {
          return this.graph.links.filter((g) => {
            return g.source === d || g.target === d
          }).length
        }))
    }
  }

  onClick (event) {
    this.props.onClick(event)
  }

  onEnter (event) {
    let node = event.target
    this.props.onEnter(this.tooltipData(node), node)

    // Only display linking paths
    let nodeIndex = node.getAttribute('data-nodeIndex')
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
    let node = event.target
    this.props.onLeave(this.tooltipData(node), node)

    // Display all paths once again
    this.graph.links.forEach((d, i) => {
      d.display = 'block'
    })
    // NOTE: This might not be the most efficient
    // look into betters way sometime
    this.forceUpdate()
  }

  tooltipData (node) {
    let label = node.getAttribute('data-nodeKey')
    let count = node.getAttribute('data-nodeValue')
    return {
      label,
      count
    }
  }

  renderCircumshaker () {
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
        <g>
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
        </g>
        <ReactTransitionGroup component='g'>
          {this.graph.links.map((d, i) => {
            let linkProps = {
              className: 'link',
              key: d.source.key.replace(/\W/g, '') + '-' + d.target.key.replace(/\W/g, ''),
              display: (typeof d.display === 'undefined')
                ? 'block'
                : d.display,
              d: path(d)
            }
            return (
              <Path {...linkProps} />
            )
          })}
        </ReactTransitionGroup>
        <ReactTransitionGroup component='g'>
          {this.graph.nodes.map((d, i) => {
            return (
              <Node
                key={d.key.replace(/\W/g, '')}
                data-nodeIndex={i}
                data-nodeKey={d.key}
                data-nodeValue={d.value}
                onMouseEnter={this.onEnter}
                onMouseLeave={this.onLeave}
                className='node'
                r={this.nodeSizeScale(this.graph.links.filter((g) => {
                  return g.source === d || g.target === d
                }).length)}
                cx={d.x}
                cy={d.y} />
            )
          })}
        </ReactTransitionGroup>
      </g>
    )
  }

  renderLoadAnimation () {
    let {chartWidth, chartHeight, ...props} = this.props
    let xPos = Math.floor(chartWidth / 2)
    let yPos = Math.floor(chartHeight / 2)
    let messageText = 'Loading data...'
    if (!props.loading) {
      if (props.status === 'Failed to fetch') {
        messageText = 'Can\'t connect to API URL'
      } else if (props.status !== 'OK') {
        messageText = 'Error retrieving data: ' + props.status
      } else {
        messageText = 'No data returned!'
      }
    }
    return (
      <g className='loading-message'>
        <text x={xPos} y={yPos}>{messageText}</text>
      </g>
    )
  }

  render () {
    let renderEl = null
    renderEl = this.renderLoadAnimation()
    if (Object.keys(this.props.data).length > 0 && this.props.chartWidth !== 0) {
      renderEl = this.renderCircumshaker()
    }
    return renderEl
  }
}

Circumshaker.defaultProps = {
  nodeMinSize: 8,
  nodeMaxSize: null,
  maxDepth: 3,
  labelField: 'label',
  chartHeight: 0,
  chartWidth: 0,
  className: 'Circumshaker',
  data: {},
  dataLoading: false,
  status: '',
  type: '',
  onClick: () => {},
  onEnter: () => {},
  onLeave: () => {}
}

Circumshaker.propTypes = {
  nodeMinSize: PropTypes.number,
  nodeMaxSize: PropTypes.number,
  maxDepth: PropTypes.number,
  labelField: PropTypes.string,
  chartHeight: PropTypes.number.isRequired,
  chartWidth: PropTypes.number.isRequired,
  className: PropTypes.string.isRequired,
  data: PropTypes.object,
  dataLoading: PropTypes.bool,
  onClick: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  status: PropTypes.string,
  type: PropTypes.string
}

export default Circumshaker
