const errors = require('restify-errors')

//checking the contentType
function checkContext(req,next) {
  if (!req.is('application/json'))
    return next(new errors.InvalidArgumentError(`Content is not application/json`))
}

/**
 * 
 *  Checks wether this request makes sense from a user standpoint 
 * if the user is not an admin it will return an error, otherwise will continue with its normal flow
 *
 * @param {*} req request
 * @param {*} next next
 * @param {*} message This is the message intended for the error to be displayed
 * @returns
 */
function checkIfAdmin(req,next, message) {
  if (!req.user.admin)
    return next(new errors.UnauthorizedError(message))
}

module.exports = {
  checkContext,
  checkIfAdmin,
}