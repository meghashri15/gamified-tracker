import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../services/api'
import { useStore } from '../store/useStore'
import toast from 'react-hot-toast'

export default function Login() {
  const navigate = useNavigate()
  const { reloadForUser } = useStore()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleLogin() {
    if (!email.trim())    { toast.error('Please enter your email');    return }
    if (!password.trim()) { toast.error('Please enter your password'); return }
    if (!/\S+@\S+\.\S+/.test(email)) { toast.error('Please enter a valid email'); return }

    setLoading(true)
    try {
      await login(email.trim(), password)
      // Load all user data from backend THEN go to dashboard
      await reloadForUser()
      toast.success('Welcome back! 👋')
      navigate('/')
    } catch (err) {
      const msg = err?.response?.data?.message || ''
      if (msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('no user')) {
        toast.error('Account not found. Please register first.')
      } else if (msg.toLowerCase().includes('password') || msg.toLowerCase().includes('incorrect')) {
        toast.error('Wrong password. Please try again.')
      } else {
        toast.error('Login failed. Check your email and password.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">⚡</div>
          <h1 className="text-xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Log in to continue your streak</p>
        </div>
        <div className="flex flex-col gap-3">
          <input type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400" />
          <input type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400" />
          <button onClick={handleLogin} disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors mt-1">
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </div>
        <p className="text-center text-sm text-gray-500 mt-5">
          No account?{' '}
          <Link to="/register" className="text-purple-600 hover:underline font-medium">Register</Link>
        </p>
      </div>
    </div>
  )
}