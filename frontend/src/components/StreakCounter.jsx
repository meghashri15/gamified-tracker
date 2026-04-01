import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'

export default function StreakCounter() {
  const { streak } = useStore()
  return (
    <motion.div whileHover={{ scale: 1.03 }}
      className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 text-center">
      <div className="text-4xl mb-1">🔥</div>
      <div className="text-3xl font-bold text-orange-500">{streak}</div>
      <div className="text-sm text-gray-500 mt-1">Day Streak</div>
    </motion.div>
  )
}