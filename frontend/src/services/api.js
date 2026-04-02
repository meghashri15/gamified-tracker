import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://gamified-tracker-hplq.onrender.com/api'
})

API.interceptors.request.use(config => {
  const token = localStorage.getItem('gp-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const register = (name, email, password) =>
  API.post('/auth/register', { name, email, password })

export const login = (email, password) =>
  API.post('/auth/login', { email, password })

export const getTasks = () => API.get('/tasks')
export const createTask = (title, category) => API.post('/tasks', { title, category, xpValue: 10 })
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data)
export const deleteTask = (id) => API.delete(`/tasks/${id}`)

export const getStats = () => API.get('/user/stats')
export const completeTaskAPI = (xpValue) => API.post('/user/complete-task', { xpValue })
export const getLeaderboard = () => API.get('/user/leaderboard')

export const mockLogin = (email) => {
  const name = email.split('@')[0]
  localStorage.setItem('gp-user', JSON.stringify({ email, name }))
  return Promise.resolve({ user: { email, name } })
}

export const mockRegister = (name, email) => {
  localStorage.setItem('gp-user', JSON.stringify({ name, email }))
  return Promise.resolve({ user: { name, email } })
}

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('gp-user') || 'null')
  } catch { return null }
}

export const logout = () => {
  localStorage.removeItem('gp-user')
  localStorage.removeItem('gp-token')
}