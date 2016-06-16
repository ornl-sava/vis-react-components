import React, { PropTypes } from 'react'
import d3 from 'd3'

class Legend extends React.Component {
  render () {
    let { colorScale, height, width, margin } = this.props
    let xPos = 0
    let yPos = height + margin.bottom / 2
    let legendBlockWidth = (width) / colorScale.range().length
    let legendHeight = 4

    return (
      <g className='legend' transform={'translate(' + xPos + ',' + yPos + ')'}>
        {colorScale.range().map((d, i) => {
          let rectProps = {
            'x': i * legendBlockWidth,
            'y': 0,
            'width': legendBlockWidth,
            'height': legendHeight,
            'fill': d
          }
          return (
            <rect key={i} {...rectProps} />
          )
        })}
        <text x={0} y={14}>
          {d3.format('n')(Math.round(colorScale.domain()[0]))}
        </text>
        <text x={(colorScale.range().length) * legendBlockWidth} y={15} textAnchor='end'>
          {d3.format('n')(Math.round(colorScale.domain()[colorScale.domain().length - 1]))}
        </text>
      </g>
    )
  }
}

Legend.defaultProps = {
  colorScale: d3.scale.linear(),
  margin: {top: 0, right: 0, bottom: 0, left: 0},
  height: 0,
  width: 0
}

Legend.propTypes = {
  colorScale: PropTypes.any,
  margin: PropTypes.object,
  height: PropTypes.number,
  width: PropTypes.number
}

export default Legend
