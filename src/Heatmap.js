import React, { PropTypes } from 'react'

class Heatmap extends React.Component {
  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.onLeave = this.onLeave.bind(this)

    this.getDatum = this.getDatum.bind(this)
  }

  onClick (event) {
    let target = event.target
    this.props.onClick(event, this.getDatum(target))
  }

  onEnter (event) {
    let target = event.target
    this.props.onEnter(event, this.getDatum(target))
  }

  onLeave (event) {
    let target = event.target
    this.props.onLeave(event, this.getDatum(target))
  }

  getDatum (target) {
    let i = target.getAttribute('data-i')
    let j = target.getAttribute('data-j')
    return this.props.data[i].bins[j]
  }

  render () {
    let props = this.props
    return (
      <g className={props.className}>
        {props.data.map((d, i) => {
          let height = (i === 0) ? props.chartHeight : props.yScale(props.data[i - 1][props.yAccessor.key])
          height -= props.yScale(d[props.yAccessor.key])
          return d.bins.map((e, j) => {
            let width = (j + 1 < d.bins.length) ? props.xScale(d.bins[j + 1][props.xAccessor.key]) : props.chartWidth
            width -= props.xScale(e[props.xAccessor.key])
            let rectProps = {
              'data-i': i,
              'data-j': j,
              'key': i + '-' + j,
              'x': props.xScale(e[props.xAccessor.key]),
              'y': props.yScale(d[props.yAccessor.key]),
              'width': width,
              'height': height,
              'fill': props.colorScale(e[props.xAccessor.value]),
              'onMouseEnter': this.onEnter,
              'onMouseLeave': this.onLeave,
              'onClick': this.onClick
            }
            return (
              <rect {...rectProps} />
            )
          })
        })}
      </g>
    )
  }
}

Heatmap.defaultProps = {
  minColor: '#eff3ff',
  maxColor: '#2171b5',
  numColorCat: 11,
  colorPerRow: true,
  labelField: 'label',
  xAccessor: {
    key: 'key',
    value: 'value'
  },
  yAccessor: {
    key: 'key',
    value: 'value'
  },
  onClick: () => {},
  onEnter: () => {},
  onLeave: () => {}
}

Heatmap.propTypes = {
  minColor: PropTypes.string,
  maxColor: PropTypes.string,
  numColorCat: PropTypes.number,
  colorPerRow: PropTypes.bool,
  labelField: PropTypes.string,
  xAccessor: PropTypes.object,
  yAccessor: PropTypes.object,
  chartHeight: PropTypes.number,
  chartWidth: PropTypes.number,
  className: PropTypes.string,
  data: PropTypes.array,
  onClick: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  xScale: PropTypes.any,
  yScale: PropTypes.any
}

export default Heatmap
