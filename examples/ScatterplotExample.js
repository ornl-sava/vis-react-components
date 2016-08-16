import React from 'react'

import { ScatterplotChart } from '../src'
import { randomScatterData, linearOrdinalScatterplotData, linearLinearScatterplotData, ordinalLinearScatterplotData, ordinalOrdinalScatterplotData } from './data/exampleData'

const toolTipFunction = (d) => {
  let toolTip = '<span> No Data </span>'

  toolTip =
    '<span class="title">' + d.x + '</span>' + (d.y)
  return toolTip
}

const commonProps = {
  margin: {top: 15, right: 5, bottom: 50, left: 50},
  height: 300
}

const chartProps1 = {
  header: () => {
    return ([
      <span className='chart-title'>Linear over Linear</span>
    ])
  },
  className: 'scatter2',
  xScaleType: 'linear',
  yScaleType: 'linear',
  data: linearLinearScatterplotData
}

const chartProps2 = {
  header: () => {
    return ([
      <span className='chart-title'>Linear over Ordinal</span>
    ])
  },
  className: 'scatter1',
  xScaleType: 'linear',
  yScaleType: 'ordinalPoint',
  data: linearOrdinalScatterplotData
}

const chartProps3 = {
  header: () => {
    return ([
      <span className='chart-title'>Ordinal over Ordinal</span>
    ])
  },
  className: 'scatter4',
  xScaleType: 'ordinalPoint',
  yScaleType: 'ordinalPoint',
  data: ordinalOrdinalScatterplotData
}

const chartProps4 = {
  header: () => {
    return ([
      <span className='chart-title'>Ordinal over Linear</span>
    ])
  },
  className: 'scatter3',
  xScaleType: 'ordinalPoint',
  yScaleType: 'linear',
  data: ordinalLinearScatterplotData
}

const chartProps5 = {
  header: () => {
    return ([
      <span className='chart-title'>Animated</span>
    ])
  },
  className: 'scatter5',
  xScaleType: 'linear',
  yScaleType: 'linear'
}

class ScatterplotExample extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      randomData: randomScatterData()
    }
  }
  componentDidMount () {
    this.createRandomData = () => {
      setTimeout(() => {
        if (this.createRandomData !== null) {
          this.setState({
            randomData: randomScatterData()
          }, () => {
            if (this.createRandomData !== null) {
              this.createRandomData()
            }
          })
        }
      }, 2500)
    }
    this.createRandomData()
  }

  componentWillUnmount () {
    this.createRandomData = null
  }
  render () {
    return (
      <div className='col-md-12'>
        <div className='row'>
          <div className='col-md-6'>
            <ScatterplotChart {...commonProps} {...chartProps1} radius={10} tipFunction={toolTipFunction} />
          </div>
          <div className='col-md-6'>
            <ScatterplotChart {...commonProps} {...chartProps2} radius={10} tipFunction={toolTipFunction} />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-6'>
            <ScatterplotChart {...commonProps} {...chartProps3} radius={10} tipFunction={toolTipFunction} />
          </div>
          <div className='col-md-6'>
            <ScatterplotChart {...commonProps} {...chartProps4} radius={10} tipFunction={toolTipFunction} />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <ScatterplotChart data={this.state.randomData} {...commonProps} {...chartProps5} radius={15} tipFunction={toolTipFunction} />
          </div>
        </div>
      </div>
    )
  }
}

export default ScatterplotExample
