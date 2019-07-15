const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

const priceUpdate = new mongoose.Schema({
  NewPrice: Number,
  lastUpdated: Date
})
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
    default:0,
    min:0
  },
  price:{
    type: Number,
    min:0
  },
  priceUpdated:[priceUpdate],
  likes:{
    type: Number,
    default: 0,
    min:0
  },

}, { timestamps: true })

  productSchema.plugin(uniqueValidator)

  const Product = mongoose.model('Product', productSchema)
  module.exports = Product
