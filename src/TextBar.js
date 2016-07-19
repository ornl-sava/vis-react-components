import React, { PropTypes } from 'react'
import ReactDom from 'react-dom'
// import Bar from './Bar'

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
  _onDoubleClick () {
    // not used
    this.props.onDoubleClick(this.props.tooltipData)
  }
  constructor (props) {
    super(props)
    this.onClick = this._onClick.bind(this)
    this.onDoubleClick = this._onDoubleClick.bind(this)
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
      xPos = this.props.width - 10
    } else {
      xPos = 10
    }
    return xPos
  }
  shouldComponentUpdate (nextProps, nextState) {
    // if I put the styleChange check back in, things bog down....
    let styleChange = nextProps.barStyle !== this.props.barStyle
    let selected = nextProps.sel
    /* if (this.props.text.indexOf('IC') >= 0) {
      console.log('next', nextProps.barStyle)
      console.log('this', this.props.barStyle)
      console.log('stylC', styleChange)
    }*/
    // if (selected) { console.log('updated') }
    return styleChange || selected
    // return selected
  }
  componentWillUnmount () {
    this._onMouseLeave()
  }
  makeRect () {
    let rectData = {
      className: this.props.className + ' barTopic',
      dataName: {name},
      width: this.props.width,
      height: this.props.height,
      x: this.props.x,
      y: this.props.y,
      style: this.props.barStyle
    }
    return rectData
  }
  // <Bar className={className + ' barTopic'} {...props} onClick={this.onClick} onDoubleClick={this.onDoubleClick} onEnter={this.onEnter} onLeave={this.onLeave} style={this.props.barStyle} />
  render () {
    let {style, ...rProps} = this.makeRect()
    // console.log('txtBar')
    // console.log('txtBar', this.props.text, this.props.barStyle)
    let {className, ...props} = this.props
    return (
      <g>
        <text className={className + ' text'} x={this.props.x + this.getTxtAlign()} y={this.props.y + this.props.height / 2} style={this.props.textStyle} > {props.text} </text>
        <rect
          {...rProps}
          style={style}
        />
        <rect {...rProps} style={{fill: 'black', fillOpacity: 0}} onClick={this.onClick} onMouseEnter={this.onEnter} onMouseLeave={this.onLeave} />
      </g>
    )
  }
}

TextBar.defaultProps = {
  height: 0,
  width: 0,
  className: 'txtBar',
  onClick: () => null,
  onDoubleClick: () => null,
  onEnter: () => null,
  onLeave: () => null,
  tooltipData: {},
  x: 0,
  y: 0,
  font: 12,
  textAlign: 'left',
  textStyle: { textAnchor: 'start', fontSize: '12px' },
  text: '',
  sel: false
}

TextBar.propTypes = {
  className: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  tooltipData: PropTypes.object,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  font: PropTypes.number.isRequired,
  barStyle: PropTypes.object,
  textStyle: PropTypes.object,
  textAlign: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  sel: PropTypes.bool.isRequired
}

// Only required for REST calls
TextBar.contextTypes = {
  filterField: PropTypes.string,
  filterString: PropTypes.string,
  filterType: PropTypes.string,
  updateFilter: PropTypes.func
}

export default TextBar
