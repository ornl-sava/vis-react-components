import React, { PropTypes } from 'react'
import d3 from 'd3'

// Copy pasted from:
// http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key
// Using to easily access nested object of passed in component
Object.byString = (o, s) => {
  s = s.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
  s = s.replace(/^\./, '')           // strip a leading dot
  var a = s.split('.')
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i]
    if (k in o) {
      o = o[k]
    } else {
      return
    }
  }
  return o
}

class Legend extends React.Component {
  render () {
    if (this.props.component === null) {
      return <g />
    }
    let { component, scaleAccessor, height, width, margin } = this.props
    let colorScale = Object.byString(component, scaleAccessor)
    if (colorScale.range().length === 0) {
      return <g />
    }
    let xPos = 0
    let yPos = height + margin.bottom / 2
    let legendBlockWidth = (width) / colorScale.range().length
    let legendHeight = 4

    return (
      <g className='legend' transform={'translate(' + xPos + ',' + yPos + ')'}>
        {colorScale.range().map((d, i) => {
          let rectProps = {
            'x': i * legendBlockWidth,
            'y': 0,
            'width': legendBlockWidth,
            'height': legendHeight,
            'fill': d
          }
          return (
            <rect key={i} {...rectProps} />
          )
        })}
        <text x={0} y={14}>
          {d3.format('n')(Math.round(colorScale.domain()[0]))}
        </text>
        <text x={(colorScale.range().length) * legendBlockWidth} y={15} textAnchor='end'>
          {d3.format('n')(Math.round(colorScale.domain()[colorScale.domain().length - 1]))}
        </text>
      </g>
    )
  }
}

Legend.defaultProps = {
  component: null,
  scaleAccessor: 'state.colorScale',
  margin: {top: 0, right: 0, bottom: 0, left: 0},
  height: 0,
  width: 0
}

Legend.propTypes = {
  component: PropTypes.any,
  scaleAccessor: PropTypes.string,
  margin: PropTypes.object,
  height: PropTypes.number,
  width: PropTypes.number
}

export default Legend
