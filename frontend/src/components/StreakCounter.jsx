import { useStore } from '../store/useStore'

export default function StreakCounter() {
  const { streak } = useStore()

  return (
    <div style={{ background:'rgba(15,22,41,0.8)', border:'1px solid rgba(251,146,60,0.15)', borderRadius:'16px', padding:'24px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', backdropFilter:'blur(8px)' }}>
      <div style={{ fontSize: '40px', marginBottom: '8px' }}>🔥</div>
      <div style={{ fontSize: '42px', fontWeight: 800, color: '#fb923c', textShadow: '0 0 16px rgba(251,146,60,0.5)', lineHeight: 1 }}>{streak}</div>
      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '6px', fontWeight: 500 }}>Day Streak</div>
      {streak >= 3 && (
        <div style={{ marginTop: '12px', fontSize: '12px', background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.2)', color: '#fb923c', padding: '4px 12px', borderRadius: '100px', fontWeight: 600 }}>
          🏅 Streak Master!
        </div>
      )}
      {streak === 0 && (
        <p style={{ fontSize: '12px', color: '#475569', marginTop: '8px' }}>Complete a task today to start!</p>
      )}
    </div>
  )
}