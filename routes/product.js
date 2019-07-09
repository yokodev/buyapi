const errors = require('restify-errors')


module.exports = server =>{

  server.get('/products', (req, res, next)=>{
    res.send({msg: 'hello mundo'})
    next()
  })
}