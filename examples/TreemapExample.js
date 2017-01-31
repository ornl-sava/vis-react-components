import React from 'react'

import Treemap from '../src/Treemap'
import { treemapData, treemapUpdateData } from './data/exampleData'

const toolTipFunction = (d) => {
  let toolTip = '<span> No Data </span>'

  toolTip =
    '<span class="title">' + d.id + '</span>' + (d.value)
  return toolTip
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
      this.setState({data: this.data})
    } else {
      this.data[2].value += 1
      this.setState({data: this.data})
    }
  }

  render () {
    return (
      <div width={600} height={450}>
        <svg width={600} height={400}>
          <Treemap data={this.data} width={600} height={400} tipFunction={toolTipFunction} />
        </svg>
        <button onClick={this.doUpdate}>Update</button>
      </div>
    )
  }
}

export default TreemapExample

