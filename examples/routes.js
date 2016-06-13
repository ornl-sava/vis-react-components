import React from 'react'
import { IndexRedirect, Route, Router, browserHistory } from 'react-router'

import App from './App'
import HistogramExample from './HistogramExample'
import HeatmapExample from './HeatmapExample'
import ScatterplotExample from './ScatterplotExample'
import ChoroplethExample from './ChoroplethExample'

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
