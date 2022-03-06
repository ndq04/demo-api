const jwt = require('jsonwebtoken')

// Authorization: Bearer qwertyuiopasdfghjklzxcvbnm

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization')
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token not found',
    })
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    )
    req.userId = decoded.userId
    next()
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Invalid token',
      error: err.massage,
    })
  }
}

module.exports = verifyToken
