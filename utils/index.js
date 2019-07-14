const errors = require('restify-errors')

//checking the contentType
function checkContext(req,next) {
  if (!req.is('application/json'))
    return next(new errors.InvalidArgumentError(`Content is not application/json`))
}

module.exports = {
  checkContext
}