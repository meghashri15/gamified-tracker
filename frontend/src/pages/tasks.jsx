import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import toast from 'react-hot-toast'

const CATEGORIES = ['General', 'Work', 'Study', 'Health', 'Personal']

export default function Tasks() {
  const { tasks, addTask, completeTask, deleteTask } = useStore()
  const [title,    setTitle]    = useState('')
  const [category, setCategory] = useState('General')
  const [filter,   setFilter]   = useState('All')

  async function handleAdd() {
    if (!title.trim()) { toast.error('Task title cannot be empty!'); return }
    try {
      await addTask(title.trim(), category)
      toast.success('Task added! 📝')
      setTitle('')
    } catch {
      toast.error('Failed to add task. Try again.')
    }
  }

  async function handleComplete(id) {
    try {
      await completeTask(id)
      toast.success('+10 XP earned! ⚡')
    } catch {
      toast.error('Failed to complete task.')
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTask(id)
    } catch {
      toast.error('Failed to delete task.')
    }
  }

  // Tasks come newest-first from the store (addTask prepends)
  const filtered = tasks.filter(t => {
    if (filter === 'Pending') return !t.completed
    if (filter === 'Done')    return t.completed
    return true
  })

  // MongoDB uses _id, localStorage used id — handle both
  function getId(task) { return task._id || task.id }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">My Tasks</h1>

      {/* Add task */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="What do you want to get done?"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={handleAdd}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors">
          + Add Task (+10 XP)
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {['All', 'Pending', 'Done'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 py-12 text-sm">
          {filter === 'Done' ? 'No completed tasks yet.' : 'No tasks here. Add one above! 👆'}
        </p>
      )}

      <AnimatePresence>
        {filtered.map(task => (
          <motion.div key={getId(task)}
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
            className={`flex items-center gap-3 rounded-2xl px-4 py-4 mb-3 border transition-all ${
              task.completed ? 'bg-green-50 border-green-100' : 'bg-white border-gray-100 shadow-sm'
            }`}>

            <button onClick={() => !task.completed && handleComplete(getId(task))}
              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-purple-500'
              }`}>
              {task.completed && <span className="text-xs">✓</span>}
            </button>

            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                {task.title}
              </p>
              <span className="inline-block mt-1 text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                {task.category}
              </span>
            </div>

            <span className={`text-sm font-semibold flex-shrink-0 ${task.completed ? 'text-green-500' : 'text-yellow-500'}`}>
              +10 XP
            </span>

            <button onClick={() => handleDelete(getId(task))}
              className="text-gray-300 hover:text-red-400 transition-colors text-lg flex-shrink-0 ml-1">
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}