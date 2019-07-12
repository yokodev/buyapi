const bcrypt = require('bcryptjs')
// const mongoose = require('mongoose')
const User = require('./models/User')

exports.authenticate = (username, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ username })
      // console.log(`en auth`,user)
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