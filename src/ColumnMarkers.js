import React, { PropTypes } from 'react'

import { setEase } from './util/d3'
import SVGComponent from './SVGComponent'

// NOTE: Fills top margin with rect column markers
// Requires a top margin greater than 5px, xScale, and the data
// Expects 2D data like heatmap
class ColumnMarkers extends React.Component {
  render () {
    let { className, data, onClick, xScale, xAccessor, chartWidth, margin } = this.props

    let y = -margin.top
    let height = (margin.top - 2 > 5)
      ? margin.top - 2
      : 5

    return (
      <g className={className}>
        {data[0].bins.map((d, i) => {
          let width = (i + 1 < data[0].bins.length)
            ? xScale(data[0].bins[i + 1][xAccessor.key])
            : chartWidth
          width -= xScale(d[xAccessor.key])
          return (
            <SVGComponent Component='rect' key={i}
              data={d}
              index={i}
              x={xScale(d[xAccessor.key])}
              y={y}
              fill='#666'
              width={width}
              height={height}
              onClick={onClick}
              onUpdate={{
                func: (transition, props) => {
                  transition
                    .delay(0)
                    .duration(500)
                    .ease(setEase('linear'))
                    .attr('x', props.x)
                    .attr('y', props.y)
                    .attr('width', props.width)
                    .attr('height', props.height)
                    .attr('fill', props.fill)
                  return transition
                }
              }} />
          )
        })}
      </g>
    )
  }
}

ColumnMarkers.defaultProps = {
  data: [],
  xAccessor: {
    key: 'key',
    value: 'value'
  },
  onClick: () => {},
  className: 'columnMarker',
  margin: {top: 0, right: 0, bottom: 0, left: 0},
  chartHeight: 0,
  chartWidth: 0
}

ColumnMarkers.propTypes = {
  data: PropTypes.array,
  xScale: PropTypes.any,
  xAccessor: PropTypes.any,
  onClick: PropTypes.func,
  className: PropTypes.string,
  margin: PropTypes.object,
  chartHeight: PropTypes.number,
  chartWidth: PropTypes.number
}

export default ColumnMarkers
