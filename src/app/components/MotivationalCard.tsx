'use client'

import { getRandomQuote, getRandomCongratulation } from '@/app/lib/quotes'

type MotivationalCardProps = {
  hasIncompleteTasks: boolean
  completionPercentage: number
}

export default function MotivationalCard({ hasIncompleteTasks, completionPercentage }: MotivationalCardProps) {
  const message = hasIncompleteTasks ? getRandomQuote() : getRandomCongratulation()
  
  // Use global semantic colors
  const borderColor = hasIncompleteTasks ? 'var(--primary)' : 'var(--success)'
  const icon = hasIncompleteTasks ? '🚀' : '🎉'
  const gradient = hasIncompleteTasks 
    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)'

  return (
    <div 
      className="glass-card" 
      style={{ 
        background: gradient,
        borderLeft: `4px solid ${borderColor}`,
        padding: 'var(--spacing-6)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
        <span style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))' }}>{icon}</span>
        <h2 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
          {hasIncompleteTasks ? 'Keep Going!' : 'Well Done!'}
        </h2>
      </div>
      
      <p style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-6)', fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
        "{message}"
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
        <div style={{ flex: 1, height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
          <div 
            style={{ 
              height: '100%', 
              width: `${completionPercentage}%`, 
              backgroundColor: borderColor,
              borderRadius: '4px',
              transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: `0 0 10px ${borderColor}`
            }}
          />
        </div>
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: borderColor, minWidth: '3.5rem', textAlign: 'right' }}>
          {Math.round(completionPercentage)}%
        </span>
      </div>
    </div>
  )
}
