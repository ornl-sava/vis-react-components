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
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.data.length > 0) {
      let xDomain = nextProps.xDomain
      if (xDomain.length === 0) {
        if (/ordinal/.test(nextProps.xScaleType)) {
          xDomain = nextProps.data.map((d) => d[nextProps.xField])
        } else {
          xDomain = d3.extent(nextProps.data, (d) => d[nextProps.xField])
        }
      }

      let yDomain = nextProps.yDomain
      if (yDomain.length === 0) {
        if (/ordinal/.test(nextProps.yScaleType)) {
          yDomain = nextProps.data.map((d) => d[nextProps.yField])
        } else {
          yDomain = d3.extent(nextProps.data, (d) => d[nextProps.yField])
        }
      }

      this.props.xScale.domain(xDomain)
      this.props.yScale.domain(yDomain)

      this.setState({
        xDomain: xDomain,
        yDomain: yDomain
      })
    }

    console.log(this.props.xScale.domain(), this.props.yScale.range())
    console.log(this.props.yScale.domain(), this.props.yScale.range())
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
      <g className='scatterplot'>
        {this.props.data.map((d, i) => {
          let circleProps = {
            'data-key': d[props.xField],
            'data-value': d[props.yField],
            'r': props.radius,
            'cx': props.xScale(d[props.xField]),
            'cy': props.yScale(d[props.yField]),
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
    renderEl = this.renderLoadAnimation(this.props)
    if (this.props.data.length > 0) {
      renderEl = this.renderScatterplot(this.props)
    }
    return renderEl
  }
}

Scatterplot.defaultProps = {
  chartHeight: 0,
  chartWidth: 0,
  xField: 'x',
  yField: 'y',
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
  radius: PropTypes.number,
  xDomain: PropTypes.array,
  yDomain: PropTypes.array,
  xField: PropTypes.string,
  yField: PropTypes.string,
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
