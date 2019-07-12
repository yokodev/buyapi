const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config');
const rjwt = require('restify-jwt-community')

const server = restify.createServer();

server.use(restify.plugins.bodyParser())

server.use(restify.plugins.queryParser({ mapParams: false }))

//Routes
server.use(rjwt({ secret: config.JWT_SECRET }).unless({path:['/auth','/products','/users']}))

server.listen(config.PORT, ()=>{
  mongoose
  .connect(config.MONGO_URI, { 
    useNewUrlParser: true, 
    useFindAndModify: false,
    useCreateIndex: true  } )
  .catch((err)=>{console.log(err)})
})

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', () =>{
  require('./routes/product')(server)
  require('./routes/user')(server)
  console.log(`server started on por ${config.PORT}`)
})



