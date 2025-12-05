import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/auth'
import { SignIn, SignOut } from './components/AuthComponents'

export const metadata: Metadata = {
  title: 'GoalPulse',
  description: 'Track your goals and momentum',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="en">
      <body>
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
                  </Link>
                  <Link href="/goals/new" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                    + New Goal
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
      </body>
    </html>
  )
}
