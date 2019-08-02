const mongoose = require('mongoose')
const errors = require('restify-errors')
const Product = require('../models/Product')
const rjwt = require('restify-jwt-community')
const config = require('../config')
const { checkContext, checkIfAdmin } = require('../utils')

module.exports = server => {
  //GET ALL
  server.get('/products', async (req, res, next) => {
    const { name, sortBy, } = req.query
    let qStrg = {}
    const asc = 1, desc = -1
    //check for sort parameters if not default to name
    sortBy === 'likes' ? (qStrg.sortBy = { 'likes': desc }) : qStrg.sortBy = { 'name': asc }
    //if param name exist setit if not get them all
    name ? qStrg.name = { name } : qStrg.name = {}
    try {
      const products = await Product.find(qStrg.name,'-__v -createdAt -updatedAt').sort(qStrg.sortBy)
      res.send(products)
      next();
    } catch (error) {
      return next(new errors.InvalidContentError(error))
    }
  })
  //Get single product
  server.get('/products/:id', async (req, res, next) => {
    try {
      const product = await Product.findById({ _id: req.params.id })
      res.send(product)
      next();
    } catch (error) {
      return next(new errors.NotFoundError(`Item was not found `))
    }
  })
  //Create a Product 
  server.post('/products', rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
    checkIfAdmin(req, next, `Only Admin is able to add products` )
    checkContext(req, next)
    const { name, quantity, price, likes } = req.body
    const singleProduct = new Product({ name, quantity, price, likes })
    await singleProduct.validate((err) => err&&next(new errors.InvalidArgumentError(err.message)))

    try {
      const newProduct = await singleProduct.save()
      res.send(201, { newProduct: newProduct })
      next()
    } catch (err) {
      return next(new errors.InternalError(`como`, err.message))
    }
  })
  
  server.put('/products/:id', rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
    checkContext(req, next)
    try {
      const productUpdated = await Product.findOneAndUpdate(
        { _id: req.params.id },
        { $inc: { likes: 1 } },
        { new: true }

      )
      res.send(200, { updated: productUpdated })
      return next()
    } catch (err) {
      return next(new errors.NotFoundError(`Item was not found `))
    }
  })
  //Update a product Stock quantity
  server.put('/products/stock/:id', rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
    checkIfAdmin(req, next, `Only Admin is able to modify a product quantity`)
    checkContext(req, next)
    try {
      const productUpdated = await Product.findOneAndUpdate(
        { _id: req.params.id },
        { quantity: req.body.quantity },
        { new: true }
      )
      res.send(200, { updated: productUpdated })
      return next()
    } catch (err) {
      return next(new errors.NotFoundError(`Item was not found `))
    }
  })
  //Update the price of a product
  server.put('/products/price/:id', rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
    checkIfAdmin(req, next, `Only Admin is able to modify price`)
    checkContext(req, next)
    const newPrice = req.body.price
    try {
      const doc = await Product.findById(req.params.id, '-createdAt' )
      const log = { oldPrice: doc.price, newPrice: newPrice,lastUpdated: Date.now() }
      doc.price = newPrice
      doc.priceUpdates.push(log)
      await doc.save()
      res.send(200, doc.toObject({ versionKey: false, virtuals: false}))
      return next()
    } catch (error) {
      return next(new errors.RestError(`${error}`))
    }
    
  })
  //Delete Product 
  server.del('/products/:id', rjwt({ secret: config.JWT_SECRET }) ,async (req, res, next) => {
    checkIfAdmin(req, next, `Only Admin is able to delete products`)
    try {
      const productDeleted = await Product.findOneAndDelete({ _id: req.params.id })
      res.send(204, { deleted: productDeleted })
      next()
    } catch (err) {
      return next(new errors.NotFoundError(`The required item was not found `))
    }
  })
}