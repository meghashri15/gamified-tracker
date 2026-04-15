const User    = require('../models/User')
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const crypto  = require('crypto')
const nodemailer = require('nodemailer')

function sendResetEmail(toEmail, resetLink) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,  // Gmail App Password (not your real password)
    },
  })
  return transporter.sendMail({
    from: `"LevelUp Tracker" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Reset your LevelUp password',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;background:#0a0f1e;color:#e2e8f0;padding:40px;border-radius:16px;">
        <h2 style="color:#63b3ed;margin-bottom:16px;">🔑 Reset your password</h2>
        <p style="color:#94a3b8;line-height:1.6;">Click the button below to reset your LevelUp Tracker password. This link expires in <strong style="color:#e2e8f0;">1 hour</strong>.</p>
        <a href="${resetLink}" style="display:inline-block;margin:24px 0;padding:12px 28px;background:linear-gradient(135deg,#3b82f6,#6366f1);color:#fff;border-radius:10px;text-decoration:none;font-weight:700;">
          Reset Password →
        </a>
        <p style="color:#475569;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  })
}

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' })
    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) return res.status(400).json({ message: 'An account with this email already exists' })
    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email: email.toLowerCase(), password: hashed })
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ message: 'Server error during registration' })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' })
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) return res.status(404).json({ message: 'No user found with this email. Please register first.' })
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ message: 'Incorrect password. Please try again.' })
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (err) {
    res.status(500).json({ message: 'Server error during login' })
  }
}

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) return res.status(404).json({ message: 'No user found with this email.' })

    const token   = crypto.randomBytes(32).toString('hex')
    const expires = Date.now() + 3600000  // 1 hour

    user.resetToken   = token
    user.resetExpires = expires
    await user.save()

    const resetLink = `${process.env.FRONTEND_URL || 'https://gamified-tracker-vert.vercel.app'}/reset-password?token=${token}`

    await sendResetEmail(user.email, resetLink)
    res.json({ message: 'Reset email sent!' })
  } catch (err) {
    console.error('Forgot password error:', err)
    res.status(500).json({ message: 'Failed to send reset email. Try again.' })
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body
    const user = await User.findOne({ resetToken: token, resetExpires: { $gt: Date.now() } })
    if (!user) return res.status(400).json({ message: 'Reset link is invalid or has expired.' })

    user.password     = await bcrypt.hash(password, 10)
    user.resetToken   = undefined
    user.resetExpires = undefined
    await user.save()

    res.json({ message: 'Password reset successfully.' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to reset password.' })
  }
}