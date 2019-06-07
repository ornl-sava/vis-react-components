import React from 'react'

import Treemap from '../src/Treemap'
import Chart from '../src/Chart'
import { treemapData, treemapUpdateData } from './data/exampleData'

const toolTipFunction = (d) => {
  let toolTip = '<span> No Data </span>'

  toolTip =
    '<span class="title">' + idDisplay(d) + '</span>' + (d.value)
  return toolTip
}

const standardSize = (d) => {
  return d.value
}

const idDisplay = (d) => {
  return d.id
}

const chartCommon = {
  margin: { top: 5, right: 5, bottom: 50, left: 50 },
  height: 300
}

class TreemapExample extends React.Component {
  constructor (props) {
    super()
    this.data = treemapData
    this.doUpdate = this.doUpdate.bind(this)
  }

  doUpdate () {
    if (this.data.length < 8) {
      this.data = this.data.concat(treemapUpdateData)
      this.setState({ data: this.data })
    } else {
      this.data[2].value += 1
      this.setState({ data: this.data })
    }
  }

  render () {
    return (
      <div className='col-md-12'>
        <div className='row'>
          <div className='col-md-6'>
            <Chart {...chartCommon}>
              <Treemap data={this.data} tipFunction={toolTipFunction} sizeFunction={standardSize} idDisplayFunction={idDisplay} />
            </Chart>
          </div>
          <div className='col-md-6'>
            <Chart {...chartCommon}>
              <Treemap data={this.data} tipFunction={toolTipFunction} sizeFunction={standardSize} idDisplayFunction={idDisplay} stretch />
            </Chart>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-6'>
            <Chart {...chartCommon}>
              <Treemap data={this.data} tipFunction={toolTipFunction} sizeFunction={standardSize} idDisplayFunction={idDisplay} zoom />
            </Chart>
          </div>
          <div className='col-md-6'>
            <Chart {...chartCommon}>
              <Treemap data={this.data} tipFunction={toolTipFunction} sizeFunction={standardSize} idDisplayFunction={idDisplay} stretch zoom />
            </Chart>
          </div>
        </div>
        <button onClick={this.doUpdate}>Update</button>
      </div>
    )
  }
}

export default TreemapExample
