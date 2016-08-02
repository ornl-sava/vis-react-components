import React, { PropTypes } from 'react'
import ReactTransitionGroup from 'react-addons-transition-group'

import { setEase } from './util/d3'
import SVGComponent from './SVGComponent'

class Heatmap extends React.Component {
  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.onLeave = this.onLeave.bind(this)
  }

  onClick (event, data, index) {
    this.props.onClick(event, data, index)
  }

  onEnter (event, data, index) {
    this.props.onEnter(event, data, index)
  }

  onLeave (event, data, index) {
    this.props.onLeave(event, data, index)
  }

  render () {
    let props = this.props
    return (
      <ReactTransitionGroup component='g' className={props.className}>
        {props.data.map((d, i) => {
          let height = (i === 0) ? props.chartHeight : props.yScale(props.data[i - 1][props.yAccessor.key])
          height -= props.yScale(d[props.yAccessor.key])
          return d.bins.map((e, j) => {
            let width = (j + 1 < d.bins.length) ? props.xScale(d.bins[j + 1][props.xAccessor.key]) : props.chartWidth
            width -= props.xScale(e[props.xAccessor.key])
            return (
              <SVGComponent Component='rect' key={i + '-' + j}
                data={d}
                index={i * d.bins.length + j}
                x={props.xScale(e[props.xAccessor.key])}
                y={props.yScale(d[props.yAccessor.key])}
                width={width}
                height={height}
                fill={props.colorScale(e[props.xAccessor.value])}
                onUpdate={{
                  func: (transition, props) => {
                    transition
                      .delay(0)
                      .duration(750)
                      .ease(setEase('linear'))
                      .attr('fill', props.fill)
                    return transition
                  }
                }}
                onMouseEnter={this.onEnter}
                onMouseLeave={this.onLeave}
                onClick={this.onClick} />
            )
          })
        })}
      </ReactTransitionGroup>
    )
  }
}

Heatmap.defaultProps = {
  minColor: '#eff3ff',
  maxColor: '#2171b5',
  numColorCat: 11,
  colorPerRow: true,
  labelField: 'label',
  xAccessor: {
    key: 'key',
    value: 'value'
  },
  yAccessor: {
    key: 'key',
    value: 'value'
  },
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
  xAccessor: PropTypes.object,
  yAccessor: PropTypes.object,
  chartHeight: PropTypes.number,
  chartWidth: PropTypes.number,
  className: PropTypes.string,
  data: PropTypes.array,
  onClick: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  xScale: PropTypes.any,
  yScale: PropTypes.any
}

export default Heatmap
