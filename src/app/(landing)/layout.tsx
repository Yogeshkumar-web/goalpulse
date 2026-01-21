import type { Metadata } from 'next'
import { auth } from '@/auth'
import Header from '@/app/(landing)/components/Header'
import Footer from '@/app/(landing)/components/Footer'
import '@/app/globals.css' 

export const metadata: Metadata = {
  title: 'GoalPulse - Track Your Goals, Build Momentum',
  description: 'Transform your goals into reality with visual progress tracking, daily tasks, and motivational feedback.',
  keywords: 'goal tracker, productivity, task management, momentum',
}

export default async function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const isAuthenticated = !!session?.user
  const userName = session?.user?.name?.split(' ')[0]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header isAuthenticated={isAuthenticated} userName={userName} />
      <main style={{ flex: 1, paddingTop: '80px' }}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
