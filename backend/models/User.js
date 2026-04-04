const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  xp:       { type: Number, default: 0 },
  level:    { type: Number, default: 1 },
  streak:   { type: Number, default: 0 },
  totalDone:{ type: Number, default: 0 },
  badges:   [{ type: String }],
  lastActiveDate: { type: String, default: '' }   // stores e.g. "Sat Apr 05 2025"
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)