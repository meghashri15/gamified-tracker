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
  const { showConfetti } = useStore()
  const user = getUser()

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}
        <Toaster position="top-right" />
        {user && <Navbar />}
        <Routes>
          <Route path="/login"    element={!user ? <Login />    : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/"         element={user  ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/tasks"    element={user  ? <Tasks />     : <Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}