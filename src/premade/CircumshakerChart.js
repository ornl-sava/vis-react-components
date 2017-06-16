import React from 'react'
import PropTypes from 'prop-types'

// import { spreadRelated } from '../util/react'
import Chart from '../Chart'
import Tooltip from '../Tooltip'
import Circumshaker from '../Circumshaker'

class CircumshakerChart extends React.Component {
  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.onLeave = this.onLeave.bind(this)

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
    return (
      <Chart
        ref='chart'
        header={this.props.header}
        height={this.props.height}
        margin={this.props.margin}
        width={this.props.width}
        resizeHandler={this.props.resizeHandler}
      >
        <Circumshaker
          chartHeight={this.props.height}
          chartWidth={this.props.width}
          data={this.props.data}
          className='circumshaker'
          childAccessor={this.props.childAccessor}
          keyAccessor={this.props.keyAccessor}
          maxDepth={this.props.maxDepth}
          nodeMaxSize={this.props.nodeMaxSize}
          nodeMinSize={this.props.nodeMinSize}
          selectedColorScale={this.selectedColorScale}
          unselectedColorScale={this.unselectedColorScale}
          valueAccessor={this.props.valueAccessor}
          colorFunction={this.props.colorFunction}
          onEnter={this.onEnter}
          onLeave={this.onLeave}
          onClick={this.onClick} />
      </Chart>
    )
  }
}

CircumshakerChart.defaultProps = {
  // Circumshaker defaults
  keyAccessor: 'key',
  valueAccessor: 'value',
  childAccessor: 'children',
  nodeMinSize: 8,
  nodeMaxSize: null,
  maxDepth: 3,
  data: {},
  onClick: () => {},
  onEnter: () => {},
  onLeave: () => {},
  // Chart defaults
  resizeHandler: () => {},
  header: () => [],
  margin: {top: 0, right: 10, bottom: 20, left: 80},
  width: 0,
  height: 250

}

CircumshakerChart.propTypes = {
  // Circumshaker props
  keyAccessor: PropTypes.string,
  valueAccessor: PropTypes.string,
  childAccessor: PropTypes.string,
  nodeMinSize: PropTypes.number,
  nodeMaxSize: PropTypes.number,
  maxDepth: PropTypes.number,

  data: PropTypes.object,
  onClick: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  colorFunction: PropTypes.func,
  // Chart Props
  resizeHandler: PropTypes.func,
  header: PropTypes.func,
  margin: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
  tipFunction: PropTypes.func
}

export default CircumshakerChart
