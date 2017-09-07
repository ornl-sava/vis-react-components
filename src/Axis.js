import React from 'react'
import PropTypes from 'prop-types'
import ReactDom from 'react-dom'
import { select } from 'd3'

import { setAxis, isOrdinalScale } from './util/d3'
// Truncate labels based on maximum allowable characters, where
// characters should be estimated at 8-10 pixels per character.
const truncateLabel = (d, maxChars) => {
  if (d == null) {
    console.warn('No label to truncate, check and makes sure the container has the correct accessor.key specified')
    return ''
  }
  let replacementString = '...'
  if (d.length > maxChars + replacementString.length) {
    return d.substring(0, maxChars) + '...'
  }
  return d
}

class Axis extends React.Component {
  constructor (props) {
    super(props)
    this.state = { range: 0, ticks: 0 }

    this.resizeAxis = this.resizeAxis.bind(this)

    this.axis = setAxis(props.orient)
    this.axis.scale(props.scale)
  }

  componentDidMount () {
    this.resizeAxis()
  }

  componentDidUpdate () {
    this.resizeAxis()
  }

  // Re-calculate postions of the chart based on the currently rendered position
  resizeAxis () {
    // let props = this.props
    let thisNode = ReactDom.findDOMNode(this)
    let parentNode = thisNode.parentNode
    let selector = '.' + this.props.className.replace(/ /g, '.')
    let selection = select(parentNode).select(selector)

    let tickCount = 0
    let tickValues = this.props.tickValues
    let tickPreformatValues = []
    let tickFormatter = null

    if (this.props.scale.domain().length > 0) {
      // Use custom tick count if it exist
      if (this.props.tickCount) {
        tickCount = this.props.tickCount
      } else {
        tickCount = this.props.type === 'y' ? 3 : this.props.scale.domain().length
      }

      // Set tickFormatter to be used
      if (isOrdinalScale(this.props.scale.type)) {
        let maxWidth = 0
        let fontSize = 12

        if (this.props.orient === 'top' || this.props.orient === 'bottom') {
          let binWidth = Math.floor((this.props.scale.step()))
          maxWidth = Math.floor(binWidth / fontSize)
        } else {
          if (this.props.orient === 'left') {
            maxWidth = this.props.margin.left
          } else {
            maxWidth = this.props.margin.right
          }
        }

        tickFormatter = (d) => {
          tickPreformatValues.push(d)
          return truncateLabel(d, maxWidth)
        }
      } else if (this.props.tickFormat) {
        tickFormatter = (d, i) => {
          tickPreformatValues.push(d)
          return this.props.tickFormat(d, i)
        }
      } else {
        tickFormatter = (d, i) => {
          // Default d3 method of formatting
          // Allows obtaining the real value for styling before it's formatted
          tickPreformatValues.push(d)
          let tick = (typeof this.props.scale.tickFormat === 'function')
            ? this.props.scale.tickFormat()(d)
            : d
          return tick
        }
      }
    }

    // Setup axis
    this.axis
      .tickFormat(tickFormatter)
      .tickValues(tickValues)
      .ticks(tickCount)

    // Create and animate axis
    selection
      .transition().duration(this.props.animationDuration)
      .call(this.axis)

    // Add styling to axis
    if (this.props.tickStyle) {
      let tickStyle = this.props.tickStyle
      selection.selectAll('.tick text')
        .each(function (d, i) {
          let tick = select(this)
          tickStyle(tick, tickPreformatValues[i], i)
        })
    }

    if (this.props.onLabelClick) {
      selection.selectAll('.tick').style('cursor', 'pointer')
      selection.selectAll('.tick').on('click', (d) => {
        this.props.onLabelClick(d)
      })
    }
  }

  render () {
    let transform = ''
    if (this.props.orient === 'bottom') {
      transform = 'translate(0,' + this.props.height + ')'
    } else if (this.props.orient === 'right') {
      transform = 'translate(' + this.props.width + ',0)'
    }

    return (
      <g className={this.props.className} transform={transform}>
        {this.props.label != null
          ? <text className='label'>{this.props.label}</text>
          : undefined
        }
      </g>
    )
  }
}

Axis.defaultProps = {
  type: 'x',
  orient: 'left',
  tickValues: null,
  tickCount: null,
  tickFormat: null,
  tickStyle: null,
  animationDuration: 0,
  label: null
}

Axis.propTypes = {
  chartHeight: PropTypes.number,
  chartWidth: PropTypes.number,
  className: PropTypes.string,
  orient: PropTypes.string.isRequired,
  margin: PropTypes.object,
  type: PropTypes.string.isRequired,
  animationDuration: PropTypes.number,
  tickStyle: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool
  ]),
  tickValues: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool
  ]),
  tickCount: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool
  ]),
  tickFormat: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool
  ]),
  label: PropTypes.string,
  scale: PropTypes.any,
  onLabelClick: PropTypes.func
}
export default Axis
