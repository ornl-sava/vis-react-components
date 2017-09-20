import React from 'react'
import PropTypes from 'prop-types'
import { extent } from 'd3'

import { setScale, isOrdinalScale } from '../util/d3'
import { spreadRelated } from '../util/react'
import Chart from '../Chart'
import Axis from '../Axis'
import HorizonGraph from '../HorizonGraph'

class HorizonGraphChart extends React.Component {
  constructor (props) {
    super(props)
    this.xScale = setScale(props.xScaleType)
    this.yScale = setScale(props.yScaleType)

    this.xDomain = this.props.xDomain
    this.yDomain = this.props.yDomain

    this.onClick = this.onClick.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.onLeave = this.onLeave.bind(this)
    this.onResize = this.onResize.bind(this)
    props.mouseMoveHandler ? this.onMouseMove = this.onMouseMove = props.mouseMoveHandler.bind(this) : this.onMouseMove = props.mouseMoveHandler

    this.updateDomain = this.updateDomain.bind(this)
    this.updateRange = this.updateRange.bind(this)

    this.updateDomain(props, this.state)
  }

  componentWillReceiveProps (nextProps) {
    this.updateDomain(nextProps, this.state)
  }

  componentWillUnmount () {
    if (this.props.tipFunction) {
      this.tip.destroy()
    }
  }

  updateDomain (props, state) {
    if (props.data.length > 0) {
      let xDomain = this.xDomain
      if (xDomain.length === 0) {
        if (this.xScale.type === 'band') {
          xDomain = props.data.map((d, i) => props.xAccessor(d, i))
        } else {
          xDomain = extent(props.data, (d, i) => props.xAccessor(d, i))
        }
      }

      let mid = props.mid ? props.mid : 0
      let yDomain = this.yDomain
      if (yDomain.length === 0) {
        if (this.yScale.type === 'band') {
          yDomain = props.data.map((d) => props.yAccessor(d))
        } else {
          // only positive domain
          let height = 0
          if (props.domainHeight) {
            height = props.domainHeight / props.numBands
          } else {
            let args = extent(props.data, (d) => { return props.yAccessor(d) - mid })
            height = Math.max(Math.abs(args[0]), Math.abs(args[1])) / props.numBands
          }

          yDomain = [mid, mid + height]
        }
      }

      this.xScale.domain(xDomain)
      this.yScale.domain(yDomain)
    }
  }

  updateRange (props, state) {
    this.yScale.range([this.refs.chart.chartHeight, 0])
    if (props.yAxis.innerPadding && isOrdinalScale(this.yScale.type)) {
      this.yScale.paddingInner(props.yAxis.innerPadding)
    }

    if (props.yAxis.outerPadding && isOrdinalScale(this.yScale.type)) {
      this.yScale.paddingOuter(props.yAxis.outerPadding)
    }

    this.xScale.range([0, this.refs.chart.chartWidth])
    if (props.xAxis.innerPadding && isOrdinalScale(this.xScale.type)) {
      this.xScale.paddingInner(props.xAxis.innerPadding)
    }

    if (props.xAxis.outerPadding && isOrdinalScale(this.xScale.type)) {
      this.xScale.paddingOuter(props.xAxis.outerPadding)
    }
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

  onResize () {
    this.updateRange(this.props, this.state)
  }

  render () {
    let props = this.props
    return (
      <Chart ref='chart' {...spreadRelated(Chart, props)} resizeHandler={this.onResize}>
        <HorizonGraph className='horizonGraph'
          {...spreadRelated(HorizonGraph, props)}
          onMouseMove={this.onMouseMove}
        />
        <Axis className='x axis' {...props.xAxis} scale={this.xScale} />
        <Axis className='y axis' {...props.yAxis} scale={this.yScale} />
      </Chart>
    )
  }
}

HorizonGraphChart.defaultProps = {
  // Premade default
  data: [],
  xDomain: [],
  yDomain: [],
  // Spread chart default
  ...Chart.defaultProps,
  // Spread scatterplot default
  ...HorizonGraph.defaultProps,
  xAxis: {
    type: 'x',
    orient: 'bottom',
    innerPadding: null,
    outerPadding: null,
    animationDuration: 500
  },
  yAxis: {
    type: 'y',
    orient: 'left',
    innerPadding: null,
    outerPadding: null,
    animationDuration: 500
  },
  // mouseMoveHandler: () => null,
  xScaleType: 'linear',
  yScaleType: 'linear'
}

HorizonGraphChart.propTypes = {
  ...HorizonGraph.propTypes,
  ...Chart.propTypes,
  mouseMoveHandler: PropTypes.func,
  brushID: PropTypes.any,
  onClick: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  tipFunction: PropTypes.func,
  xScaleType: PropTypes.string,
  yScaleType: PropTypes.string,
  xDomain: PropTypes.array,
  yDomain: PropTypes.array,
  xAccessor: PropTypes.any,
  yAccessor: PropTypes.any,
  xAxis: PropTypes.object,
  yAxis: PropTypes.object
}

export default HorizonGraphChart
