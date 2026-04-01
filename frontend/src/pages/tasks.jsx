import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import TaskCard from '../components/TaskCard'

const CATEGORIES = ['General', 'Study', 'Work', 'Health', 'Personal']

export default function Tasks() {
  const { tasks, addTask } = useStore()
  const [title,    setTitle]    = useState('')
  const [category, setCategory] = useState('General')
  const [filter,   setFilter]   = useState('All')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    addTask(title.trim(), category)
    setTitle('')
  }

  const filtered = filter === 'All' ? tasks : filter === 'Done'
    ? tasks.filter(t => t.completed) : tasks.filter(t => !t.completed)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Tasks</h1>

      <form onSubmit={handleAdd}
        className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
        <div className="flex gap-3 mb-3">
          <input value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-400 transition-colors" />
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm outline-none">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-2 text-sm font-medium transition-colors">
          + Add Task (+10 XP)
        </button>
      </form>

      <div className="flex gap-2 mb-4">
        {['All', 'Pending', 'Done'].map(f => (
          <motion.button key={f} onClick={() => setFilter(f)}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
              ${filter === f ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
            {f}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        <div className="space-y-3">
          {filtered.length === 0
            ? <p className="text-center text-gray-400 py-12">No tasks here. Add one above!</p>
            : filtered.map(t => <TaskCard key={t.id} task={t} />)
          }
        </div>
      </AnimatePresence>
    </div>
  )
}