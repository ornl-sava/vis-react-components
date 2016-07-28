import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import { brushX, select, event as d3Event } from 'd3'

class BrushX extends React.Component {
  constructor (props) {
    super(props)
    this.selection = null
    this.state = {
      selection: this.selection
    }
  }
  _start () {
  }
  _brush () {
    this.applySelection()
  }
  _end () {
    this.setState({selection: this.selection})
  }
  // Normally we'd append a path to the handle <g>
  // but as of D3 v4 the handles is now a <rect>
  setBrushDimensions () {
    let h = this.props.height / 5
    let y = this.props.height / 2 - (h / 2)
    select(findDOMNode(this)).selectAll('.handle')
      .style('width', 7)
      .style('height', h)
      .style('y', y)
      .style('rx', '6')
      .style('ry', '6')
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.props.width !== prevProps.width || this.props.height !== prevProps.height) {
      let thisNode = findDOMNode(this)
      let selection = select(thisNode)
      this.brush = brushX()
        .extent([[0, 0], [this.props.width, this.props.height]])
        .on('start', this._start.bind(this))
        .on('brush', this._brush.bind(this))
        .on('end', this._end.bind(this))
      selection.call(this.brush)
      this.setBrushDimensions()
    }
  }
  applySelection () {
    if (d3Event.sourceEvent.type === 'brush') return
    let domain = this.calculateSelection(d3Event.selection.map(this.props.scale.invert))
    let thisNode = findDOMNode(this)
    select(thisNode)
        .call(this.brush.move, domain.map(this.props.scale))
    this.selection = domain
  }
  calculateSelection (domain) {
    let { interval, scale } = this.props
    let dateScale = /time/.test(scale.type)
    if (dateScale) {
      domain = domain.map((val) => { return val.getTime() })
    }
    let nIntervals = Math.abs(scale.domain()[1] - scale.domain()[0]) / interval
    let out = domain.slice()
    for (let i = 0; i < nIntervals; i++) {
      let xVal = dateScale ? scale.domain()[0].getTime() : scale.domain()[0]
      xVal += interval * i
      if (domain[0] >= xVal && domain[0] < xVal + interval) {
        out[0] = xVal
      }
      if (domain[1] > xVal && domain[1] < xVal + interval) {
        out[1] = xVal
      }
    }
    if (out[0] === out[1]) {
      out[1] += interval
    }
    return dateScale ? [new Date(out[0]), new Date(out[1])] : out
  }
  render () {
    // console.log('brush selection is : ' + this.state.selection)
    return (
      <g className='brush'>{this.props.children}</g>
    )
  }
}

BrushX.defaultProps = {
}

BrushX.propTypes = {
  children: PropTypes.node,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  interval: PropTypes.number.isRequired,
  scale: PropTypes.func.isRequired
}

export default BrushX
