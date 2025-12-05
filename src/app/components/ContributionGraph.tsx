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
    
    if (!entry) return 'var(--surface-hover)' // No data/Empty
    if (entry.isMissed) return 'var(--danger)' // Missed
    if (entry.count > 0) return 'var(--success)' // Completed
    return 'var(--surface-hover)'
  }

  const getTooltip = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    const entry = data.find(d => d.date.startsWith(dateStr))
    if (!entry) return `${date.toLocaleDateString()}: No activity`
    if (entry.isMissed) return `${date.toLocaleDateString()}: Missed`
    return `${date.toLocaleDateString()}: Completed`
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '100%' }}>
      {days.map((date, i) => (
        <div 
          key={i}
          title={getTooltip(date)}
          style={{
            width: '12px',
            height: '12px',
            backgroundColor: getColor(date),
            borderRadius: '2px',
            cursor: 'default'
          }}
        />
      ))}
    </div>
  )
}
