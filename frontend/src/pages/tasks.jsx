import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import toast from 'react-hot-toast'

const CATEGORIES = ['General','Work','Study','Health','Personal']
const CAT_COLORS = { General:'#63b3ed', Work:'#a78bfa', Study:'#34d399', Health:'#fb923c', Personal:'#f472b6' }

export default function Tasks() {
  const { tasks, addTask, completeTask, deleteTask } = useStore()
  const [title,    setTitle]    = useState('')
  const [category, setCategory] = useState('General')
  const [filter,   setFilter]   = useState('All')

  async function handleAdd() {
    if (!title.trim()) { toast.error('Task title cannot be empty!'); return }
    try { await addTask(title.trim(), category); toast.success('Task added! 📝'); setTitle('') }
    catch { toast.error('Failed to add task.') }
  }

  async function handleComplete(id) {
    try { await completeTask(id); toast.success('+10 XP earned! ⚡') }
    catch { toast.error('Failed to complete task.') }
  }

  async function handleDelete(id) {
    try { await deleteTask(id) }
    catch { toast.error('Failed to delete task.') }
  }

  const filtered = tasks.filter(t => {
    if (filter === 'Pending') return !t.completed
    if (filter === 'Done')    return t.completed
    return true
  })
  function getId(task) { return task._id || task.id }

  const counts = { All: tasks.length, Pending: tasks.filter(t=>!t.completed).length, Done: tasks.filter(t=>t.completed).length }

  return (
    <div style={{ background:'#0a0f1e', minHeight:'100vh', padding:'28px 16px 48px' }}>
      <div style={{ maxWidth:'720px', margin:'0 auto' }}>

        <h1 style={{ fontSize:'clamp(20px,4vw,26px)', fontWeight:800, color:'#f1f5f9', marginBottom:'24px' }}>My Tasks</h1>

        {/* Add task card */}
        <div style={{ background:'rgba(15,22,41,0.9)', border:'1px solid rgba(99,179,237,0.15)', borderRadius:'16px', padding:'20px', marginBottom:'20px', backdropFilter:'blur(8px)' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
              <input value={title} onChange={e=>setTitle(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleAdd()}
                placeholder="What do you want to get done?"
                style={{ flex:'1 1 200px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(99,179,237,0.15)', borderRadius:'10px', padding:'11px 14px', color:'#e2e8f0', fontSize:'14px', outline:'none', minWidth:'0', transition:'border-color 0.2s' }}
                onFocus={e=>e.target.style.borderColor='rgba(99,179,237,0.5)'} onBlur={e=>e.target.style.borderColor='rgba(99,179,237,0.15)'} />
              <select value={category} onChange={e=>setCategory(e.target.value)}
                style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(99,179,237,0.15)', borderRadius:'10px', padding:'11px 14px', color:'#e2e8f0', fontSize:'14px', outline:'none', cursor:'pointer', flexShrink:0 }}>
                {CATEGORIES.map(c=><option key={c} style={{background:'#1a2035'}}>{c}</option>)}
              </select>
            </div>
            <button onClick={handleAdd}
              style={{ background:'linear-gradient(135deg, #3b82f6, #6366f1)', border:'none', borderRadius:'10px', padding:'12px', color:'#fff', fontSize:'14px', fontWeight:700, cursor:'pointer', boxShadow:'0 0 20px rgba(99,130,246,0.35)', transition:'opacity 0.15s' }}>
              + Add Task &nbsp;·&nbsp; +10 XP
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display:'flex', gap:'8px', marginBottom:'16px', flexWrap:'wrap' }}>
          {['All','Pending','Done'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              style={{ padding:'7px 16px', borderRadius:'100px', fontSize:'13px', fontWeight:600, cursor:'pointer', transition:'all 0.15s', border:'none',
                background: filter===f ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'rgba(255,255,255,0.05)',
                color: filter===f ? '#fff' : '#64748b',
                boxShadow: filter===f ? '0 0 14px rgba(99,130,246,0.35)' : 'none' }}>
              {f} <span style={{ opacity:0.7, marginLeft:'4px' }}>({counts[f]})</span>
            </button>
          ))}
        </div>

        {filtered.length===0 && (
          <div style={{ textAlign:'center', padding:'56px 0', color:'#475569', fontSize:'14px' }}>
            {filter==='Done' ? '🎯 No completed tasks yet.' : '📋 No tasks here. Add one above!'}
          </div>
        )}

        <AnimatePresence>
          {filtered.map(task=>(
            <motion.div key={getId(task)} initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,x:-24}}
              style={{ display:'flex', alignItems:'center', gap:'12px', borderRadius:'14px', padding:'14px 16px', marginBottom:'10px', transition:'all 0.2s',
                background: task.completed ? 'rgba(52,211,153,0.05)' : 'rgba(15,22,41,0.8)',
                border: task.completed ? '1px solid rgba(52,211,153,0.2)' : '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(8px)' }}>

              <button onClick={()=>!task.completed&&handleComplete(getId(task))}
                style={{ width:'26px', height:'26px', borderRadius:'50%', flexShrink:0, cursor:task.completed?'default':'pointer', transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:700,
                  background: task.completed ? 'rgba(52,211,153,0.9)' : 'transparent',
                  border: task.completed ? '2px solid #34d399' : '2px solid rgba(255,255,255,0.2)',
                  color: '#fff', boxShadow: task.completed ? '0 0 8px rgba(52,211,153,0.4)' : 'none' }}>
                {task.completed && '✓'}
              </button>

              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:'14px', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', transition:'all 0.2s',
                  color: task.completed ? '#475569' : '#e2e8f0',
                  textDecoration: task.completed ? 'line-through' : 'none' }}>
                  {task.title}
                </p>
                <span style={{ fontSize:'11px', fontWeight:600, color: CAT_COLORS[task.category]||'#63b3ed', background:`${CAT_COLORS[task.category]||'#63b3ed'}15`, padding:'2px 8px', borderRadius:'100px', display:'inline-block', marginTop:'3px' }}>
                  {task.category}
                </span>
              </div>

              <span style={{ fontSize:'12px', fontWeight:700, flexShrink:0, color: task.completed ? '#34d399' : '#fbbf24' }}>
                +10 XP
              </span>

              <button onClick={()=>handleDelete(getId(task))}
                style={{ background:'none', border:'none', color:'#334155', cursor:'pointer', fontSize:'18px', padding:'0 4px', transition:'color 0.15s', flexShrink:0 }}
                onMouseEnter={e=>e.target.style.color='#f87171'} onMouseLeave={e=>e.target.style.color='#334155'}>
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}