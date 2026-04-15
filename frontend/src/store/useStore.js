import { create } from 'zustand'
import {
  getTasks, createTask, deleteTaskAPI,
  completeTaskAPI, getStats, getLeaderboard
} from '../services/api'

// Badge definitions — names MUST match exactly what backend stores
const BADGES = [
  { id: 1, name: 'First Step',    desc: 'Complete your first task', icon: '🏅' },
  { id: 2, name: 'On a Roll',     desc: 'Complete 5 tasks',         icon: '🔥' },
  { id: 3, name: 'Level Up',      desc: 'Reach level 2',            icon: '⬆️' },
  { id: 4, name: 'Streak Master', desc: 'Get a 3-day streak',       icon: '📅' },
  { id: 5, name: 'XP Grinder',    desc: 'Earn 100 XP',              icon: '💎' },
]

export const useStore = create((set, get) => ({
  tasks:          [],
  xp:             0,
  level:          1,
  streak:         0,
  totalDone:      0,
  unlockedBadges: [],   // array of strings e.g. ['First Step', 'Level Up']
  leaderboard:    [],
  badges:         BADGES,
  showConfetti:   false,
  levelledUp:     false,

  reloadForUser: async () => {
    try {
      const [stats, tasks, leaderboard] = await Promise.all([
        getStats(),
        getTasks(),
        getLeaderboard(),
      ])
      set({
        xp:             stats.xp        || 0,
        level:          stats.level     || 1,
        streak:         stats.streak    || 0,
        totalDone:      stats.totalDone || 0,
        unlockedBadges: Array.isArray(stats.badges) ? stats.badges : [],
        tasks:          tasks           || [],
        leaderboard:    leaderboard     || [],
      })
    } catch (err) {
      console.error('Failed to load user data:', err)
    }
  },

  addTask: async (title, category = 'General') => {
    try {
      const newTask = await createTask(title, category)
      set(state => ({ tasks: [newTask, ...state.tasks] }))
    } catch (err) {
      console.error('Failed to add task:', err)
      throw err
    }
  },

  deleteTask: async (id) => {
    try {
      await deleteTaskAPI(id)
      set(state => ({ tasks: state.tasks.filter(t => (t._id || t.id) !== id) }))
    } catch (err) {
      console.error('Failed to delete task:', err)
      throw err
    }
  },

  completeTask: async (id) => {
    const task = get().tasks.find(t => (t._id || t.id) === id)
    if (!task || task.completed) return

    try {
      const updatedUser = await completeTaskAPI(id, task.xpValue || 10)
      const levelled    = updatedUser.level > get().level

      // ✅ updatedUser.badges is an array of strings from backend
      const newBadges = Array.isArray(updatedUser.badges) ? updatedUser.badges : []

      set(state => ({
        tasks:          state.tasks.map(t => (t._id || t.id) === id ? { ...t, completed: true } : t),
        xp:             updatedUser.xp         || 0,
        level:          updatedUser.level      || 1,
        streak:         updatedUser.streak     || 0,
        totalDone:      updatedUser.totalDone  || 0,
        unlockedBadges: newBadges,
        showConfetti:   true,
        levelledUp:     levelled,
      }))

      // Refresh leaderboard after completing
      const lb = await getLeaderboard()
      set({ leaderboard: lb })

      setTimeout(() => set({ showConfetti: false, levelledUp: false }), 4000)
    } catch (err) {
      console.error('Failed to complete task:', err)
      throw err
    }
  },

  xpForNextLevel: () => {
    const level = get().level
    const thresholds = [50, 150, 300, 500, 999]
    return thresholds[Math.min(level - 1, 4)]
  },
}))