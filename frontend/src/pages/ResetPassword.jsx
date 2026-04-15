import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://gamified-tracker-hplq.onrender.com'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [loading,  setLoading]  = useState(false)
  const [showPw,   setShowPw]   = useState(false)

  async function handleReset() {
    if (!password.trim())    { toast.error('Please enter a new password'); return }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    if (password !== confirm) { toast.error("Passwords don't match"); return }
    setLoading(true)
    try {
      await axios.post(`${BASE_URL}/api/auth/reset-password`, { token, password })
      toast.success('Password reset! Please log in.')
      navigate('/login')
    } catch {
      toast.error('Reset link is invalid or expired. Please try again.')
    } finally { setLoading(false) }
  }

  const card = { background: 'rgba(15,22,41,0.95)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '20px', backdropFilter: 'blur(20px)', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }
  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '12px', padding: '12px 16px', color: '#e2e8f0', fontSize: '14px', width: '100%', outline: 'none', paddingRight: '44px' }

  if (!token) return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ ...card, padding: '40px', textAlign: 'center', maxWidth: '380px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Invalid or missing reset token.</p>
        <Link to="/forgot-password" style={{ color: '#63b3ed' }}>Request a new link</Link>
      </div>
    </div>
  )

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ ...card, width: '100%', maxWidth: '400px', padding: '40px 36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '44px', marginBottom: '10px' }}>🔑</div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#f1f5f9', marginBottom: '6px' }}>Set new password</h1>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Choose a strong password you'll remember.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[['New Password', password, setPassword], ['Confirm Password', confirm, setConfirm]].map(([lbl, val, setter], i) => (
            <div key={lbl}>
              <label style={{ display:'block', fontSize:'12px', fontWeight:600, color:'#94a3b8', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.05em' }}>{lbl}</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} placeholder="••••••••" value={val} onChange={e => setter(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleReset()} style={inputStyle}
                  onFocus={e => e.target.style.borderColor='rgba(99,179,237,0.5)'} onBlur={e => e.target.style.borderColor='rgba(99,179,237,0.15)'} />
                {i === 0 && (
                  <button onClick={() => setShowPw(p => !p)} type="button"
                    style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:'16px' }}>
                    {showPw ? '🙈' : '👁️'}
                  </button>
                )}
              </div>
            </div>
          ))}
          <button onClick={handleReset} disabled={loading}
            style={{ background: loading ? 'rgba(59,130,246,0.3)' : 'linear-gradient(135deg, #3b82f6, #6366f1)', border:'none', borderRadius:'12px', padding:'13px', color:'#fff', fontSize:'15px', fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 0 20px rgba(99,130,246,0.35)', marginTop:'4px' }}>
            {loading ? 'Resetting…' : 'Reset Password'}
          </button>
        </div>
      </div>
    </div>
  )
}