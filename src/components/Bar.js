import React, { PropTypes } from 'react'
import ReactDom from 'react-dom'

class Bar extends React.Component {
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
  constructor (props) {
    super(props)
    this.onClick = props.onClick.bind(this)
    this.onMouseEnter = this._onMouseEnter.bind(this)
    this.onMouseLeave = this._onMouseLeave.bind(this)
  }
  componentWillUnmount () {
    this._onMouseLeave()
  }
  render () {
    let { className, data, ...other } = this.props
    className = 'bar ' + className
    return (
      <rect
        className={className}
        data-x={data.x}
        data-y={data.y}
        {...other}
        onClick={this.onClick}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
     />)
  }
}

Bar.defaultProps = {
  height: 0,
  width: 0,
  className: 'bar',
  onClick: () => null,
  tooltipData: null,
  y: 0
}

Bar.propTypes = {
  className: PropTypes.string.isRequired,
  data: PropTypes.object,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  tooltipData: PropTypes.object,
  y: PropTypes.number.isRequired
}

// Only required for REST calls
Bar.contextTypes = {
  filterField: PropTypes.string,
  filterType: PropTypes.string,
  params: PropTypes.object,
  updateFilter: PropTypes.func
}

export default Bar
