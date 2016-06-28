import React from 'react'
import ReactDom from 'react-dom'
import routes from './routes'
import './vis.css'
import './icono.min.css'
import './flexboxgrid.min.css'

console.info('Serving examples from vis/examples')
ReactDom.render(
  <div>{routes}</div>
  , document.getElementById('root')
)
