const user = require('./user')
const book = require('./book')

module.exports = app => {
  app.use('/api/user', user)
  app.use('/api/book', book)
}
