import React from 'react'
import ReactDom from 'react-dom'
import routes from './routes'
import './vis.css'

ReactDom.render(
  <div>{routes}</div>
  , document.getElementById('root')
)
