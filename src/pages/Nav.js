import React from 'react'
import { Link } from 'react-router'

class Nav extends React.Component {
  render () {
    return (
      <nav role='navigation'>
        <ul>
          <li><Link to='/histogram' activeClassName='active'>Histogram</Link></li>
          <li><Link to='/heatmap' activeClassName='active'>Heatmap</Link></li>
          <li><Link to='/scatterplot' activeClassName='active'>Scatterplot</Link></li>
          <li><Link to='/choropleth' activeClassName='active'>Choropleth Map</Link></li>
          <li><Link to='/scatterHeatmap' activeClassName='active'>Scatter Heatmap Hybrid</Link></li>
        </ul>
      </nav>
    )
  }
}

export default Nav
