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
    this.state = {}
  }

  onClick (event, data, index) {
    if (this.props.zoom && data.children) {
      this.setState({selectedId: data.id})
    }
    this.props.onClick(event, data, index)
  }

  onEnter (event, data, index) {
    if (data && this.tip) {
      this.tip.show(event, data, index)
    }
    this.props.onEnter(event, data, index)
  }

  onLeave (event, data, index) {
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
    const w = this.props.chartWidth ? this.props.chartWidth : this.props.width
    const h = this.props.chartHeight ? this.props.chartHeight : this.props.height

    const treemap = d3.treemap()
      .size([w, h])
      .round(true)
      .padding(2)

    const getParent = (id) => {
      if (this.props.zoom && this.state.selectedId === id) {
        return ''
      }
      return id.substring(0, id.lastIndexOf('.'))
    }

    const stratify = d3.stratify()
      .parentId(d => { return getParent(d.id) })

    let activeData = this.props.data

    if (this.props.zoom && this.state.selectedId) {
      activeData = []
      // let startIndex = getParent(this.state.selectedId).length + 1
      this.props.data.map((d) => {
        if (d.id.includes(this.state.selectedId)) {
          activeData.push(d)
        }
      })
    }

    const root = stratify(activeData)
      .sum(d => { return this.props.sizeFunction(d) })
      .sort((a, b) => { return b.height - a.height || b.value - a.value })

    const colors = d3.scaleOrdinal(d3.schemeCategory20)

    treemap(root)

    let visibleNodes = null
    if (this.props.zoom) {
      visibleNodes = root.children
    } else {
      visibleNodes = root.leaves()
    }

    return (
      <ReactTransitionGroup component='g'>
        {visibleNodes.map((d, i) => {
          return (
            <SVGComponent Component='svg'
              key={d.id}
              x={d.x0 + 'px'}
              y={d.y0 + 'px'}
              width={d.x1 - d.x0 + 'px'}
              height={d.y1 - d.y0 + 'px'}
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
              }}>
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
                x={'0px'}
                y={'0px'}
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
                x={'5px'}
                y={5 + this.props.fontSize + 'px'}
                fill={'black'}
                fontSize={this.props.fontSize + 'px'}>
                { this.props.idDisplayFunction(d) }
              </SVGComponent>
            </SVGComponent>
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
  sizeFunction: (d) => { return d.value },
  idDisplayFunction: (d) => { return d.id },
  fontSize: 12,
  zoom: true,
  className: 'Treemap'
}

Treemap.propTypes = {
  onClick: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  tipFunction: PropTypes.func,
  sizeFunction: PropTypes.func,
  idDisplayFunction: PropTypes.func,
  data: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number,
  chartWidth: PropTypes.number,
  chartHeight: PropTypes.number,
  className: PropTypes.string,
  fontSize: PropTypes.number,
  zoom: PropTypes.bool
}

export default Treemap
