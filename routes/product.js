const errors = require('restify-errors')
const Product = require('../models/Product')
const rjwt = require('restify-jwt-community')
const config = require('../config')

module.exports = server =>{

  //GET ALL
  server.get('/products', async (req, res, next)=>{
    const { name, sortBy, } = req.query
    let qStrg ={}
    const asc = 1, desc =-1   
    //check for sort parameters if not default to name
    sortBy === 'likes' ? (qStrg.sortBy = {'likes':desc}) : qStrg.sortBy = {'name':asc}
    //if param name exist setit if not get them all
    name ? qStrg.name = {name} : qStrg.name = {}
    try {
      const products = await Product.find(qStrg.name).sort(qStrg.sortBy)
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
  
  //Create a Product 
  server.post('/products', rjwt({ secret: config.JWT_SECRET }),async (req, res, next)=>{
    //Check if the content is correct
    if(!req.is('application/json'))
    return next(new errors.InvalidContentError("Expects 'application/json'") )
    
    const { name, quantity, price,likes } = req.body
    
    const singleProduct = new Product({ name, quantity, price, likes })
    
    try{
      const newProduct = await singleProduct.save() 
      res.send(201, { newProduct: newProduct })
      next()
    }catch(err){
      return next(new errors.InternalError(err.message))
    }
  })
  //Update Product 
    // server.put('/products/:id', async (req, res, next)=>{
    //   //Check if the content is correct
    //   if(!req.is('application/json'))
    //   return next(new errors.InvalidContentError("Expects 'application/json'") )
      
    //   try{
    //     const productUpdated = await Product.findOneAndUpdate({_id:req.params.id},req.body) 
    //     res.send(200)
    //     next()
    //   }catch(err){
    //     return next(new errors.NotFoundError(`Item was not found `))      }
    // })
  //like a Product 
    server.put('/products/:id', async (req, res, next)=>{
      //Check if the content is correct
      if(!req.is('application/json'))
      return next(new errors.InvalidContentError("Expects 'application/json'") )
      try{
        const productUpdated = await Product.findOneAndUpdate(
          { _id: req.params.id },
          { $inc: { likes: 1 } }
        ) 
        res.send(200,{updated:productUpdated})
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