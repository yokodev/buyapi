const errors = require('restify-errors')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const auth = require('../auth')
const jwt = require('jsonwebtoken')
const config = require('../config')
const { checkContext } = require('../utils')

module.exports = server => {
  server.get('/users', async (req, res, next) => {
    try {
      const Users = await User.find({})
      res.send(200, Users)
      next()
    } catch (err) {
      return new errors.InvalidContentError(err)
    }
  })
  // Create user
  server.post('/users', async (req, res, next) => {
    checkContext(req, next)
    const { username, password, admin } = req.body
    if (!username || !password)
      return next(new errors.InvalidArgumentError('Username and Password are required'))

    const user = new User({ username, password, admin })
    await user.validate((err) => next(new errors.InvalidArgumentError(err.message)))

    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(user.password, salt, async (err, hash) => {
        user.password = hash
        try {
          const newUser = await user.save()
          res.send(201, { guardado: newUser })
          return next()
        } catch (err) {
          return next(new errors.InternalError(`error, ${error} `))
        }
      })
    })
  })
  //delete user
  server.del('/users/:id', async (req, res, next) => {
    try {
      const deleted = await User.findOneAndDelete({ _id: req.params.id })
      res.send(200, { deleted: { deleted } })
      return next()
    } catch (error) {
      return next(new errors.InvalidArgumentError(`User not found`))
    }
  })
  //authenticate a User
  server.post('/auth', async (req, res, next) => {
    checkContext(req, next)
    const { username, password } = req.body
    try {
      const user = await auth.authenticate(username, password)

      const token = jwt.sign(user.toJSON(), config.JWT_SECRET, { expiresIn: '60m' })
      const { iat, exp } = jwt.decode(token)

      res.send({ iat, exp, token })
      return next()
    } catch (err) {
      return next(new errors.UnauthorizedError(err))
    }
  })
}
