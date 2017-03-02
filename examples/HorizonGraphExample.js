import React from 'react'

import HorizonGraph from '../src/HorizonGraph'
import Chart from '../src/Chart'

let startData = [-6, -4, -2, -1, 0, 1, 2, 4, 5, 8, 6, 4, 2, 0, -1, -2, -4]

const chartCommon = {
  margin: {top: 5, right: 5, bottom: 5, left: 5},
  height: 100
}

const identity = (d) => { return d }

// extreme negative, common negative, common postive, extreme positive
const altColors = ['#ed9797', '#840000', '#08519c', '#bdd7e7']

class HorizonGraphExample extends React.Component {
  constructor (props) {
    super()
    this.data = startData
    this.position = 0
    this.update = this.update.bind(this)
  }

  update () {
    this.data.push(this.data[this.position])
    this.position += 1
    this.setState({data: this.data})
  }

  render () {
    return (
      <div className='col-md-12'>
        <div className='row'>
          <div className='col-md-12'>
            <Chart {...chartCommon}>
              <HorizonGraph data={this.data} accessor={identity} numBands={1} mode='offset' bgColor='black' />
            </Chart>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <Chart {...chartCommon}>
              <HorizonGraph data={this.data} accessor={identity} numBands={2} mode='offset' bgColor='black' />
            </Chart>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <Chart {...chartCommon}>
              <HorizonGraph data={this.data} accessor={identity} numBands={3} mode='offset' bgColor='black' />
            </Chart>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <Chart {...chartCommon}>
              <HorizonGraph data={this.data} accessor={identity} numBands={1} mode='mirror' colors={altColors} />
            </Chart>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <Chart {...chartCommon}>
              <HorizonGraph data={this.data} accessor={identity} numBands={2} mode='mirror' colors={altColors} />
            </Chart>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <Chart {...chartCommon}>
              <HorizonGraph data={this.data} accessor={identity} numBands={3} mode='mirror' colors={altColors} />
            </Chart>
          </div>
        </div>
        <button onClick={this.update}>Update</button>
      </div>
    )
  }
}

export default HorizonGraphExample
