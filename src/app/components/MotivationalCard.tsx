'use client'

import { getRandomQuote, getRandomCongratulation } from '@/app/lib/quotes'

type MotivationalCardProps = {
  hasIncompleteTasks: boolean
  completionPercentage: number
}

export default function MotivationalCard({ hasIncompleteTasks, completionPercentage }: MotivationalCardProps) {
  const message = hasIncompleteTasks ? getRandomQuote() : getRandomCongratulation()
  const bgColor = hasIncompleteTasks ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)'
  const borderColor = hasIncompleteTasks ? 'var(--danger)' : 'var(--success)'
  const icon = hasIncompleteTasks ? '⚠️' : '✅'

  return (
    <div 
      className="card" 
      style={{ 
        backgroundColor: bgColor,
        borderLeft: `4px solid ${borderColor}`,
        padding: 'var(--spacing-6)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)' }}>
        <span style={{ fontSize: '2rem' }}>{icon}</span>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
          {hasIncompleteTasks ? 'Keep Going!' : 'Well Done!'}
        </h2>
      </div>
      
      <p style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-4)', fontStyle: 'italic' }}>
        "{message}"
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
        <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
          <div 
            style={{ 
              height: '100%', 
              width: `${completionPercentage}%`, 
              backgroundColor: borderColor,
              transition: 'width 0.3s ease'
            }}
          />
        </div>
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: borderColor }}>
          {completionPercentage}%
        </span>
      </div>
    </div>
  )
}
