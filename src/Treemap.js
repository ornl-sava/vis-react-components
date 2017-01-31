// partly inspired by https://bl.ocks.org/mbostock/6bbb0a7ff7686b124d80

import React, { PropTypes } from 'react'
import ReactTransitionGroup from 'react-addons-transition-group'

import * as d3 from 'd3'

import { setEase } from './util/d3'
import SVGComponent from './SVGComponent'
import Tooltip from './Tooltip'

class Treemap extends React.Component {
  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.onLeave = this.onLeave.bind(this)
    this.tip = props.tipFunction
      ? new Tooltip().attr('className', 'd3-tip').html(props.tipFunction)
      : props.tipFunction
  }

  onClick (event, data, index) {
    this.props.onClick(event, data, index)
  }

  onEnter (event, data, index) {
    console.log('asdf')
    if (data && this.tip) {
      this.tip.show(event, data, index)
    }
    this.props.onEnter(event, data, index)
  }

  onLeave (event, data, index) {
    console.log('fdsa')
    if (data && this.tip) {
      this.tip.hide(event, data, index)
    }
    this.props.onLeave(event, data, index)
  }

  componentWillUnmount () {
    if (this.props.tipFunction) {
      this.tip.destroy()
    }
  }

  render () {
    const treemap = d3.treemap()
      .size([this.props.width, this.props.height])
      .round(true)
      .padding(1)

    const getParent = (id) => { return id.substring(0, id.lastIndexOf('.')) }

    const stratify = d3.stratify()
      .parentId(d => { return getParent(d.id) })

    const root = stratify(this.props.data)
      .sum(d => { return d.value })
      .sort((a, b) => { return b.height - a.height || b.value - a.value })

    const colors = d3.scaleOrdinal(d3.schemeCategory20)

    treemap(root)

    return (
      <ReactTransitionGroup component='g'>
        {root.leaves().map((d, i) => {
          return (
            <g key={d.id}>
              <SVGComponent Component='rect'
                key={d.id}
                data={d}
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
                      .attr('fill', props.fill)
                    return transition
                  }
                }}
                x={d.x0 + 'px'}
                y={d.y0 + 'px'}
                width={d.x1 - d.x0 + 'px'}
                height={d.y1 - d.y0 + 'px'}
                fill={colors(getParent(d.id))}
              />
              <SVGComponent Component='text'
                key={d.id + ' value'}
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
                x={d.x0 + (d.x1 - d.x0) / 2 + 'px'}
                y={d.y0 + (d.y1 - d.y0) / 2 + 'px'}
                width={(d.x1 - d.x0) / 2 + 'px'}
                height={(d.y1 - d.y0) / 2 + 'px'}
                fill={'black'}>
                {d.id}
              </SVGComponent>
            </g>
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
  className: 'Treemap'
}

Treemap.propTypes = {
  onClick: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  tipFunction: PropTypes.func,
  data: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string
}

export default Treemap
