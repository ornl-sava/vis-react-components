import React, { PropTypes } from 'react'
import d3 from 'd3'

class Scatterplot extends React.Component {
  constructor (props) {
    super(props)

    this.onClick = this.onClick.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.renderLoadAnimation = this.renderLoadAnimation.bind(this)
    this.renderScatterplot = this.renderScatterplot.bind(this)

    this.updateDomain(props, this.state)
  }

  componentWillReceiveProps (nextProps) {
    this.updateDomain(nextProps, this.state)
  }

  updateDomain (props, state) {
    if (props.data.length > 0) {
      let xDomain = props.xDomain
      if (xDomain.length === 0) {
        if (/ordinal/.test(props.xScale.type)) {
          xDomain = props.data.map((d) => d[props.xAccessor])
        } else {
          xDomain = d3.extent(props.data, (d) => d[props.xAccessor])
        }
      }

      let yDomain = props.yDomain
      if (yDomain.length === 0) {
        if (/ordinal/.test(props.yScale.type)) {
          yDomain = props.data.map((d) => d[props.yAccessor])
        } else {
          yDomain = d3.extent(props.data, (d) => d[props.yAccessor])
        }
      }

      this.props.xScale.domain(xDomain)
      this.props.yScale.domain(yDomain)
    }
  }

  onClick (event) {
    this.props.onClick(event)
  }

  onMouseEnter (event) {
    let node = event.target
    this.props.onEnter(this.tooltipData(node), node)
  }

  onMouseLeave (event) {
    let node = event.target
    this.props.onLeave(this.tooltipData(node), node)
  }

  tooltipData (node) {
    let key = node.getAttribute('data-key')
    let value = node.getAttribute('data-value')
    return {
      key,
      value
    }
  }

  renderScatterplot () {
    let props = this.props
    return (
      <g className={props.className}>
        {this.props.data.map((d, i) => {
          let circleProps = {
            'data-key': d[props.xAccessor],
            'data-value': d[props.yAccessor],
            'r': props.radius,
            'cx': props.xScale(d[props.xAccessor]),
            'cy': props.yScale(d[props.yAccessor]),
            'onMouseEnter': this.onMouseEnter,
            'onMouseLeave': this.onMouseLeave,
            'onClick': this.onClick
          }
          return (
            <circle key={i} {...circleProps} />
          )
        })}
      </g>
    )
  }

  renderLoadAnimation () {
    let {chartWidth, chartHeight, ...props} = this.props
    let xPos = Math.floor(chartWidth / 2)
    let yPos = Math.floor(chartHeight / 2)
    let messageText = 'Loading data...'
    if (!props.loading) {
      if (props.status === 'Failed to fetch') {
        messageText = 'Can\'t connect to API URL'
      } else if (props.status !== 'OK') {
        messageText = 'Error retrieving data: ' + props.status
      } else {
        messageText = 'No data returned!'
      }
    }
    return (
      <g className='loading-message'>
        <text x={xPos} y={yPos}>{messageText}</text>
      </g>
    )
  }

  render () {
    let renderEl = null
    renderEl = this.renderLoadAnimation()
    if (this.props.data.length > 0 && this.props.chartWidth !== 0) {
      renderEl = this.renderScatterplot()
    }
    return renderEl
  }
}

Scatterplot.defaultProps = {
  chartHeight: 0,
  chartWidth: 0,
  className: 'scatterplot',
  xAccessor: 'x',
  yAccessor: 'y',
  xDomain: [],
  yDomain: [],
  radius: 5,
  data: [],
  loading: false,
  status: '',
  onClick: () => {},
  onEnter: () => {},
  onLeave: () => {}
}

Scatterplot.propTypes = {
  chartHeight: PropTypes.number.isRequired,
  chartWidth: PropTypes.number.isRequired,
  className: PropTypes.string,
  radius: PropTypes.number,
  xDomain: PropTypes.array,
  yDomain: PropTypes.array,
  xAccessor: PropTypes.string,
  yAccessor: PropTypes.string,
  xScale: PropTypes.any,
  yScale: PropTypes.any,
  data: PropTypes.array,
  loading: PropTypes.bool,
  status: PropTypes.string,
  onClick: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func
}

export default Scatterplot
