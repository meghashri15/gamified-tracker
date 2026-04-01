import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import toast from 'react-hot-toast'

export default function TaskCard({ task }) {
  const { completeTask, deleteTask } = useStore()

  const handleComplete = () => {
    completeTask(task.id)
    toast.success('+10 XP earned! 🎉')
  }

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`flex items-center justify-between p-4 rounded-xl border transition-all
        ${task.completed
          ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 opacity-60'
          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'}`}>
      <div className="flex items-center gap-3">
        <button onClick={handleComplete} disabled={task.completed}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
            ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-purple-500'}`}>
          {task.completed && '✓'}
        </button>
        <div>
          <p className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.title}</p>
          <span className="text-xs text-purple-500 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-full">{task.category}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-amber-500 font-medium">+{task.xpValue} XP</span>
        {!task.completed && (
          <button onClick={() => deleteTask(task.id)}
            className="text-gray-300 hover:text-red-500 transition-colors text-lg leading-none">×</button>
        )}
      </div>
    </motion.div>
  )
}