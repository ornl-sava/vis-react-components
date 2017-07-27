import React, { Children, cloneElement } from 'react'
import PropTypes from 'prop-types'

// TODO: Create other various input types to be used

// Helper to create dropdown options menu
class Dropdown extends React.PureComponent {
  constructor (props) {
    super(props)

    this.onChange = this.onChange.bind(this)
    this.defaultValue = props.defaultSelected(props.chart)
  }

  onChange (event) {
    let value = event.target.value
    this.defaultValue = value
    this.forceUpdate()
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

class Input extends React.PureComponent {
  constructor (props) {
    super(props)

    this.onKeyPress = this.onKeyPress.bind(this)
  }

  onKeyPress (event) {
    if (event.key === 'Enter') {
      this.props.onChange(event.target.value)
    }
  }

  render () {
    let props = this.props
    return (
      <div className='settings-option'>
        <label>{props.label}</label>
        <input onKeyPress={this.onKeyPress} />
      </div>
    )
  }
}

Input.propTypes = {
  onChange: PropTypes.any
}

class Settings extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      menuDisplay: 'none'
    }

    this.openMenu = this.openMenu.bind(this)
  }

  openMenu () {
    let display = this.state.menuDisplay === 'none'
      ? 'block'
      : 'none'
    this.setState({
      menuDisplay: display
    })
  }

  render () {
    let settings = this.props.settings
    let chart = this.props.chart

    let containerProps = {
      className: 'settings-container',
      style: {
        position: 'relative',
        top: 0,
        left: 0,
        zIndex: 100
      }
    }
    let iconJSX = this.props.iconFunction ? this.props.iconFunction() : <span />

    let iconProps = {
      className: this.props.icon ? this.props.icon + ' settings-icon' : 'settings-icon',
      style: {
        zIndex: 103,
        top: 0
      },
      onClick: this.openMenu
    }
    iconJSX = cloneElement(Children.only(iconJSX), {...iconProps})

    let menuProps = {
      className: 'settings-menu',
      style: {
        position: 'absolute',
        display: this.state.menuDisplay,
        zIndex: -100,
        width: this.props.width,
        top: 0,
        transform: 'translate(' + -this.props.width + 'px,0px)'
      }
    }

    return (
      <div {...containerProps}>
        {iconJSX}
        <div {...menuProps}>
          <div className='settings-title'>{settings.title}</div>
          {settings.options.map((d, i) => {
            if (d.type === 'dropdown') {
              return (<Dropdown key={i} chart={chart} {...d} />)
            }
            if (d.type === 'input') {
              return (<Input key={i} chart={chart} {...d} />)
            } // Check for render other types of input here
          })}
        </div>
      </div>
    )
  }
}

Settings.defaultProps = {
  settings: {},
  chart: null,
  width: 200
}

Settings.propTypes = {
  settings: PropTypes.object,
  chart: PropTypes.object,
  width: PropTypes.number.isRequired,
  icon: PropTypes.string,
  iconFunction: PropTypes.func
}

export default Settings
