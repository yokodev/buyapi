const errors = require('restify-errors')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const auth = require('../auth')
const jwt = require('jsonwebtoken')
const config = require('../config')


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
  // Create user
  server.post('/users', async (req, res, next)=>{
    if(!req.is('application/json') )
       return next(new errors.InvalidArgumentError(`Content is not application/json`))
       const { username, password } = req.body
       
       const user = new User({ username , password })
       bcrypt.genSalt(10, (error, salt)=>{
         bcrypt.hash(user.password, salt, async (err, hash) =>{
           user.password = hash
           try {
             const newUser = await user.save()
             res.send(201,{guardado:newUser})
             next()
           } catch (err) {
             return next(new errors.InternalError(`error, ${error} `))
           }
         })
       })
   })
  //delete user
  server.del('/users/:id', async (req, res, next) => {
    try {
      const deleted =await User.findOneAndDelete({_id:req.params.id})
      res.send(200,{deleted:{deleted}})
      next()
    } catch (error) {
      return next(new errors.InvalidArgumentError(`User not found`))
    }
  })
  //auth user
  server.post('/auth', async (req, res, next)=>{
    if(!req.is('application/json')){
      return new errors.InvalidContentError("content has to be 'application/json'")
    }else{
      const {username, password } = req.body

      try {
        const user = await auth.authenticate(username,password)

        const token = jwt.sign(user.toJSON(), config.JWT_SECRET, { expiresIn: '10m' })

        const {iat, exp } = jwt.decode(token)

        res.send({ iat,exp,token })
        // console.log(user)
        next()
      } catch (err) {
        return next(new errors.UnauthorizedError(err))
      }
    }

  })
}
