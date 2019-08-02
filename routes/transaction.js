const Transaction = require('../models/Transaction')
const Product  = require('../models/Product')
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
    const {username, productid, quantity } = req.body
    
    try {
      const productToUpdate = await Product.findById(productid)
      productToUpdate.transactions.push({username, quantity})
      await productToUpdate.validate(
        (err) => err && next(new errors.InvalidArgumentError(err.message)))
    
      await productToUpdate.save()
      res.send(201, { newTransact: productToUpdate })
      next()
    } catch (err) {
      return next(new errors.InternalError(err.message))
    }
  })

}