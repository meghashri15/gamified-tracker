import { useStore } from '../store/useStore'

export default function BadgeGrid() {
  const { badges, unlockedBadges } = useStore()

  return (
    <div style={{ background:'rgba(15,22,41,0.8)', border:'1px solid rgba(167,139,250,0.15)', borderRadius:'16px', padding:'24px', backdropFilter:'blur(8px)' }}>
      <h3 style={{ fontSize:'13px', fontWeight:700, color:'#a78bfa', marginBottom:'4px', textTransform:'uppercase', letterSpacing:'0.06em' }}>Badges</h3>
      <p style={{ fontSize:'11px', color:'#475569', marginBottom:'16px' }}>{unlockedBadges.length} / {badges.length} unlocked</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px' }}>
        {badges.map(badge => {
          // unlockedBadges is an array of strings like ['First Step', 'Level Up']
          // badge.name is also a string — so this comparison is always string vs string ✅
          const unlocked = unlockedBadges.includes(badge.name)
          return (
            <div key={badge.id} title={`${badge.name}: ${badge.desc}`}
              style={{
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                borderRadius:'12px', padding:'12px 8px', textAlign:'center', transition:'all 0.3s',
                cursor: 'default',
                background: unlocked
                  ? 'linear-gradient(135deg, rgba(167,139,250,0.15), rgba(99,179,237,0.08))'
                  : 'rgba(255,255,255,0.02)',
                border: unlocked
                  ? '1px solid rgba(167,139,250,0.4)'
                  : '1px solid rgba(255,255,255,0.05)',
                filter: unlocked ? 'none' : 'grayscale(1)',
                opacity: unlocked ? 1 : 0.35,
                boxShadow: unlocked ? '0 0 14px rgba(167,139,250,0.2), inset 0 0 12px rgba(167,139,250,0.05)' : 'none',
                transform: unlocked ? 'scale(1.02)' : 'scale(1)',
              }}>
              <div style={{ fontSize: '24px', marginBottom: '5px', filter: unlocked ? 'drop-shadow(0 0 6px rgba(167,139,250,0.6))' : 'none' }}>
                {badge.icon}
              </div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: unlocked ? '#c4b5fd' : '#334155', lineHeight: 1.3 }}>
                {badge.name}
              </div>
              {unlocked && (
                <div style={{ fontSize:'9px', color:'#7c3aed', marginTop:'3px', fontWeight:600 }}>✓ Earned</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}