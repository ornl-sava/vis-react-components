import React, { PropTypes } from 'react'
import ReactDom from 'react-dom'
import * as d3 from 'd3'

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
    this.state = {range: 0, ticks: 0}

    this.setAxis = this.setAxis.bind(this)
    this.resizeAxis = this.resizeAxis.bind(this)

    this.axis = null
    this.setAxis(this.props)
  }
  componentDidMount () {
    this.resizeAxis()
  }
  componentDidUpdate () {
    // console.log(this.props.type + ' did update')
    this.resizeAxis()
  }
  componentWillReceiveProps (nextProps) {
    // console.log(this.props.type + ' will receive props')
    let range = nextProps.scale.range()[1] - nextProps.scale.range()[0]
    this.setState({range})
  }
  setAxis (props) {
    if (props.orient === 'left') {
      this.axis = d3.axisLeft()
    } else if (props.orient === 'bottom') {
      this.axis = d3.axisBottom()
    } else if (props.orient === 'top') {
      this.axis = d3.axisTop()
    } else if (props.orient === 'right') {
      this.axis = d3.axisRight()
    }
    this.axis.scale(props.scale)
  }
  // Re-calculate postions of the chart based on the currently rendered position
  // Also updates the axes based on the
  resizeAxis () {
    let props = this.props
    let thisNode = ReactDom.findDOMNode(this)
    let parentNode = thisNode.parentNode
    let selector = '.' + props.className.replace(/ /g, '.')
    let selection = d3.select(parentNode).select(selector)

    let tickCount = 0
    let tickValues = props.tickValues

    if (props.data.length > 0 && props.scale.domain().length > 0 && props.scale.range().length > 0) {
      // Use custom tick count if it exist
      if (props.tickCount) {
        tickCount = props.tickCount
      } else {
        tickCount = props.type === 'y' ? 3 : props.scale.domain().length
      }

      // If scale type is ordinal truncate labels
      if (/ordinal+/.test(props.scale.type)) {
        let maxWidth = 0
        let fontSize = 12
        if (props.orient === 'top' || props.orient === 'bottom') {
          let binWidth = Math.floor((props.scale.range()[tickCount - 1] / tickCount))
          maxWidth = Math.floor(binWidth / fontSize)
        } else {
          if (props.orient === 'left') {
            maxWidth = props.margin.left
          } else {
            maxWidth = props.margin.right
          }
        }
        this.axis.tickFormat((d) => {
          return truncateLabel(d, maxWidth)
        })
      }

      // Use custom tickFormatter if it exist
      if (props.tickFormat) {
        this.axis.tickFormat((d, i) => {
          return props.tickFormat(d, i)
        })
      }
    }

    this.setAxis(props)
    this.axis
      .tickValues(tickValues)
      .ticks(tickCount)
    selection.call(this.axis)
  }

  render () {
    let props = this.props
    // Need to handle top and left orientations, but this works for now
    let transform = ''
    if (props.orient === 'bottom') {
      transform = 'translate(0,' + props.chartHeight + ')'
    } else if (props.orient === 'right') {
      transform = 'translate(' + props.chartWidth + ',0)'
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
  tickValues: null,
  tickCount: false,
  tickFormat: false,
  label: ''
}

Axis.propTypes = {
  orient: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  tickValues: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool
  ]),
  tickCount: React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.bool
  ]),
  tickFormat: React.PropTypes.oneOfType([
    React.PropTypes.func,
    React.PropTypes.bool
  ]),
  label: PropTypes.string,
  scale: PropTypes.any
}
export default Axis
