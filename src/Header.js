import React, { PropTypes } from 'react'

class Header extends React.Component {
  render () {
    let { chart, ...props } = this.props
    let containerStyle = {
      marginLeft: chart.props.margin.left,
      marginRight: chart.props.margin.right
    }
    return (
      <div style={containerStyle}>
        {props.components().map((e, i) => {
          let cloneProps = {}
          cloneProps.key = i
          if ('chart' in e.props) {
            cloneProps.chart = chart
          }
          return React.cloneElement(e, cloneProps)
        })}
      </div>
    )
  }
}

Header.defaultProps = {
  chart: null
}

Header.propTypes = {
  chart: PropTypes.any,
  components: PropTypes.any
}

export default Header
