import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { logout, getUser } from '../services/api'

export default function Navbar() {
  const { xp, level } = useStore()
  const user = getUser()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    window.location.href = '/login'
  }

  const isActive = (path) => location.pathname === path

  const navLink = (to, label) => (
    <Link to={to} onClick={() => setMenuOpen(false)}
      className={`text-sm font-medium transition-all px-3 py-1.5 rounded-lg ${
        isActive(to)
          ? 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/20'
          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
      }`}>
      {label}
    </Link>
  )

  return (
    <nav style={{backgroundColor: 'rgba(10,15,30,0.95)', borderBottom: '1px solid rgba(99,179,237,0.1)', backdropFilter:'blur(12px)'}}
      className="sticky top-0 z-40 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl">⚡</span>
          <span className="font-extrabold text-lg tracking-tight"
            style={{background:'linear-gradient(135deg, #63b3ed, #a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>
            LevelUp
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-1">
          {navLink('/', 'Dashboard')}
          {navLink('/tasks', 'Tasks')}
        </div>

        {/* Right side */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{background:'rgba(99,179,237,0.08)', border:'1px solid rgba(99,179,237,0.15)'}}>
            <span className="text-xs font-bold text-cyan-400">Lv.{level}</span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-300 font-mono">{xp} XP</span>
          </div>
          <Link to="/profile"
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all hover:scale-105"
            style={{background:'linear-gradient(135deg, #3b82f6, #8b5cf6)', boxShadow:'0 0 12px rgba(99,102,241,0.4)'}}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </Link>
          <button onClick={handleLogout}
            className="text-xs text-slate-400 hover:text-red-400 transition-colors px-2 py-1 rounded">
            Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(o => !o)}
          className="sm:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-200"
          style={{background:'rgba(255,255,255,0.05)'}}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden mt-3 pb-3 border-t flex flex-col gap-2 pt-3 max-w-6xl mx-auto"
          style={{borderColor:'rgba(99,179,237,0.1)'}}>
          <div className="flex items-center gap-2 px-2 py-1 text-xs text-slate-400">
            <span className="text-cyan-400 font-bold">Lv.{level}</span> · <span>{xp} XP</span>
            {user && <span className="ml-1 text-slate-300">· {user.name}</span>}
          </div>
          {navLink('/', 'Dashboard')}
          {navLink('/tasks', 'Tasks')}
          {navLink('/profile', 'Edit Profile')}
          <button onClick={handleLogout}
            className="text-sm text-red-400/80 hover:text-red-400 text-left px-3 py-1.5 rounded-lg hover:bg-red-500/5 transition-colors">
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}