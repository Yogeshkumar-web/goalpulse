'use client'

import { toggleTaskCompletion } from '@/app/actions/tasks'
import { useState } from 'react'

type Task = {
  id: string
  title: string
  goalId: string
}

type TaskCompletion = {
  taskId: string
  completed: boolean
}

type TodayTasksCardProps = {
  tasksByGoal: {
    goalId: string
    goalTitle: string
    tasks: Task[]
  }[]
  initialCompletions: TaskCompletion[]
}

export default function TodayTasksCard({ tasksByGoal, initialCompletions }: TodayTasksCardProps) {
  const [completions, setCompletions] = useState<Map<string, boolean>>(
    new Map(initialCompletions.map(c => [c.taskId, c.completed]))
  )

  const handleToggle = async (taskId: string) => {
    const currentState = completions.get(taskId) || false
    const newState = !currentState
    
    // Optimistic update
    setCompletions(new Map(completions).set(taskId, newState))
    
    // Server update
    await toggleTaskCompletion(taskId, new Date(), newState)
  }

  const totalTasks = tasksByGoal.reduce((sum, g) => sum + g.tasks.length, 0)
  const completedTasks = Array.from(completions.values()).filter(Boolean).length

  if (totalTasks === 0) {
    return (
      <div className="card">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: 'var(--spacing-4)' }}>Today's Tasks</h2>
        <p style={{ color: 'var(--text-secondary)' }}>No tasks yet. Create a goal and add some tasks to get started!</p>
      </div>
    )
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Today's Tasks</h2>
        <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
          {completedTasks} / {totalTasks} completed
        </span>
      </div>

      {tasksByGoal.map(({ goalId, goalTitle, tasks }) => (
        <div key={goalId} style={{ marginBottom: 'var(--spacing-4)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: 'var(--spacing-2)', color: 'var(--primary)' }}>
            {goalTitle}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            {tasks.map(task => {
              const isCompleted = completions.get(task.id) || false
              return (
                <label 
                  key={task.id}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--spacing-2)',
                    padding: 'var(--spacing-2)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    backgroundColor: isCompleted ? 'rgba(34, 197, 94, 0.05)' : 'transparent',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => handleToggle(task.id)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <span style={{ 
                    textDecoration: isCompleted ? 'line-through' : 'none',
                    color: isCompleted ? 'var(--text-secondary)' : 'var(--text-primary)'
                  }}>
                    {task.title}
                  </span>
                </label>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
