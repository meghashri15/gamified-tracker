const User    = require('../models/User')
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // ✅ Check if email already exists
    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' })
    }

    const hashed = await bcrypt.hash(password, 10)
    const user   = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
    })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ message: 'Server error during registration' })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // ✅ Check if user exists — clear message if not
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(404).json({ message: 'No user found with this email. Please register first.' })
    }

    // ✅ Check password separately — clear message if wrong
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ message: 'Incorrect password. Please try again.' })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Server error during login' })
  }
}