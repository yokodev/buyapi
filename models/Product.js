const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
const { TransactionSchema } = require('../models/Transaction')

const priceUpdate = new mongoose.Schema({
  oldPrice: Number,
  newPrice: Number,
  lastUpdated: Date
})
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Can't be blank"],
      unique: true,
      trim: true,
      minlength: 3
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0
    },
    price: {
      type: Number,
      min: 0
    },
    likes: {
      type: Number,
      default: 0,
      min: 0
    },
    priceUpdates: [priceUpdate],
    transactions: [TransactionSchema]
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

productSchema.plugin(uniqueValidator)

const Product = mongoose.model('Product', productSchema)
module.exports = Product
