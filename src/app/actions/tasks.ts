'use server'

import { prisma } from '@/app/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function toggleTaskCompletion(taskId: string, date: Date, completed: boolean) {
  try {
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
