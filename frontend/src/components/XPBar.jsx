import { useStore } from '../store/useStore'

const LEVEL_THRESHOLDS = [0, 50, 150, 300, 500]
const LEVEL_NAMES = ['Beginner', 'Apprentice', 'Explorer', 'Expert', 'Master']
const LEVEL_COLORS = [
  ['#60a5fa','#818cf8'],
  ['#34d399','#60a5fa'],
  ['#a78bfa','#ec4899'],
  ['#fbbf24','#f97316'],
  ['#f43f5e','#a855f7'],
]

export default function XPBar() {
  const { xp, level, xpForNextLevel } = useStore()
  const nextXP  = xpForNextLevel()
  const prevXP  = LEVEL_THRESHOLDS[Math.min(level - 1, 4)]
  const percent = Math.min(((xp - prevXP) / (nextXP - prevXP)) * 100, 100)
  const [c1, c2] = LEVEL_COLORS[Math.min(level-1,4)]

  return (
    <div style={{ background: 'rgba(15,22,41,0.8)', border: '1px solid rgba(99,179,237,0.1)', borderRadius: '16px', padding: '20px 24px', backdropFilter: 'blur(8px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ background: `linear-gradient(135deg, ${c1}, ${c2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '15px', fontWeight: 800 }}>
            Level {level} — {LEVEL_NAMES[Math.min(level - 1, 4)]}
          </span>
        </div>
        <span style={{ fontSize: '13px', color: '#64748b', fontFamily: 'monospace' }}>{xp} / {nextXP} XP</span>
      </div>

      <div style={{ width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '100px', height: '10px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: '100px', width: `${percent}%`,
          background: `linear-gradient(90deg, ${c1}, ${c2})`,
          boxShadow: `0 0 12px ${c1}88`,
          transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)'
        }} />
      </div>

      <p style={{ fontSize: '12px', color: '#475569', marginTop: '8px' }}>
        {nextXP - xp > 0 ? `${nextXP - xp} XP to next level` : '🎉 Max level reached!'}
      </p>
    </div>
  )
}