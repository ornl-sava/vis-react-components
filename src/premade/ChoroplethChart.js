import React, { PropTypes } from 'react'
import { range, interpolateHcl } from 'd3'

import { setScale } from '../util/d3'
import { spreadRelated } from '../util/react'
import { Chart, Tooltip, Choropleth, Legend } from '../.'

class ChoroplethChart extends React.Component {
  constructor (props) {
    super(props)
    this.selectedColorScale = setScale('qunatile')
    this.unselectedColorScale = setScale('qunatile')

    this.onClick = this.onClick.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.onLeave = this.onLeave.bind(this)
    this.onResize = this.onResize.bind(this)

    this.updateColorScales = this.updateColorScales.bind(this)

    this.tip = props.tipFunction
      ? new Tooltip().attr('className', 'd3-tip').useMouseCoordinates(true).html(props.tipFunction)
      : props.tipFunction

    this.updateColorScales(props, this.state)
  }

  componentWillReceiveProps (nextProps) {
    this.updateColorScales(nextProps, this.state)
  }

  updateColorScales (props, state) {
    // Generate scale to determine class for coloring
    let tempSelectedColorScale = setScale('linear')
      .domain([0, this.props.numColorCat])
      .range([this.props.selectedMinColor, this.props.selectedMaxColor])
      .interpolate(interpolateHcl)

    let tempUnselectedColorScale = setScale('linear')
      .domain([0, this.props.numColorCat])
      .range([this.props.unselectedMinColor, this.props.unselectedMaxColor])
      .interpolate(interpolateHcl)

    let colorDomain = [0]
    this.props.data
      .forEach((d) => {
        let datum = d[this.props.valueField]
        if (datum > 0) colorDomain.push(datum)
      })

    let selectedColorRange = []
    let unselectedColorRange = []
    range(this.props.numColorCat).map((i) => {
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

  shouldComponentUpdate (nextProps, nextState) {
    return true
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

  onResize () {}

  render () {
    let props = this.props
    return (
      <Chart ref='chart' {...spreadRelated(Chart, props)} resizeHandler={this.onResize}>
        <Choropleth className='circumshaker' {...spreadRelated(Choropleth, props)}
          onEnter={this.onEnter} onLeave={this.onLeave} onClick={this.onClick}
          unselectedColorScale={this.unselectedColorScale} selectedColorScale={this.selectedColorScale} />
        <Legend colorScale={this.selectedColorScale} />
      </Chart>
    )
  }
}

ChoroplethChart.defaultProps = {
  // Premade default
  data: [],
  // Spread chart default
  ...Chart.defaultProps,
  // Spread heatmap default
  ...Choropleth.defaultProps
}

ChoroplethChart.propTypes = {
  ...Choropleth.propTypes,
  ...Chart.propTypes,
  onClick: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  tipFunction: PropTypes.func
}

export default ChoroplethChart
