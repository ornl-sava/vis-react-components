import React from 'react'
import ReactDom from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
// import routes from './routes'

import './css/flexboxgrid.min.css'
import './css/vis.css'
import './css/font-awesome.min.css'

console.info('Serving examples from vis/examples')
ReactDom.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
  , document.getElementById('root')
)
