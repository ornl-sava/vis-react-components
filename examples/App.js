import React from 'react'

import Main from './Main'
import Nav from './Nav'

class App extends React.Component {
  render () {
    return (
      <div>
        <Nav />
        <Main />
      </div>
    )
  }
}

export default App
