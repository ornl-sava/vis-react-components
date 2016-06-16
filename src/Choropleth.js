import React, { PropTypes } from 'react'
import d3 from 'd3'
import topojson from 'topojson'

class Choropleth extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      colorScale: d3.scale.quantile()
    }

    this.projection = d3.geo.equirectangular()
    this.path = d3.geo.path()
      .projection(this.projection)

    this.tooltipData = this.tooltipData.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.onLeave = this.onLeave.bind(this)
    this.renderLoadAnimation = this.renderLoadAnimation.bind(this)
    this.renderMap = this.renderMap.bind(this)
  }

  tooltipData (id) {
    // Get datum based on id
    let index = -1
    this.props.data[0].bins.forEach((d, i) => {
      if (d[this.props.keyField] === id) {
        index = i
        return false
      }
    })

    let datum0 = this.props.data[0].bins[index]
    let datum1 = this.props.data[1].bins[index]
    let counts = (typeof datum0 === 'undefined' || typeof datum1 === 'undefined')
      ? [0, 0]
      : [datum1[this.props.valueField], datum0[this.props.valueField]]
    let tooltipData = {
      key: id,
      value: counts
    }

    return tooltipData
  }

  onClick (event) {
    let node = event.target
    let id = node.getAttribute('data-id')
    this.props.onClick.apply(this, [id])

    // Call this to remove tooltip
    this.props.onLeave(this.tooltipData(id), node)
  }

  onEnter (event) {
    let node = event.target
    let id = node.getAttribute('data-id')
    this.props.onEnter(this.tooltipData(id), node)
  }

  onLeave (event) {
    let node = event.target
    let id = node.getAttribute('data-id')
    this.props.onLeave(this.tooltipData(id), node)
  }

  renderMap () {
    // Get map bounds and scaling
    let mapBounds = this.path.bounds(topojson.feature(this.props.map, this.props.map.objects.countries))
    let mapScale = this.projection.scale()

    // Get possible scales based on width / height
    let hscale = mapScale * this.props.chartWidth / (mapBounds[1][0] - mapBounds[0][0])
    let vscale = mapScale * this.props.chartHeight / (mapBounds[1][1] - mapBounds[0][1])

    // Determine which scaling to use
    mapScale = (hscale < vscale) ? hscale : vscale
    this.projection
      .scale(mapScale)
      .translate([this.props.chartWidth / 2, this.props.chartHeight / 2])

    this.path
      .projection(this.projection)

    // Generate scale to determine class for coloring
    let tempColorScale = d3.scale.linear()
      .domain([0, this.props.numColorCat])
      .range([this.props.minColor, this.props.maxColor])
      .interpolate(d3.interpolateHcl)

    let colorDomain = [0]
    this.props.data[1].bins
      .forEach((d) => {
        let datum = d[this.props.valueField]
        if (datum > 0) colorDomain.push(datum)
      })

    let colorRange = []
    d3.range(this.props.numColorCat).map((i) => {
      colorRange.push(tempColorScale(i))
    })

    this.state.colorScale
      .domain(colorDomain)
      .range(colorRange)

    // Helper to get datum and return color
    const getColor = (id) => {
      // Find associated datum
      let index = -1
      this.props.data[1].bins.forEach((d, i) => {
        if (d[this.props.keyField] === id) {
          index = i
          return false
        }
      })
      let datum = this.props.data[1].bins[index]
      let color = this.props.minColor
      if (typeof datum !== 'undefined') {
        color = this.state.colorScale(datum[this.props.valueField])
      }
      return color
    }

    return (
      <g>
        <g>
          {topojson.feature(this.props.map, this.props.map.objects.countries).features.map((d, i) => {
            return (<path key={i}
              data-id={d.id}
              d={this.path(d, i)}
              fill={getColor(d.id)}
              onClick={this.onClick}
              onMouseEnter={this.onEnter}
              onMouseLeave={this.onLeave} />)
          })}
        </g>
        <g>
          <path d={this.path(topojson.mesh(this.props.map, this.props.map.objects.countries, (a, b) => {
            return a !== b
          }))} className='boundary' />
        </g>
      </g>
    )
  }

  renderLoadAnimation () {
    let xPos = Math.floor(this.props.chartWidth / 2)
    let yPos = Math.floor(this.props.chartHeight / 2)
    let messageText = 'Loading data...'
    if (!this.props.loading) {
      if (this.props.status === 'Failed to fetch') {
        messageText = 'Can\'t connect to API URL'
      } else if (this.props.status !== 'OK') {
        messageText = 'Error retrieving data: ' + this.props.status
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
      renderEl = this.renderMap(this.props)
    }
    return renderEl
  }
}

Choropleth.defaultProps = {
  minColor: '#eff3ff',
  maxColor: '#2171b5',
  numColorCat: 20,
  chartHeight: 0,
  chartWidth: 0,
  className: 'choropleth',
  data: [],
  keyField: 'key',
  valueField: 'value',
  loading: false,
  status: '',
  type: '',
  onClick: () => {},
  onEnter: () => {},
  onLeave: () => {}
}

Choropleth.propTypes = {
  minColor: PropTypes.string,
  maxColor: PropTypes.string,
  numColorCat: PropTypes.number,
  map: PropTypes.object.isRequired,
  chartHeight: PropTypes.number.isRequired,
  chartWidth: PropTypes.number.isRequired,
  className: PropTypes.string.isRequired,
  data: PropTypes.array,
  keyField: PropTypes.string,
  valueField: PropTypes.string,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  status: PropTypes.string
}

// Only required for REST calls
Choropleth.contextTypes = {
  filterField: PropTypes.string,
  filterType: PropTypes.string,
  params: PropTypes.object,
  updateFilter: PropTypes.func
}

export default Choropleth
