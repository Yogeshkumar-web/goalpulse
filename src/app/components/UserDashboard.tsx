import Link from 'next/link'
import MotivationalCard from '@/app/components/MotivationalCard'
import TodayTasksCard from '@/app/components/TodayTasksCard'
import ProgressOverview from '@/app/components/ProgressOverview'
import ContributionGraph from '@/app/components/ContributionGraph'

type UserDashboardProps = {
  userData: {
    goals: any[]
    tasksByGoal: any[]
    todayCompletions: any[]
    hasIncompleteTasks: boolean
    completionPercentage: number
    overallMomentum: number
    currentStreak: number
    weeklyCompletion: number[]
  }
  userName: string
  isPublic?: boolean
}

export default function UserDashboard({ userData, userName, isPublic = false }: UserDashboardProps) {
  const {
    goals,
    tasksByGoal,
    todayCompletions,
    hasIncompleteTasks,
    completionPercentage,
    overallMomentum,
    currentStreak,
    weeklyCompletion
  } = userData

  const greeting = `Good ${new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, ${userName}!`

  return (
    <div className="container animate-fade-in-up">
      <header style={{ marginBottom: 'var(--spacing-8)', marginTop: 'var(--spacing-8)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: 'var(--spacing-2)' }}>
            {isPublic ? `${userName}'s Dashboard` : greeting}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            {goals.length === 0 ? 'Start your journey by creating your first goal' : 'Keep up the momentum!'}
          </p>
        </div>
        {isPublic && (
          <Link href="/auth/login" className="btn btn-primary">
            Login to Manage
          </Link>
        )}
      </header>

      {goals.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: 'var(--spacing-12)' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-4)', fontWeight: 'bold' }}>No goals yet</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-8)', fontSize: '1.1rem' }}>
            Create your first goal to start tracking your progress and unlocking your potential.
          </p>
          {!isPublic && (
            <Link href="/goals/new" className="btn btn-primary" style={{ padding: 'var(--spacing-3) var(--spacing-6)', fontSize: '1.1rem' }}>
              + Create Your First Goal
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
            <MotivationalCard 
              hasIncompleteTasks={hasIncompleteTasks}
              completionPercentage={completionPercentage}
            />
            <ProgressOverview 
              overallMomentum={overallMomentum}
              currentStreak={currentStreak}
              weeklyCompletion={weeklyCompletion}
            />
          </div>

          <TodayTasksCard 
            tasksByGoal={tasksByGoal}
            initialCompletions={todayCompletions}
            isReadOnly={isPublic}
          />

          {/* Activity Section */}
          <section>
             <ContributionGraph data={[]} /> {/* Placeholder or need to fetch real contribution data if available */}
          </section>

          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
              <h2 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 'bold' }}>Your Goals</h2>
              {!isPublic && (
                <Link href="/goals/new" className="btn btn-primary">
                  + New Goal
                </Link>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--spacing-6)' }}>
              {goals.map((goal: any) => {
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
                    href={isPublic ? '#' : `/goals/${goal.id}`} 
                    className="glass-card" 
                    style={{ 
                      display: 'block', 
                      textDecoration: 'none', 
                      color: 'inherit', 
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      padding: 'var(--spacing-6)',
                      cursor: isPublic ? 'default' : 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: '700' }}>{goal.title}</h3>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', backgroundColor: 'var(--surface-active)', padding: '4px 8px', borderRadius: '4px' }}>
                        {new Date(goal.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {/* Deadline Progress Bar */}
                    <div style={{ marginBottom: 'var(--spacing-6)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2)' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Time Progress</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: progressColor }}>
                          {daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}
                        </span>
                      </div>
                      <div style={{ 
                        width: '100%', 
                        height: '6px', 
                        backgroundColor: 'var(--surface-active)', 
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          width: `${progressPercentage}%`, 
                          height: '100%', 
                          backgroundColor: progressColor,
                          transition: 'width 0.3s ease',
                          borderRadius: '3px'
                        }} />
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 'var(--spacing-4)' }}>
                      <div style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-1)' }}>Momentum</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{Math.round(momentum)}</div>
                      </div>
                      <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--border)' }}></div>
                      <div style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-1)' }}>Streak</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{streak} 🔥</div>
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
