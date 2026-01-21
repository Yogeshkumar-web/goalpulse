'use client'

import { toggleTaskCompletion } from '@/app/actions/tasks'
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

type TodayTasksCardProps = {
  tasksByGoal: {
    goalId: string
    goalTitle: string
    tasks: Task[]
  }[]
  initialCompletions: TaskCompletion[]
  isReadOnly?: boolean
}

export default function TodayTasksCard({ tasksByGoal, initialCompletions, isReadOnly = false }: TodayTasksCardProps) {
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
      <div className="glass-card" style={{ padding: 'var(--spacing-6)', textAlign: 'center' }}>
        <h2 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: 'var(--spacing-4)' }}>Your Tasks</h2>
        <p style={{ color: 'var(--text-secondary)' }}>No tasks yet. Create a goal and add some tasks to get started!</p>
      </div>
    )
  }

  return (
    <div className="glass-card" style={{ padding: 'var(--spacing-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
        <h2 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Your Tasks</h2>
        <span style={{ 
          fontSize: '0.9rem', 
          fontWeight: 600,
          color: 'var(--text-secondary)',
          backgroundColor: 'var(--surface-active)',
          padding: 'var(--spacing-1) var(--spacing-3)',
          borderRadius: 'var(--radius-full)'
        }}>
          {completedTasks} / {totalTasks} Done
        </span>
      </div>

      {tasksByGoal.map(({ goalId, goalTitle, tasks }) => (
        <div key={goalId} style={{ marginBottom: 'var(--spacing-6)' }}>
          <h3 style={{ 
            fontSize: '1rem', 
            fontWeight: 'bold', 
            marginBottom: 'var(--spacing-3)', 
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-2)'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></span>
            {goalTitle}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
            {tasks.map(task => {
              const isCompleted = completions.get(task.id) || false
              return (
                <TaskItem
                  key={task.id}
                  task={task}
                  isCompleted={isCompleted}
                  onToggle={handleToggle}
                  isReadOnly={isReadOnly}
                />
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
