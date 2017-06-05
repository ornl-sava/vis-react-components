import React from 'react'
import PropTypes from 'prop-types'
import { TransitionGroup } from 'react-transition-group'
import { interpolate, extent, max, min, range, ascending, set } from 'd3'

import SVGComponent from './SVGComponent'
import { setScale, setEase } from './util/d3'

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

    this.generateGraph(props)
  }

  // Update the domain for the shared scale
  componentWillReceiveProps (nextProps) {
    this.generateGraph(nextProps)
  }

  // NOTE: Changes will beed to be made here once API is created
  generateGraph (props) {
    if (Object.keys(props.data).length > 0) {
      let graph = this.graph

      // Instantiate nodes and links
      graph.nodes = []
      graph.links = []

      // Helper to generate graph's links and nodes
      const generateGraph = (data, depth = 0, parent = null) => {
        // Create node
        let node = {
          key: data[props.keyAccessor],
          value: data[props.valueAccessor],
          depth: depth
        }

        // Bind all of data to node
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

        // Continue traversing data
        if (props.childAccessor in data) {
          data[props.childAccessor].forEach((d) => {
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
        .range([props.nodeMinSize, maxSize])
        .domain(extent(this.graph.nodes, (d) => {
          return this.graph.links.filter((g) => {
            return g.source === d || g.target === d
          }).length
        }))
    }
  }

  onClick (event, data, index) {
    this.props.onClick(event, data, index)
  }

  onEnter (event, data, index) {
    this.props.onEnter(event, data, index)

    // Only display linking paths
    let gNode = this.graph.nodes[index]
    this.graph.links.forEach((d, i) => {
      let key = d.source.key.replace(/\W/g, '') + '-' + d.target.key.replace(/\W/g, '')
      let link = this.refs[key]
      link.style.display = (d.source === gNode || d.target === gNode)
        ? 'block'
        : 'none'
    })
  }

  onLeave (event, data, index) {
    this.props.onLeave(event, data, index)

    // Display all paths once again
    this.graph.links.forEach((d, i) => {
      let key = d.source.key.replace(/\W/g, '') + '-' + d.target.key.replace(/\W/g, '')
      let link = this.refs[key]
      link.style.display = 'block'
    })
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
        <g>
          {range(1, this.depth + 1, 1).map((d, i) => {
            return (
              <circle
                className='concentricCircle'
                key={i}
                r={this.radius * d}
                cx={chartWidth / 2}
                cy={chartHeight / 2} />
            )
          })}
        </g>
        {this.graph.links.map((d, i) => {
          return (
            <path ref={d.source.key.replace(/\W/g, '') + '-' + d.target.key.replace(/\W/g, '')}
              key={d.source.key.replace(/\W/g, '') + '-' + d.target.key.replace(/\W/g, '')}
              className='link'
              d={path(d)}
              display={typeof d.display === 'undefined'
                ? 'block'
                : d.display
              } />
          )
        })}
        <TransitionGroup component='g'>
          {this.graph.nodes.map((d, i) => {
            return (
              <SVGComponent ref={'node-' + i}
                key={d.key.replace(/\W/g, '')}
                className='node'
                Component='circle'
                data={d}
                index={i}
                onClick={this.onClick}
                onMouseEnter={this.onEnter}
                onMouseLeave={this.onLeave}
                onEnter={{
                  func: (transition, props) => {
                    let radius = this.radius * (this.depth + 1)
                    let degree = props.data.degree
                    let x = this.props.chartWidth / 2
                    let y = this.props.chartHeight / 2
                    x += radius * Math.cos(degree * (Math.PI / 180))
                    y += radius * Math.sin(degree * (Math.PI / 180))
                    transition
                      .delay(0)
                      .duration(500)
                      .ease(setEase('linear'))
                      .attrTween('r', () => {
                        return interpolate(0, props.r)
                      })
                      .attrTween('cx', () => {
                        return interpolate(x, props.cx)
                      })
                      .attrTween('cy', () => {
                        return interpolate(y, props.cy)
                      })
                    return transition
                  }
                }}
                onUpdate={{
                  func: (transition, props) => {
                    transition
                      .delay(0)
                      .duration(500)
                      .ease(setEase('linear'))
                      .attr('r', props.r)
                      .attr('cx', props.cx)
                      .attr('cy', props.cy)
                    return transition
                  }
                }}
                onExit={{
                  func: (transition, props) => {
                    let radius = this.radius * (this.depth + 1)
                    let degree = props.data.degree
                    let x = this.props.chartWidth / 2
                    let y = this.props.chartHeight / 2
                    x += radius * Math.cos(degree * (Math.PI / 180))
                    y += radius * Math.sin(degree * (Math.PI / 180))
                    transition
                      .delay(0)
                      .duration(500)
                      .ease(setEase('linear'))
                      .attr('r', 0)
                      .attr('cx', x)
                      .attr('cy', y)
                    return transition
                  }
                }}
                r={this.nodeSizeScale(this.graph.links.filter((g) => {
                  return g.source === d || g.target === d
                }).length)}
                cx={d.x}
                cy={d.y}
                fill={this.props.colorFunction ? this.props.colorFunction(d) : null} />
            )
          })}
        </TransitionGroup>
      </g>
    )
  }
}

Circumshaker.defaultProps = {
  keyAccessor: 'key',
  valueAccessor: 'value',
  childAccessor: 'children',
  nodeMinSize: 8,
  nodeMaxSize: null,
  maxDepth: 3,
  data: {},
  onClick: () => {},
  onEnter: () => {},
  onLeave: () => {}
}

// nodeMaxSize defaults to using largest fit possible space
Circumshaker.propTypes = {
  keyAccessor: PropTypes.string,
  valueAccessor: PropTypes.string,
  childAccessor: PropTypes.string,
  nodeMinSize: PropTypes.number,
  nodeMaxSize: PropTypes.number,
  maxDepth: PropTypes.number,
  chartHeight: PropTypes.number,
  chartWidth: PropTypes.number,
  className: PropTypes.string,
  data: PropTypes.object,
  onClick: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  colorFunction: PropTypes.func
}

export default Circumshaker
