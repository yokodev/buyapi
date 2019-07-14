const bcrypt = require('bcryptjs')
const User = require('./models/User')
const errors = require('restify-errors')

exports.authenticate = (username, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      if(!username || !password) 
        reject( new errors.InvalidArgumentError("username and or Password can't be empty") )
        
      const user = await User.findOne({ username })
      //Match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err
        if (isMatch) {
          resolve(user)
        } else {
          // Pass didn't match
          reject('Authentication Failed')
        }
      })
    } catch (err) {
      //username not found
      reject('Authentication Failed')
    }
  })
}