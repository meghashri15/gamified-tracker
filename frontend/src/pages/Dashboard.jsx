// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import XPBar from '../components/XPBar'
import StreakCounter from '../components/StreakCounter'
import BadgeGrid from '../components/BadgeGrid'
import Leaderboard from '../components/Leaderboard'
import { getUser } from '../services/api'

export default function Dashboard() {
  const { xp, level, streak, totalDone } = useStore()
  const user = getUser()

  const stats = [
    { label: 'Tasks Done',    value: totalDone, icon: '✅', color: 'text-green-500' },
    { label: 'Total XP',      value: xp,        icon: '⚡', color: 'text-yellow-500' },
    { label: 'Current Level', value: level,     icon: '🎮', color: 'text-purple-500' },
    { label: 'Day Streak',    value: streak,    icon: '🔥', color: 'text-orange-500' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {user?.name} 👋</h1>
        <p className="text-gray-500 mt-1">Keep going — you're on a {streak}-day streak!</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-5 text-center shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="text-3xl mb-1">{s.icon}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="mb-6">
        <XPBar />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <StreakCounter />
        <BadgeGrid />
        <Leaderboard />
      </div>
    </div>
  )
}