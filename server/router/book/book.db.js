const mg = require('mongoose')
const config = require('../../config')

mg.connect(config.uri, { useNewUrlParser: true })

const bookSchema = {
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  pic: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    default: ''
  },
  acc: {
    type: Boolean,
    default: false
  }
}

const Book = mg.model('book', bookSchema)

module.exports = Book
