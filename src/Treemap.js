// partly inspired by https://bl.ocks.org/mbostock/6bbb0a7ff7686b124d80

import React from 'react'
import PropTypes from 'prop-types'
import { TransitionGroup } from 'react-transition-group'

import * as d3 from 'd3'

import { setEase } from './util/d3'
import SVGComponent from './SVGComponent'
import Tooltip from './Tooltip'

class Treemap extends React.Component {
  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.onLeave = this.onLeave.bind(this)
    this.tip = props.tipFunction
      ? new Tooltip().attr('className', 'd3-tip').html(props.tipFunction)
      : props.tipFunction
    this.state = {}
  }

  onClick (event, data, index) {
    if (this.props.zoom && data.children) {
      // the first setState is to make sure every component is properly initialized, to avoid a TransitionGroup error when that component tries to exit
      this.setState(this.state, () => {
        this.setState({selectedId: data.id})
      })
    } else {
      this.props.onClick(event, data, index)
    }
  }

  onEnter (event, data, index) {
    if (data && this.tip) {
      this.tip.show(event, data, index)
    }
    this.props.onEnter(event, data, index)
  }

  onLeave (event, data, index) {
    if (data && this.tip) {
      this.tip.hide(event, data, index)
    }
    this.props.onLeave(event, data, index)
  }

  componentWillUnmount () {
    if (this.props.tipFunction) {
      this.tip.destroy()
    }
  }

  render () {
    if (this.tip) {
      this.tip.hide()
      this.tip.destroy()
    }
    this.tip = this.props.tipFunction
      ? new Tooltip().attr('className', 'd3-tip').html(this.props.tipFunction)
      : this.props.tipFunction

    let w = this.props.width ? this.props.width : this.props.width
    let h = this.props.height ? this.props.height : this.props.height

    const barPadding = 2
    let barOffset = 0
    if (this.props.zoom) {
      barOffset = this.props.fontSize + 10 + 2 * barPadding
    }
    h = h - barOffset

    const manualPadding = this.props.stretch ? 2 : 0

    const ratio = this.props.stretch ? 4 : 1

    const treemap = d3.treemap()
      .size([w / ratio, h])
      .round(true)

    if (!this.props.stretch) {
      treemap.padding(2)
    }

    const getParent = (id, zoomOut) => {
      if (this.props.zoom && this.state.selectedId === id && !zoomOut) {
        return ''
      }
      return id.substring(0, id.lastIndexOf('.'))
    }

    const stratify = d3.stratify()
      .parentId(d => { return getParent(d.id) })

    let activeData = this.props.data

    if (this.props.zoom && this.state.selectedId) {
      activeData = []

      var stillThere = false

      this.props.data.map((d) => {
        if (d.id === this.state.selectedId || d.id.includes(this.state.selectedId + '.')) {
          activeData.push(d)
        }
        if (d.id === this.state.selectedId) {
          stillThere = true
        }
      })

      if (!stillThere) {
        this.state.selectedId = null
        activeData = this.props.data
      }
    }

    const root = stratify(activeData)
      .sum(d => { return this.props.sizeFunction(d) })
      .sort((a, b) => { return b.height - a.height || b.value - a.value })

    const colors = d3.scaleOrdinal(d3.schemeCategory20)

    treemap(root)

    let visibleNodes = []
    let overlayNodes = []
    if (this.props.zoom) {
      root.children.map((d) => {
        if (d.children) {
          visibleNodes = visibleNodes.concat(d.children)
        } else {
          visibleNodes.push(d)
        }
        overlayNodes.push(d)
      })
    } else {
      visibleNodes = root.leaves()
      overlayNodes = root.leaves()
    }

    let transitionFunc = {func: (transition, props) => {
      transition
        .delay(0)
        .duration(500)
        .ease(setEase('linear'))
        .attr('height', props.height)
        .attr('width', props.width)
        .attr('y', props.y)
        .attr('x', props.x)
        .attr('fill', props.fill)
      return transition
    }}

    return (
      // There used to be a TransitionGroup in place of the top SVGComponent, but that caused a strange bug. May need to add it back.
      <TransitionGroup component='g'>
        {this.props.zoom &&
          <SVGComponent Component='rect'
            key={'zoom rect'}
            x={barPadding + 'px'}
            y={barPadding + 'px'}
            width={w - 2 * barPadding + 'px'}
            height={barOffset - 2 * barPadding + 'px'}
            fill={'orange'}
            onClick={() => {
              if (this.state.selectedId) {
                this.setState({selectedId: getParent(this.state.selectedId, true)})
              }
            }}
            onUpdate={transitionFunc}
          />
        }
        {this.props.zoom &&
          <SVGComponent Component='text'
            key={'zoom text'}
            x={barPadding + 5 + 'px'}
            y={barPadding + 5 + this.props.fontSize + 'px'}
            fill={'black'}
            fontSize={this.props.fontSize + 'px'}
            onUpdate={transitionFunc}
          >
            {this.props.idDisplayFunction(root)}
          </SVGComponent>
        }
        {visibleNodes.map((d, i) => {
          let w = Math.max((d.x1 - d.x0) * ratio - manualPadding, 0)
          let h = Math.max(d.y1 - d.y0 - manualPadding, 0)
          return (
            <SVGComponent Component='svg'
              key={d.id + ' svg'}
              x={d.x0 * ratio + manualPadding + 'px'}
              y={barOffset + d.y0 + manualPadding + 'px'}
              width={w + 'px'}
              height={h + 'px'}
              onUpdate={transitionFunc}>
              <SVGComponent Component='rect'
                key={d.id + ' rect'}
                data={d}
                onUpdate={transitionFunc}
                x={'0px'}
                y={'0px'}
                width={w + 'px'}
                height={h + 'px'}
                fill={colors(getParent(d.id))}
              />
            </SVGComponent>
          )
        })}
        {overlayNodes.map((d) => {
          let w = Math.max((d.x1 - d.x0) * ratio - manualPadding, 0)
          let h = Math.max(d.y1 - d.y0 - manualPadding, 0)
          return (
            <SVGComponent Component='svg'
              key={d.id + ' svg'}
              x={d.x0 * ratio + manualPadding + 'px'}
              y={barOffset + d.y0 + manualPadding + 'px'}
              width={w + 'px'}
              height={h + 'px'}
              onUpdate={transitionFunc}>
              <SVGComponent Component='rect'
                key={d.id + ' rect'}
                data={d}
                onMouseEnter={this.onEnter}
                onMouseLeave={this.onLeave}
                onClick={this.onClick}
                onUpdate={transitionFunc}
                x={'0px'}
                y={'0px'}
                width={w + 'px'}
                height={h + 'px'}
                opacity={'0.0'}
              />
              <SVGComponent Component='text'
                key={d.id + ' text'}
                onMouseEnter={this.onEnter}
                onMouseLeave={this.onLeave}
                onClick={this.onClick}
                onUpdate={transitionFunc}
                x={5 + 'px'}
                y={2 + this.props.fontSize + 'px'}
                fill={'black'}
                data={d}
                fontSize={this.props.fontSize + 'px'}>
                { this.props.idDisplayFunction(d) }
              </SVGComponent>
            </SVGComponent>
          )
        })}
      </TransitionGroup>
    )
  }
}

Treemap.defaultProps = {
  onClick: () => {},
  onEnter: () => {},
  onLeave: () => {},
  data: [],
  sizeFunction: (d) => { return d.value },
  idDisplayFunction: (d) => { return d.id },
  fontSize: 12,
  zoom: false,
  stretch: false
}

Treemap.propTypes = {
  onClick: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  tipFunction: PropTypes.func,
  sizeFunction: PropTypes.func,
  idDisplayFunction: PropTypes.func,
  data: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number,
  chartWidth: PropTypes.number,
  chartHeight: PropTypes.number,
  fontSize: PropTypes.number,
  zoom: PropTypes.bool,
  stretch: PropTypes.bool
}

export default Treemap
