'use client'

import { toggleTaskCompletion } from '../actions/tasks'
import { useState } from 'react'

type Task = {
  id: string
  title: string
}

type TaskCompletion = {
  taskId: string
  completed: boolean
}

export default function TaskList({ 
  tasks, 
  initialCompletions,
  date 
}: { 
  tasks: Task[], 
  initialCompletions: TaskCompletion[],
  date: Date
}) {
  const [completions, setCompletions] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {}
    initialCompletions.forEach(c => map[c.taskId] = c.completed)
    return map
  })

  const handleToggle = async (taskId: string, currentStatus: boolean) => {
    // Optimistic update
    setCompletions(prev => ({ ...prev, [taskId]: !currentStatus }))
    
    const result = await toggleTaskCompletion(taskId, date, !currentStatus)
    if (!result.success) {
      // Revert if failed
      setCompletions(prev => ({ ...prev, [taskId]: currentStatus }))
      alert('Failed to update task')
    }
  }

  return (
    <div className="card">
      <h3 style={{ marginBottom: 'var(--spacing-4)', fontSize: '1.2rem' }}>Daily Tasks</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
        {tasks.map(task => {
          const isCompleted = completions[task.id] || false
          return (
            <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
              <input 
                type="checkbox" 
                checked={isCompleted}
                onChange={() => handleToggle(task.id, isCompleted)}
                style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
              <span style={{ 
                textDecoration: isCompleted ? 'line-through' : 'none',
                color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                transition: 'color 0.2s'
              }}>
                {task.title}
              </span>
            </div>
          )
        })}
        {tasks.length === 0 && (
          <p style={{ color: 'var(--text-secondary)' }}>No tasks defined for this goal.</p>
        )}
      </div>
    </div>
  )
}
