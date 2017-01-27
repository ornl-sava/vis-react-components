import React from 'react'

import Treemap from '../src/Treemap'
import { treemapData } from './data/exampleData'

class TreemapExample extends React.Component {

  render () {
    return (
      <div width={600} height={400}>
        <svg width={600} height={400}>
          <Treemap data={treemapData} width={600} height={400} />
        </svg>
      </div>
    )
  }
}

export default TreemapExample

