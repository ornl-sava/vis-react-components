// import React from 'react'
import React, { PropTypes } from 'react'
import d3 from 'd3'
// import {Chart} from 'vis'
import {Chart} from '../src'
import TopicFlow from '../src/TopicFlow'
import ColorView from '../src/ColorView'
import topicData from './data/topics.json'

const hTop = 60 * (20 + 15)

// when cursor over bar it spits out data
const toolTipFunction = (tooltipData) => {
  console.log('toolFData', tooltipData)
  let d = tooltipData
  var toolTip =
    '<span class="title">' + d.label + '</span>' +
    d3.format('n')(d.counts)
  return toolTip
}

// gets unique prefixes
const getPrefixes = (data) => {
  // getting data in right format
  let fData = Object.keys(data).map(key => { return topicData[key][0] })
  // let dataPref = []
  // console.log('fData', fData)
  fData = fData.map((arr, i) => {
    if (arr == null) {
      arr = 'EMPTY'
    }
    // console.log('split', arr.split(/:|-/, 1))
    // arr = arr.split(/:|-/, 1)
    let arrPref = arr.split(/:|-/, 1)
    return arrPref[0]
  })
  // console.log('nData', fData)
  return fData.filter((arr, i) => {
    return fData.indexOf(arr) === i
  })
}
const prefixes = getPrefixes(topicData)

// generates random data based on source
const getRandData = (topicData, amt) => {
  let dataArr = []
  let dataObj = {}
  for (let i = 0; i < amt; i++) {
    // gets random index of source data
    let rand = parseInt(Math.random() * Object.keys(topicData).length)
    if (dataArr.indexOf(rand) <= 0) {
      dataArr.push(rand)
    }
  }
  for (let i = 0; i < dataArr.length; i++) {
    dataObj[i] = topicData[dataArr[i]]
  }
  return dataObj
}

// combining the data into one obj
const allDataComb = (n) => {
  let numData = n
  let comData = []
  for (let i = 0; i < numData; i++) {
    if (i === 0) {
      comData[i] = Object.keys(topicData).map(key => { return topicData[key] })
    } else {
      // generates random number of topics between 15 and 45
      let amt = parseInt(Math.random() * 30 + 15)
      comData[i] = getRandData(topicData, amt)
      comData[i] = Object.keys(comData[i]).map(key => { return comData[i][key] })
    }
  }
  return comData
}

const nData = 7
const allData = allDataComb(nData)

class TopicsContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      loading: true,
      status: '',
      topArray: [],
      clickArray: []
    }
    // this.prefixes = prefixes
    // console.log('pref', this.prefixes)
    // We can use a different function for the stacked histogram
    // if we define it above and assign it to this.toolTipFunction
    this.toolTipFunction = toolTipFunction
    this.onClick = this._onBarClick.bind(this)
  }
  _onBarClick (toggleList) {
    let list = this.props.colorDomain
    console.log('toggleList', toggleList)
    list = list.filter((elem, index) => {
      // console.log('filterInd', toggleList[index])
      return toggleList[elem] === true
    })
    console.log('selectedList', list)
    console.log('loadingStatus', this.state.loading)
    this.setState({topArray: list, clickArray: toggleList}, () => {
      this.refs.updateChart.forceUpdate()
      this.refs.updateChart2.forceUpdate()
    })
  }
  componentWillMount () {
    // console.log('topicData', topicData)
  }
  componentDidMount () {
    // let setClickArr = new Array(this.props.colorDomain.length).fill(true)
    let setClickArr = {}
    for (let i = 0; i < this.props.colorDomain.length; i++) {
      setClickArr[this.props.colorDomain[i]] = true
    }
    // console.log('setClickArr', setClickArr)
    this.setState({clickArray: setClickArr})
    this.fetchData(this.props)
  }
  shouldComponentUpdate (nextProps, nextState) {
    console.log('here')
    // this.fetchData(nextProps)
    // return nextState.loading !== this.state.loading
    return true
  }
  componentWillReceiveProps (nextProps) {
    // this.fetchData(this.props)
    this.setState({loading: true})
    console.log('sCU')
    return true
  }
  fetchData (nextProps) {
    this.setState({data: [], loading: true, status: ''})
    // doesn't re-render if setting state twice
    // this would be where it updates data..
    // if the data didn't go beyond this ... loading wouldn't be set to false
    this.setState({data: allData, loading: false, status: 'OK'})
  }
  getStuff () {
    console.log('gettingSTUFF')
    return (
      <div className={'row ' + this.props.className}>
        <div className='row col-md-12'>
          <Chart ref='updateChart' {...this.props} {...this.state} topArray={this.state.topArray} tipFunction={this.toolTipFunction} yAxis={false} xAxis={false} height={hTop}>
            <TopicFlow {...this.props} clickArray={this.state.clickArray} topArray={this.state.topArray} colorView={this.refs.colorView} onBarClick={this.onClick} />
          </Chart>
        </div>
        <div className='row col-md-12'>
          <Chart ref='updateChart2'{...this.props} {...this.state} tipFunction={this.toolTipFunction} yAxis={false} xAxis={false} xScaleType='linear' height={600}>
            <ColorView {...this.props} clickArray={this.state.clickArray} ref='colorView' onBarClick={this.onClick} />
          </Chart>
        </div>
      </div>
    )
  }
  render () {
    console.log('renderTopicsContainerData: ', this.state.data)
    console.log('UPDATING!!!!')
    console.log(this.state.topArray)
    return this.getStuff()
  }
}

TopicsContainer.defaultProps = {
  url: '',
  endpoint: '',
  filterType: 'selectedFilter',
  height: 200,
  numTData: nData,
  numBins: 10,
  colorDomain: prefixes
}
TopicsContainer.propTypes = {
  className: PropTypes.string,
  endpoint: PropTypes.string,
  filterField: PropTypes.string,
  filterType: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  numTData: PropTypes.number,
  numBins: PropTypes.number,
  url: PropTypes.string,
  params: PropTypes.object.isRequired,
  updateFilter: PropTypes.func.isRequired,
  colorDomain: PropTypes.array
}

export default TopicsContainer
