import React from 'react'
import { IndexRedirect, Route, Router, browserHistory } from 'react-router'

import App from './App'
import HistogramExample from './HistogramExample'
// import HeatmapExample from './HeatmapExample'
// import ScatterplotExample from './ScatterplotExample'
// import ChoroplethExample from './ChoroplethExample'
// import ScatterHeatmapExample from './ScatterHeatmapExample'
// import CircumshakerExample from './CircumshakerExample'
// import TopicsExample from './TopicsExample'

const reactRouterRoutes = (
  <Router history={browserHistory}>
    <Route path='/' component={App}>
      <IndexRedirect to='/histogram' />
      <Route path='/histogram' component={HistogramExample} />
    </Route>
  </Router>
)

// <Route path='/heatmap' component={HeatmapExample} />
// <Route path='/scatterplot' component={ScatterplotExample} />
// <Route path='/choropleth' component={ChoroplethExample} />
// <Route path='/scatterHeatmap' component={ScatterHeatmapExample} />
// <Route path='/circumshaker' component={CircumshakerExample} />
// <Route path='/topics' component={TopicsExample} />
export default reactRouterRoutes
