import React, { PropTypes } from 'react'

// TODO: Create other various input fields to be used

// Helper to create dropdown options menu
class Dropdown extends React.Component {
  constructor (props) {
    super(props)

    this.onChange = this.onChange.bind(this)
  }

  onChange (event) {
    let props = this.props
    props.onChange(event.target.value, props.chart)
  }

  render () {
    let props = this.props
    let chart = props.chart
    return (
      <div>
        <label>{props.label}</label>
        <select onChange={this.onChange} value={props.defaultSelected(chart)}>
          {props.options.map((d, i) => {
            return (<option key={i} value={d}>{d}</option>)
          })}
        </select>
      </div>
    )
  }
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
    let height = chart.state.chartHeight

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
        left: width + margin.left
      },
      onClick: this.openMenu
    }

    let menuProps = {
      className: 'settings-menu',
      style: {
        position: 'absolute',
        display: this.state.menuDisplay,
        zIndex: this.state.menuZIndex,
        width: (width + margin.left) / 2,
        height: height,
        top: 0,
        left: (width + margin.left) / 2
      }
    }

    return (
      <div {...containerProps}>
        <span {...iconProps} />
        <div {...menuProps}>
          <span className='settings-title'>{settings.title}</span>
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
