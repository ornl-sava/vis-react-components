import React, { PropTypes } from 'react'

class Choropleth extends React.Component {
  render () {
    let {chartWidth, chartHeight} = this.props
    let xPos = Math.floor(chartWidth / 2)
    let yPos = Math.floor(chartHeight / 2)
    let messageText = 'TODO: Choropleth Component'
    return (
      <g className='loading-message'>
        <text x={xPos} y={yPos}>{messageText}</text>
      </g>
    )
  }
}

Choropleth.defaultProps = {
  data: [],
  loading: false,
  status: ''
}

Choropleth.propTypes = {
  chartHeight: PropTypes.number.isRequired,
  chartWidth: PropTypes.number.isRequired,
  data: PropTypes.array,
  loading: PropTypes.bool,
  status: PropTypes.string
}

export default Choropleth
