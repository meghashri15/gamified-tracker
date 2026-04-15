import { useStore } from '../store/useStore'

const MEDALS = ['🥇','🥈','🥉']

export default function Leaderboard() {
  const { leaderboard } = useStore()

  return (
    <div style={{ background:'rgba(15,22,41,0.8)', border:'1px solid rgba(99,179,237,0.12)', borderRadius:'16px', padding:'24px', backdropFilter:'blur(8px)' }}>
      <h3 style={{ fontSize:'13px', fontWeight:700, color:'#63b3ed', marginBottom:'16px', textTransform:'uppercase', letterSpacing:'0.06em' }}>Leaderboard</h3>
      <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
        {leaderboard.map((entry, i) => (
          <div key={entry.name}
            style={{ display:'flex', alignItems:'center', gap:'10px', borderRadius:'10px', padding:'10px 12px', transition:'all 0.15s',
              background: entry.isYou ? 'rgba(99,179,237,0.08)' : 'rgba(255,255,255,0.03)',
              border: entry.isYou ? '1px solid rgba(99,179,237,0.2)' : '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontSize:'16px', width:'20px', textAlign:'center', flexShrink:0 }}>
              {MEDALS[i] || <span style={{ fontSize:'12px', color:'#475569' }}>{i+1}</span>}
            </span>
            <span style={{ flex:1, fontSize:'13px', fontWeight:600, color: entry.isYou ? '#63b3ed' : '#cbd5e1', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {entry.name}{entry.isYou && <span style={{ color:'#4a9fc2', fontSize:'11px', marginLeft:'4px' }}>(you)</span>}
            </span>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <div style={{ fontSize:'12px', fontWeight:700, color:'#fbbf24' }}>{entry.xp} XP</div>
              <div style={{ fontSize:'11px', color:'#475569' }}>Lv.{entry.level}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}