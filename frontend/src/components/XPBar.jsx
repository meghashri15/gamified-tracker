import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'

export default function XPBar() {
  const { xp, level, xpForNextLevel } = useStore()
  const next = xpForNextLevel()
  const pct  = Math.min((xp / next) * 100, 100)

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-purple-600 dark:text-purple-400">Level {level}</span>
        <span className="text-sm text-gray-500">{xp} / {next} XP</span>
      </div>
      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">{Math.round(next - xp)} XP to next level</p>
    </div>
  )
}