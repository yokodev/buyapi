const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

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
    default:0 
  },
  price:{
    type: Number,
    required: [true, "Price is required"],

  },
  likes:{
    type: Number,
    required: false,
    default: 0
  },

}, { timestamps: true })

  productSchema.plugin(uniqueValidator)

  const Product = mongoose.model('Product', productSchema)
  module.exports = Product
