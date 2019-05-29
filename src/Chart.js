import React, { Children, cloneElement } from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import { select } from 'd3'

import Header from './Header'

class Chart extends React.Component {
  constructor (props) {
    super(props)

    this.chartWidth = props.width
    this.chartHeight = props.height
    if (props.addResizeListener) {
      props.addResizeListener(this.resizeChart.bind(this))
    }
    this.rootElement = React.createRef()
  }

  componentDidMount () {
    this._handleResize = debounce(this.resizeChart.bind(this), 50)
    window.addEventListener('resize', this._handleResize, false)
    this._handleResize() // Lets call take place after component has mounted
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this._handleResize, false)
  }

  resizeChart () {
    if (!this.rootElement.current) return
    let props = this.props
    let rootRect = this.rootElement.current.getBoundingClientRect()
    let svg = select(this.refs.svgRoot)

    this.chartWidth = props.width === 0
      ? rootRect.width - props.margin.left - props.margin.right
      : Math.min((rootRect.width - props.margin.left - props.margin.right),
        (props.width - props.margin.left - props.margin.right))
    this.chartHeight = props.height - props.margin.top - props.margin.bottom

    svg
      .attr('width', props.width === 0 ? rootRect.width : props.width)
      .attr('height', props.height)

    if (props.resizeHandler) props.resizeHandler()
    // this.forceUpdate()
  }

  renderChildren () {
    return Children.map(this.props.children, (e, i) => {
      return cloneElement(e, {
        margin: this.props.margin,
        chartWidth: this.chartWidth,
        chartHeight: this.chartHeight
      })
    })
  }

  render () {
    let { width, height, ...props } = this.props
    let left = props.margin.left
    let top = props.margin.top
    return (
      <div ref={this.rootElement} className={props.className} style={{ position: 'relative' }} data-name='chart-root'>
        {(this.chartWidth === 0 || this.chartHeight === 0)
          ? null
          : <Header chart={this} components={this.props.header} />
        }
        <svg ref='svgRoot' width={width} height={height}>
          {/* <defs>
            <clipPath id='clip'>
              <rect width={this.chartWidth} height={this.chartHeight} />
            </clipPath>
          </defs> */}
          {/* <g className='vis-container' transform={'translate(' + left + ',' + top + ')'}>
            <g className='vis-component'>
              {(this.chartWidth === 0 || this.chartHeight === 0)
                ? null
                : this.renderChildren()
              }
            </g>
          </g>
          */}
          {<g className='vis-component' transform={'translate(' + left + ',' + top + ')'}>
            {(this.chartWidth === 0 || this.chartHeight === 0)
              ? null
              : this.renderChildren()
            }
          </g>}
        </svg>
      </div>
    )
  }
}

Chart.defaultProps = {
  margin: { top: 0, right: 10, bottom: 20, left: 80 },
  width: 0,
  height: 250
}

Chart.propTypes = {
  resizeHandler: PropTypes.func,
  addResizeListener: PropTypes.func,
  header: PropTypes.func,
  children: PropTypes.any,
  className: PropTypes.string,
  margin: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number
}

export default Chart
