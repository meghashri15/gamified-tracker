import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'

export default function BadgeGrid() {
  const { badges, unlockedBadges } = useStore()
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
      <h3 className="font-semibold mb-4">Badges</h3>
      <div className="grid grid-cols-3 gap-3">
        {badges.map(b => {
          const unlocked = unlockedBadges.includes(b.id)
          return (
            <motion.div key={b.id} whileHover={{ scale: 1.05 }}
              title={b.desc}
              className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all
                ${unlocked
                  ? 'border-purple-300 bg-purple-50 dark:bg-purple-950 dark:border-purple-700'
                  : 'border-gray-200 dark:border-gray-700 opacity-40 grayscale'}`}>
              <span className="text-2xl">{b.icon}</span>
              <span className="text-xs mt-1 font-medium">{b.name}</span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}