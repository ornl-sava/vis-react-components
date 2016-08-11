import React, { PropTypes } from 'react'

import { spreadRelated } from '../util/react'
import Chart from '../Chart'
import Tooltip from '../Tooltip'
import Circumshaker from '../Circumshaker'

class CircumshakerChart extends React.Component {
  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.onLeave = this.onLeave.bind(this)
    this.onResize = this.onResize.bind(this)

    this.tip = props.tipFunction
      ? new Tooltip().attr('className', 'd3-tip').html(props.tipFunction)
      : props.tipFunction
  }

  componentWillUnmount () {
    if (this.props.tipFunction) {
      this.tip.destroy()
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

  render () {
    let props = this.props
    return (
      <Chart ref='chart' {...spreadRelated(Chart, props)}>
        <Circumshaker className='circumshaker' {...spreadRelated(Circumshaker, props)}
          onEnter={this.onEnter} onLeave={this.onLeave} onClick={this.onClick}
          unselectedColorScale={this.unselectedColorScale} selectedColorScale={this.selectedColorScale} />
      </Chart>
    )
  }
}

CircumshakerChart.defaultProps = {
  // Premade default
  data: [],
  // Spread chart default
  ...Chart.defaultProps,
  // Spread circumshaker default
  ...Circumshaker.defaultProps
}

CircumshakerChart.propTypes = {
  ...Circumshaker.propTypes,
  ...Chart.propTypes,
  onClick: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  tipFunction: PropTypes.func
}

export default CircumshakerChart
