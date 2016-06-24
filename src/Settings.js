import React, { PropTypes } from 'react'

// TODO: Create other various input fields to be used

// Helper to create dropdown options menu
class Dropdown extends React.Component {
  constructor (props) {
    super(props)

    this.onChange = this.onChange.bind(this)
    this.defaultValue = props.defaultSelected(props.chart)
  }

  onChange (event) {
    let value = event.target.value
    this.defaultValue = value
    this.props.onChange(value, this.props.chart)
  }

  render () {
    let props = this.props
    return (
      <div className='settings-option'>
        <label>{props.label}</label>
        <select onChange={this.onChange} value={this.defaultValue}>
          {props.options.map((d, i) => {
            return (<option key={i} value={d}>{d}</option>)
          })}
        </select>
      </div>
    )
  }
}

Dropdown.propTypes = {
  defaultSelected: PropTypes.any,
  onChange: PropTypes.any,
  chart: PropTypes.object
}

class Settings extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      menuDisplay: 'none',
      menuZIndex: -9998
    }

    this.openMenu = this.openMenu.bind(this)
  }

  openMenu () {
    let display = this.state.menuDisplay === 'none'
      ? 'block'
      : 'none'
    this.setState({
      menuDisplay: display,
      menuZIndex: 9998
    })
  }

  render () {
    let props = this.props
    let settings = props.settings
    let chart = props.chart
    let margin = chart.props.margin
    let width = chart.state.chartWidth

    let longestLen = 0
    longestLen = settings.options.reduce((a, b) => {
      let aStringLen = 0
      let bStringLen = 0
      if (typeof a.label !== 'undefined') {
        aStringLen = a.label.length + a.options.reduce((f, g) => {
          return f.length > g.length ? f.length : g.length
        }, 0)
      }
      if (typeof b.label !== 'undefined') {
        bStringLen = b.label.length + b.options.reduce((f, g) => {
          return f.length > g.length ? f.length : g.length
        }, 0)
      }
      return aStringLen > bStringLen ? aStringLen : bStringLen
    }, 0)

    // NOTE: Currently a bit arbitrary; just need something larger
    // then font size that also accounts for the dropdown itself
    let minWidth = longestLen * 11

    let containerProps = {
      className: 'settings-container',
      style: {
        position: 'absolute',
        top: 0,
        left: 0
      }
    }

    let iconProps = {
      className: props.icon + ' settings-icon',
      style: {
        zIndex: 9999,
        position: 'absolute',
        top: 0,
        transform: 'translate(' + (width + margin.left + margin.right) + 'px,0px)'
      },
      onClick: this.openMenu
    }

    let menuProps = {
      className: 'settings-menu',
      style: {
        position: 'absolute',
        display: this.state.menuDisplay,
        zIndex: this.state.menuZIndex,
        width: (width + margin.left) - (width + margin.left + margin.right - minWidth),
        top: 0,
        transform: 'translate(' + (width + margin.left - minWidth) + 'px,0px)'
      }
    }

    return (
      <div {...containerProps}>
        <span {...iconProps} />
        <div {...menuProps}>
          <div className='settings-title'>{settings.title}</div>
          {settings.options.map((d, i) => {
            if (d.type === 'dropdown') {
              return (<Dropdown key={i} chart={chart} {...d} />)
            }
          })}
        </div>
      </div>
    )
  }
}

Settings.defaultProps = {
  settings: {},
  chart: null,
  icon: 'icono-gear'
}

Settings.propTypes = {
  settings: PropTypes.object,
  chart: PropTypes.object,
  icon: PropTypes.string
}

export default Settings
