const errors = require('restify-errors')
const User = require('../models/User')

module.exports = server =>{

  server.get('/users',async (req, res, next)=>{
    try{
      const Users = await User.find({})
      res.send(200, Users)
      next()
    }catch(err){
      return new errors.InvalidContentError(err)
    }
  })
  
  server.post('/users', async (req, res, next)=>{
    if(!req.is('application/json') )
       return next(new errors.InvalidArgumentError(`Content is not application/json`))
       const { username, password } = req.body
       
       const user = new User({ username , password })
    try {
      const newUser = await user.save()
      res.send(201,{guardado:newUser})
      next()
    } catch (error) {
      return next(new errors.InternalError(`error, ${error} `))
    }}
   )
  
  server.del('/users/:id', async (req, res, next) => {
    try {
      const deleted =await User.findOneAndDelete({_id:req.params.id})
      res.send(200,{deleted:{deleted}})
      next()
    } catch (error) {
      return next(new errors.InvalidArgumentError(`User not found`))
    }
  })
}
