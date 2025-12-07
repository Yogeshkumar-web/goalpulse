'use client'

import { createGoal } from '../../actions/goals'
import { useToast } from '@/app/components/ToastProvider'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewGoalPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showToast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const result = await createGoal(formData)

    if (result.success) {
      showToast('Goal created successfully! 🎉', 'success')
      router.push('/')
    } else {
      showToast(result.error || 'Failed to create goal', 'error')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: 'var(--spacing-6)' }}>Create New Goal</h2>
      
      <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: '500' }}>Goal Title</label>
          <input 
            type="text" 
            name="title" 
            required 
            disabled={isSubmitting}
            placeholder="e.g. Learn Guitar"
            style={{ 
              width: '100%', 
              padding: 'var(--spacing-2)', 
              backgroundColor: 'var(--background)', 
              border: '1px solid var(--border)', 
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)'
            }} 
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: '500' }}>Description</label>
          <textarea 
            name="description" 
            rows={3}
            disabled={isSubmitting}
            placeholder="Why is this important?"
            style={{ 
              width: '100%', 
              padding: 'var(--spacing-2)', 
              backgroundColor: 'var(--background)', 
              border: '1px solid var(--border)', 
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)'
            }} 
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: '500' }}>Deadline</label>
          <input 
            type="date" 
            name="deadline" 
            required 
            disabled={isSubmitting}
            style={{ 
              width: '100%', 
              padding: 'var(--spacing-2)', 
              backgroundColor: 'var(--background)', 
              border: '1px solid var(--border)', 
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)'
            }} 
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="btn btn-primary" 
          style={{ 
            marginTop: 'var(--spacing-4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--spacing-2)',
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? (
            <>
              <span className="spinner" />
              Creating...
            </>
          ) : (
            '✨ Create Goal'
          )}
        </button>
      </form>

      <style jsx>{`
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
