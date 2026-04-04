import { useStore } from '../store/useStore'

const MEDALS = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const { leaderboard } = useStore()

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-semibold text-gray-700 text-sm mb-4">Leaderboard</h3>
      <div className="flex flex-col gap-2">
        {leaderboard.map((entry, i) => (
          <div
            key={entry.name}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${
              entry.isYou
                ? 'bg-purple-50 border border-purple-200'
                : 'bg-gray-50'
            }`}
          >
            <span className="text-lg w-6 text-center flex-shrink-0">
              {MEDALS[i] || <span className="text-sm text-gray-400">{i + 1}</span>}
            </span>
            <span className={`flex-1 text-sm font-medium truncate ${
              entry.isYou ? 'text-purple-600' : 'text-gray-700'
            }`}>
              {entry.name} {entry.isYou && '(you)'}
            </span>
            <div className="text-right flex-shrink-0">
              <div className="text-xs font-semibold text-yellow-500">{entry.xp} XP</div>
              <div className="text-xs text-gray-400">Lv.{entry.level}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}