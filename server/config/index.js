const path = require('path')
const bodyParser = require('body-parser')
const compression = require('compression')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const resolve = (p) => {
  return path.join(__dirname, '../../', p)
}

module.exports = {
  uri: process.env.uri,
  port: process.env.PORT || 8000,
  root: resolve('dist'),
  url: 'https://api.douban.com/v2/book',
  middleware: [
    compression(),
    bodyParser.urlencoded({ extended: true }),
    bodyParser.json(),
    session({
      secret: 'a89fcb187be2cd29',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({
        url: process.env.suri,
        ttl: 60 * 60 * 24
      })
    })
  ]
}
