import type { Metadata } from 'next'
import Header from '@/app/(landing)/components/Header'
import Footer from '@/app/(landing)/components/Footer'
import '@/app/globals.css' 

export const metadata: Metadata = {
  title: 'GoalPulse - Track Your Goals, Build Momentum',
  description: 'Transform your goals into reality with visual progress tracking, daily tasks, and motivational feedback.',
  keywords: 'goal tracker, productivity, task management, momentum',
}

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
