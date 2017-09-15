import React from 'react'
import PropTypes from 'prop-types'
import { format, range, scaleLinear } from 'd3'

class Legend extends React.Component {
  render () {
    let { colorScale, chartWidth, chartHeight, margin, numBoxes, positionFunction, orient, numberFormat, numLabels } = this.props
    if (colorScale === null || colorScale.range().length === 0) {
      return <g />
    }

    // note: non-default values for numBoxes and numLabels currently only supported for linear scales

    let [x, y] = positionFunction(margin, chartHeight, chartWidth)

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

    let labelScale = scaleLinear().domain([0, numLabels - 1]).range([colorScale.domain()[0], colorScale.domain()[colorScale.domain().length - 1]])

    if (orient === 'vertical') {
      let yScale = scaleLinear().domain([0, numLabels - 1]).range([15, displayColors.length * legendBlockWidth])
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
          {range(numLabels).map((i) => {
            return (
              <text key={'label ' + i} x={5} y={yScale(i)}>
                {numberFormat(labelScale(i))}
              </text>
            )
          })}
        </g>
      )
    } else {
      let xScale = scaleLinear().domain([0, numLabels - 1]).range([0, displayColors.length * legendBlockWidth])
      let getAnchor = (i) => {
        if (i === 0) {
          return 'start'
        }
        if (i === numLabels - 1) {
          return 'end'
        }
        return 'middle'
      }
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
          {range(numLabels).map((i) => {
            return (
              <text key={'label ' + i} x={xScale(i)} y={15} textAnchor={getAnchor(i)}>
                {numberFormat(labelScale(i))}
              </text>
            )
          })}
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
  orient: 'horizontal',
  numberFormat: (n) => { return format(',')(Math.round(n)) },
  numLabels: 2
}

Legend.propTypes = {
  colorScale: PropTypes.any,
  margin: PropTypes.object,
  chartHeight: PropTypes.number,
  chartWidth: PropTypes.number,
  numBoxes: PropTypes.number,
  positionFunction: PropTypes.func,
  orient: PropTypes.string,
  numberFormat: PropTypes.func,
  numLabels: PropTypes.number
}

export default Legend
