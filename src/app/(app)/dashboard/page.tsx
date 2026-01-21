import { auth } from '@/auth'
import { getDashboardData } from '@/app/lib/data'
import UserDashboard from '@/app/components/UserDashboard'
import Link from 'next/link'

export default async function Dashboard() {
  const session = await auth()
  
  if (!session?.user?.id) {
    // This should ideally be handled by middleware, but as a fallback:
    return (
      <div className="container" style={{ padding: 'var(--spacing-12)', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-4)' }}>Access Denied</h1>
        <p style={{ marginBottom: 'var(--spacing-6)' }}>Please sign in to view your dashboard.</p>
        <Link href="/auth/login" className="btn btn-primary">
          Sign In
        </Link>
      </div>
    )
  }

  const dashboardData = await getDashboardData(session.user.id)
  const userName = session.user.name?.split(' ')[0] || 'User'

  return <UserDashboard userData={dashboardData} userName={userName} />
}
