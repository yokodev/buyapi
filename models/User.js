const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true,
    unique: true,
    trim:true,
    minlength:5
  },
  password:{
    type: String,
    required: true,
    trim:true
  },
}, { timestamps:true })

userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)
module.exports = User