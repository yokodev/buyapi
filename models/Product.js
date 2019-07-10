const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

const productSchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, "Can't be blank"],
    unique:true,
    trim: true,
    minlength:5
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

}, { timestamps: true })

  productSchema.plugin(uniqueValidator)

  const Product = mongoose.model('Product', productSchema)
  module.exports = Product
