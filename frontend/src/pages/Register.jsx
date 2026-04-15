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
  const [showPw,   setShowPw]   = useState(false)

  async function handleRegister() {
    if (!name.trim())     { toast.error('Please enter your name'); return }
    if (!email.trim())    { toast.error('Please enter your email'); return }
    if (!password.trim()) { toast.error('Please enter a password'); return }
    if (!/\S+@\S+\.\S+/.test(email)) { toast.error('Please enter a valid email'); return }
    if (password.length < 6)         { toast.error('Password must be at least 6 characters'); return }
    if (password !== confirm)        { toast.error("Passwords don't match"); return }

    setLoading(true)
    try {
      await register(name.trim(), email.trim().toLowerCase(), password)
      await reloadForUser()
      toast.success('Account created! Welcome 🎉')
      navigate('/')
    } catch (err) {
      const msg = err?.response?.data?.message || ''
      if (msg.includes('exists') || msg.includes('duplicate')) toast.error('Email already registered. Please log in.')
      else toast.error('Registration failed. Please try again.')
    } finally { setLoading(false) }
  }

  const card = { background: 'rgba(15,22,41,0.95)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '20px', backdropFilter: 'blur(20px)', boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(99,179,237,0.05)' }
  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '12px', padding: '12px 16px', color: '#e2e8f0', fontSize: '14px', width: '100%', outline: 'none', transition: 'border-color 0.2s' }
  const label = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{ ...card, width: '100%', maxWidth: '420px', padding: '40px 36px', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '44px', marginBottom: '10px' }} className="float-anim">🚀</div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f1f5f9', marginBottom: '6px' }}>Create account</h1>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Start your productivity journey</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={label}>Your Name</label>
            <input type="text" placeholder="e.g. Megha" value={name} onChange={e => setName(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.borderColor='rgba(99,179,237,0.5)'} onBlur={e => e.target.style.borderColor='rgba(99,179,237,0.15)'} />
          </div>
          <div>
            <label style={label}>Email</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.borderColor='rgba(99,179,237,0.5)'} onBlur={e => e.target.style.borderColor='rgba(99,179,237,0.15)'} />
          </div>
          <div>
            <label style={label}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPw ? 'text' : 'password'} placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: '44px' }}
                onFocus={e => e.target.style.borderColor='rgba(99,179,237,0.5)'} onBlur={e => e.target.style.borderColor='rgba(99,179,237,0.15)'} />
              <button onClick={() => setShowPw(p => !p)} type="button"
                style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:'16px' }}>
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <div>
            <label style={label}>Confirm Password</label>
            <input type="password" placeholder="Re-enter password" value={confirm} onChange={e => setConfirm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleRegister()} style={inputStyle}
              onFocus={e => e.target.style.borderColor='rgba(99,179,237,0.5)'} onBlur={e => e.target.style.borderColor='rgba(99,179,237,0.15)'} />
          </div>

          <button onClick={handleRegister} disabled={loading}
            style={{ background: loading ? 'rgba(139,92,246,0.3)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '12px', padding: '13px', color: '#fff', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 0 24px rgba(139,92,246,0.4)', marginTop: '4px', transition: 'all 0.2s' }}>
            {loading ? 'Creating account…' : 'Create Account →'}
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '24px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#63b3ed', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}