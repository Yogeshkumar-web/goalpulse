import { getGoals } from './actions/goals'
import Link from 'next/link'

// Components (Inline for now, will extract later)
function MomentumArc({ score }: { score: number }) {
  // Simple SVG Gauge
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  
  // Color based on score
  let color = 'var(--danger)'
  if (score > 70) color = 'var(--success)'
  else if (score > 30) color = 'var(--warning)'

  return (
    <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="50" cy="50" r={radius} stroke="var(--surface-hover)" strokeWidth="8" fill="transparent" />
        <circle 
          cx="50" cy="50" r={radius} 
          stroke={color} 
          strokeWidth="8" 
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', fontSize: '1.2rem', fontWeight: 'bold' }}>{Math.round(score)}</div>
    </div>
  )
}

function GoalCard({ goal }: { goal: any }) {
  // Calculate progress (mock for now if no logs)
  const momentum = goal.logs[0]?.momentumScore || 50
  const streak = goal.logs[0]?.streakCurrent || 0
  
  return (
    <Link href={`/goals/${goal.id}`} className="card" style={{ display: 'block', textDecoration: 'none', color: 'inherit', transition: 'transform 0.2s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{goal.title}</h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {new Date(goal.deadline).toLocaleDateString()}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center' }}>
        <MomentumArc score={momentum} />
        <div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Streak</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{streak} <span style={{ fontSize: '1rem' }}>days</span></div>
        </div>
      </div>
    </Link>
  )
}

export default async function Dashboard() {
  const { data: goals } = await getGoals()

  return (
    <div className="container">
      <header style={{ marginBottom: 'var(--spacing-8)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, User</p>
        </div>
        <Link href="/goals/new" className="btn btn-primary">
          + New Goal
        </Link>
      </header>

      <section>
        <h3 style={{ marginBottom: 'var(--spacing-4)', fontSize: '1.2rem' }}>Your Goals</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-4)' }}>
          {goals?.map((goal: any) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
          {(!goals || goals.length === 0) && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', color: 'var(--text-secondary)' }}>
              <p>No goals yet.</p>
              <Link href="/goals/new" style={{ color: 'var(--primary)', marginTop: 'var(--spacing-2)' }}>Create one now</Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
