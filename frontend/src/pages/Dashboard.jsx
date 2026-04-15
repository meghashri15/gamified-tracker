import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import XPBar from '../components/XPBar'
import StreakCounter from '../components/StreakCounter'
import BadgeGrid from '../components/BadgeGrid'
import Leaderboard from '../components/Leaderboard'
import { getUser } from '../services/api'

export default function Dashboard() {
  const { xp, level, streak, totalDone, reloadForUser } = useStore()
  const user = getUser()
  useEffect(() => { reloadForUser() }, [])

  const isNewUser = xp === 0 && totalDone === 0

  const stats = [
    { label: 'Tasks Done',    value: totalDone, icon: '✅', color: '#34d399', glow: 'rgba(52,211,153,0.25)',  bg: 'rgba(52,211,153,0.07)'  },
    { label: 'Total XP',      value: xp,        icon: '⚡', color: '#fbbf24', glow: 'rgba(251,191,36,0.25)',  bg: 'rgba(251,191,36,0.07)'  },
    { label: 'Current Level', value: level,     icon: '🎮', color: '#a78bfa', glow: 'rgba(167,139,250,0.25)', bg: 'rgba(167,139,250,0.07)' },
    { label: 'Day Streak',    value: streak,    icon: '🔥', color: '#fb923c', glow: 'rgba(251,146,60,0.25)',  bg: 'rgba(251,146,60,0.07)'  },
  ]

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh', padding: '28px 16px 48px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Welcome header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 800, color: '#f1f5f9', marginBottom: '6px' }}>
              {isNewUser ? `Hey ${user?.name}! 👋` : `Welcome back, ${user?.name}! 👋`}
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              {isNewUser ? 'Complete your first task to earn XP and start your streak!' : `You're on a ${streak}-day streak — keep it going! 🔥`}
            </p>
          </div>
          <Link to="/tasks"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', border: 'none', borderRadius: '12px', padding: '10px 20px', color: '#fff', fontSize: '13px', fontWeight: 700, textDecoration: 'none', display: 'inline-block', boxShadow: '0 0 20px rgba(99,130,246,0.35)', whiteSpace: 'nowrap' }}>
            + Add Tasks
          </Link>
        </motion.div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {stats.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              style={{ background: s.bg, border: `1px solid ${s.glow}`, borderRadius: '16px', padding: '20px 16px', textAlign: 'center', backdropFilter: 'blur(8px)' }}>
              <div style={{ fontSize: '26px', marginBottom: '8px' }}>{s.icon}</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: s.color, textShadow: `0 0 12px ${s.glow}`, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', fontWeight: 500 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* XP Bar */}
        <div style={{ marginBottom: '20px' }}><XPBar /></div>

        {/* Bottom row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <StreakCounter />
          <BadgeGrid />
          <Leaderboard />
        </div>
      </div>
    </div>
  )
}