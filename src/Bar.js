import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import { select } from 'd3'

class Bar extends React.Component {
  constructor (props) {
    super(props)
    this.onClick = this._onClick.bind(this)
    this.onMouseEnter = this._onMouseEnter.bind(this)
    this.onMouseLeave = this._onMouseLeave.bind(this)
    this.onMouseDown = this._onMouseDown.bind(this)
  }
  componentWillUnmount () {
    this._onMouseLeave()
  }
  _onClick (event) {
    if (this.props.tooltipData) {
      this.props.onClick(event, this.props.tooltipData)
    }
  }
  _onMouseDown (event) {
    console.log('mouse down!')
    if (this.props.tooltipData) {
      let thisNode = findDOMNode(this)
      let selection = select(thisNode)
      selection.attr('pointer-events', 'none')
      // this.props.onEnter(event, this.props.tooltipData)
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
  render () {
    let { className, data, name, width, height, y, x, style } = this.props
    className = className ? 'histogram-bar ' + className : 'histogram-bar'
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
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onMouseDown={this.onMouseDown}
        style={style}
     />)
  }
}

Bar.defaultProps = {
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
