const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const TransactionSchema = new mongoose.Schema({
  username: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quantity: {
    type: Number, 
    default: 1, 
    min:0
  },
  dateOfPurchase: {
    type: Date,
    default: Date.now()
  }
})

const Transaction = mongoose.model('Transaction', TransactionSchema)
module.exports = {Transaction, TransactionSchema} 