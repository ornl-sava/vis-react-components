import React from 'react'
import { NavLink } from 'react-router-dom'

class Nav extends React.Component {
  render () {
    return (
      <nav role='navigation'>
        <ul>
          <li><NavLink to='/histogram' activeClassName='active'>Histogram</NavLink></li>
          <li><NavLink to='/heatmap' activeClassName='active'>Heatmap</NavLink></li>
          <li><NavLink to='/scatterplot' activeClassName='active'>Scatterplot</NavLink></li>
          <li><NavLink to='/choropleth' activeClassName='active'>Choropleth Map</NavLink></li>
          <li><NavLink to='/scatterHeatmap' activeClassName='active'>Scatter Heatmap Hybrid</NavLink></li>
          <li><NavLink to='/circumshaker' activeClassName='active'>Circumshaker</NavLink></li>
          <li><NavLink to='/topics' activeClassName='active'>Topics</NavLink></li>
          <li><NavLink to='/forceDirected' activeClassName='active'>Force-Directed</NavLink></li>
          <li><NavLink to='/treemap' activeClassName='active'>Treemap</NavLink></li>
          <li><NavLink to='/horizonGraph' activeClassName='active'>Horizon Graph</NavLink></li>
          <li><NavLink to='/summaryTimeline' activeClassName='active'>Summary Timeline</NavLink></li>
        </ul>
      </nav>
    )
  }
}

export default Nav
