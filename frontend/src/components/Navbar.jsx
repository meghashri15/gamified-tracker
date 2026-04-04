import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { logout, getUser } from '../services/api'

export default function Navbar() {
  const { xp, level } = useStore()
  const user = getUser()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    window.location.href = '/login'
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      {/* Main row */}
      <div className="flex items-center justify-between">
        {/* Logo */}
        <span className="font-bold text-lg text-purple-600">⚡ LevelUp</span>

        {/* Desktop links — hidden on mobile */}
        <div className="hidden sm:flex items-center gap-6">
          <Link to="/"      className="text-sm text-gray-700 hover:text-purple-600 transition-colors">Dashboard</Link>
          <Link to="/tasks" className="text-sm text-gray-700 hover:text-purple-600 transition-colors">Tasks</Link>
        </div>

        {/* Right side */}
        <div className="hidden sm:flex items-center gap-4">
          <span className="text-sm text-gray-500">Lv.{level} · {xp} XP</span>
          {user && <span className="text-sm font-medium text-gray-700">{user.name}</span>}
          <button
            onClick={handleLogout}
            className="text-sm bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Hamburger — only on mobile */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="sm:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="sm:hidden mt-3 flex flex-col gap-3 pb-2 border-t border-gray-100 pt-3">
          <span className="text-sm text-gray-500">Lv.{level} · {xp} XP</span>
          {user && <span className="text-sm font-medium text-gray-700">{user.name}</span>}
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-gray-700 hover:text-purple-600"
          >
            Dashboard
          </Link>
          <Link
            to="/tasks"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-gray-700 hover:text-purple-600"
          >
            Tasks
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 w-fit"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}