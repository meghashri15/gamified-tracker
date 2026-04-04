import { useStore } from '../store/useStore'

export default function BadgeGrid() {
  const { badges, unlockedBadges } = useStore()

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-semibold text-gray-700 text-sm mb-4">Badges</h3>
      <div className="grid grid-cols-3 gap-3">
        {badges.map(badge => {
          const unlocked = unlockedBadges.includes(badge.id)
          return (
            <div
              key={badge.id}
              title={badge.desc}
              className={`flex flex-col items-center justify-center rounded-xl p-3 text-center transition-all ${
                unlocked
                  ? 'bg-purple-50 border border-purple-200'
                  : 'bg-gray-50 border border-gray-100 opacity-40 grayscale'
              }`}
            >
              <div className="text-2xl mb-1">{badge.icon}</div>
              <div className="text-xs font-medium text-gray-600 leading-tight">{badge.name}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}