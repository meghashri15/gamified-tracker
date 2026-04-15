const User   = require('../models/User')
const bcrypt = require('bcryptjs')

exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body
    if (!name || !name.trim()) return res.status(400).json({ message: 'Name cannot be empty' })
    const updated = await User.findByIdAndUpdate(req.user.id, { name: name.trim() }, { new: true }).select('-password')
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile' })
  }
}

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user.id)
    const match = await bcrypt.compare(currentPassword, user.password)
    if (!match) return res.status(401).json({ message: 'Current password is incorrect.' })
    if (!newPassword || newPassword.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters' })
    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()
    res.json({ message: 'Password changed successfully.' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to change password' })
  }
}