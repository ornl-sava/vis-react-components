import React, { PropTypes } from 'react'
import { spreadRelated } from '../util/react'
import {Chart} from '../'
import TopicFlow from '../TopicFlow'
import ColorView from '../ColorView'

const maxNumTopics = 60
const hTop = maxNumTopics * (20 + 15)

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
  }
  _onGroupClick (toggleList) {
    // takes toggle list and updates clickArray state
    // console.log('toggleList', toggleList)
    this.setState({clickArray: toggleList}, () => {
      this.refs.updateChart.forceUpdate()
      this.refs.updateChart2.forceUpdate()
    })
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
  render () {
    console.log('adjacencyList-TC', this.props.adjacencyList)
    let props = this.props
    return (
      <div className='row' >
        <text className='top'></text>
        <Chart className='col-md-2' ref='updateChart2'{...spreadRelated(Chart, props)} tipFunction={this.toolTipFunction} yAxis={false} xAxis={false} xScaleType='linear' height={600}>
          <ColorView {...props} clickArray={this.state.clickArray} ref='colorView' onBarClick={this.onGroupClick} />
        </Chart>
        <Chart className='col-md-10' ref='updateChart'{...spreadRelated(Chart, props)} tipFunction={this.toolTipFunction} yAxis={false} xAxis={false} xScaleType='linear' height={hTop}>
          <TopicFlow {...props} clickArray={this.state.clickArray} />
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
  adjacencyList: {},
  tipFunction: () => null,
  data: [],
  ...Chart.defaultProps
}
TopicsChart.propTypes = {
  numTData: PropTypes.number,
  maxTopics: PropTypes.number,
  url: PropTypes.string,
  colorDomain: PropTypes.array,
  adjacencyList: PropTypes.array,
  tipFunction: PropTypes.func,
  data: PropTypes.array,
  ...Chart.propTypes
}

export default TopicsChart
