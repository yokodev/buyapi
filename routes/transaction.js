const Transaction = require('../models/Transaction')
const mongoose = require('mongoose')
const errors = require('restify-errors')
const rjwt = require('restify-jwt-community')
const config = require('../config')
const { checkContext, checkIfAdmin } = require('../utils')

module.exports = server => {
  //GET ALL
  server.get('/transactions', async (req, res, next) => {
    const { name, sortBy, } = req.query
    try {
      const trans = await Transaction.find({})
      res.send(trans)
      next();
    } catch (error) {
      return next(new errors.InvalidContentError(error))
    }
  })

  // //Create a transaction 
  // server.post('/transactions', rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
  server.post('/transactions', async (req, res, next) => {
    checkContext(req, next)
    // checkIfAdmin(req, next, `Only Admin is able to add products`)
    const { username, quantity, productId } = req.body
    const transaction =  new Transaction({
      buyer: username, product:productId, quantity })

    await transaction.validate((err) => err && next(new errors.InvalidArgumentError(err.message)))

    try {
      const newTransact = await transaction.save()
      res.send(201, { newTransact: newTransact })
      next()
    } catch (err) {
      return next(new errors.InternalError(err.message))
    }
  })

}