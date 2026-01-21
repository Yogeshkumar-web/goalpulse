'use client'

type ContributionData = {
  date: string
  count: number // 0 for missed/none, 1+ for completed tasks
  isMissed: boolean
}

export default function ContributionGraph({ data }: { data: ContributionData[] }) {
  // Generate a grid of last ~90 days
  const today = new Date()
  const days = []
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    days.push(d)
  }

  const getColor = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    const entry = data.find(d => d.date.startsWith(dateStr))
    
    if (!entry) return 'var(--surface-active)' // No data/Empty
    if (entry.isMissed) return 'var(--danger)' // Missed
    if (entry.count > 0) return 'var(--primary)' // Completed - Primary color for success
    return 'var(--surface-active)'
  }

  const getOpacity = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    const entry = data.find(d => d.date.startsWith(dateStr))
    if (entry && entry.count > 0) {
      // Scale opacity by count, max at 1
      return Math.min(0.4 + (entry.count * 0.2), 1)
    }
    return 1
  }

  const getTooltip = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    const entry = data.find(d => d.date.startsWith(dateStr))
    const dateDisplay = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    if (!entry) return `${dateDisplay}: No activity`
    if (entry.isMissed) return `${dateDisplay}: Missed`
    return `${dateDisplay}: ${entry.count} tasks completed`
  }

  return (
    <div className="glass-card" style={{ padding: 'var(--spacing-6)', width: '100%', overflowX: 'auto' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: 'var(--spacing-4)', color: 'var(--text-primary)' }}>Activity</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '100%' }}>
        {days.map((date, i) => (
          <div 
            key={i}
            title={getTooltip(date)}
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: getColor(date),
              opacity: getOpacity(date),
              borderRadius: '2px',
              cursor: 'default',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.5)'
              e.currentTarget.style.zIndex = '10'
              e.currentTarget.style.boxShadow = `0 0 8px ${getColor(date)}`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.zIndex = '1'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
        ))}
      </div>
    </div>
  )
}
