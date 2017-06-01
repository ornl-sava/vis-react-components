import React from 'react'
import PropTypes from 'prop-types'
import ReactTransitionGroup from 'react-addons-transition-group'

import * as d3 from 'd3'

import { setEase } from './util/d3'
import SVGComponent from './SVGComponent'

class SummaryTimeline extends React.Component {
  render () {
    let data = this.props.data

    let width = this.props.chartWidth ? this.props.chartWidth : this.props.width
    let height = this.props.chartHeight ? this.props.chartHeight : this.props.height

    var x = d3.scaleTime()
      .domain(d3.extent(data, (d) => { return d.date }))
      .rangeRound([0, width])

    var yMin = d3.min(data, (d) => { return d.min })
    var yMax = d3.max(data, (d) => { return d.max })
    var y = d3.scaleLinear()
      .domain([yMin, yMax])
      .rangeRound([height, 0])

    var meanLine = d3.line()
      .curve(d3.curveStepAfter)
      .x((d) => { return x(d.date) })
      .y((d) => { return y(d.mean) })(data)
    // var stdevMinLine = d3.line()
    //   .x((d) => { return x(d.date) })
    //   .y((d) => { return y(d.stdevMin) })(data)
    // var stdevMaxLine = d3.line()
    //   .x((d) => { return x(d.date) })
    //   .y((d) => { return y(d.stdevMax) })(data)
    // var maxLine = d3.line()
    //   .x((d) => { return x(d.date) })
    //   .y((d) => { return y(d.max) })(data)
    // var minLine = d3.line()
    //   .x((d) => { return x(d.date) })
    //   .y((d) => { return y(d.min) })(data)

    var stdevRangeArea = d3.area()
      .curve(d3.curveStepAfter)
      .x((d) => { return x(d.date) })
      .y0((d) => { return y(d.stdevMin) })
      .y1((d) => { return y(d.stdevMax) })(data)
    var extentRangeArea = d3.area()
      .curve(d3.curveStepAfter)
      .x((d) => { return x(d.date) })
      .y0((d) => { return y(d.min) })
      .y1((d) => { return y(d.max) })(data)

    let pathTransition = {func: (transition, props) => {
      transition
        .delay(0)
        .duration(500)
        .ease(setEase('linear'))
        .attr('d', props.d)
        .attr('fill', props.fill)
      return transition
    }}

    return (
      <ReactTransitionGroup component='g'>
        <SVGComponent Component='path'
          key='extentRange'
          fill='#c6dbef'
          d={extentRangeArea}
          onUpdate={pathTransition}
        />
        <SVGComponent Component='path'
          key='stdevRange'
          fill='#9ecae1'
          d={stdevRangeArea}
          onUpdate={pathTransition}
        />
        <SVGComponent Component='path'
          key='mean'
          fill='none'
          stroke='black'
          strokeLinejoin='round'
          strokeLinecap='round'
          strokeWidth={1.5}
          d={meanLine}
          onUpdate={pathTransition}
        />
      </ReactTransitionGroup>
    )
  }
}

SummaryTimeline.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  chartWidth: PropTypes.number,
  chartHeight: PropTypes.number,
  data: PropTypes.array
}

export default SummaryTimeline
