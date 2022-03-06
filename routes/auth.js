const express = require('express')
const router = express.Router()
const User = require('../models/User')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

// @route POST api/auth/register
// @desc Register user
// @access Public
router.get('/', (req, res) => {
  res.json('hello')
})
router.post('/register', async (req, res) => {
  const {fullname, email, password} = req.body
  // Simple validation
  if (!fullname || !email || !password) {
    return res.status(400).json({
      success: false,
      massage: 'Missing fullname or/and email or/and password',
    })
  }
  try {
    // check username exists
    const checkExistUser = await User.findOne({email})
    if (checkExistUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already taken',
      })
    }
    // else
    // encode password
    const hashedPassword = await argon2.hash(password)
    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    })
    const user = await newUser.save()
    // res.json(user)

    // return token
    const accessToken = jwt.sign(
      {userId: user._id},
      process.env.ACCESS_TOKEN_SECRET
    )
    res.json({
      success: true,
      message: 'Successfully',
      accessToken,
      user,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.massage,
    })
  }
})

// @route POST api/auth/login
// @desc Login user
// @access Public

router.post('/login', async (req, res) => {
  const {email, password} = req.body
  // Simple validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      massage: 'Missing email or/and password',
    })
  }
  try {
    const user = await User.findOne({email})

    // Email not found
    if (!user) {
      return res.status(400).json({
        success: false,
        massage: 'Email not found',
      })
    }

    // Username found
    const passwordValid = await argon2.verify(user.password, password)
    if (!passwordValid) {
      return res.status(400).json({
        success: false,
        massage: 'Incorrect password',
      })
    }
    // All good

    // return token
    const accessToken = jwt.sign(
      {userId: user._id},
      process.env.ACCESS_TOKEN_SECRET
    )
    res.json({
      success: true,
      message: 'Logged in successfully',
      accessToken,
      user,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.massage,
    })
  }
})

module.exports = router
