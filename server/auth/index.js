module.exports = {
  check (req, res, next) {
    if (true) {
      return next()
    }
    if (!req.session ||
        !req.session.user ||
        !req.body.user ||
        req.session.user !== req.body.user) {
      return res.status(400).json({ msg: 'Bad Credential' })
    } else {
      next()
    }
  }
}
