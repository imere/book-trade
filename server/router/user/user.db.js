const mg = require('mongoose')
const config = require('../../config')

mg.connect(config.uri, { useNewUrlParser: true })

const userSchema = {
  user: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator (v) {
        return /^[a-zA-Z]{1}[a-zA-Z0-9]{4,14}$/.test(v)
      }
    }
  },
  pass: {
    type: String,
    required: true,
    validate: {
      validator (v) {
        return /^[a-zA-Z0-9]{5,15}$/.test(v)
      }
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator (v) {
        return /^(www\.)?[\w]+@[a-zA-Z]+\.[a-zA-Z]+$/.test(v)
      }
    }
  },
  state: {
    type: String,
    default: ''
  },
  book: {
    type: Array
  }
}

const User = mg.model('user', userSchema)

module.exports = User
