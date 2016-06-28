import React, { PropTypes } from 'react'
import d3 from 'd3'

class Heatmap extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      colorScale: d3.scale.quantile(),
      xDomain: this.props.xDomain,
      yDomain: this.props.yDomain
    }

    this.onClick = this.onClick.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.onLeave = this.onLeave.bind(this)
    this.renderLoadAnimation = this.renderLoadAnimation.bind(this)
    this.renderHeatmap = this.renderHeatmap.bind(this)
  }

  // Update the domain for the shared scale
  componentWillReceiveProps (nextProps) {
    if (nextProps.data.length > 0 && nextProps.data[0].bins.length > 0) {
      // If xDomain is not predefined
      // NOTE: When determining domain for x the first bin is Used
      // Each bin should have matching x domain keys
      let xDomain = nextProps.xDomain
      if (xDomain.length === 0) {
        // NOTE: Computing offset so proper xDomain is given
        // Nth bin has a start time of it's key; so it's 'end time'
        // must be taken into consideration
        let offset = nextProps.data[0].bins[1][nextProps.xAccessor.key] -
          nextProps.data[0].bins[0][nextProps.xAccessor.key]
        if (nextProps.xScaleType === 'ordinalBand') {
          xDomain = nextProps.data[0].bins.map((d) => d[nextProps.xAccessor.key])
        } else {
          xDomain = d3.extent(nextProps.data[0].bins, (d) => d[nextProps.xAccessor.key])
        }
        xDomain[1] = xDomain[1] + offset
      }

      // If yDomain is not predefined
      let yDomain = nextProps.yDomain
      if (yDomain.length === 0) {
        if (nextProps.yScaleType === 'ordinalBand') {
          yDomain = nextProps.data.map((d) => d[nextProps.yAccessor.key])
        } else {
          yDomain = [0, d3.max(nextProps.data, (d) => d[nextProps.yAccessor.key])]
        }
      }

      // Update state and scale if domains are new
      if (xDomain !== this.state.xDomain) {
        this.props.xScale.domain(xDomain)
        this.setState({xDomain: xDomain})
      }

      if (yDomain !== this.state.yDomain) {
        this.props.yScale.domain(yDomain)
        this.setState({yDomain: yDomain})
      }

      // Generate color scale
      let yMax = nextProps.colorPerRow
        ? d3.max(nextProps.data, (d, i) => {
          return d3.max(d.bins, (e, j) => e[nextProps.xAccessor.value])
        })
        : d3.max(nextProps.data, (d, i) => d[nextProps.yAccessor.value])

      let tempColorScale = d3.scale.linear()
        .domain([0, yMax])
        .range([nextProps.minColor, nextProps.maxColor])
        .interpolate(d3.interpolateHcl)

      let colorDomain = [0, 1]
      let colorRange = [nextProps.minColor]
      let colorDomainBand = yMax / (nextProps.numColorCat - 1)
      for (var i = 2; i < nextProps.numColorCat + 1; i++) {
        let value = colorDomain[i - 1] + colorDomainBand
        if (i === 2) value--
        colorDomain.push(value)
        colorRange.push(tempColorScale(value))
      }

      // NOTE: Alternate quantile color generation . . .
      // Generate scale to determine class for coloring
      // let tempColorScale = d3.scale.linear()
      //   .domain([0, nextProps.numColorCat])
      //   .range([nextProps.minColor, nextProps.maxColor])
      //   .interpolate(d3.interpolateHcl)
      //
      // let colorDomain = [0, 1]
      // nextProps.data.forEach((d) => {
      //   d.bins.forEach((g) => {
      //     let datum = g[nextProps.yAccessor.value]
      //     if (datum > 0) colorDomain.push(datum)
      //   })
      // })
      //
      // let colorRange = []
      // d3.range(nextProps.numColorCat).map((i) => {
      //   colorRange.push(tempColorScale(i))
      // })

      this.state.colorScale
        .domain(colorDomain)
        .range(colorRange)
    }
  }

  onClick (event) {
    // Call this to remove tooltip
    this.props.onClick(event)
  }

  onEnter (event) {
    let node = event.target
    this.props.onEnter(this.tooltipData(node), node)
  }

  onLeave (event) {
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

  renderHeatmap (props) {
    return (
      <g className='heatmap'>
        {props.data.map((d, i) => {
          if (props.yScaleType === 'linear') {
            console.log(props.yScale(d[props.yAccessor.key]), d)
          }
          return d.bins.map((e, j) => {
            let rectProps = {
              'data-key': e[props.labelField],
              'data-value': e[props.xAccessor.value],
              'x': props.xScale(e[props.xAccessor.key]),
              'y': props.yScale(d[props.yAccessor.key]),
              'width': props.chartWidth / d.bins.length,
              'height': props.chartHeight / props.data.length,
              'fill': this.state.colorScale(e[props.xAccessor.value]),
              'onMouseEnter': this.onEnter,
              'onMouseLeave': this.onLeave,
              'onClick': this.onClick
            }
            return (
              <rect key={i + j} {...rectProps} />
            )
          })
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
      renderEl = this.renderHeatmap(this.props)
    }
    return renderEl
  }
}

Heatmap.defaultProps = {
  minColor: '#eff3ff',
  maxColor: '#2171b5',
  numColorCat: 11,
  colorPerRow: true,
  labelField: 'label',
  chartHeight: 0,
  chartWidth: 0,
  className: 'histogram',
  data: [],
  xDomain: [],
  yDomain: [],
  xAccessor: {
    key: 'key',
    value: 'value'
  },
  yAccessor: {
    key: 'key',
    value: 'value'
  },
  loading: false,
  status: '',
  onClick: () => {},
  onEnter: () => {},
  onLeave: () => {}
}

Heatmap.propTypes = {
  minColor: PropTypes.string,
  maxColor: PropTypes.string,
  numColorCat: PropTypes.number,
  colorPerRow: PropTypes.bool,
  labelField: PropTypes.string,
  xDomain: PropTypes.array,
  xAccessor: PropTypes.object,
  yDomain: PropTypes.array,
  yAccessor: PropTypes.object,
  chartHeight: PropTypes.number.isRequired,
  chartWidth: PropTypes.number.isRequired,
  className: PropTypes.string.isRequired,
  data: PropTypes.array,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  status: PropTypes.string,
  xScale: PropTypes.any,
  yScale: PropTypes.any
}

export default Heatmap
