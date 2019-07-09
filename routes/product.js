const errors = require('restify-errors')
const Product = require('../models/Product')

module.exports = server =>{

  server.get('/products', async (req, res, next)=>{
    try {
      const customers = await Product.find({})
      res.send(customers)
      next();
    } catch (error) {
      return next(new errors.InvalidContentError(error))
    }
  })

  server.post('/newproduct', async (req, res, next)=>{
    // console.log(`req`,req.body)
    if(!req.is('application/json'))
    return next(new errors.InvalidContentError("Expects 'application/json'") )

    const { name, quantity, price,likes } = req.body
    // console.log('heeeeloooo', req)

    const singleProduct = new Product({
      name,
      quantity,
      price,
      likes,
    })
    console.log(`estes es el singleProduct `,singleProduct)
    try{
      await singleProduct.save() 
      res.send(201)
      next()
    }catch(err){
      return next(new errors.InternalError(err.message))
    }
  })
}