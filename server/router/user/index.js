const router = require('express').Router()
const User = require('./user.db.js')
const auth = require('../../auth')

const check = auth.check

// signin
router.post('/info', (req, res) => {
  User.findOne({
    user: req.body.user,
    pass: req.body.pass
  },  (err, doc) => {
    if (err) {
      return res.status(500).json({ ok: false })
    } else if (!doc) {
      return res.status(404).json({ ok: false })
    }
    req.session.user = req.body.user
    res.json(doc)
  })
})

// signup
router.post('/', (req, res)=> {
  let data = {
    user: req.body.user,
    pass: req.body.pass,
    email: req.body.email
  }
  if (req.body.state) {
    Object.assign(data, { state: req.body.state })
  }
  User.insertMany(data, err => {
    if (err) {
      if (err.message.indexOf('duplicate') !== -1) {
        return res.status(400).json({ msg: 'Exist' })
      }
      return res.status(500).json({ ok: false })
    }
    res.json({ ok: true })
  })
})

// update password
router.put('/pass', check, (req, res) => {
  User.findOneAndUpdate({
    user: req.session.user,
    pass: req.body.opass
  }, {
    $set: {
      pass: req.body.pass
    }
  }, (err, doc) => {
    if (err) {
      return res.status(500).json({ ok: false })
    } else if (!doc) {
      return res.status(400).json({ msg: 'incorrect' })
    }
    res.status(201).json({ ok: true })
  })
})


// update state
router.put('/state', check, (req, res) => {
  User.findOneAndUpdate({
    user: req.session.user
  }, {
    $set: {
      state: req.body.state
    }
  }, (err, doc) => {
    if (err) {
      return res.status(500).json({ ok: false })
    } else if (!doc) {
      return res.status(400).json({ msg: 'incorrect' })
    }
    res.status(201).json({ ok: true })
  })
})

router.post('/logout', (req, res) => {
  delete req.session.user
  res.json({ ok: true })
})

module.exports = router
