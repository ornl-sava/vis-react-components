import React, { PropTypes } from 'react'
import { format } from 'd3'

class Legend extends React.Component {
  render () {
    let { colorScale, chartWidth, chartHeight, margin } = this.props
    if (colorScale === null || colorScale.range().length === 0) {
      return <g />
    }

    let x = 0
    let y = (chartHeight + margin.top) + margin.bottom / 2
    let legendBlockWidth = (chartWidth) / colorScale.range().length
    let legendHeight = 4

    return (
      <g className='legend' transform={'translate(' + x + ',' + y + ')'}>
        {colorScale.range().map((d, i) => {
          return (
            <rect key={i}
              x={i * legendBlockWidth}
              y={0}
              width={legendBlockWidth}
              height={legendHeight}
              fill={d} />
          )
        })}
        <text x={0} y={14}>
          {format(',')(Math.round(colorScale.domain()[0]))}
        </text>
        <text x={(colorScale.range().length) * legendBlockWidth} y={15} textAnchor='end'>
          {format(',')(Math.round(colorScale.domain()[colorScale.domain().length - 1]))}
        </text>
      </g>
    )
  }
}

Legend.defaultProps = {
  colorScale: null,
  margin: {top: 0, right: 0, bottom: 0, left: 0},
  chartHeight: 0,
  chartWidth: 0
}

Legend.propTypes = {
  colorScale: PropTypes.any,
  margin: PropTypes.object,
  chartHeight: PropTypes.number,
  chartWidth: PropTypes.number
}

export default Legend
