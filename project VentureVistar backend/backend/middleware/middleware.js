const User = require('../models/User')
const {verifyToken} = require('../utils/utility.function')

const sendResponseError = (statusCode, msg, res) => {
  res.status(statusCode || 400).send(!!msg ? msg : 'Invalid input !!')
}

const verifyUser = async (req, res, next) => {
  const {authorization} = req.headers
  if (!authorization) {
    sendResponseError(400, 'You are not authorized ', res)
    return
  } else if (!authorization.startsWith('Bearer ')) {
    sendResponseError(400, 'You are not authorized ', res)
    return
  }

  try {
    const payload = await verifyToken(authorization.split(' ')[1])
    if (payload) {
      const user = await User.findById(payload.id, {password: 0})
      
      if (!user) {
        sendResponseError(401, 'User not found', res)
        return
      }

      req['user'] = user
      next()
    } else {
      sendResponseError(401, 'You are not authorized', res)
    }
  } catch (err) {
    console.log('Error ', err)
    sendResponseError(401, 'Invalid token', res)
  }
}

module.exports = {
  sendResponseError,
  verifyUser,
}
