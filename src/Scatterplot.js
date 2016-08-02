import React, { PropTypes } from 'react'
import ReactTransitionGroup from 'react-addons-transition-group'
import { interpolate } from 'd3'

import { setEase } from './util/d3'
import SVGComponent from './SVGComponent'

class Scatterplot extends React.Component {
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
    let { keyFunction, ...props } = this.props
    return (
      <ReactTransitionGroup component='g' className={props.className}>
        {this.props.data.map((d, i) => {
          return (
            <SVGComponent Component='circle' key={keyFunction(d, i)}
              data={d}
              index={i}
              onEnter={{
                func: (transition, props) => {
                  transition
                    .delay(0)
                    .duration(750)
                    .ease(setEase('linear'))
                    .attrTween('r', () => {
                      return interpolate(0, props.r)
                    })
                  return transition
                }
              }}
              onUpdate={{
                func: (transition, props) => {
                  transition
                    .delay(0)
                    .duration(750)
                    .ease(setEase('linear'))
                    .attr('r', props.r)
                    .attr('cx', props.cx)
                    .attr('cy', props.cy)
                  return transition
                }
              }}
              onExit={{
                func: (transition, props) => {
                  transition
                    .delay(0)
                    .duration(750)
                    .ease(setEase('linear'))
                    .attr('r', 0)
                  return transition
                }
              }}
              r={props.radius}
              cx={props.xScale(d[props.xAccessor])}
              cy={props.yScale(d[props.yAccessor])}
              onMouseEnter={this.onEnter}
              onMouseLeave={this.onLeave}
              onClick={this.onClick} />
          )
        })}
      </ReactTransitionGroup>
    )
  }
}

Scatterplot.defaultProps = {
  xAccessor: 'x',
  yAccessor: 'y',
  keyFunction: (d, i) => i,
  radius: 5,
  onClick: () => {},
  onEnter: () => {},
  onLeave: () => {}
}

Scatterplot.propTypes = {
  chartHeight: PropTypes.number,
  chartWidth: PropTypes.number,
  className: PropTypes.string,
  radius: PropTypes.number,
  xAccessor: PropTypes.string,
  yAccessor: PropTypes.string,
  keyFunction: PropTypes.func,
  xScale: PropTypes.any,
  yScale: PropTypes.any,
  data: PropTypes.array,
  onClick: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func
}

export default Scatterplot
