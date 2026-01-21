import { prisma } from '@/app/lib/prisma'

type TaskWithCompletion = {
  id: string
  completed: boolean
}

export async function getDashboardData(userId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Get all active goals with tasks
  const goals = await prisma.goal.findMany({
    where: { userId, status: 'ACTIVE' },
    include: {
      tasks: true,
      logs: {
        orderBy: { date: 'desc' },
        take: 7 // Last 7 days for weekly view
      }
    }
  })

  // Get today's task completions
  const allTaskIds = goals.flatMap((g: any) => g.tasks.map((t: any) => t.id))
  const todayCompletions = await prisma.taskCompletion.findMany({
    where: {
      taskId: { in: allTaskIds },
      date: today
    }
  })

  // Calculate overall stats
  const totalTasks = allTaskIds.length
  const completedToday = todayCompletions.filter((c: any) => c.completed).length
  const completionPercentage = totalTasks > 0 ? Math.round((completedToday / totalTasks) * 100) : 0
  const hasIncompleteTasks = completedToday < totalTasks

  // Calculate overall momentum (average of all goals)
  const momentumScores = goals.map((g: any) => g.logs[0]?.momentumScore || 50)
  const overallMomentum = momentumScores.length > 0 
    ? momentumScores.reduce((sum: number, score: number) => sum + score, 0) / momentumScores.length 
    : 50

  // Calculate current streak (minimum across all goals)
  const streaks = goals.map((g: any) => g.logs[0]?.streakCurrent || 0)
  const currentStreak = streaks.length > 0 ? Math.min(...streaks) : 0

  // Calculate weekly completion for last 7 days
  const weeklyCompletion: number[] = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)

    const dayCompletions = await prisma.taskCompletion.findMany({
      where: {
        taskId: { in: allTaskIds },
        date: date
      }
    })

    const dayCompleted = dayCompletions.filter((c: any) => c.completed).length
    const dayPercentage = totalTasks > 0 ? Math.round((dayCompleted / totalTasks) * 100) : 0
    weeklyCompletion.push(dayPercentage)
  }

  // Prepare tasks grouped by goal
  const tasksByGoal = goals.map((goal: any) => ({
    goalId: goal.id,
    goalTitle: goal.title,
    tasks: goal.tasks
  }))

  return {
    goals,
    tasksByGoal,
    todayCompletions: todayCompletions.map((c: any) => ({ taskId: c.taskId, completed: c.completed })),
    hasIncompleteTasks,
    completionPercentage,
    overallMomentum,
    currentStreak,
    weeklyCompletion
  }
}
