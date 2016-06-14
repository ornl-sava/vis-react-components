import React, { PropTypes } from 'react'

class Heatmap extends React.Component {
  render () {
    let {chartWidth, chartHeight} = this.props
    let xPos = Math.floor(chartWidth / 2)
    let yPos = Math.floor(chartHeight / 2)
    let messageText = 'TODO: Heatmap Component'
    return (
      <g className='loading-message'>
        <text x={xPos} y={yPos}>{messageText}</text>
      </g>
    )
  }
}

Heatmap.defaultProps = {
  chartHeight: 0,
  chartWidth: 0,
  data: [],
  loading: false,
  status: ''
}

Heatmap.propTypes = {
  chartHeight: PropTypes.number.isRequired,
  chartWidth: PropTypes.number.isRequired,
  data: PropTypes.array,
  loading: PropTypes.bool,
  status: PropTypes.string
}

export default Heatmap
