import React from 'react'
import { IndexRedirect, Route, Router, browserHistory } from 'react-router'

import App from './pages/App'
import HistogramExample from './pages/HistogramExample'
import HeatmapExample from './pages/HeatmapExample'
import ScatterplotExample from './pages/ScatterplotExample'
import ChoroplethExample from './pages/ChoroplethExample'

const reactRouterRoutes = (
  <Router history={browserHistory}>
    <Route path='/' component={App}>
      <IndexRedirect to='/histogram' />
      <Route path='/histogram' component={HistogramExample} />
      <Route path='/heatmap' component={HeatmapExample} />
      <Route path='/scatterplot' component={ScatterplotExample} />
      <Route path='/choropleth' component={ChoroplethExample} />
    </Route>
  </Router>
)

export default reactRouterRoutes
