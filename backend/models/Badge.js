const mongoose = require('mongoose')

const BadgeSchema = new mongoose.Schema({
  name:      String,
  description: String,
  condition: String
})

module.exports = mongoose.model('Badge', BadgeSchema)