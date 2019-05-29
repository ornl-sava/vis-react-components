import React from 'react'
import PropTypes from 'prop-types'
import storyData from '../examples/data/for-hci/stories.json'
import eTopics from '../examples/data/for-hci/enduring-topics-listed.json'
import hrTopics from '../examples/data/for-hci/hourly-topics-listed.json'

class Tester extends React.Component {
  _onMouseEnter () {
  }
  _onMouseLeave () {
  }
  constructor (props) {
    super(props)
    this.stories = storyData
    this.endTopics = eTopics
    this.hrTopics = hrTopics
  }
  componentWillUnmount () {
  }
  /* buildButton () {
    position:relative;
    transition: .5s ease;
    top: 191px;
    left: 420px;
    right: -420px;
    bottom: -191px;
  } */
  render () {
    let buttonProps = { width: '100%', height: '50px' }
    /* console.log('storyLength', storyData.length)
    console.log('eTopics00,01', eTopics[0], eTopics[1])
    console.log('hrTopics00,01', hrTopics[0], hrTopics[1]) */
    // transform={'translate(' + (800) + ',' + 50 + ')'}
    return (
      <div className={this.props.className} >
        <button style={buttonProps}>oo lala</button>
        <button style={buttonProps}>oo lala 2</button>
      </div>
    )
  }
}

Tester.defaultProps = {
}

Tester.propTypes = {
  className: PropTypes.string.isRequired
}

export default Tester
