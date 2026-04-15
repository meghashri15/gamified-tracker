import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { getUser, getToken, logout } from '../services/api'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://gamified-tracker-hplq.onrender.com'

export default function Profile() {
  const user = getUser()
  const navigate = useNavigate()
  const [name,        setName]        = useState(user?.name || '')
  const [currentPw,   setCurrentPw]   = useState('')
  const [newPw,       setNewPw]       = useState('')
  const [confirmPw,   setConfirmPw]   = useState('')
  const [loading,     setLoading]     = useState(false)
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw,     setShowNewPw]     = useState(false)

  async function handleSaveName() {
    if (!name.trim()) { toast.error('Name cannot be empty'); return }
    if (name.trim() === user?.name) { toast('Name is unchanged'); return }
    setLoading(true)
    try {
      const res = await axios.put(`${BASE_URL}/api/user/profile`, { name: name.trim() }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      const updated = { ...user, name: res.data.name }
      localStorage.setItem('gp-user', JSON.stringify(updated))
      toast.success('Name updated! ✅')
      window.location.reload()
    } catch { toast.error('Failed to update name.') }
    finally   { setLoading(false) }
  }

  async function handleChangePassword() {
    if (!currentPw) { toast.error('Enter your current password'); return }
    if (!newPw)     { toast.error('Enter a new password'); return }
    if (newPw.length < 6)       { toast.error('Password must be at least 6 characters'); return }
    if (newPw !== confirmPw)    { toast.error("Passwords don't match"); return }
    setLoading(true)
    try {
      await axios.put(`${BASE_URL}/api/user/change-password`, { currentPassword: currentPw, newPassword: newPw }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      toast.success('Password changed! Please log in again.')
      setTimeout(() => { logout(); navigate('/login') }, 1500)
    } catch (err) {
      const msg = err?.response?.data?.message || ''
      if (msg.includes('incorrect') || msg.includes('wrong')) toast.error('Current password is incorrect.')
      else toast.error('Failed to change password.')
    } finally { setLoading(false) }
  }

  const card = { background: 'rgba(15,22,41,0.8)', border: '1px solid rgba(99,179,237,0.12)', borderRadius: '16px', padding: '28px' }
  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '10px', padding: '11px 14px', color: '#e2e8f0', fontSize: '14px', width: '100%', outline: 'none', transition: 'border-color 0.2s' }
  const label = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh', padding: '32px 16px' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 800, flexShrink: 0,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#f1f5f9' }}>Edit Profile</h1>
            <p style={{ fontSize: '13px', color: '#64748b' }}>{user?.email}</p>
          </div>
        </div>

        {/* Name section */}
        <div style={{ ...card, marginBottom: '16px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#cbd5e1', marginBottom: '20px' }}>👤 Display Name</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={label}>Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.borderColor='rgba(99,179,237,0.5)'} onBlur={e => e.target.style.borderColor='rgba(99,179,237,0.15)'} />
            </div>
            <button onClick={handleSaveName} disabled={loading}
              style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', border: 'none', borderRadius: '10px', padding: '11px', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 16px rgba(99,130,246,0.3)' }}>
              {loading ? 'Saving…' : 'Save Name'}
            </button>
          </div>
        </div>

        {/* Password section */}
        <div style={card}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#cbd5e1', marginBottom: '20px' }}>🔒 Change Password</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={label}>Current Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showCurrentPw ? 'text' : 'password'} placeholder="••••••••" value={currentPw} onChange={e => setCurrentPw(e.target.value)}
                  style={{ ...inputStyle, paddingRight: '44px' }}
                  onFocus={e => e.target.style.borderColor='rgba(99,179,237,0.5)'} onBlur={e => e.target.style.borderColor='rgba(99,179,237,0.15)'} />
                <button onClick={() => setShowCurrentPw(p => !p)} type="button"
                  style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:'15px' }}>
                  {showCurrentPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div>
              <label style={label}>New Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showNewPw ? 'text' : 'password'} placeholder="Min 6 characters" value={newPw} onChange={e => setNewPw(e.target.value)}
                  style={{ ...inputStyle, paddingRight: '44px' }}
                  onFocus={e => e.target.style.borderColor='rgba(99,179,237,0.5)'} onBlur={e => e.target.style.borderColor='rgba(99,179,237,0.15)'} />
                <button onClick={() => setShowNewPw(p => !p)} type="button"
                  style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:'15px' }}>
                  {showNewPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div>
              <label style={label}>Confirm New Password</label>
              <input type="password" placeholder="Re-enter new password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleChangePassword()} style={inputStyle}
                onFocus={e => e.target.style.borderColor='rgba(99,179,237,0.5)'} onBlur={e => e.target.style.borderColor='rgba(99,179,237,0.15)'} />
            </div>
            <button onClick={handleChangePassword} disabled={loading}
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border:'none', borderRadius:'10px', padding:'11px', color:'#fff', fontSize:'14px', fontWeight:700, cursor:'pointer', boxShadow:'0 0 16px rgba(139,92,246,0.3)' }}>
              {loading ? 'Updating…' : 'Change Password'}
            </button>
          </div>
        </div>

        <button onClick={() => navigate('/')}
          style={{ display: 'block', width: '100%', marginTop: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '11px', color: '#94a3b8', fontSize: '14px', cursor: 'pointer' }}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  )
}