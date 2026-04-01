const User = require('../models/User')

function calcLevel(xp) {
  if (xp < 50)  return 1
  if (xp < 150) return 2
  if (xp < 300) return 3
  if (xp < 500) return 4
  return 5
}

exports.getStats = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password')
  res.json(user)
}

exports.completeTask = async (req, res) => {
  const user    = await User.findById(req.user.id)
  const xpGain  = req.body.xpValue || 10
  const newXP   = user.xp + xpGain
  const today   = new Date().toDateString()
  const streak  = user.lastActiveDate === new Date(Date.now() - 86400000).toDateString()
    ? user.streak + 1 : 1

  const badges = [...user.badges]
  if (newXP >= 10  && !badges.includes('First Step'))   badges.push('First Step')
  if (newXP >= 100 && !badges.includes('XP Grinder'))   badges.push('XP Grinder')
  if (streak >= 3  && !badges.includes('Streak Master')) badges.push('Streak Master')

  const updated = await User.findByIdAndUpdate(req.user.id, {
    xp: newXP, level: calcLevel(newXP),
    totalDone: user.totalDone + 1,
    streak, lastActiveDate: today, badges
  }, { new: true }).select('-password')

  res.json(updated)
}

exports.getLeaderboard = async (req, res) => {
  const users = await User.find().select('name xp level').sort({ xp: -1 }).limit(10)
  res.json(users)
}