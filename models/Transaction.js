const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const TransactionSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number, default: 1
  },
  dateOfPurchase: {
    type: Date,
    default: Date.now()
  }
})




const Transaction = mongoose.model('Transaction', TransactionSchema)
module.exports = Transaction 