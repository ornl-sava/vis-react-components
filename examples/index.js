import React from 'react'
import ReactDom from 'react-dom'
import routes from './routes'
import './css/vis.css'
import './css/font-awesome.min.css'

console.info('Serving examples from vis/examples')
ReactDom.render(
  <div>{routes}</div>
  , document.getElementById('root')
)
