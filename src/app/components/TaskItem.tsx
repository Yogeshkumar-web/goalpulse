'use client'

import { useState } from 'react'
import { updateTask, deleteTask } from '@/app/actions/tasks'
import TaskForm from './TaskForm'

type TaskItemProps = {
  task: {
    id: string
    title: string
    goalId: string
  }
  isCompleted: boolean
  onToggle: (taskId: string) => void
  isReadOnly?: boolean
}

export default function TaskItem({ task, isCompleted, onToggle, isReadOnly = false }: TaskItemProps) {
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
      <TaskForm 
        goalId={task.goalId}
        existingTask={task}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  return (
    <div 
      className="group"
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 'var(--spacing-3)',
        padding: 'var(--spacing-3)',
        borderRadius: 'var(--radius-md)',
        backgroundColor: isCompleted ? 'rgba(0, 230, 118, 0.05)' : 'transparent',
        border: '1px solid transparent',
        transition: 'all 0.2s',
        marginBottom: 'var(--spacing-2)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = isCompleted ? 'rgba(0, 230, 118, 0.08)' : 'var(--surface-hover)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = isCompleted ? 'rgba(0, 230, 118, 0.05)' : 'transparent'
      }}
    >
      <div 
        onClick={() => onToggle(task.id)}
        style={{ 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          border: `2px solid ${isCompleted ? 'var(--primary)' : 'var(--text-muted)'}`,
          backgroundColor: isCompleted ? 'var(--primary)' : 'transparent',
          position: 'relative',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {isCompleted && (
          <span className="check-pop" style={{ color: 'black', fontSize: '14px', fontWeight: 'bold' }}>✓</span>
        )}
      </div>

      <span style={{ 
        flex: 1,
        textDecoration: isCompleted ? 'line-through' : 'none',
        color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
        transition: 'color 0.2s',
        fontSize: '1rem',
        cursor: 'pointer'
      }} onClick={() => onToggle(task.id)}>
        {task.title}
      </span>

      {!isReadOnly && (
        <div style={{ display: 'flex', gap: 'var(--spacing-1)', opacity: 0.5, transition: 'opacity 0.2s' }} 
             onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
             onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}>
          <button 
            onClick={() => setIsEditing(true)}
            className="btn btn-ghost"
            style={{ fontSize: '0.9rem', padding: 'var(--spacing-2)' }}
            title="Edit"
          >
            ✏️
          </button>
          <button 
            onClick={handleDelete}
            disabled={isSubmitting}
            className="btn btn-ghost"
            style={{ fontSize: '0.9rem', padding: 'var(--spacing-2)', color: 'var(--danger)' }}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  )
}
