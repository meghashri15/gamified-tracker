import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Confetti from 'react-confetti'
import { useStore } from './store/useStore'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/tasks'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import { getUser } from './services/api'

export default function App() {
  const { showConfetti } = useStore()
  const user = getUser()

  return (
    <BrowserRouter>
      <div style={{ backgroundColor: '#0a0f1e', minHeight: '100vh', color: '#e2e8f0' }}>
        {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1a2035', color: '#e2e8f0', border: '1px solid rgba(99,179,237,0.2)' }
        }} />
        {user && <Navbar />}
        <Routes>
          <Route path="/login"           element={!user ? <Login />          : <Navigate to="/" />} />
          <Route path="/register"        element={!user ? <Register />       : <Navigate to="/" />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password"  element={<ResetPassword />} />
          <Route path="/"                element={user  ? <Dashboard />      : <Navigate to="/login" />} />
          <Route path="/tasks"           element={user  ? <Tasks />          : <Navigate to="/login" />} />
          <Route path="/profile"         element={user  ? <Profile />        : <Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}