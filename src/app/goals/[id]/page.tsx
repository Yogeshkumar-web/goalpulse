import { prisma } from '@/app/lib/prisma'
import TaskList from '@/app/components/TaskList'
import TaskForm from '@/app/components/TaskForm'
import GoalActions from '@/app/components/GoalActions'
import MomentumHistoryChart from '@/app/components/MomentumHistoryChart'
import ContributionGraph from '@/app/components/ContributionGraph'
import { notFound } from 'next/navigation'
import { auth } from '@/auth'

async function getGoalDetails(id: string) {
  const goal = await prisma.goal.findUnique({
    where: { id },
    include: {
      tasks: true,
      logs: {
        orderBy: { date: 'asc' }, // Ascending for chart
        take: 90 // Last 90 days for heatmap
      }
    }
  })
  return goal
}

async function getTodayCompletions(taskIds: string[]) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const completions = await prisma.taskCompletion.findMany({
    where: {
      taskId: { in: taskIds },
      date: today
    }
  })
  return completions
}

export default async function GoalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return <div>Please sign in</div>

  const { id } = await params
  const goal = await getGoalDetails(id)
  
  if (!goal) {
    notFound()
  }

  if (goal.userId !== session.user.id) {
    return <div>Unauthorized</div>
  }

  const todayCompletions = await getTodayCompletions(goal.tasks.map(t => t.id))
  
  // Get latest log for current stats
  const latestLog = goal.logs[goal.logs.length - 1]
  const currentMomentum = latestLog?.momentumScore || 50
  const currentStreak = latestLog?.streakCurrent || 0

  // Prepare data for charts
  const momentumData = goal.logs.map(log => ({
    date: log.date.toISOString(),
    score: log.momentumScore
  }))

  const contributionData = goal.logs.map(log => ({
    date: log.date.toISOString(),
    count: log.isMissed ? 0 : 1, // Simplified: 1 if not missed (assuming activity)
    isMissed: log.isMissed
  }))

  let health = 'Healthy'
  let healthColor = 'var(--success)'
  if (currentMomentum < 30) {
    health = 'Critical'
    healthColor = 'var(--danger)'
  } else if (currentMomentum < 70) {
    health = 'Risky'
    healthColor = 'var(--warning)'
  }

  return (
    <div className="container">
      <header style={{ marginBottom: 'var(--spacing-6)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: 'var(--spacing-2)' }}>{goal.title}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-4)' }}>{goal.description}</p>
        
        <GoalActions 
          goalId={goal.id}
          title={goal.title}
          description={goal.description}
          deadline={goal.deadline}
        />
        
        <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
          <div className="card" style={{ padding: 'var(--spacing-4)', flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Momentum</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{Math.round(currentMomentum)}</div>
          </div>
          <div className="card" style={{ padding: 'var(--spacing-4)', flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Streak</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{currentStreak}</div>
          </div>
          <div className="card" style={{ padding: 'var(--spacing-4)', flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Health</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: healthColor }}>{health}</div>
          </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-6)' }}>
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <div className="card">
            <h3 style={{ marginBottom: 'var(--spacing-4)', fontSize: '1.2rem' }}>Daily Tasks</h3>
            <TaskList 
              tasks={goal.tasks} 
              initialCompletions={todayCompletions} 
              date={new Date()} 
            />
            <div style={{ marginTop: 'var(--spacing-4)', paddingTop: 'var(--spacing-4)', borderTop: '1px solid var(--border)' }}>
              <h4 style={{ marginBottom: 'var(--spacing-2)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Add New Task</h4>
              <TaskForm goalId={goal.id} />
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: 'var(--spacing-4)', fontSize: '1.2rem' }}>Momentum History</h3>
            <MomentumHistoryChart data={momentumData} />
          </div>
        </section>
        
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <div className="card">
            <h3 style={{ marginBottom: 'var(--spacing-4)', fontSize: '1.2rem' }}>Timeline</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Start Date</div>
                <div>{new Date(goal.createdAt).toLocaleDateString()}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Deadline</div>
                <div>{new Date(goal.deadline).toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: 'var(--spacing-4)', fontSize: '1.2rem' }}>Activity</h3>
            <ContributionGraph data={contributionData} />
          </div>
        </aside>
      </div>
    </div>
  )
}
