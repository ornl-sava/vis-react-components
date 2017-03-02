import React, { PropTypes } from 'react'
import ReactTransitionGroup from 'react-addons-transition-group'

import * as d3 from 'd3'

import { setEase } from './util/d3'
import SVGComponent from './SVGComponent'

class HorizonGraph extends React.Component {
/*  constructor (props) {
    super(props)
  }
*/
  render () {
    let data = this.props.data
    let numBands = this.props.numBands
    let access = this.props.accessor

    let w = this.props.chartWidth ? this.props.chartWidth : this.props.width
    let h = this.props.chartHeight ? this.props.chartHeight : this.props.height

    var ymax = -Infinity

    data.map((d) => {
      let val = access(d)
      if (Math.abs(val) > ymax) {
        ymax = Math.abs(val)
      }
    })

    let xScale = d3.scaleLinear().domain([0, data.length - 1]).range([0, w])
    let yScale = d3.scaleLinear().domain([0, ymax]).range([0, h * numBands])

    let points = d3.area()
      .curve(d3.curveLinear)
      .x((d, i) => {
        return xScale(i)
      })
      .y0(h * numBands)
      .y1((d) => {
        return h * numBands - yScale(access(d))
      })(data)

    let levels = d3.range(-1, -numBands - 1, -1).concat(d3.range(1, numBands + 1))

    let horizonTransform = this.props.mode === 'offset'
      ? (d) => { return 'translate(0,' + (d + (d < 0) - numBands) * h + ')' }
      : (d) => { return (d < 0 ? 'scale(1,-1)' : '') + 'translate(0,' + (d - numBands) * h + ')' }

    let colors = this.props.colors
    var color = d3.scaleLinear()
      .domain(numBands > 1 ? [-numBands, -1, 1, numBands] : [-1, 0, 0, 1])
      .range(numBands > 1 ? colors : [colors[1], colors[0], colors[3], colors[2]])

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
        <SVGComponent Component='svg'
          x={'0px'}
          y={'0px'}
          width={w + 'px'}
          height={h + 'px'}
        >
          <SVGComponent Component='rect'
            x={'0px'}
            y={'0px'}
            width={w + 'px'}
            height={h + 'px'}
            fill={this.props.bgColor}
            />
          {
            levels.map((d) => {
              return (
                <SVGComponent Component='path'
                  key={'' + d}
                  d={points}
                  transform={horizonTransform(d)}
                  fill={color(d)}
                  onUpdate={pathTransition}
                />
              )
            })
          }
        </SVGComponent>
      </ReactTransitionGroup>
    )
  }
}

HorizonGraph.defaultProps = {
  mode: 'offset',
  numBands: 2,
  data: [],
  colors: ['#bdd7e7', '#08519c', '#006d2c', '#bae4b3'],
  bgColor: 'white',
  accessor: (d) => { return d }
}

HorizonGraph.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  chartWidth: PropTypes.number,
  chartHeight: PropTypes.number,
  numBands: PropTypes.number,
  mode: PropTypes.string,
  data: PropTypes.array,
  colors: PropTypes.array,
  bgColor: PropTypes.string,
  accessor: PropTypes.func
}

export default HorizonGraph

