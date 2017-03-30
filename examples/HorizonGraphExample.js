import React from 'react'

import HorizonGraphChart from '../src/premade/HorizonGraphChart'

let startData = [-6, -4, -2, -1, 0, 1, 2, 4, 5, 8, 6, 4, 2, 0, -1, -2, -4]

const xAccess = (d, i) => { return i }
const yAccess = (d) => { return d }

// extreme negative, common negative, common postive, extreme positive
const altColors = ['#ed9797', '#840000', '#08519c', '#bdd7e7']

class HorizonGraphExample extends React.Component {
  constructor (props) {
    super()
    this.data = startData
    this.position = 0
    this.update = this.update.bind(this)
    this.state = {}
    this.handleSelection = this.handleSelection.bind(this)
  }

  update () {
    this.data.push(this.data[this.position])
    this.position += 1
    this.setState({data: this.data})
  }

  handleSelection (index) {
    this.setState({selectedIndex: index})
  }

  render () {
    const chartCommon = {
      margin: {top: 10, right: 10, bottom: 50, left: 50},
      height: 150,
      xAccessor: xAccess,
      yAccessor: yAccess,
      xScaleType: 'linear',
      yScaleType: 'linear',
      handleSelection: this.handleSelection,
      selectedIndex: this.state.selectedIndex
    }

    return (
      <div className='col-md-12'>
        <div className='row'>
          <div className='col-md-12'>
            <HorizonGraphChart {...chartCommon} data={this.data} numBands={1} mode='offset' bgColor='black' />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <HorizonGraphChart {...chartCommon} data={this.data} numBands={2} mode='offset' bgColor='black' />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <HorizonGraphChart {...chartCommon} data={this.data} numBands={2} mid={2} mode='offset' bgColor='black' />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <HorizonGraphChart {...chartCommon} data={this.data} numBands={3} mode='offset' bgColor='black' />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <HorizonGraphChart {...chartCommon} data={this.data} numBands={1} mode='mirror' colors={altColors} />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <HorizonGraphChart {...chartCommon} data={this.data} numBands={2} mode='mirror' colors={altColors} />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <HorizonGraphChart {...chartCommon} data={this.data} numBands={2} mid={2} mode='mirror' colors={altColors} />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <HorizonGraphChart {...chartCommon} data={this.data} numBands={3} mode='mirror' colors={altColors} />
          </div>
        </div>
        <button onClick={this.update}>Update</button>
      </div>
    )
  }
}

export default HorizonGraphExample
