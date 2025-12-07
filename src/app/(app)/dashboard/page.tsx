import { prisma } from '@/app/lib/prisma' 
import { auth } from '@/auth'
import Link from 'next/link'
import MotivationalCard from '@/app/components/MotivationalCard'
import TodayTasksCard from '@/app/components/TodayTasksCard'
import ProgressOverview from '@/app/components/ProgressOverview'

async function getDashboardData(userId: string) {
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
  const allTaskIds = goals.flatMap(g => g.tasks.map(t => t.id))
  const todayCompletions = await prisma.taskCompletion.findMany({
    where: {
      taskId: { in: allTaskIds },
      date: today
    }
  })

  // Calculate overall stats
  const totalTasks = allTaskIds.length
  const completedToday = todayCompletions.filter(c => c.completed).length
  const completionPercentage = totalTasks > 0 ? Math.round((completedToday / totalTasks) * 100) : 0
  const hasIncompleteTasks = completedToday < totalTasks

  // Calculate overall momentum (average of all goals)
  const momentumScores = goals.map(g => g.logs[0]?.momentumScore || 50)
  const overallMomentum = momentumScores.length > 0 
    ? momentumScores.reduce((sum, score) => sum + score, 0) / momentumScores.length 
    : 50

  // Calculate current streak (minimum across all goals)
  const streaks = goals.map(g => g.logs[0]?.streakCurrent || 0)
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

    const dayCompleted = dayCompletions.filter(c => c.completed).length
    const dayPercentage = totalTasks > 0 ? Math.round((dayCompleted / totalTasks) * 100) : 0
    weeklyCompletion.push(dayPercentage)
  }

  // Prepare tasks grouped by goal
  const tasksByGoal = goals.map(goal => ({
    goalId: goal.id,
    goalTitle: goal.title,
    tasks: goal.tasks
  }))

  return {
    goals,
    tasksByGoal,
    todayCompletions: todayCompletions.map(c => ({ taskId: c.taskId, completed: c.completed })),
    hasIncompleteTasks,
    completionPercentage,
    overallMomentum,
    currentStreak,
    weeklyCompletion
  }
}

export default async function Dashboard() {
  const session = await auth()
  if (!session?.user?.id) {
    return (
      <div className="container">
        <h1>Please sign in to view your dashboard</h1>
      </div>
    )
  }

  const {
    goals,
    tasksByGoal,
    todayCompletions,
    hasIncompleteTasks,
    completionPercentage,
    overallMomentum,
    currentStreak,
    weeklyCompletion
  } = await getDashboardData(session.user.id)

  const userName = session.user.name?.split(' ')[0] || 'User'
  const greeting = `Good ${new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, ${userName}!`

  return (
    <div className="container">
      <header style={{ marginBottom: 'var(--spacing-6)' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: 'var(--spacing-2)' }}>{greeting}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          {goals.length === 0 ? 'Start your journey by creating your first goal' : 'Keep up the momentum!'}
        </p>
      </header>

      {goals.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-4)' }}>No goals yet</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-4)' }}>
            Create your first goal to start tracking your progress
          </p>
          <Link href="/goals/new" className="btn btn-primary">
            + Create Your First Goal
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <MotivationalCard 
            hasIncompleteTasks={hasIncompleteTasks}
            completionPercentage={completionPercentage}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-6)' }}>
            <TodayTasksCard 
              tasksByGoal={tasksByGoal}
              initialCompletions={todayCompletions}
            />

            <ProgressOverview 
              overallMomentum={overallMomentum}
              currentStreak={currentStreak}
              weeklyCompletion={weeklyCompletion}
            />
          </div>

          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Your Goals</h2>
              <Link href="/goals/new" className="btn btn-primary">
                + New Goal
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-4)' }}>
              {goals.map(goal => {
                const momentum = goal.logs[0]?.momentumScore || 50
                const streak = goal.logs[0]?.streakCurrent || 0
                
                // Calculate deadline progress
                const now = new Date()
                const start = new Date(goal.createdAt)
                const deadline = new Date(goal.deadline)
                const totalDuration = deadline.getTime() - start.getTime()
                const elapsed = now.getTime() - start.getTime()
                const progressPercentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
                
                // Calculate days remaining
                const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                
                // Determine progress bar color
                let progressColor = 'var(--success)'
                if (daysRemaining < 7) {
                  progressColor = 'var(--danger)'
                } else if (daysRemaining < 30) {
                  progressColor = 'var(--warning)'
                }
                
                return (
                  <Link 
                    key={goal.id} 
                    href={`/goals/${goal.id}`} 
                    className="card" 
                    style={{ display: 'block', textDecoration: 'none', color: 'inherit', transition: 'transform 0.2s' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-3)' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>{goal.title}</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {new Date(goal.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {/* Deadline Progress Bar */}
                    <div style={{ marginBottom: 'var(--spacing-4)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-1)' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Time Progress</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: progressColor }}>
                          {daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}
                        </span>
                      </div>
                      <div style={{ 
                        width: '100%', 
                        height: '6px', 
                        backgroundColor: 'var(--surface)', 
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          width: `${progressPercentage}%`, 
                          height: '100%', 
                          backgroundColor: progressColor,
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-1)' }}>Momentum</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{Math.round(momentum)}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-1)' }}>Streak</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{streak} 🔥</div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
