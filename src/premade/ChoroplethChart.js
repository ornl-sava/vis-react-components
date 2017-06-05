import React from 'react'
import PropTypes from 'prop-types'
import { range, interpolateHcl } from 'd3'

import { setScale } from '../util/d3'
import { spreadRelated } from '../util/react'
import Chart from '../Chart'
import Tooltip from '../Tooltip'
import Choropleth from '../Choropleth'
import Legend from '../Legend'

class ChoroplethChart extends React.Component {
  constructor (props) {
    super(props)
    this.selectedColorScale = setScale('quantile')
    this.unselectedColorScale = setScale('quantile')

    this.onClick = this.onClick.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.onLeave = this.onLeave.bind(this)
    this.onMove = this.onMove.bind(this)

    this.updateColorScales = this.updateColorScales.bind(this)

    this.tip = props.tipFunction
      ? new Tooltip().attr('className', 'd3-tip').useMouseCoordinates(true).offset([-12, 0]).html(props.tipFunction)
      : props.tipFunction

    this.updateColorScales(props, this.state)
  }

  componentWillUnmount () {
    if (this.props.tipFunction) {
      this.tip.destroy()
    }
  }

  componentWillReceiveProps (nextProps) {
    this.updateColorScales(nextProps, this.state)
  }

  updateColorScales (props, state) {
    // Generate scale to determine class for coloring
    let tempSelectedColorScale = setScale('linear')
      .domain([0, props.numColorCat])
      .range([props.selectedMinColor, props.selectedMaxColor])
      .interpolate(interpolateHcl)

    let tempUnselectedColorScale = setScale('linear')
      .domain([0, props.numColorCat])
      .range([props.unselectedMinColor, props.unselectedMaxColor])
      .interpolate(interpolateHcl)

    let colorDomain = [0]
    props.data
      .forEach((d) => {
        let datum = d[props.valueField]
        if (datum > 0) colorDomain.push(datum)
      })

    let selectedColorRange = []
    let unselectedColorRange = []
    range(props.numColorCat).map((i) => {
      selectedColorRange.push(tempSelectedColorScale(i))
      unselectedColorRange.push(tempUnselectedColorScale(i))
    })

    this.selectedColorScale
      .domain(colorDomain)
      .range(selectedColorRange)

    this.unselectedColorScale
      .domain(colorDomain)
      .range(unselectedColorRange)
  }

  onClick (event, data) {
    this.props.onClick(event, data)
  }

  onEnter (event, data) {
    if (data && this.tip) {
      this.tip.show(event, data)
    }
    this.props.onEnter(event, data)
  }

  onLeave (event, data) {
    if (data && this.tip) {
      this.tip.hide(event, data)
    }
    this.props.onLeave(event, data)
  }

  onMove (event, data) {
    if (data && this.tip) {
      this.tip.show(event, data)
    }
    this.props.onEnter(event, data)
  }

  render () {
    let props = this.props
    return (
      <Chart ref='chart' {...spreadRelated(Chart, props)}>
        <Choropleth className='circumshaker' {...spreadRelated(Choropleth, props)}
          onEnter={this.onEnter} onLeave={this.onLeave} onClick={this.onClick} onMove={this.onMove}
          unselectedColorScale={this.unselectedColorScale} selectedColorScale={this.selectedColorScale} />
        <Legend colorScale={this.selectedColorScale} />
      </Chart>
    )
  }
}

ChoroplethChart.defaultProps = {
  // Premade default
  data: [],
  selectedMinColor: '#eff3ff',
  selectedMaxColor: '#2171b5',
  unselectedMinColor: '#f7f7f7',
  unselectedMaxColor: '#636363',
  numColorCat: 20,
  // Spread chart default
  ...Chart.defaultProps,
  // Spread choropleth default
  ...Choropleth.defaultProps
}

ChoroplethChart.propTypes = {
  selectedMinColor: PropTypes.string,
  selectedMaxColor: PropTypes.string,
  unselectedMinColor: PropTypes.string,
  unselectedMaxColor: PropTypes.string,
  numColorCat: PropTypes.number,
  ...Choropleth.propTypes,
  ...Chart.propTypes,
  onClick: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  tipFunction: PropTypes.func
}

export default ChoroplethChart
