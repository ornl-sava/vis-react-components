import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import HistogramExample from './HistogramExample'
import HeatmapExample from './HeatmapExample'
import ScatterplotExample from './ScatterplotExample'
import ChoroplethExample from './ChoroplethExample'
import CircumshakerExample from './CircumshakerExample'
import ScatterHeatmapExample from './ScatterHeatmapExample'
import TopicsExample from './TopicsExample'
import SingleTopicExample from './SingleTopicExample'
import ForceDirectedGraphExample from './ForceDirectedGraphExample'
import ForceDirectedTreeGraphExample from './ForceDirectedTreeGraphExample'
import TreemapExample from './TreemapExample'
import HorizonGraphExample from './HorizonGraphExample'
import SummaryTimelineExample from './SummaryTimelineExample'

class Main extends React.Component {
  // NOTE the Redirect needs to be last, or the page won't render
  // This may be a bug with the router????
  render () {
    return (
      <Switch>
        <Route exact path='/histogram' component={HistogramExample} />
        <Route exact path='/heatmap' component={HeatmapExample} />
        <Route exact path='/scatterplot' component={ScatterplotExample} />
        <Route exact path='/choropleth' component={ChoroplethExample} />
        <Route exact path='/circumshaker' component={CircumshakerExample} />
        <Route exact path='/scatterHeatmap' component={ScatterHeatmapExample} />
        <Route exact path='/topics' component={TopicsExample} />
        <Route exact path='/id' component={SingleTopicExample} />
        <Route exact path='/forceDirected' component={ForceDirectedGraphExample} />
        <Route exact path='/forceDirectedTree' component={ForceDirectedTreeGraphExample} />
        <Route exact path='/treemap' component={TreemapExample} />
        <Route exact path='/horizonGraph' component={HorizonGraphExample} />
        <Route exact path='/summaryTimeline' component={SummaryTimelineExample} />
        <Redirect from='/' to='/histogram' />
      </Switch>
    )
  }

}
export default Main
