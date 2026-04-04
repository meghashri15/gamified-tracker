import { create } from 'zustand'
import {
  getTasks, createTask, deleteTaskAPI,
  completeTaskAPI, getStats, getLeaderboard
} from '../services/api'

const BADGES = [
  { id: 1, name: 'First Step',    desc: 'Complete your first task', condition: (xp)           => xp >= 10,   icon: '🏅' },
  { id: 2, name: 'On a Roll',     desc: 'Complete 5 tasks',         condition: (_, t)          => t >= 5,    icon: '🔥' },
  { id: 3, name: 'Level Up',      desc: 'Reach level 2',            condition: (_, __, l)      => l >= 2,    icon: '⬆️' },
  { id: 4, name: 'Streak Master', desc: '3-day streak',             condition: (_, __, ___, s) => s >= 3,    icon: '📅' },
  { id: 5, name: 'XP Grinder',    desc: 'Earn 100 XP',              condition: (xp)           => xp >= 100, icon: '💎' },
]

export const useStore = create((set, get) => ({
  tasks:          [],
  xp:             0,
  level:          1,
  streak:         0,
  totalDone:      0,
  unlockedBadges: [],
  leaderboard:    [],
  badges:         BADGES,
  showConfetti:   false,
  levelledUp:     false,

  // Call this after login/register — loads everything from the real backend
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
        unlockedBadges: stats.badges    || [],
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
      const levelled = updatedUser.level > get().level

      set(state => ({
        tasks:          state.tasks.map(t => (t._id || t.id) === id ? { ...t, completed: true } : t),
        xp:             updatedUser.xp,
        level:          updatedUser.level,
        streak:         updatedUser.streak,
        totalDone:      updatedUser.totalDone,
        unlockedBadges: updatedUser.badges || [],
        showConfetti:   true,
        levelledUp:     levelled,
      }))

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