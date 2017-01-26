import React from 'react'

import { Treemap } from '../src'
import { treemapData } from './data/exampleData'

class TreemapExample extends React.Component {

  render () {
    return (
      <div>
        <Treemap data={treemapData} width={600} height={400} />
      </div>
    )
  }
}

export default TreemapExample

