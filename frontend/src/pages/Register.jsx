import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/api'
import { useStore } from '../store/useStore'
import toast from 'react-hot-toast'

export default function Register() {
  const navigate = useNavigate()
  const { reloadForUser } = useStore()
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleRegister() {
    // Frontend validation
    if (!name.trim())     { toast.error('Please enter your name');     return }
    if (!email.trim())    { toast.error('Please enter your email');    return }
    if (!password.trim()) { toast.error('Please enter a password');    return }

    if (!/\S+@\S+\.\S+/.test(email)) { toast.error('Please enter a valid email'); return }
    if (password.length < 6)          { toast.error('Password must be at least 6 characters'); return }
    if (password !== confirm)         { toast.error("Passwords don't match"); return }

    setLoading(true)
    try {
      await register(name.trim(), email.trim(), password)
      reloadForUser()
      toast.success('Account created! Welcome 🎉')
      navigate('/')
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || ''
      if (msg.toLowerCase().includes('exists') || msg.toLowerCase().includes('duplicate') || msg.toLowerCase().includes('already')) {
        toast.error('An account with this email already exists. Please log in.')
      } else {
        toast.error('Registration failed. Please try again.')
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
          <h1 className="text-xl font-bold text-gray-900">Create account</h1>
          <p className="text-sm text-gray-500 mt-1">Start your productivity journey</p>
        </div>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRegister()}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            onClick={handleRegister}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors mt-1"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-600 hover:underline font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}