import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { logout, getUser } from '../services/api'

export default function Navbar() {
  const { darkMode, toggleDark, xp, level } = useStore()
  const navigate = useNavigate()
  const user = getUser()

  // apply dark mode on mount
  useEffect(() => {
    const global = JSON.parse(localStorage.getItem('gp-global') || '{}')
    if (global.darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <span className="font-bold text-lg text-purple-600 dark:text-purple-400">⚡ LevelUp</span>
        <Link to="/"      className="text-sm hover:text-purple-600 transition-colors">Dashboard</Link>
        <Link to="/tasks" className="text-sm hover:text-purple-600 transition-colors">Tasks</Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">Lv.{level} · {xp} XP</span>
        {user && <span className="text-sm font-medium">{user.name}</span>}
        <button onClick={toggleDark} className="text-xl">{darkMode ? '☀️' : '🌙'}</button>
        <button
  onClick={() => {
    logout()
    window.location.href = '/login'
  }}
  className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
  Logout
</button>
      </div>
    </nav>
  )
}