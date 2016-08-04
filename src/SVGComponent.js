import React, { PropTypes } from 'react'
import { select, transition } from 'd3'
console.log(transition)
import { spreadExclude } from './util/react'

// Set prop types here so internal class methods can access prop types
const SVGComponentPropTypes = {
  // Container props
  Component: PropTypes.any,
  className: PropTypes.string,
  id: PropTypes.string,
  data: PropTypes.any,
  index: PropTypes.number,
  children: PropTypes.any,
  // Container enter/exit/update for animations
  onEnter: PropTypes.any,
  onUpdate: PropTypes.any,
  onExit: PropTypes.any,
  // Container action handlers
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onContextMenu: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseOut: PropTypes.func,
  onMouseOver: PropTypes.func
}

class SVGComponent extends React.Component {
  constructor (props) {
    super(props)

    // Need state that doesn't rely on setState triggers
    this.simpleState = Object.assign(spreadExclude(props, SVGComponentPropTypes))
    this.animate = this.animate.bind(this)

    this.onClick = this.onClick.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.onContextMenu = this.onContextMenu.bind(this)
    this.onDoubleClick = this.onDoubleClick.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseOut = this.onMouseOut.bind(this)
    this.onMouseOver = this.onMouseOver.bind(this)
  }

  shouldComponentUpdate () {
    // End transition early
    select(this.refs.node)
      .transition()
      .duration(0)

    return true
  }

  componentWillAppear (callback) {
    this.animate(callback, this.props, 'onEnter')
  }

  componentWillEnter (callback) {
    this.animate(callback, this.props, 'onEnter')
  }

  componentWillUpdate (nextProps) {
    this.animate(() => {}, nextProps, 'onUpdate')
  }

  componentWillLeave (callback) {
    this.animate(callback, this.props, 'onExit')
  }

  animate (callback, props, type) {
    let node = select(this.refs.node)
    let propsCopy = JSON.parse(JSON.stringify(spreadExclude(props, { children: '' })))
    node.transition(this.transition)
      .call((transition) => {
        props[type].func(transition, propsCopy)
      })
      .on('end', () => {
        this.simpleState = Object.assign(spreadExclude(props, SVGComponentPropTypes))
        callback()
      })
  }

  onClick (event) {
    this.props.onClick(event, this.props.data, this.props.index)
  }

  onMouseEnter (event) {
    this.props.onMouseEnter(event, this.props.data, this.props.index)
  }

  onMouseLeave (event) {
    this.props.onMouseLeave(event, this.props.data, this.props.index)
  }

  onContextMenu (event) {
    this.props.onContextMenu(event, this.props.data, this.props.index)
  }

  onDoubleClick (event) {
    this.props.onDoubleClick(event, this.props.data, this.props.index)
  }

  onMouseDown (event) {
    this.props.onMouseDown(event, this.props.data, this.props.index)
  }

  onMouseUp (event) {
    this.props.onMouseUp(event, this.props.data, this.props.index)
  }

  onMouseMove (event) {
    this.props.onMouseMove(event, this.props.data, this.props.index)
  }

  onMouseOut (event) {
    this.props.onMouseOut(event, this.props.data, this.props.index)
  }

  onMouseOver (event) {
    this.props.onMouseOver(event, this.props.data, this.props.index)
  }

  render () {
    let { Component, ...props } = this.props
    return (
      <Component
        ref='node'
        className={props.className}
        id={props.id}
        {...this.simpleState}
        onClick={this.onClick}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onContextMenu={this.onContextMenu}
        onDoubleClick={this.onDoubleClick}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseMove={this.onMouseMove}
        onMouseOut={this.onMouseOut}
        onMouseOver={this.onMouseOver}>
        {this.props.children}
      </Component>
    )
  }
}

SVGComponent.defaultProps = {
  Component: 'g',
  id: '',
  className: '',
  data: null,
  index: null,
  onEnter: {
    func: () => {}
  },
  onUpdate: {
    func: () => {}
  },
  onExit: {
    func: () => {}
  },
  onClick: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {},
  onContextMenu: () => {},
  onDoubleClick: () => {},
  onMouseDown: () => {},
  onMouseUp: () => {},
  onMouseMove: () => {},
  onMouseOut: () => {},
  onMouseOver: () => {}
}

SVGComponent.propTypes = SVGComponentPropTypes

export default SVGComponent
