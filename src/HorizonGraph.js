import React, { PropTypes } from 'react'
import ReactTransitionGroup from 'react-addons-transition-group'

import * as d3 from 'd3'

import { setEase } from './util/d3'
import SVGComponent from './SVGComponent'

class HorizonGraph extends React.Component {
  constructor (props) {
    super(props)

    this.onMouseMove = this.onMouseMove.bind(this)
    this.binarySearch = this.binarySearch.bind(this)

    this.xScale = null
  }

  onMouseMove (event) {
    let bounds = event.target.getBoundingClientRect()
    let x = event.clientX - bounds.left
    let target = this.xScale.invert(x)
    let index = this.binarySearch(target, 0, this.props.data.length - 1)
    if (index !== this.props.selectedIndex) {
      this.props.handleSelection(index)
    }
  }

  binarySearch (target, left, right) {
    let xAccess = this.props.xAccessor
    let data = this.props.data

    let mid = Math.floor((left + right) / 2)
    let min = xAccess(data[left], left)
    let max = xAccess(data[right], right)
    let lowDist = target - min
    let highDist = max - target
    let goLeft = lowDist <= highDist

    if (left === mid) {
      return goLeft ? left : right
    } else {
      return goLeft ? this.binarySearch(target, left, mid) : this.binarySearch(target, mid, right)
    }
  }

  render () {
    let data = this.props.data
    let numBands = this.props.numBands
    let xAccess = this.props.xAccessor
    let yAccess = this.props.yAccessor

    let w = this.props.chartWidth ? this.props.chartWidth : this.props.width
    let h = this.props.chartHeight ? this.props.chartHeight : this.props.height

    var xmin = Infinity
    var xmax = -Infinity
    var ymax = -Infinity

    let mid = this.props.mid ? this.props.mid : 0

    data.map((d, i) => {
      let x = xAccess(d, i)
      let y = yAccess(d) - mid
      if (x < xmin) {
        xmin = x
      }
      if (x > xmax) {
        xmax = x
      }
      if (Math.abs(y) > ymax) {
        ymax = Math.abs(y)
      }
    })

    if (this.props.domainHeight) {
      ymax = this.props.domainHeight
    }

    let xScale = d3.scaleLinear().domain([xmin, xmax]).range([0, w])
    this.xScale = xScale
    let yScale = d3.scaleLinear().domain([0, ymax]).range([0, h * numBands])

    let points = d3.area()
      .curve(d3.curveLinear)
      .x((d, i) => {
        return xScale(xAccess(d, i))
      })
      .y0(h * numBands)
      .y1((d) => {
        return h * numBands - yScale(yAccess(d) - mid)
      })(data)

    let levels = d3.range(-1, -numBands - 1, -1).concat(d3.range(1, numBands + 1))

    let horizonTransform = this.props.mode === 'offset'
      ? (d) => { return 'translate(0,' + (d + (d < 0) - numBands) * h + ')' }
      : (d) => { return (d < 0 ? 'scale(1,-1)' : '') + 'translate(0,' + (d - numBands) * h + ')' }

    let colors = this.props.colors
    var color = d3.scaleLinear()
      .domain(numBands > 1 ? [-numBands, -1, 1, numBands] : [-1, 0, 0, 1])
      .range(numBands > 1 ? colors : [colors[1], colors[0], colors[3], colors[2]])

    var selectionX = null
    var labelX = null
    var labelText = null
    let si = this.props.selectedIndex
    if ((si || si === 0) && si < data.length) {
      selectionX = xScale(xAccess(data[si], si))
      labelText = this.props.labelFormat(data[si])
      let labelWidth = 7 * labelText.length
      if (w - selectionX < labelWidth + 5) {
        labelX = w - labelWidth - 5
      } else {
        labelX = selectionX + 5
      }
    }

    let pathTransition = {func: (transition, props) => {
      transition
        .delay(0)
        .duration(500)
        .ease(setEase('linear'))
        .attr('d', props.d)
        .attr('fill', props.fill)
      return transition
    }}

    let boxTransition = {func: (transition, props) => {
      transition
        .delay(0)
        .duration(500)
        .ease(setEase('linear'))
        .attr('x', props.x)
        .attr('y', props.y)
        .attr('width', props.width)
        .attr('height', props.height)
        .attr('fill', props.fill)
      return transition
    }}

    let lineTransition = {func: (transition, props) => {
      transition
        .delay(0)
        .duration(0)
        .ease(setEase('linear'))
        .attr('x1', props.x1)
        .attr('y1', props.y1)
        .attr('x2', props.x2)
        .attr('y2', props.y2)
      return transition
    }}

    let textTransition = {func: (transition, props) => {
      transition
        .delay(0)
        .duration(0)
        .ease(setEase('linear'))
        .attr('x', props.x)
        .attr('y', props.y)
      return transition
    }}

    return (
      <ReactTransitionGroup component='g'>
        <SVGComponent Component='svg'
          x={'0px'}
          y={'0px'}
          width={w + 'px'}
          height={h + 'px'}
          key='horizonSvg'
          onUpdate={boxTransition}
          onMouseMove={this.onMouseMove}
        >
          <SVGComponent Component='rect'
            x={'0px'}
            y={'0px'}
            width={w + 'px'}
            height={h + 'px'}
            fill={this.props.bgColor}
            key='horizonBackground'
            onUpdate={boxTransition}
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
          {selectionX !== null &&
            <SVGComponent Component='g'>
              <SVGComponent Component='line'
                key='selectionLine'
                x1={selectionX}
                y1={0}
                x2={selectionX}
                y2={h}
                stroke='black'
                pointerEvents='none'
                onUpdate={lineTransition}
              />
              <SVGComponent Component='text'
                key='selectionLabel'
                x={labelX}
                y={20}
                pointerEvents='none'
                onUpdate={textTransition}
              >{labelText}</SVGComponent>
            </SVGComponent>
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
  xAccessor: (d, i) => { return i },
  yAccessor: (d) => { return d },
  labelFormat: (d) => { return '' + d }
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
  xAccessor: PropTypes.func,
  yAccessor: PropTypes.func,
  mid: PropTypes.number,
  domainHeight: PropTypes.number,
  selectedIndex: PropTypes.number,
  handleSelection: PropTypes.func,
  labelFormat: PropTypes.func
}

export default HorizonGraph

