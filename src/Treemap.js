// partly inspired by https://github.com/yang-wei/rd3/blob/master/src/treemap

import React, { PropTypes } from 'react'
import ReactTransitionGroup from 'react-addons-transition-group'

import * as d3 from 'd3'

import { setEase } from './util/d3'
import SVGComponent from './SVGComponent'

class Treemap extends React.Component {
  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.onLeave = this.onLeave.bind(this)
  }

  onClick (event, data, index) {
    this.props.onClick(event, data, index)
  }

  onEnter (event, data, index) {
    this.props.onEnter(event, data, index)
  }

  onLeave (event, data, index) {
    this.props.onLeave(event, data, index)
  }

  render () {
    const treemap = d3.treemap()
      .size([this.props.width, this.props.height])

    const tree = treemap(this.props.data)

    return (
      <ReactTransitionGroup component='g' className={this.props.className}>
        {tree.map((d, i) => {
          return (
            <SVGComponent Component='rect'
              key={i}
              onMouseEnter={this.onEnter}
              onMouseLeave={this.onLeave}
              onClick={this.onClick}
              onUpdate={{
                func: (transition, props) => {
                  transition
                    .delay(0)
                    .duration(500)
                    .ease(setEase('linear'))
                    .attr('height', props.height)
                    .attr('width', props.width)
                    .attr('y', props.y)
                    .attr('x', props.x)
                  return transition
                }
              }}
              x={d.x}
              y={d.y}
              width={d.dx}
              height={d.dy}
              fill={this.props.colors(i)}
            />
          )
        })}
      </ReactTransitionGroup>
    )
  }
}

Treemap.defaultProps = {
  onClick: () => {},
  onEnter: () => {},
  onLeave: () => {},
  data: [],
  colors: d3.scaleOrdinal(d3.schemeCategory20)
}

Treemap.propTypes = {
  onClick: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  data: PropTypes.array,
  colors: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string
}

export default Treemap
