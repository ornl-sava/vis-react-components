import React, { PropTypes } from 'react'
import { spreadRelated } from '../util/react'
import Chart from '../Chart'
import TopicFlow from '../TopicFlow'
import ColorView from '../ColorView'
import Tooltip from '../Tooltip'
import { format } from 'd3'

const maxNumTopics = 60
const hTop = maxNumTopics * (20 + 15)

const toolTipFunction = (data) => {
  var toolTip =
    '<span class="title">TopicID: ' + data.topic + '</span>' +
    '</span>Number of Common Events: ' + format(',')(data.events.length) +
    '<br /><small>'
  return toolTip
}

class TopicsChart extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      clickArray: []
    }
    this.onGroupClick = this._onGroupClick.bind(this)
    this.onClick = this._onBarClick
    this.topicData = []

    this.tip = toolTipFunction
      ? new Tooltip().attr('className', 'd3-tip').html(toolTipFunction)
      : toolTipFunction

    this.onBarEnter = this._onBarEnter.bind(this)
    this.onBarLeave = this._onBarLeave.bind(this)
  }
  _onGroupClick (toggleList) {
    // takes toggle list and updates clickArray state
    // console.log('toggleList', toggleList)
    this.setState({clickArray: toggleList})
  }
  _onBarEnter (event, data) {
    this.tip.show(event, data)
  }
  _onBarLeave (event, data) {
    this.tip.hide(event, data)
  }
  componentWillMount () {
    // console.log('topicData', topicData)
    return true
  }
  componentDidMount () {
    let setClickArr = {}
    for (let i = 0; i < this.props.colorDomain.length; i++) {
      setClickArr[this.props.colorDomain[i]] = true
    }
    this.setState({clickArray: setClickArr})
  }
  shouldComponentUpdate (nextProps, nextState) {
    return true
  }
  componentWillReceiveProps (nextProps) {
    return true
  }
  sort (props) {
    props.timeBins.map((data, index) => {
      data.topics.sort((a, b) => {
        return b[props.sortAccessor] - a[props.sortAccessor]
      })
    })
  }
  render () {
    let props = this.props
    this.sort(props)
    return (
      <div className='row' >
        <text className='top'></text>
        <Chart className='colorView col-md-2' ref='updateChart2'
          {...spreadRelated(Chart, props)}
          yAxis={false} xAxis={false} xScaleType='linear' height={600}>
          <ColorView {...props} clickArray={this.state.clickArray} ref='colorView' onBarClick={this.onGroupClick} />
        </Chart>
        <Chart className='topicFlow col-md-10' ref='updateChart'
          {...spreadRelated(Chart, props)}
          yAxis={false} xAxis={false} xScaleType='linear' height={hTop} margin={{top: 20, right: 20, bottom: 10, left: 20}} >
          <TopicFlow {...props} clickArray={this.state.clickArray} onEnter={this.onBarEnter} onLeave={this.onBarLeave} />
        </Chart>
        <text className='bottom'></text>
      </div>
    )
  }
}

TopicsChart.defaultProps = {
  url: '',
  numTData: 7,
  maxTopics: maxNumTopics,
  colorDomain: [],
  tipFunction: () => null,
  data: [],
  topicBins: [],
  sortAccessor: 'avg_composite_score',
  sortType: 'ascending',
  ...Chart.defaultProps
}
TopicsChart.propTypes = {
  numTData: PropTypes.number,
  maxTopics: PropTypes.number,
  url: PropTypes.string,
  colorDomain: PropTypes.array,
  tipFunction: PropTypes.func,
  data: PropTypes.array,
  topicBins: PropTypes.array,
  sortAccessor: PropTypes.string,
  sortType: PropTypes.string,
  ...Chart.propTypes
}

export default TopicsChart
