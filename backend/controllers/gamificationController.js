const User = require('../models/User')
const Task = require('../models/Task')   // ← NEW LINE ADDED

function calcLevel(xp) {
  if (xp < 50)  return 1
  if (xp < 150) return 2
  if (xp < 300) return 3
  if (xp < 500) return 4
  return 5
}

exports.getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

exports.completeTask = async (req, res) => {
  try {
    const user   = await User.findById(req.user.id)
    const xpGain = req.body.xpValue || 10
    const newXP  = user.xp + xpGain

    const today     = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    const lastDay   = user.lastActiveDate || ''

    let newStreak
    if (lastDay === today) {
      newStreak = user.streak
    } else if (lastDay === yesterday) {
      newStreak = user.streak + 1
    } else if (lastDay === '') {
      newStreak = 1
    } else {
      newStreak = 1
    }

    const newTotal = user.totalDone + 1
    const newLevel = calcLevel(newXP)
    const badges   = [...user.badges]

    if (newXP >= 10    && !badges.includes('First Step'))    badges.push('First Step')
    if (newXP >= 100   && !badges.includes('XP Grinder'))    badges.push('XP Grinder')
    if (newStreak >= 3 && !badges.includes('Streak Master')) badges.push('Streak Master')
    if (newTotal >= 5  && !badges.includes('On a Roll'))     badges.push('On a Roll')
    if (newLevel >= 2  && !badges.includes('Level Up'))      badges.push('Level Up')

    // ✅ FIX: Mark the task as completed in MongoDB so it persists
    if (req.body.taskId) {
      await Task.findOneAndUpdate(
        { _id: req.body.taskId, userId: req.user.id },
        { completed: true },
        { new: true }
      )
    }

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        xp:             newXP,
        level:          newLevel,
        totalDone:      newTotal,
        streak:         newStreak,
        lastActiveDate: today,
        badges,
      },
      { new: true }
    ).select('-password')

    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find().select('name xp level').sort({ xp: -1 }).limit(10)
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}