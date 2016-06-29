import React from 'react'
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
  render () {
    /* console.log('storyLength', storyData.length)
    console.log('eTopics00,01', eTopics[0], eTopics[1])
    console.log('hrTopics00,01', hrTopics[0], hrTopics[1])*/
    return null
  }
}

Tester.defaultProps = {
}

Tester.propTypes = {
}

export default Tester
