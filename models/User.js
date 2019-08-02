const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Can't be blank"],
      unique: true,
      trim: true,
      minlength: 4
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 4
    },
    admin: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)
module.exports = User