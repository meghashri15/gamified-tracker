import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Confetti from 'react-confetti'
import { useStore } from './store/useStore'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/tasks'
import Login from './pages/Login'
import Register from './pages/Register'
import { getUser } from './services/api'

export default function App() {
  const { darkMode, showConfetti } = useStore()

  // Fix 3: apply dark mode class on every render, not just toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // also apply immediately on first load
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('gp-state') || '{}')
    if (saved.darkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const user = getUser()

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
        {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}
        <Toaster position="top-right" />
        {user && <Navbar />}
        <Routes>
          {/* Fix 1: /register must come BEFORE the catch-all, and must not redirect logged-in users away */}
          <Route path="/login"    element={!user ? <Login />    : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/"         element={user  ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/tasks"    element={user  ? <Tasks />     : <Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}