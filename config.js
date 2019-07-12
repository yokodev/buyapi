module.exports ={
  ENV:  process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '3000',
  URL:  process.env.URL || 'http://localhost:3000',
  // MONGO_URI: process.env.MONGO_URI || 'mongodb+srv://snackAdmin:12345@cluster0-w1gig.mongodb.net/snacks?retryWrites=true&w=majority',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/snacks',
  JWT_SECRET: process.env.JWT_SECRET || 'sEcrete01',

}

