const fs = require('fs')
const process = require('process')
const express = require('express')
const compression = require('compression')

const publicDir = 'public'
const port = process.env.PORT || 8080

// Exit if the `public` directory doesnt exist.
try {
  fs.statSync(publicDir)
} catch (e) {
  console.log('The ' + publicDir + ' directory does not exist. Create it by running `npm run build`')
  process.exit(1)
}

var app = express()
app.use(compression())
app.use(express.static(publicDir))

// Redirect all requests back to /
app.all('*', function (req, res) {
  res.redirect('/')
})

console.log('Listening on port ' + port)
app.listen(port)
