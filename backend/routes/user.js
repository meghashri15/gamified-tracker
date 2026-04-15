const router = require('express').Router()
const auth   = require('../middleware/authMiddleware')
const { getStats, completeTask, getLeaderboard } = require('../controllers/gamificationController')
const { updateProfile, changePassword } = require('../controllers/userController')

router.get('/stats',            auth, getStats)
router.post('/complete-task',   auth, completeTask)
router.get('/leaderboard',      auth, getLeaderboard)
router.put('/profile',          auth, updateProfile)
router.put('/change-password',  auth, changePassword)
module.exports = router