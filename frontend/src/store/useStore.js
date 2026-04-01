import { create } from 'zustand'

const BADGES = [
  { id: 1, name: 'First Step',    desc: 'Complete your first task',  condition: (xp)            => xp >= 10,  icon: '🏅' },
  { id: 2, name: 'On a Roll',     desc: 'Complete 5 tasks',          condition: (_, t)           => t >= 5,   icon: '🔥' },
  { id: 3, name: 'Level Up',      desc: 'Reach level 2',             condition: (_, __, l)       => l >= 2,   icon: '⬆️' },
  { id: 4, name: 'Streak Master', desc: '3-day streak',              condition: (_, __, ___, s)  => s >= 3,   icon: '📅' },
  { id: 5, name: 'XP Grinder',    desc: 'Earn 100 XP',               condition: (xp)            => xp >= 100, icon: '💎' },
]

function calcLevel(xp) {
  if (xp < 50)  return 1
  if (xp < 150) return 2
  if (xp < 300) return 3
  if (xp < 500) return 4
  return 5
}

function xpForNextLevel(level) {
  const thresholds = [50, 150, 300, 500, 999]
  return thresholds[Math.min(level - 1, 4)]
}

// Safe localStorage read — never crashes
function safeGet(key) {
  try { return JSON.parse(localStorage.getItem(key) || '{}') } catch { return {} }
}

function getUserEmail() {
  try {
    const u = JSON.parse(localStorage.getItem('gp-user') || 'null')
    return u?.email || null
  } catch { return null }
}

function loadUserState() {
  const email = getUserEmail()
  if (!email) return {}
  return safeGet(`gp-state-${email}`)
}

function saveUserState(partial) {
  const email = getUserEmail()
  if (!email) return
  const key     = `gp-state-${email}`
  const current = safeGet(key)
  localStorage.setItem(key, JSON.stringify({ ...current, ...partial }))
}

const MOCK_OTHERS = [
  { name: 'Alice',   xp: 340, level: 4 },
  { name: 'Bob',     xp: 210, level: 3 },
  { name: 'Charlie', xp: 95,  level: 2 },
  { name: 'Diana',   xp: 60,  level: 2 },
]

function buildLeaderboard(myXP, myLevel) {
  try {
    const u = JSON.parse(localStorage.getItem('gp-user') || 'null')
    const userName = u?.name || 'You'
    const all = [
      { name: userName, xp: myXP, level: myLevel, isYou: true },
      ...MOCK_OTHERS,
    ]
    return all.sort((a, b) => b.xp - a.xp)
  } catch {
    return MOCK_OTHERS
  }
}

// Load initial state safely
const saved = loadUserState()

export const useStore = create((set, get) => ({
  tasks:          saved.tasks          || [],
  xp:             saved.xp             || 0,
  level:          saved.level          || 1,
  streak:         saved.streak         || 0,
  totalDone:      saved.totalDone      || 0,
  unlockedBadges: saved.unlockedBadges || [],
  darkMode:       safeGet('gp-global').darkMode ?? false,
  showConfetti:   false,
  levelledUp:     false,
  leaderboard:    buildLeaderboard(saved.xp || 0, saved.level || 1),
  badges:         BADGES,

  // Call this right after login/register so store loads the correct user's data
  reloadForUser: () => {
    const s = loadUserState()
    const xp    = s.xp    || 0
    const level = s.level || 1
    set({
      tasks:          s.tasks          || [],
      xp,
      level,
      streak:         s.streak         || 0,
      totalDone:      s.totalDone      || 0,
      unlockedBadges: s.unlockedBadges || [],
      leaderboard:    buildLeaderboard(xp, level),
    })
  },

  addTask: (title, category = 'General') => {
    const task  = {
      id: Date.now(), title, category,
      completed: false, xpValue: 10,
      createdAt: new Date().toISOString()
    }
    const tasks = [...get().tasks, task]
    set({ tasks })
    saveUserState({ tasks })
  },

  deleteTask: (id) => {
    const tasks = get().tasks.filter(t => t.id !== id)
    set({ tasks })
    saveUserState({ tasks })
  },

  completeTask: (id) => {
    const task = get().tasks.find(t => t.id === id)
    if (!task || task.completed) return

    const tasks     = get().tasks.map(t => t.id === id ? { ...t, completed: true } : t)
    const newXP     = get().xp + (task.xpValue || 10)
    const newLevel  = calcLevel(newXP)
    const newTotal  = get().totalDone + 1
    const newStreak = get().streak + 1
    const levelled  = newLevel > get().level

    const unlockedBadges = BADGES
      .filter(b => b.condition(newXP, newTotal, newLevel, newStreak))
      .map(b => b.id)

    const leaderboard = buildLeaderboard(newXP, newLevel)

    set({
      tasks, xp: newXP, level: newLevel,
      totalDone: newTotal, streak: newStreak,
      unlockedBadges, leaderboard,
      showConfetti: true, levelledUp: levelled,
    })
    saveUserState({
      tasks, xp: newXP, level: newLevel,
      totalDone: newTotal, streak: newStreak, unlockedBadges
    })
    setTimeout(() => set({ showConfetti: false, levelledUp: false }), 4000)
  },

  toggleDark: () => {
    const darkMode = !get().darkMode
    set({ darkMode })
    const global = safeGet('gp-global')
    localStorage.setItem('gp-global', JSON.stringify({ ...global, darkMode }))
    document.documentElement.classList.toggle('dark', darkMode)
  },

  xpForNextLevel: () => xpForNextLevel(get().level),
}))