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
          <li><Link to='/circumshaker' activeClassName='active'>Circumshaker</Link></li>
          <li><Link to='/topics' activeClassName='active'>Topics</Link></li>
          <li><Link to='/forceDirected' activeClassName='active'>Force-Directed</Link></li>
          <li><Link to='/treemap' activeClassName='active'>Treemap</Link></li>
        </ul>
      </nav>
    )
  }
}

export default Nav
