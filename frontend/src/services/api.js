import axios from 'axios'

// ✅ This points to your real deployed backend on Render
const BASE_URL = import.meta.env.VITE_API_URL || 'https://gamified-tracker-hplq.onrender.com'

const api = axios.create({ baseURL: BASE_URL })

// ✅ Automatically attach the JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('gp-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function register(name, email, password) {
  const res = await api.post('/api/auth/register', { name, email, password })
  // Save token and user info so the app knows you're logged in
  localStorage.setItem('gp-token', res.data.token)
  localStorage.setItem('gp-user',  JSON.stringify(res.data.user))
  return res.data
}

export async function login(email, password) {
  const res = await api.post('/api/auth/login', { email, password })
  localStorage.setItem('gp-token', res.data.token)
  localStorage.setItem('gp-user',  JSON.stringify(res.data.user))
  return res.data
}

export function logout() {
  localStorage.removeItem('gp-token')
  localStorage.removeItem('gp-user')
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem('gp-user') || 'null')
  } catch {
    return null
  }
}

export function getToken() {
  return localStorage.getItem('gp-token')
}

// ─── Tasks ───────────────────────────────────────────────────────────────────

export async function getTasks() {
  const res = await api.get('/api/tasks')
  return res.data
}

export async function createTask(title, category) {
  const res = await api.post('/api/tasks', { title, category })
  return res.data
}

export async function updateTask(id, updates) {
  const res = await api.put(`/api/tasks/${id}`, updates)
  return res.data
}

export async function deleteTaskAPI(id) {
  const res = await api.delete(`/api/tasks/${id}`)
  return res.data
}

// ─── User / Gamification ─────────────────────────────────────────────────────

export async function getStats() {
  const res = await api.get('/api/user/stats')
  return res.data
}

export async function completeTaskAPI(taskId, xpValue = 10) {
  const res = await api.post('/api/user/complete-task', { taskId, xpValue })
  return res.data
}

export async function getLeaderboard() {
  const res = await api.get('/api/user/leaderboard')
  return res.data
}