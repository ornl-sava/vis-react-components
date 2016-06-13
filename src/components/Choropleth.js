import React, { PropTypes } from 'react'
import d3 from 'd3'
import topojson from 'topojson'

import map from '../data/world-110.json'

class ChoroplethMap extends React.Component {
  constructor (props) {
    super(props)

    this.tooltipData = this.tooltipData.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.onLeave = this.onLeave.bind(this)
    this.renderLoadAnimation = this.renderLoadAnimation.bind(this)
    this.renderMap = this.renderMap.bind(this)
  }

  tooltipData (id) {
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
      label: id,
      counts: counts
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
    let colorScale = d3.scale.quantile()
    let projection = d3.geo.equirectangular()
    let path = d3.geo.path()
      .projection(projection)

    let mapBounds = path.bounds(topojson.feature(map, map.objects.countries))
    let mapScale = projection.scale()

    let hscale = mapScale * this.props.chartWidth / (mapBounds[1][0] - mapBounds[0][0])
    let vscale = mapScale * this.props.chartHeight / (mapBounds[1][1] - mapBounds[0][1])
    mapScale = (hscale < vscale) ? hscale : vscale
    projection
      .scale(mapScale)
      .translate([this.props.chartWidth / 2, this.props.chartHeight / 2])

    path
      .projection(projection)

    // Generate scale to determine class for coloring
    let domain = []
    this.props.data[1].bins
      .forEach((d) => {
        let datum = d[this.props.valueField]
        if (datum > 0) domain.push(datum)
      })

    colorScale
      .domain(domain)
      .range(d3.range(9).map((i) => {
        return 'land' + i
      }))

    // Helper to generate class for map coloring
    const getClassName = (id) => {
      let index = -1
      this.props.data[1].bins.forEach((d, i) => {
        if (d[this.props.keyField] === id) {
          index = i
          return false
        }
      })
      let datum = this.props.data[1].bins[index]
      let className = 'landN'
      if (typeof datum !== 'undefined') {
        // Get color rank
        let colorVal = datum[this.props.valueField]
        let colorClass = (colorVal === 0) ? 'landN'
         : colorScale(colorVal)
        // Get selected
        // let selected = (self.selectedModels.empty()) ? true
        //  : self.selectedModels.has(datum[self.keyField])
        // let selectedClass = (selected) ? ' selected' : ''
        let selectedClass = ' selected'
        className = colorClass + selectedClass
      }
      return className
    }

    return (
      <g>
        <g>
          {topojson.feature(map, map.objects.countries).features.map((d, i) => {
            return (<path key={i}
              data-id={d.id}
              d={path(d, i)}
              className={getClassName(d.id)}
              onClick={this.onClick}
              onMouseEnter={this.onEnter}
              onMouseLeave={this.onLeave} />)
          })}
        </g>
        <g>
          <path d={path(topojson.mesh(map, map.objects.countries, (a, b) => {
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

ChoroplethMap.defaultProps = {
  addOverlay: true,
  padding: 0.2,
  outerPadding: 0.4,
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

ChoroplethMap.propTypes = {
  addOverlay: PropTypes.bool,
  padding: PropTypes.number.isRequired,
  outerPadding: PropTypes.number.isRequired,
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
ChoroplethMap.contextTypes = {
  filterField: PropTypes.string,
  filterType: PropTypes.string,
  params: PropTypes.object,
  updateFilter: PropTypes.func
}

export default ChoroplethMap
