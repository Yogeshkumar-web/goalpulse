'use client'

import { useState } from 'react'
import { updateTask, deleteTask } from '@/app/actions/tasks'

type TaskItemProps = {
  task: {
    id: string
    title: string
  }
  isCompleted: boolean
  onToggle: (taskId: string) => void
}

export default function TaskItem({ task, isCompleted, onToggle }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleUpdate = async () => {
    if (!editTitle.trim()) return

    setIsSubmitting(true)
    const result = await updateTask(task.id, editTitle)
    setIsSubmitting(false)

    if (result.success) {
      setIsEditing(false)
    } else {
      alert(result.error || 'Failed to update task')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this task?')) return

    setIsSubmitting(true)
    const result = await deleteTask(task.id)
    
    if (!result.success) {
      alert(result.error || 'Failed to delete task')
      setIsSubmitting(false)
    }
  }

  if (isEditing) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 'var(--spacing-2)',
        padding: 'var(--spacing-2)',
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--radius-sm)'
      }}>
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          disabled={isSubmitting}
          autoFocus
          style={{
            flex: 1,
            padding: 'var(--spacing-2)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--background)',
            color: 'var(--text-primary)'
          }}
        />
        <button 
          onClick={handleUpdate}
          disabled={isSubmitting || !editTitle.trim()}
          className="btn btn-primary"
          style={{ fontSize: '0.8rem', padding: 'var(--spacing-1) var(--spacing-2)' }}
        >
          Save
        </button>
        <button 
          onClick={() => setIsEditing(false)}
          disabled={isSubmitting}
          className="btn btn-ghost"
          style={{ fontSize: '0.8rem', padding: 'var(--spacing-1) var(--spacing-2)' }}
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 'var(--spacing-2)',
      padding: 'var(--spacing-2)',
      borderRadius: 'var(--radius-sm)',
      backgroundColor: isCompleted ? 'rgba(34, 197, 94, 0.05)' : 'transparent',
      transition: 'background-color 0.2s'
    }}>
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={() => onToggle(task.id)}
        style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--primary)' }}
      />
      <span style={{ 
        flex: 1,
        textDecoration: isCompleted ? 'line-through' : 'none',
        color: isCompleted ? 'var(--text-secondary)' : 'var(--text-primary)',
        transition: 'color 0.2s'
      }}>
        {task.title}
      </span>
      <button 
        onClick={() => setIsEditing(true)}
        className="btn btn-ghost"
        style={{ fontSize: '0.8rem', padding: 'var(--spacing-1) var(--spacing-2)' }}
      >
        ✏️
      </button>
      <button 
        onClick={handleDelete}
        disabled={isSubmitting}
        className="btn btn-ghost"
        style={{ fontSize: '0.8rem', padding: 'var(--spacing-1) var(--spacing-2)', color: 'var(--danger)' }}
      >
        🗑️
      </button>
    </div>
  )
}
