const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config');


const server = restify.createServer();

server.use(restify.plugins.bodyParser())

server.listen(config.PORT, ()=>{
  mongoose.connect(config.MONGO_URI, { useNewUrlParser: true } )
  .catch((err)=>{console.log(err)})
})


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', () =>{
  require('./routes/product')(server)
  console.log(`server started on por ${config.PORT}`)
})



