import React, { PropTypes } from 'react'
import ReactDom from 'react-dom'
import d3 from 'd3'

// Truncate labels based on maximum allowable characters, where
  // characters should be estimated at 8-10 pixels per character.
const truncateLabel = (d, maxChars) => {
  let replacementString = '...'
  if (d.length > maxChars + replacementString.length) {
    return d.substring(0, maxChars) + '...'
  }
  return d
}
class Axis extends React.Component {
  constructor (props) {
    super(props)
    let scaleType = 'linear'
    if (typeof props.scale.rangePoints === 'function') {
      scaleType = 'ordinal'
    }
    this.state = {range: 0, ticks: 0, scaleType}
    this.axis = d3.svg.axis()
      .scale(props.scale)
      .orient(props.orient)
      .ticks(0)
  }
  componentDidMount () {
    this.resizeAxis(this.props)
  }
  componentDidUpdate () {
    // console.log(this.props.type + ' did update')
    this.resizeAxis(this.props)
  }
  componentWillReceiveProps (nextProps) {
    // console.log(this.props.type + ' will receive props')
    let range = nextProps.scale.range()[1] - nextProps.scale.range()[0]
    this.setState({range})
  }
  // Re-calculate postions of the chart based on the currently rendered position
  // Also updates the axes based on the
  resizeAxis (props) {
    let thisNode = ReactDom.findDOMNode(this)
    let parentNode = thisNode.parentNode
    let selector = '.' + props.className.replace(/ /g, '.')
    let selection = d3.select(parentNode).select(selector)
    let tickCount = 0
    let tickValues = []

    if (props.data.length > 0) {
      tickCount = props.type === 'y' ? 3 : props.scale.domain().length
      tickValues = props.type === 'y' ? null : props.scale.domain()
      if (this.state.scaleType === 'ordinal') {
        let binWidth = Math.floor((props.scale.range()[tickCount - 1] / tickCount))
        let maxWidth = Math.floor(binWidth / 8)
        this.axis.tickFormat((d) => {
          return truncateLabel(d, maxWidth)
        })
      }
    }
    this.axis.scale(props.scale)
      .orient(props.orient)
      .tickValues(tickValues)
      .ticks(tickCount)
    selection.call(this.axis)
  }

  render () {
    let props = this.props
    // Need to handle top and left orientations, but this works for now
    let transform = ''
    if (props.type === 'x' && props.orient === 'bottom') {
      transform = 'translate(0,' + props.chartHeight + ')'
    }
    if (props.label) {
      return (
        <g className={props.className} transform={transform}>
          <text className='label'>{props.label}</text>
        </g>
      )
    } else {
      return <g className={props.className} transform={transform}></g>
    }
  }
}

Axis.defaultProps = {
  type: 'x',
  orient: 'left',
  dx: '',
  dy: '',
  label: '',
  xPos: 6,
  yPos: 200
}

Axis.propTypes = {
  orient: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  dx: PropTypes.string,
  dy: PropTypes.string,
  label: PropTypes.string,
  scale: PropTypes.any
}
export default Axis
