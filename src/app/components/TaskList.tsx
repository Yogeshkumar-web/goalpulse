'use client'

import { toggleTaskCompletion } from '../actions/tasks'
import { useState } from 'react'
import TaskItem from './TaskItem'

type Task = {
  id: string
  title: string
  goalId: string
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

  const handleToggle = async (taskId: string) => {
    const currentStatus = completions[taskId] || false
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
      {tasks.map(task => {
        const isCompleted = completions[task.id] || false
        return (
          <TaskItem 
            key={task.id}
            task={task}
            isCompleted={isCompleted}
            onToggle={handleToggle}
          />
        )
      })}
      {tasks.length === 0 && (
        <p style={{ color: 'var(--text-secondary)' }}>No tasks defined for this goal.</p>
      )}
    </div>
  )
}
