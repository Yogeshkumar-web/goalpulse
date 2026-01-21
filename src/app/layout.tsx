import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GoalPulse - High Performance Productivity',
  description: 'Track daily tasks, build consistency, and achieve your goals.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased" style={{ opacity: 1 }}>{children}</body>
    </html>
  )
}
