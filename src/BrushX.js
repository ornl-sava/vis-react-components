import React, { PropTypes } from 'react'
// import { findDOMNode } from 'react-dom'
import { brushX, select, event as d3Event } from 'd3'
class BrushX extends React.Component {
  _start () {
  }
  _brush () {
    this.applySelection()
  }
  _end () {
  }
  componentDidMount () {
    select('body')
      .on('keydown', () => {
        console.log('what')
        if (d3Event.keyCode === 16) {
          document.body.style.cursor = 'crosshair'
          select(this.refs.brush).select('.overlay')
            .attr('pointer-events', 'all')
        }
      })
      .on('keyup', () => {
        if (d3Event.keyCode === 16) {
          document.body.style.cursor = 'default'
          select(this.refs.brush).select('.overlay')
            .attr('pointer-events', 'none')
        }
      })
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.props.width !== prevProps.width || this.props.height !== prevProps.height) {
      this.count = 0
      let thisNode = this.refs.brush
      let selection = select(thisNode)
      this.brush = brushX()
        .extent([[0, 0], [this.props.width, this.props.height]])
        .on('start', this._start.bind(this))
        .on('brush', this._brush.bind(this))
        .on('end', this._end.bind(this))
      selection.call(this.brush)
      selection.select('.overlay')
        .attr('pointer-events', 'none')
    }
  }
  applySelection () {
    if (d3Event.sourceEvent.type === 'brush') return
    let domain = this.calculateSelection(d3Event.selection.map(this.props.scale.invert))
    let thisNode = this.refs.brush
    select(thisNode)
        .call(this.brush.move, domain.map(this.props.scale))
    select(thisNode).select('.overlay')
      .attr('pointer-events', 'none')
  }
  calculateSelection (domain, expand) {
    let dateScale = /time/.test(this.props.scale.type)
    if (dateScale) {
      domain[0] = domain[0].getTime()
      domain[1] = domain[1].getTime()
    }
    let interval = this.props.children[1].props.children[0].props.data.x - this.props.children[0].props.children[0].props.data.x
    let range = this.props.children.reduce((prev, current) => {
      let xVal = dateScale ? current.props.children[0].props.data.x.getTime() : current.props.children[0].props.data.x
      let begin = prev[0] >= xVal && prev[0] < xVal + interval ? xVal : prev[0]
      let end = prev[1] > xVal && prev[1] < xVal + interval ? xVal : prev[1]
      if (expand || begin === end) {
        end += interval
      }
      return [new Date(begin), new Date(end)]
    }, domain)
    return range
  }
  render () {
    return (
      <g>
        {this.props.children}
        <g ref='brush' className='brush' />
      </g>
    )
  }
}

BrushX.defaultProps = {
}

BrushX.propTypes = {
  children: PropTypes.node,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  scale: PropTypes.func.isRequired
}

export default BrushX
