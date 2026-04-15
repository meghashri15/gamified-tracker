import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://gamified-tracker-hplq.onrender.com'

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)

  async function handleSubmit() {
    if (!email.trim()) { toast.error('Please enter your email'); return }
    setLoading(true)
    try {
      await axios.post(`${BASE_URL}/api/auth/forgot-password`, { email: email.trim().toLowerCase() })
      setSent(true)
    } catch (err) {
      const msg = err?.response?.data?.message || ''
      if (msg.includes('not found') || msg.includes('No user')) toast.error('No account found with this email.')
      else toast.error('Something went wrong. Please try again.')
    } finally { setLoading(false) }
  }

  const card = { background: 'rgba(15,22,41,0.95)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '20px', backdropFilter: 'blur(20px)', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }
  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '12px', padding: '12px 16px', color: '#e2e8f0', fontSize: '14px', width: '100%', outline: 'none', transition: 'border-color 0.2s' }

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ position: 'absolute', top: '-100px', left: '30%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{ ...card, width: '100%', maxWidth: '400px', padding: '40px 36px' }}>
        {!sent ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ fontSize: '44px', marginBottom: '10px' }}>🔐</div>
              <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#f1f5f9', marginBottom: '6px' }}>Forgot password?</h1>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>Enter your email and we'll send you a link to reset your password.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display:'block', fontSize:'12px', fontWeight:600, color:'#94a3b8', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.05em' }}>Email</label>
                <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()} style={inputStyle}
                  onFocus={e => e.target.style.borderColor='rgba(99,179,237,0.5)'} onBlur={e => e.target.style.borderColor='rgba(99,179,237,0.15)'} />
              </div>
              <button onClick={handleSubmit} disabled={loading}
                style={{ background: loading ? 'rgba(59,130,246,0.3)' : 'linear-gradient(135deg, #3b82f6, #6366f1)', border:'none', borderRadius:'12px', padding:'13px', color:'#fff', fontSize:'15px', fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 0 20px rgba(99,130,246,0.35)' }}>
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>📬</div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#f1f5f9', marginBottom: '10px' }}>Check your inbox!</h2>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.7, marginBottom: '24px' }}>
              We sent a password reset link to <strong style={{ color: '#63b3ed' }}>{email}</strong>.<br/>
              Check your spam folder if you don't see it.
            </p>
            <button onClick={() => setSent(false)}
              style={{ background: 'rgba(99,179,237,0.1)', border: '1px solid rgba(99,179,237,0.2)', borderRadius: '10px', padding: '10px 20px', color: '#63b3ed', fontSize: '13px', cursor: 'pointer' }}>
              Try a different email
            </button>
          </div>
        )}

        <p style={{ textAlign:'center', fontSize:'13px', color:'#64748b', marginTop:'24px' }}>
          <Link to="/login" style={{ color:'#63b3ed', fontWeight:600, textDecoration:'none' }}>← Back to login</Link>
        </p>
      </div>
    </div>
  )
}