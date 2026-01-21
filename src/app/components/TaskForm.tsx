'use client'

import { useState } from 'react'
import { createTask, updateTask, deleteTask } from '@/app/actions/tasks'

type TaskFormProps = {
  goalId: string
  existingTask?: { id: string; title: string }
  onCancel?: () => void
}

export default function TaskForm({ goalId, existingTask, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(existingTask?.title || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    
    if (existingTask) {
      await updateTask(existingTask.id, title)
    } else {
      await createTask(goalId, title)
    }
    
    setIsSubmitting(false)
    setTitle('')
    onCancel?.()
  }

  const handleDelete = async () => {
    if (!existingTask) return
    if (!confirm('Are you sure you want to delete this task?')) return

    setIsSubmitting(true)
    await deleteTask(existingTask.id)
    setIsSubmitting(false)
    onCancel?.()
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center' }}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={existingTask ? "Update task..." : "Add a new task..."}
        disabled={isSubmitting}
        autoFocus={!!existingTask}
        style={{
          flex: 1,
          padding: 'var(--spacing-3)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          color: 'var(--text-primary)',
          outline: 'none',
          transition: 'border-color 0.2s',
          fontSize: '1rem'
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
      />
      <button 
        type="submit" 
        disabled={isSubmitting || !title.trim()}
        className="btn btn-primary"
        style={{ padding: 'var(--spacing-2) var(--spacing-4)' }}
      >
        {existingTask ? 'Update' : 'Add'}
      </button>
      {existingTask && (
        <button 
          type="button"
          onClick={handleDelete}
          disabled={isSubmitting}
          className="btn"
          style={{ padding: 'var(--spacing-2) var(--spacing-4)', backgroundColor: 'var(--danger)', color: 'white', border: 'none' }}
        >
          Delete
        </button>
      )}
      {onCancel && (
        <button 
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="btn btn-ghost"
          style={{ padding: 'var(--spacing-2) var(--spacing-4)' }}
        >
          Cancel
        </button>
      )}
    </form>
  )
}
