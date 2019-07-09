const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const productSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    trim: true
  },
  quantity:{
    type: Number,
    required: true,
    
  },
  price:{
    type: Number,
    required: true,

  },
  likes:{
    type: Number,
    required: false,
  },

})

  productSchema.plugin(timestamp)
  const Product = mongoose.model('Product', productSchema)
  module.exports = Product
