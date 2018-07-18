const router = require('express').Router()
const axios = require('axios')
const Book = require('./book.db.js')
const auth = require('../../auth')
const config = require('../../config')

const check = auth.check

// get all books
router.post('/all', (req, res) => {
  Book.find({}, (err, docs) => {
    if (err) {
      return res.status(500).json({ ok: false })
    }
    res.json(docs)
  })
})

// get user's books
router.post('/mybook', check, (req, res) => {
  Book.find({
    from: req.session.user,
    to: ''
  }, (err, docs) => {
    if (err) {
      return res.status(500).json({ ok: false })
    }
    res.json(docs)
  })
})

// create book
router.put('/:book', check, (req, res)=> {
  axios.get(config.url + '/search?count=1&q=' + req.params.book)
  .then(data => {
    data = data.data.books[0]
    let id = data.id
    let title = data.title
    let pic = data.image
    Book.insertMany({
      id: id,
      title: title,
      pic: pic,
      from: req.session.user
    }, err => {
      if (err) {
        return res.status(500).json({ ok: false })
      }
      res.status(201).json({
        id: id,
        title: title,
        pic: pic,
        from: req.session.user,
        to: '',
        acc: false
      })
    })
  })
  .catch(ex => {
    res.status(404).send(ex.message)
  })
})

// delete book
router.delete('/:id', check, (req, res) => {
  Book.deleteOne({
    id: req.params.id,
    from: req.session.user,
    to: ''
  }, err => {
    if (err) {
      return res.status(500).json({ ok: false })
    }
    res.status(204).send()
  })
})

// add require
router.put('/require/add', check, (req, res)=> {
  Book.findOneAndUpdate({
    _id: req.body.id,
    to: ''
  }, {
    $set: {
      to: req.session.user,
      acc: false
    }
  }, (err, doc) => {
    if (err) {
      return res.status(500).json({ ok: false })
    }
    res.status(201).json(doc)
  })
})

// delete require
router.put('/require/del', check, (req, res)=> {
  Book.findOneAndUpdate({
    _id: req.body.id,
    to: req.session.user
  }, {
    $set: {
      to: '',
      acc: false
    }
  }, err => {
    if (err) {
      return res.status(500).json({ ok: false })
    }
    res.status(201).json({ ok: true })
  })
})

// accept request
router.put('/request/acc', check, (req, res)=> {
  Book.findOneAndUpdate({
    _id: req.body.id,
    from: req.session.user
  }, {
    $set: {
      acc: true
    }
  }, err => {
    if (err) {
      return res.status(500).json({ ok: false })
    }
    res.status(201).json({ ok: true })
  })
})

// decline request
router.put('/request/dec', check, (req, res)=> {
  Book.findOneAndUpdate({
    _id: req.body.id,
    from: req.session.user
  }, {
    $set: {
      to: '',
      acc: false
    }
  }, err => {
    if (err) {
      return res.status(500).json({ ok: false })
    }
    res.status(201).json({ ok: true })
  })
})

module.exports = router
