'use client'

import Link from 'next/link'

export default function CTASection() {
  return (
    <section style={{
      padding: 'var(--spacing-16) 0',
      background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }} />

      <div className="container" style={{
        maxWidth: '800px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          fontWeight: 'bold',
          marginBottom: 'var(--spacing-6)',
          color: 'black'
        }}>
          Ready to Transform Your Goals?
        </h2>

        <p style={{
          fontSize: '1.3rem',
          color: 'rgba(0, 0, 0, 0.8)',
          marginBottom: 'var(--spacing-12)',
          lineHeight: '1.6'
        }}>
          Join thousands of achievers who are already using GoalPulse to track their progress and build unstoppable momentum.
        </p>

        <div className="flex-center" style={{ gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
          <Link
            href="/auth/login"
            className="btn"
            style={{
              background: 'black',
              color: 'white',
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              border: 'none',
              boxShadow: 'var(--shadow-lg)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            🚀 Get Started Free
          </Link>

          <a
            href="#features"
            className="btn"
            style={{
              background: 'transparent',
              color: 'black',
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              border: '2px solid black',
              transition: 'all 0.2s',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'black'
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'black'
            }}
          >
            📖 Learn More
          </a>
        </div>

        <p style={{
          marginTop: 'var(--spacing-8)',
          color: 'rgba(0, 0, 0, 0.7)',
          fontSize: '0.9rem',
          fontWeight: 500
        }}>
          ✨ No credit card required • 🔒 Free forever • ⚡ Start in 30 seconds
        </p>
      </div>
    </section>
  )
}
