import { useState } from 'react'
import { Link } from 'react-router-dom'
import { mockLogin } from '../services/api'
import { useStore } from '../store/useStore'
import toast from 'react-hot-toast'

export default function Login() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const { reloadForUser } = useStore()

const handleSubmit = async (e) => {
  e.preventDefault()
  if (!email.trim()) return toast.error('Please enter your email')
  if (!email.includes('@')) return toast.error('Please enter a valid email')
  if (!password.trim()) return toast.error('Please enter a password')
  await mockLogin(email)
  reloadForUser()
  window.location.href = '/'
}

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
        <h1 className="text-2xl font-bold mb-2">Welcome back ⚡</h1>
        <p className="text-gray-500 text-sm mb-6">Log in to continue your streak</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-400 transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-400 transition-colors"
          />
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-3 font-medium transition-colors"
          >
            Log In
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          No account?{' '}
          <Link to="/register" className="text-purple-600 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  )
}