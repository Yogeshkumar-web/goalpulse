import { auth } from '@/auth'
import { getDashboardData } from '@/app/lib/data'
import UserDashboard from '@/app/components/UserDashboard'
import HeroSection from '@/app/(landing)/components/HeroSection'

export default async function LandingPage() {
  const session = await auth()

  // Show personalized dashboard for authenticated users
  if (session?.user?.id) {
    try {
      const dashboardData = await getDashboardData(session.user.id)
      const userName = session.user.name?.split(' ')[0] || 'User'
      return <UserDashboard userData={dashboardData} userName={userName} />
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    }
  }

  // Show hero section for unauthenticated users
  return <HeroSection />
}
 