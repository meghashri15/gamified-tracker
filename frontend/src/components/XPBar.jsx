import { useStore } from '../store/useStore'

const LEVEL_THRESHOLDS = [0, 50, 150, 300, 500]
const LEVEL_NAMES = ['Beginner', 'Apprentice', 'Explorer', 'Expert', 'Master']

export default function XPBar() {
  const { xp, level, xpForNextLevel } = useStore()
  const nextXP  = xpForNextLevel()
  const prevXP  = LEVEL_THRESHOLDS[Math.min(level - 1, 4)]
  const percent = Math.min(((xp - prevXP) / (nextXP - prevXP)) * 100, 100)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-purple-600 text-sm">
          Level {level} — {LEVEL_NAMES[Math.min(level - 1, 4)]}
        </span>
        <span className="text-sm text-gray-500">{xp} / {nextXP} XP</span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="text-xs text-gray-400 mt-2">
        {nextXP - xp > 0 ? `${nextXP - xp} XP to next level` : '🎉 Max level reached!'}
      </p>
    </div>
  )
}