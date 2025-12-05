'use client'

import { createGoal } from '../../actions/goals'
import { useActionState } from 'react' // Next.js 15 / React 19
// If useActionState is not available yet in the installed version, fallback to useFormState
// But create-next-app@latest should have it. I'll use standard form action for simplicity first.

export default function NewGoalPage() {
  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: 'var(--spacing-6)' }}>Create New Goal</h2>
      
      <form action={async (formData) => { await createGoal(formData) }} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: '500' }}>Goal Title</label>
          <input 
            type="text" 
            name="title" 
            required 
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

        <button type="submit" className="btn btn-primary" style={{ marginTop: 'var(--spacing-4)' }}>
          Create Goal
        </button>
      </form>
    </div>
  )
}
