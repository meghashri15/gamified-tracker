import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import XPBar from '../components/XPBar'
import StreakCounter from '../components/StreakCounter'
import BadgeGrid from '../components/BadgeGrid'
import Leaderboard from '../components/Leaderboard'
import { getUser } from '../services/api'

const TUTORIAL_STEPS = [
  { icon: '✅', title: 'Add tasks',     desc: 'Go to the Tasks page and add things you want to get done today.' },
  { icon: '⚡', title: 'Earn XP',       desc: 'Complete a task to earn +10 XP. XP fills your level bar.' },
  { icon: '🎮', title: 'Level up',      desc: "Earn enough XP and you'll level up! Each level needs more XP." },
  { icon: '🔥', title: 'Build streaks', desc: 'Complete at least one task every day to maintain your streak.' },
  { icon: '🏅', title: 'Unlock badges', desc: 'Hit milestones to unlock achievement badges. Can you get them all?' },
]

function TutorialModal({ onClose }) {
  const [step, setStep] = useState(0)
  const isLast = step === TUTORIAL_STEPS.length - 1
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl border border-gray-100">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{TUTORIAL_STEPS[step].icon}</div>
          <h2 className="text-xl font-bold mb-2">{TUTORIAL_STEPS[step].title}</h2>
          <p className="text-gray-500 text-sm">{TUTORIAL_STEPS[step].desc}</p>
        </div>
        <div className="flex justify-center gap-2 mb-6">
          {TUTORIAL_STEPS.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-purple-600' : 'bg-gray-200'}`} />
          ))}
        </div>
        <div className="flex gap-3">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              className="flex-1 border border-gray-200 rounded-xl py-2 text-sm font-medium hover:bg-gray-50 transition-colors">
              Back
            </button>
          )}
          <button onClick={() => isLast ? onClose() : setStep(s => s + 1)}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-2 text-sm font-medium transition-colors">
            {isLast ? "Let's go! 🚀" : 'Next'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function Dashboard() {
  const { xp, level, streak, totalDone, reloadForUser } = useStore()
  const user = getUser()

  // ✅ Reload data from backend every time dashboard mounts
  useEffect(() => { reloadForUser() }, [])

  const isNewUser = xp === 0 && totalDone === 0
  const tutorialKey = `gp-tutorial-${user?.email}`
  const [showTutorial, setShowTutorial] = useState(false)

  useEffect(() => {
    if (isNewUser && !localStorage.getItem(tutorialKey)) {
      setShowTutorial(true)
    }
  }, [isNewUser])

  const closeTutorial = () => {
    localStorage.setItem(tutorialKey, 'seen')
    setShowTutorial(false)
  }

  const stats = [
    { label: 'Tasks Done',    value: totalDone, icon: '✅', color: 'text-green-500' },
    { label: 'Total XP',      value: xp,        icon: '⚡', color: 'text-yellow-500' },
    { label: 'Current Level', value: level,     icon: '🎮', color: 'text-purple-500' },
    { label: 'Day Streak',    value: streak,    icon: '🔥', color: 'text-orange-500' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
      <AnimatePresence>{showTutorial && <TutorialModal onClose={closeTutorial} />}</AnimatePresence>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold leading-snug">
          {isNewUser ? `Welcome, ${user?.name}! 👋` : `Welcome back, ${user?.name}! 👋`}
        </h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          {isNewUser ? 'Start completing tasks to earn XP and level up!' : `Keep going — you're on a ${streak}-day streak!`}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {stats.map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-4 sm:p-5 text-center shadow-sm border border-gray-100">
            <div className="text-2xl sm:text-3xl mb-1">{s.icon}</div>
            <div className={`text-xl sm:text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="mb-6"><XPBar /></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StreakCounter />
        <BadgeGrid />
        <Leaderboard />
      </div>
    </div>
  )
}