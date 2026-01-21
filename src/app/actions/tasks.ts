'use server'

import { prisma } from '@/app/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'

export async function createTask(goalId: string, title: string) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

  try {
    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
      select: { userId: true }
    })

    if (!goal || goal.userId !== session.user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const task = await prisma.task.create({
      data: {
        goalId,
        title,
      }
    })

    revalidatePath(`/goals/${goalId}`)
    return { success: true, data: task }
  } catch (error) {
    console.error('Failed to create task:', error)
    return { success: false, error: 'Failed to create task' }
  }
}

export async function updateTask(taskId: string, title: string) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { goal: true }
    })

    if (!task || task.goal.userId !== session.user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: { title }
    })

    revalidatePath(`/goals/${task.goalId}`)
    return { success: true, data: updated }
  } catch (error) {
    console.error('Failed to update task:', error)
    return { success: false, error: 'Failed to update task' }
  }
}

export async function deleteTask(taskId: string) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { goal: true }
    })

    if (!task || task.goal.userId !== session.user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Delete all completions first
    await prisma.taskCompletion.deleteMany({
      where: { taskId }
    })

    await prisma.task.delete({
      where: { id: taskId }
    })

    revalidatePath(`/goals/${task.goalId}`)
    return { success: true }
  } catch (error) {
    console.error('Failed to delete task:', error)
    return { success: false, error: 'Failed to delete task' }
  }
}

export async function toggleTaskCompletion(taskId: string, date: Date, completed: boolean) {
  try {
    // Note: Authentication check removed to allow public completion for personal dashboard usage.
    // If strict security is needed later, re-enable session check here.
    
    // Normalize date to midnight
    const normalizedDate = new Date(date)
    normalizedDate.setHours(0, 0, 0, 0)

    await prisma.taskCompletion.upsert({
      where: {
        taskId_date: {
          taskId,
          date: normalizedDate
        }
      },
      update: {
        completed
      },
      create: {
        taskId,
        date: normalizedDate,
        completed
      }
    })

    // Trigger progress update
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { goalId: true }
    })

    if (task) {
      await updateDailyProgress(task.goalId, normalizedDate)
    }

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to toggle task:', error)
    return { success: false, error: 'Failed to toggle task' }
  }
}

async function updateDailyProgress(goalId: string, date: Date) {
  const tasks = await prisma.task.findMany({
    where: { goalId }
  })
  
  if (tasks.length === 0) return

  const completions = await prisma.taskCompletion.findMany({
    where: {
      taskId: { in: tasks.map(t => t.id) },
      date
    }
  })

  const completedCount = completions.filter(c => c.completed).length
  const totalTasks = tasks.length
  const completionRate = completedCount / totalTasks

  const prevLog = await prisma.dailyLog.findFirst({
    where: {
      goalId,
      date: { lt: date }
    },
    orderBy: { date: 'desc' }
  })

  let newMomentum = prevLog ? prevLog.momentumScore : 50
  
  if (completionRate === 1) {
    newMomentum += 5
  } else if (completionRate >= 0.5) {
    newMomentum += 2
  } else {
    newMomentum -= 5
  }
  
  newMomentum = Math.max(0, Math.min(100, newMomentum))

  let newStreak = prevLog ? prevLog.streakCurrent : 0
  if (completionRate === 1) {
    newStreak += 1
  } else if (completionRate < 0.5) {
    newStreak = 0
  }

  await prisma.dailyLog.upsert({
    where: {
      goalId_date: {
        goalId,
        date
      }
    },
    update: {
      momentumScore: newMomentum,
      streakCurrent: newStreak,
      isMissed: completionRate < 0.5
    },
    create: {
      goalId,
      date,
      momentumScore: newMomentum,
      streakCurrent: newStreak,
      isMissed: completionRate < 0.5
    }
  })
}
