import React, { PropTypes } from 'react'
import { select } from 'd3'

class Bar extends React.Component {
  constructor (props) {
    super(props)
    this.onClick = this._onClick.bind(this)
    this.onMouseEnter = this._onMouseEnter.bind(this)
    this.onMouseDown = this._onMouseDown.bind(this)
    this.onMouseLeave = this._onMouseLeave.bind(this)
  }
  componentWillUnmount () {
    if (this._onMouseLeave) {
      this._onMouseLeave()
    }
  }
  _onClick (event) {
    if (this.props.brushed) return
    if (this.props.tooltipData && this.props.data.y !== 0) {
      this.props.onClick(event, this.props.tooltipData)
    }
  }
  _onMouseEnter (event) {
    if (this.props.tooltipData) {
      this.props.onEnter(event, this.props.tooltipData)
    }
  }
  _onMouseLeave (event) {
    if (this.props.tooltipData) {
      this.props.onLeave(event, this.props.tooltipData)
    }
  }
  _onMouseDown (event) {
    if (this.props.tooltipData) {
      // console.log('Bar :: mousedown')
      let newEvent = new MouseEvent('mousedown', event)
      if (this.props.brushed) {
        let target = select('.selection')
        let leftMargin = select('.overlay').node().getBoundingClientRect().left
        let selectionWidth = parseFloat(target.attr('width'))
        let min = parseFloat(target.attr('x')) + leftMargin
        let max = parseFloat(target.attr('x')) + selectionWidth + leftMargin
        if (target.style('display') === 'none' ||
        event.pageX < min || event.pageX > max) {
          target = select('.overlay').node()
        } else {
          target = target.node()
        }
        target.dispatchEvent(newEvent)
      }
    }
  }
  render () {
    let { className, data, name, width, height, y, x, style } = this.props
    className = className ? 'histogram-bar ' + className : 'histogram-bar'
    if (this.props.brushed) {
      className += ' brushed'
    }
    return (
      <rect
        className={className}
        data-name={name}
        data-x={data.x}
        data-y={data.y}
        width={width}
        height={height}
        x={x}
        y={y}
        onClick={this.onClick}
        onMouseDown={this.onMouseDown}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        style={style}
     />)
  }
}

Bar.defaultProps = {
  brushed: false,
  height: 0,
  name: '',
  width: 0,
  onClick: () => null,
  tooltipData: null,
  y: 0,
  x: 0,
  style: {}
}

Bar.propTypes = {
  brushed: PropTypes.bool.isRequired,
  className: PropTypes.string,
  data: PropTypes.object,
  height: PropTypes.number.isRequired,
  name: PropTypes.string,
  width: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  tooltipData: PropTypes.object,
  y: PropTypes.number.isRequired,
  x: PropTypes.number,
  style: PropTypes.object
}

export default Bar
