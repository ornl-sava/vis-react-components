import React, { PropTypes } from 'react'
import ReactDom from 'react-dom'
import Bar from './Bar'

class TextBar extends React.Component {
  _onMouseEnter () {
    if (this.props.tooltipData) {
      let thisNode = ReactDom.findDOMNode(this)
      this.props.onEnter(this.props.tooltipData, thisNode)
    }
  }
  _onMouseLeave () {
    if (this.props.tooltipData) {
      let thisNode = ReactDom.findDOMNode(this)
      this.props.onLeave(this.props.tooltipData, thisNode)
    }
  }
  _onClick () {
    // console.log('toolTip', this.props.tooltipData)
    this.props.onClick(this.props.tooltipData)
  }
  constructor (props) {
    super(props)
    this.onClick = this._onClick.bind(this)
    this.onEnter = this._onMouseEnter.bind(this)
    this.onLeave = this._onMouseLeave.bind(this)
  }
  setElem () {
    // let {chartWidth, chartHeight, ...props} = this.props
  }
  getTxtAlign () {
    let xPos = 0
    let align = this.props.textStyle.textAnchor
    if (align === 'middle') {
      xPos = this.props.width / 2
    } else if (align === 'end') {
      xPos = this.props.width
    }
    return xPos
  }
  componentWillUnmount () {
    this._onMouseLeave()
  }
  render () {
    let {className, ...props} = this.props
    return (
      <g>
        <Bar className={className + ' barTopic'} {...props} onClick={this.onClick} onEnter={this.onEnter} onLeave={this.onLeave} style={this.props.barStyle} />
        <text className={this.props.className + ' text'} x={this.props.x + 10 + this.getTxtAlign()} y={this.props.y + this.props.height / 2} style={this.props.textStyle} > {this.props.text} </text>)
      </g>
    )
  }
}

TextBar.defaultProps = {
  height: 0,
  width: 0,
  className: 'txtBar',
  onClick: () => null,
  tooltipData: {},
  x: 0,
  y: 0,
  font: 12,
  textAlign: 'left',
  textStyle: { textAnchor: 'start', fontSize: '12px' },
  text: ''
}

TextBar.propTypes = {
  className: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  tooltipData: PropTypes.object,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  font: PropTypes.number.isRequired,
  barStyle: PropTypes.object,
  textStyle: PropTypes.object,
  textAlign: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
}

// Only required for REST calls
TextBar.contextTypes = {
  filterField: PropTypes.string,
  filterType: PropTypes.string,
  params: PropTypes.object,
  updateFilter: PropTypes.func
}

export default TextBar
