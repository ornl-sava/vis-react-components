import React, { PropTypes } from 'react'

class Scatterplot extends React.Component {
  constructor (props) {
    super(props)

    this.onClick = this.onClick.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.onLeave = this.onLeave.bind(this)
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
    return this.props.data[i]
  }

  render () {
    let props = this.props
    return (
      <g className={props.className}>
        {this.props.data.map((d, i) => {
          let circleProps = {
            'data-i': i,
            'r': props.radius,
            'cx': props.xScale(d[props.xAccessor]),
            'cy': props.yScale(d[props.yAccessor]),
            'onMouseEnter': this.onEnter,
            'onMouseLeave': this.onLeave,
            'onClick': this.onClick
          }
          return (
            <circle key={i} {...circleProps} />
          )
        })}
      </g>
    )
  }
}

Scatterplot.defaultProps = {
  xAccessor: 'x',
  yAccessor: 'y',
  radius: 5,
  onClick: () => {},
  onEnter: () => {},
  onLeave: () => {}
}

Scatterplot.propTypes = {
  chartHeight: PropTypes.number,
  chartWidth: PropTypes.number,
  className: PropTypes.string,
  radius: PropTypes.number,
  xAccessor: PropTypes.string,
  yAccessor: PropTypes.string,
  xScale: PropTypes.any,
  yScale: PropTypes.any,
  data: PropTypes.array,
  onClick: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func
}

export default Scatterplot
