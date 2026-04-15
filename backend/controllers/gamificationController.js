const User = require('../models/User')
const Task = require('../models/Task')

function calcLevel(xp) {
  if (xp < 50)  return 1
  if (xp < 150) return 2
  if (xp < 300) return 3
  if (xp < 500) return 4
  return 5
}

// Recalculate which badges a user should have based on their current stats
// This is the SINGLE source of truth for badge logic
function calcBadges(xp, totalDone, level, streak) {
  const earned = []
  if (xp        >= 10) earned.push('First Step')
  if (totalDone >= 5)  earned.push('On a Roll')
  if (level     >= 2)  earned.push('Level Up')
  if (streak    >= 3)  earned.push('Streak Master')
  if (xp        >= 100) earned.push('XP Grinder')
  return earned
}

exports.getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')

    // ✅ Always recalculate badges on every stats fetch
    // This fixes any user whose badges array got corrupted or is out of sync
    const correctBadges = calcBadges(user.xp, user.totalDone, user.level, user.streak)

    // Only update DB if badges are out of sync (avoids unnecessary writes)
    const badgesChanged =
      correctBadges.length !== user.badges.length ||
      correctBadges.some(b => !user.badges.includes(b))

    if (badgesChanged) {
      await User.findByIdAndUpdate(req.user.id, { badges: correctBadges })
      user.badges = correctBadges
    }

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

    // Streak logic — only increases ONCE per calendar day
    const today     = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    const lastDay   = user.lastActiveDate || ''

    let newStreak
    if (lastDay === today)      newStreak = user.streak          // already done today
    else if (lastDay === yesterday) newStreak = user.streak + 1  // kept streak going
    else if (lastDay === '')    newStreak = 1                     // first task ever
    else                        newStreak = 1                     // missed a day

    const newTotal = user.totalDone + 1
    const newLevel = calcLevel(newXP)

    // ✅ Use calcBadges — single source of truth, no stale array issues
    const newBadges = calcBadges(newXP, newTotal, newLevel, newStreak)

    // ✅ Mark the task as completed in MongoDB
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
        badges:         newBadges,
      },
      { new: true }
    ).select('-password')

    res.json(updated)
  } catch (err) {
    console.error('completeTask error:', err)
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