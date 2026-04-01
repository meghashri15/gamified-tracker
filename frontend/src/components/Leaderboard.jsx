import { useStore } from '../store/useStore'

export default function Leaderboard() {
  const { leaderboard } = useStore()
  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
      <h3 className="font-semibold mb-4">Leaderboard</h3>
      <div className="space-y-3">
        {leaderboard.map((u, i) => (
          <div
            key={u.name}
            className={`flex items-center justify-between p-3 rounded-xl transition-colors
              ${u.isYou
                ? 'bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800'
                : 'bg-gray-50 dark:bg-gray-800'}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg w-6 text-center">
                {medals[i] || `#${i + 1}`}
              </span>
              <span className={`font-medium ${u.isYou ? 'text-purple-600 dark:text-purple-400' : ''}`}>
                {u.name}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold">{u.xp} XP</div>
              <div className="text-xs text-gray-400">Level {u.level}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}