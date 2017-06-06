import React from 'react'
import PropTypes from 'prop-types'
import { TransitionGroup } from 'react-transition-group'

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

    // var yMin = d3.min(data, (d) => { return d.min })
    var yMin = d3.min(data, (d) => { return Math.min(d.innerRangeMin, d.outerRangeMin) })
    // var yMax = d3.max(data, (d) => { return d.max })
    var yMax = d3.max(data, (d) => { return Math.max(d.innerRangeMax, d.outerRangeMax) })
    var y = d3.scaleLinear()
      .domain([yMin, yMax])
      .rangeRound([height, 0])

    // console.log('SummaryTimeline.render()')
    // console.log('opacityScale: ' + this.props.opacityScale)
    // var avgMin = d3.min(data, (d) => { return d.avg })
    // var avgMax = d3.max(data, (d) => { return d.avg })
    //
    // var opacityScale = d3.scaleLinear()
    //   .domain([avgMin, avgMax])
    //   .range([0.20, 0.90])

    // console.log('bgColor: ' + this.props.bgColor)
    // var meanLine = d3.line()
    //   .curve(d3.curveStepAfter)
    //   .x((d) => { return x(d.date) })
    //   .y((d) => { return y(d.avg) })(data)
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
      .y0((d) => { return y(d.innerRangeMin) })
      .y1((d) => { return y(d.innerRangeMax) })(data)
    var extentRangeArea = d3.area()
      .curve(d3.curveStepAfter)
      .x((d) => { return x(d.date) })
      .y0((d) => { return y(d.outerRangeMin) })
      .y1((d) => { return y(d.outerRangeMax) })(data)

    let pathTransition = {func: (transition, props) => {
      transition
        .delay(0)
        .duration(500)
        .ease(setEase('linear'))
        .attr('d', props.d)
        .attr('fill', props.fill)
      return transition
    }}

    let { keyFunction, ...props } = this.props

    return (
      <TransitionGroup component='g'>
        {this.props.showRange2Area &&
          <SVGComponent Component='path'
            key='extentRange2'
            fill={this.props.range2FillColor}
            d={extentRangeArea}
            onUpdate={pathTransition}
          />
        }
        {this.props.showRange1Area &&
          <SVGComponent Component='path'
            key='extentRange1'
            fill={this.props.range1FillColor}
            d={stdevRangeArea}
            onUpdate={pathTransition}
          />
        }
        {this.props.data.map((d, i) => {
          let opacityValue = 1.0
          if (props.useOpacityScale && d.opacityValue !== undefined) {
            opacityValue = props.opacityScale(d.opacityValue)
          }
          return (
            <SVGComponent Component='circle' key={keyFunction(d, i)}
              data={d}
              index={i}
              onUpdate={{
                func: (transition, props) => {
                  transition
                    .delay(0)
                    .duration(500)
                    .ease(setEase('linear'))
                    .attr('r', props.r)
                    .attr('cx', props.cx)
                    .attr('cy', props.cy)
                    .style('fill-opacity', props.fillOpacity)
                  return transition
                }
              }}
              r={props.meanCircleRadius}
              cx={x(d.date)}
              cy={y(d.avg)}
              fillOpacity={opacityValue}
              fill={this.props.meanFillColor}
              stroke='none' />
          )
        })}
      </TransitionGroup>
    )
  }
}

// <SVGComponent Component='path'
//   key='mean'
//   fill='none'
//   stroke='darkgray'
//   strokeLinejoin='round'
//   strokeLinecap='round'
//   strokeWidth={1.5}
//   d={meanLine}
//   onUpdate={pathTransition}
// />

SummaryTimeline.defaultProps = {
  keyFunction: (d, i) => i,
  bgColor: 'cyan',
  range1FillColor: '#9ecae1',
  range2FillColor: 'c6dbef',
  // range2FillColor: 'orange',
  meanFillColor: 'black',
  meanCircleRadius: 1.0,
  useOpacityScale: true,
  showRange1Area: false,
  showRange2Area: true
}

SummaryTimeline.propTypes = {
  useOpacityScale: PropTypes.bool,
  showRange1Area: PropTypes.bool,
  showRange2Area: PropTypes.bool,
  bgColor: PropTypes.string,
  range1FillColor: PropTypes.string,
  range2FillColor: PropTypes.string,
  meanCircleRadius: PropTypes.number,
  meanFillColor: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  chartWidth: PropTypes.number,
  chartHeight: PropTypes.number,
  data: PropTypes.array,
  keyFunction: PropTypes.func,
  opacityScale: PropTypes.any
}

export default SummaryTimeline
