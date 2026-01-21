'use client'

import { useState } from 'react'
import { updateGoal, deleteGoal } from '@/app/actions/goals'
import { useRouter } from 'next/navigation'

type GoalActionsProps = {
  goalId: string
  title: string
  description: string | null
  deadline: Date
}

export default function GoalActions({ goalId, title, description, deadline }: GoalActionsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this goal? All tasks and progress will be lost.')) {
      return
    }

    setIsDeleting(true)
    const result = await deleteGoal(goalId)
    
    if (result.success) {
      router.push('/')
    } else {
      alert(result.error || 'Failed to delete goal')
      setIsDeleting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const result = await updateGoal(goalId, formData)
    
    if (result.success) {
      setIsEditing(false)
    } else {
      alert(result.error || 'Failed to update goal')
    }
  }

  if (isEditing) {
    return (
      <div className="glass-card" style={{ marginBottom: 'var(--spacing-6)', padding: 'var(--spacing-6)' }}>
        <h3 className="text-gradient" style={{ marginBottom: 'var(--spacing-4)', fontSize: '1.2rem', fontWeight: 'bold' }}>Edit Goal</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Title</label>
            <input
              type="text"
              name="title"
              defaultValue={title}
              required
              className="input-base"
              style={{
                width: '100%',
                padding: 'var(--spacing-3)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface-hover)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Description</label>
            <textarea
              name="description"
              defaultValue={description || ''}
              rows={3}
              style={{
                width: '100%',
                padding: 'var(--spacing-3)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface-hover)',
                color: 'var(--text-primary)',
                resize: 'vertical',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Deadline</label>
            <input
              type="date"
              name="deadline"
              defaultValue={new Date(deadline).toISOString().split('T')[0]}
              required
              style={{
                width: '100%',
                padding: 'var(--spacing-3)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface-hover)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-2)' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              Save Changes
            </button>
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="btn btn-ghost"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-6)' }}>
      <button 
        onClick={() => setIsEditing(true)}
        className="btn btn-ghost"
        style={{ fontSize: '0.9rem', padding: 'var(--spacing-2) var(--spacing-4)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}
      >
        <span>✏️</span> Edit Goal
      </button>
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="btn"
        style={{ 
          fontSize: '0.9rem', 
          padding: 'var(--spacing-2) var(--spacing-4)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: 'var(--danger)',
          border: '1px solid var(--danger)',
          display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)'
        }}
      >
        <span>🗑️</span> {isDeleting ? 'Deleting...' : 'Delete Goal'}
      </button>
    </div>
  )
}
