import React from 'react'
import PropTypes from 'prop-types'
import { format } from 'd3'

class Legend extends React.Component {
  render () {
    let { colorScale, chartWidth, chartHeight, margin, numBoxes, positionFunction, orient } = this.props
    if (colorScale === null || colorScale.range().length === 0) {
      return <g />
    }

    let [x, y] = positionFunction(margin, chartHeight, chartWidth)

    // might need another approach if we ever want to use logarithmic scales
    var displayColors = []
    if (numBoxes > 1) {
      let min = colorScale.domain()[0]
      let max = colorScale.domain()[colorScale.domain().length - 1]
      let increment = (max - min) / (numBoxes - 1)
      for (var i = 0; i < numBoxes; i++) {
        displayColors.push(colorScale(min + i * increment))
      }
    } else {
      displayColors = colorScale.range()
    }

    let legendBlockWidth = (orient === 'vertical' ? chartHeight : chartWidth) / displayColors.length
    let legendHeight = 4

    if (orient === 'vertical') {
      return (
        <g className='legend' transform={'translate(' + x + ',' + y + ')'}>
          {displayColors.map((d, i) => {
            return (
              <rect key={i}
                x={0}
                y={i * legendBlockWidth}
                width={legendHeight}
                height={legendBlockWidth}
                fill={d} />
            )
          })}
          <text x={5} y={15}>
            {format(',')(Math.round(colorScale.domain()[0]))}
          </text>
          <text x={5} y={(displayColors.length) * legendBlockWidth}>
            {format(',')(Math.round(colorScale.domain()[colorScale.domain().length - 1]))}
          </text>
        </g>
      )
    } else {
      return (
        <g className='legend' transform={'translate(' + x + ',' + y + ')'}>
          {displayColors.map((d, i) => {
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
          <text x={(displayColors.length) * legendBlockWidth} y={15} textAnchor='end'>
            {format(',')(Math.round(colorScale.domain()[colorScale.domain().length - 1]))}
          </text>
        </g>
      )
    }
  }
}

Legend.defaultProps = {
  colorScale: null,
  margin: {top: 0, right: 0, bottom: 0, left: 0},
  chartHeight: 0,
  chartWidth: 0,
  positionFunction: (margin, chartHeight, chartWidth) => {
    // legend in bottom margin of Chart
    let x = 0
    let y = (chartHeight + margin.top) + margin.bottom / 2
    return [x, y]
  },
  orient: 'horizontal'
}

Legend.propTypes = {
  colorScale: PropTypes.any,
  margin: PropTypes.object,
  chartHeight: PropTypes.number,
  chartWidth: PropTypes.number,
  numBoxes: PropTypes.number,
  positionFunction: PropTypes.func,
  orient: PropTypes.string
}

export default Legend
