const errors = require('restify-errors')
const Product = require('../models/Product')

module.exports = server =>{

  //GET ALL
  server.get('/products/all', async (req, res, next)=>{
    try {
      const products = await Product.find({})
      res.send(products)
      next();
    } catch (error) {
      return next(new errors.InvalidContentError(error))
    }
  })

  //GET ONE
  server.get('/products/:id', async (req, res, next)=>{
    try {
      const product = await Product.findById({_id:req.params.id})
      res.send(product)
      next();
    } catch (error) {
      return next(new errors.NotFoundError(`Item was not found `))
    }
  })
  
  //Create Product 
  server.post('/products/new', async (req, res, next)=>{
    //Check if the content is correct
    if(!req.is('application/json'))
    return next(new errors.InvalidContentError("Expects 'application/json'") )
    
    const { name, quantity, price,likes } = req.body
    
    const singleProduct = new Product({ name, quantity, price, likes })
    
    try{
      await singleProduct.save() 
      res.send(201)
      next()
    }catch(err){
      return next(new errors.InternalError(err.message))
    }
  })
  //Update Product 
    server.put('/products/update/:id', async (req, res, next)=>{
      //Check if the content is correct
      if(!req.is('application/json'))
      return next(new errors.InvalidContentError("Expects 'application/json'") )
      
      try{
        const productUpdated = await Product.findOneAndUpdate({_id:req.params.id},req.body) 
        res.send(200)
        next()
      }catch(err){
        return next(new errors.NotFoundError(`Item was not found `))      }
    })
  //Delete Product 
    server.del('/products/:id', async (req, res, next)=>{
      try{
        const productDeleted = await Product.findOneAndDelete({_id:req.params.id}) 
        res.send(204, {deleted:productDeleted})
        next()
      }catch(err){
        return next(new errors.NotFoundError(`The required item was not found `))      }
    })
}