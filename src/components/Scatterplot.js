import React, { PropTypes } from 'react'

class Scatterplot extends React.Component {
  render () {
    let {chartWidth, chartHeight} = this.props
    let xPos = Math.floor(chartWidth / 2)
    let yPos = Math.floor(chartHeight / 2)
    let messageText = 'TODO: Scatterplot Component'
    return (
      <g className='loading-message'>
        <text x={xPos} y={yPos}>{messageText}</text>
      </g>
    )
  }
}

Scatterplot.defaultProps = {
  data: [],
  loading: false,
  status: ''
}

Scatterplot.propTypes = {
  chartHeight: PropTypes.number.isRequired,
  chartWidth: PropTypes.number.isRequired,
  data: PropTypes.array,
  loading: PropTypes.bool,
  status: PropTypes.string
}

export default Scatterplot
