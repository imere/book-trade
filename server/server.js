const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const config = require('./config')

if (config.middleware && config.middleware.length) {
  for (const mw of config.middleware) {
    app.use(mw)
  }
}

app.use(express.static(config.root))

app.get('/*?$/', (req, res) => {
  res.header({
    'Content-Type': 'html',
    'Cache-Control': 'no-cache'
  })
  res.send(fs.readFileSync(path.join(config.root, '/index.html')))
})

require('./router')(app)

app.listen(config.port, () => {
  console.log(`Listening on port ${ config.port }`)
})
