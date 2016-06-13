const fs = require('fs')
const process = require('process')
const express = require('express')
const compression = require('compression')

const exampleDir = 'examples'
const port = process.env.PORT || 8080

// Exit if the `public` directory doesnt exist.
try {
  fs.statSync(exampleDir)
} catch (e) {
  console.log('The ' + exampleDir + ' directory does not exist.`')
  process.exit(1)
}

var app = express()
app.use(compression())
app.use(express.static(exampleDir))

// Redirect all requests back to /
app.all('*', function (req, res) {
  res.redirect('/')
})

console.log('Listening on port ' + port)
app.listen(port)
