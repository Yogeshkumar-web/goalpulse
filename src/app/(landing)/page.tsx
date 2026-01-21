import { auth } from '@/auth'
import { getDashboardData } from '@/app/lib/data'
import { prisma } from '@/app/lib/prisma'
import UserDashboard from '@/app/components/UserDashboard'
import HeroSection from '@/app/(landing)/components/HeroSection'

export default async function LandingPage() {
  try {
    const session = await auth()

    if (session?.user?.id) {
      const dashboardData = await getDashboardData(session.user.id)
      const userName = session.user.name?.split(' ')[0] || 'User'
      return <UserDashboard userData={dashboardData} userName={userName} />
    }

    // Fallback: Fetch the first user (Owner) for Public View
    const owner = await prisma.user.findFirst({
      orderBy: { createdAt: 'asc' }
    })

    if (owner) {
      const dashboardData = await getDashboardData(owner.id)
      const userName = owner.name?.split(' ')[0] || 'Owner'
      return <UserDashboard userData={dashboardData} userName={userName} isPublic={true} />
    }
  } catch (error) {
    console.error("Database connection failed:", error)
    // Fallback to HeroSection on error
  }

  // If no users exist at all, DB is down, or other error, show the hero section
  return <HeroSection />
}
 