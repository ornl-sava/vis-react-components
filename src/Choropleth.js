import React from 'react'
import PropTypes from 'prop-types'
import ReactTransitionGroup from 'react-addons-transition-group'
import { interpolate, geoPath, geoEquirectangular } from 'd3'
import * as topojson from 'topojson'

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
      let color = this.props.unselectedColorScale.range()[0]
      if (typeof datum !== 'undefined') {
        if (datum[this.props.selectedField] === this.props.selectedValue) {
          color = datum[this.props.valueField] === 0
            ? this.props.selectedColorScale.range()[0]
            : this.props.selectedColorScale(datum[this.props.valueField])
        } else {
          color = datum[this.props.valueField] === 0
            ? this.props.unselectedColorScale.range()[0]
            : this.props.unselectedColorScale(datum[this.props.valueField])
        }
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
                onEnter={{
                  func: (transition, props) => {
                    transition
                      .delay(0)
                      .duration(500)
                      .ease(setEase('linear'))
                      .attrTween('fill', () => {
                        return interpolate(this.props.unselectedColorScale.range()[0], props.fill)
                      })
                    return transition
                  }
                }}
                onUpdate={{
                  func: (transition, props) => {
                    transition
                      .delay(0)
                      .duration(500)
                      .ease(setEase('linear'))
                      .attr('fill', props.fill)
                      .attr('d', props.d)
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
          <SVGComponent Component='path'
            className='boundary'
            onUpdate={{
              func: (transition, props) => {
                transition
                  .delay(0)
                  .duration(500)
                  .ease(setEase('linear'))
                  .attr('d', props.d)
                return transition
              }
            }}
            d={this.path(topojson.mesh(this.props.map, this.props.map.objects.countries, (a, b) => {
              return a !== b
            }))} />
        </g>
      </g>
    )
  }
}

Choropleth.defaultProps = {
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

export default Choropleth
