import React from 'react'

import HorizonGraphChart from '../src/premade/HorizonGraphChart'
import Settings from '../src/Settings'

let startData = [-6, -4, -2, -1, 0, 1, 2, 4, 5, 8, 6, 4, 2, 0, -1, -2, -4, 10, 3, 7, 11, 5]

const xAccess = (d, i) => { return i }
const yAccess = (d) => { return d }

// extreme negative, common negative, common postive, extreme positive
const altColors = ['#ed9797', '#840000', '#08519c', '#bdd7e7']

// const mouseEventPollyFill = (event) => {
//   let newEvent = null
//   if (typeof window.Event === 'function') {
//     newEvent = new MouseEvent('mousedown', event)
//     // console.log(Object.keys(event))
//     // console.log(event)
//   } else {
//     newEvent = document.createEvent('MouseEvent')
//     newEvent.initMouseEvent('mousedown', true, true, window, event.detail,
//       event.screenX, event.screenY,
//       event.clientX, event.clientY,
//       event.ctrlKey, event.altKey, event.shiftKey, event.metaKey,
//       event.button, event.relatedTarget
//     )
//   }
//   return (newEvent)
// }

class HorizonGraphExample extends React.Component {
  constructor (props) {
    super()
    this.data = startData.sort((a, b) => a - b)
    this.position = 0
    this.update = this.update.bind(this)
    this.onBrush = this._onBrush.bind(this)
    this.state = {}
    this.handleSelection = this.handleSelection.bind(this)
    this.state = {
      data: this.data
    }
    this.header = () => {
      return ([
        <span className='options'>
          {this.settings !== null
            ? <Settings icon='fa fa-cogs' settings={this.settings} />
            : undefined
          }
        </span>
      ])
    }

    this.settings = {
      options: [
        {
          type: 'input',
          label: 'Midpoint',
          onChange: (value) => {
            let n = Number(value)
            if (isNaN(n)) {
              n = null
            }
            this.setState({
              mid: n
            })
          }
        }
      ]
    }
  }
  mouseMoveHandler (event) {
    console.log('mousemove')
    console.log(this)
  }
  _onBrush (selection) {
    console.log('onBrush')
    console.log(selection)

    let d = this.state.data
    console.log(d)
    let low = -1
    let high = d.length
    for (let i = 0; i < d.length - 1; i++) {
      if (d[i] <= selection[0] && d[i + 1] >= selection[0]) {
        low = i
      }
      if (d[i] <= selection[1] && d[i + 1] >= selection[1]) {
        high = i + 1
      }
    }
    let data = d.slice(low, high)

    console.log(data)
    this.setState({
      data
    })
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
            <HorizonGraphChart
              brushID='0'
              {...chartCommon}
              data={this.state.data}
              numBands={1}
              mode='offset'
              bgColor='black'
              onBrush={this.onBrush}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <HorizonGraphChart brushID='1' mouseMoveHandler={this.mouseMoveHandler} {...chartCommon} data={this.state.data} numBands={2} mode='offset' bgColor='black' header={this.header} mid={this.state.mid} />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <HorizonGraphChart brushID='2' {...chartCommon} data={this.state.data} numBands={2} mid={2} domainHeight={12} mode='offset' bgColor='black' />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <HorizonGraphChart brushID='3' {...chartCommon} data={this.state.data} numBands={3} mode='offset' bgColor='black' />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <HorizonGraphChart brushID='4' {...chartCommon} data={this.state.data} numBands={1} mode='mirror' colors={altColors} />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <HorizonGraphChart brushID='5' {...chartCommon} data={this.state.data} numBands={2} mode='mirror' colors={altColors} />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <HorizonGraphChart brushID='6' {...chartCommon} data={this.state.data} numBands={2} mid={2} domainHeight={12} mode='mirror' colors={altColors} />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <HorizonGraphChart brushID='7' {...chartCommon} data={this.state.data} numBands={3} mode='mirror' colors={altColors} />
          </div>
        </div>
        <button onClick={this.update}>Update</button>
      </div>
    )
  }
}

export default HorizonGraphExample
