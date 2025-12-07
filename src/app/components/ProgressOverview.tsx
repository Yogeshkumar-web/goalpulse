type ProgressOverviewProps = {
  overallMomentum: number
  currentStreak: number
  weeklyCompletion: number[]
}

export default function ProgressOverview({ overallMomentum, currentStreak, weeklyCompletion }: ProgressOverviewProps) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  
  return (
    <div className="card">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: 'var(--spacing-6)' }}>Progress Overview</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
        <div style={{ textAlign: 'center', padding: 'var(--spacing-4)', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-2)' }}>Overall Momentum</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{Math.round(overallMomentum)}</div>
        </div>
        
        <div style={{ textAlign: 'center', padding: 'var(--spacing-4)', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-2)' }}>Current Streak</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)' }}>{currentStreak} 🔥</div>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: 'var(--spacing-3)' }}>This Week</h3>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)', justifyContent: 'space-between' }}>
          {days.map((day, index) => {
            const completion = weeklyCompletion[index] || 0
            const height = Math.max(20, completion) // Minimum height for visibility
            const color = completion === 100 ? 'var(--success)' : completion > 50 ? 'var(--warning)' : 'var(--danger)'
            
            return (
              <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <div style={{ 
                  width: '100%', 
                  height: '100px', 
                  display: 'flex', 
                  alignItems: 'flex-end',
                  justifyContent: 'center'
                }}>
                  <div 
                    style={{ 
                      width: '100%', 
                      height: `${height}%`, 
                      backgroundColor: color,
                      borderRadius: 'var(--radius-sm)',
                      transition: 'height 0.3s ease'
                    }}
                    title={`${completion}% complete`}
                  />
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{day}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
