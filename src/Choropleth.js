import React, { PropTypes } from 'react'
import ReactTransitionGroup from 'react-addons-transition-group'
import { geoPath, geoEquirectangular } from 'd3'
import topojson from 'topojson'

import { setEase } from './util/d3'
import SVGComponent from './SVGComponent'

class Choropleth extends React.Component {
  constructor (props) {
    super(props)
    this.projection = geoEquirectangular()
    this.path = geoPath()
      .projection(this.projection)

    this.getDatum = this.getDatum.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.onLeave = this.onLeave.bind(this)
    this.onMove = this.onMove.bind(this)
  }

  getDatum (id) {
    // Get datum based on id
    let index = -1
    this.props.data.forEach((d, i) => {
      if (d[this.props.keyField] === id) {
        index = i
        return false
      }
    })

    return this.props.data[index]
  }

  onClick (event) {
    let target = event.target
    let id = target.getAttribute('data-id')
    this.props.onClick(event, this.getDatum(id))
  }

  onEnter (event) {
    let target = event.target
    let id = target.getAttribute('data-id')
    this.props.onEnter(event, this.getDatum(id))
  }

  onLeave (event) {
    let target = event.target
    let id = target.getAttribute('data-id')
    this.props.onLeave(event, this.getDatum(id))
  }

  onMove (event) {
    let target = event.target
    let id = target.getAttribute('data-id')
    this.props.onMove(event, this.getDatum(id))
  }

  render () {
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

    // Helper to get datum and return color
    const getColor = (id) => {
      // Find associated datum
      let index = -1
      this.props.data.forEach((d, i) => {
        if (d[this.props.keyField] === id) {
          index = i
          return false
        }
      })
      let datum = this.props.data[index]
      let color = this.props.unselectedMinColor
      if (typeof datum !== 'undefined') {
        color = datum[this.props.selectedField] === this.props.selectedValue
          ? this.props.selectedColorScale(datum[this.props.valueField])
          : this.props.unselectedColorScale(datum[this.props.valueField])
      }
      return color
    }

    return (
      <g>
        <ReactTransitionGroup component='g'>
          {topojson.feature(this.props.map, this.props.map.objects.countries).features.map((d, i) => {
            return (
              <SVGComponent Component='path' key={i}
                data-id={d.id}
                d={this.path(d, i)}
                fill={getColor(d.id)}
                onUpdate={{
                  func: (transition, props) => {
                    transition
                      .delay(0)
                      .duration(1000)
                      .ease(setEase('linear'))
                      .attr('fill', props.fill)
                    return transition
                  }
                }}
                onClick={this.onClick}
                onMouseEnter={this.onEnter}
                onMouseLeave={this.onLeave}
                onMouseMove={this.onMove} />
            )
          })}
        </ReactTransitionGroup>
        <g>
          <path d={this.path(topojson.mesh(this.props.map, this.props.map.objects.countries, (a, b) => {
            return a !== b
          }))} className='boundary' />
        </g>
      </g>
    )
  }
}

Choropleth.defaultProps = {
  selectedMinColor: '#eff3ff',
  selectedMaxColor: '#2171b5',
  unselectedMinColor: '#f7f7f7',
  unselectedMaxColor: '#636363',
  numColorCat: 20,
  data: [],
  keyField: 'key',
  valueField: 'value',
  selectedField: 'selectedField',
  selectedValue: 'selected',
  onClick: () => {},
  onEnter: () => {},
  onLeave: () => {},
  onMove: () => {}
}

Choropleth.propTypes = {
  selectedColorScale: PropTypes.func,
  unselectedColorScale: PropTypes.func,
  selectedMinColor: PropTypes.string,
  selectedMaxColor: PropTypes.string,
  unselectedMinColor: PropTypes.string,
  unselectedMaxColor: PropTypes.string,
  numColorCat: PropTypes.number,
  map: PropTypes.object.isRequired,
  data: PropTypes.array,
  chartWidth: PropTypes.number,
  chartHeight: PropTypes.number,
  keyField: PropTypes.string,
  valueField: PropTypes.string,
  selectedField: PropTypes.string,
  selectedValue: PropTypes.string,
  onClick: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  onMove: PropTypes.func
}

// Only required for REST calls
Choropleth.contextTypes = {
  filterField: PropTypes.string,
  filterString: PropTypes.string,
  filterType: PropTypes.string,
  updateFilter: PropTypes.func
}

export default Choropleth
