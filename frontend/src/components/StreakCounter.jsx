import { useStore } from '../store/useStore'

export default function StreakCounter() {
  const { streak } = useStore()

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center justify-center text-center min-h-[140px]">
      <div className="text-4xl mb-2">🔥</div>
      <div className="text-3xl font-bold text-orange-500">{streak}</div>
      <div className="text-sm text-gray-500 mt-1">Day Streak</div>
      {streak >= 3 && (
        <div className="mt-2 text-xs bg-orange-50 text-orange-500 px-3 py-1 rounded-full font-medium">
          🏅 Streak Master!
        </div>
      )}
      {streak === 0 && (
        <p className="text-xs text-gray-400 mt-2">Complete a task today to start!</p>
      )}
    </div>
  )
}