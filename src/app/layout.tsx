import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/auth'
import { SignIn, SignOut } from './components/AuthComponents'
import { ToastProvider } from './components/ToastProvider'

export const metadata: Metadata = {
  title: 'GoalPulse',
  description: 'Track your goals and momentum',
}

import { prisma } from '@/app/lib/prisma'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  // Check for incomplete tasks today
  let pendingTasksCount = 0
  if (session?.user?.id) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Get all active goals for user
    const goals = await prisma.goal.findMany({
      where: { userId: session.user.id, status: 'ACTIVE' },
      include: { tasks: true }
    })

    const taskIds = goals.flatMap(g => g.tasks.map(t => t.id))
    
    const completions = await prisma.taskCompletion.findMany({
      where: {
        taskId: { in: taskIds },
        date: today,
        completed: true
      }
    })

    const totalTasks = taskIds.length
    const completedCount = completions.length
    pendingTasksCount = totalTasks - completedCount
  }

  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside style={{ 
              width: '250px', 
              borderRight: '1px solid var(--border)', 
              padding: 'var(--spacing-6)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-4)'
            }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>GoalPulse</h1>
              
              {session?.user ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
                    {session.user.image && (
                      <img src={session.user.image} alt="User" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                    )}
                    <span style={{ fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session.user.name}</span>
                  </div>
                  <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                    <Link href="/" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                      Dashboard
                      {pendingTasksCount > 0 && (
                        <span style={{ 
                          marginLeft: 'auto', 
                          backgroundColor: 'var(--danger)', 
                          color: 'white', 
                          fontSize: '0.7rem', 
                          padding: '2px 6px', 
                          borderRadius: '10px' 
                        }}>
                          {pendingTasksCount}
                        </span>
                      )}
                    </Link>
                    <Link href="/goals/new" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                      + New Goal
                    </Link>
                    <Link href="/settings" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                      Settings
                    </Link>
                  </nav>
                  <div style={{ marginTop: 'auto' }}>
                    <SignOut />
                  </div>
                </>
              ) : (
                <div style={{ marginTop: 'auto' }}>
                  <p style={{ marginBottom: 'var(--spacing-2)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Sign in to track goals</p>
                  <SignIn />
                </div>
              )}
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: 'var(--spacing-8)', overflowY: 'auto' }}>
              {children}
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  )
}
