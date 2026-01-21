type ProgressOverviewProps = {
  overallMomentum: number
  currentStreak: number
  weeklyCompletion: number[]
}

export default function ProgressOverview({ overallMomentum, currentStreak, weeklyCompletion }: ProgressOverviewProps) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  
  return (
    <div className="glass-card" style={{ padding: 'var(--spacing-6)' }}>
      <h2 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: 'var(--spacing-6)' }}>Progress Overview</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-8)' }}>
        <div style={{ textAlign: 'center', padding: 'var(--spacing-4)', backgroundColor: 'var(--surface-active)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-2)' }}>Overall Momentum</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)', textShadow: '0 0 20px rgba(0, 230, 118, 0.3)' }}>{Math.round(overallMomentum)}</div>
        </div>
        
        <div style={{ textAlign: 'center', padding: 'var(--spacing-4)', backgroundColor: 'var(--surface-active)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-2)' }}>Current Streak</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--secondary)', textShadow: '0 0 20px rgba(41, 121, 255, 0.3)' }}>{currentStreak} <span style={{fontSize: '2rem'}}>🔥</span></div>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: 'var(--spacing-4)', color: 'var(--text-primary)' }}>This Week's Activity</h3>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)', justifyContent: 'space-between', height: '140px', alignItems: 'flex-end' }}>
          {days.map((day, index) => {
            const completion = weeklyCompletion[index] || 0
            const height = Math.max(10, completion) // Minimum height for visibility
            const color = completion === 100 ? 'var(--primary)' : completion > 50 ? 'var(--secondary)' : 'var(--surface-active)'
            
            return (
              <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2)', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  paddingBottom: 'var(--spacing-1)'
                }}>
                  <div 
                    style={{ 
                      width: '80%', 
                      height: `${height}%`, 
                      backgroundColor: color,
                      borderRadius: 'var(--radius-sm)',
                      transition: 'height 0.3s ease',
                      boxShadow: completion > 0 ? `0 0 10px ${color}` : 'none',
                      opacity: completion > 0 ? 1 : 0.3
                    }}
                    title={`${completion}% complete`}
                  />
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{day}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
