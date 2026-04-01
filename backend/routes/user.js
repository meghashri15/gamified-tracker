const router = require('express').Router()
const auth   = require('../middleware/authMiddleware')
const { getStats, completeTask, getLeaderboard } = require('../controllers/gamificationController')
router.get('/stats',          auth, getStats)
router.post('/complete-task', auth, completeTask)
router.get('/leaderboard',    auth, getLeaderboard)
module.exports = router