'use client'

import Link from 'next/link'

export default function CTASection() {
  return (
    <section style={{
      padding: '6rem 2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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

      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          color: 'white'
        }}>
          Ready to Transform Your Goals?
        </h2>

        <p style={{
          fontSize: '1.3rem',
          color: 'rgba(255, 255, 255, 0.9)',
          marginBottom: '3rem',
          lineHeight: '1.6'
        }}>
          Join thousands of achievers who are already using GoalPulse to track their progress and build unstoppable momentum.
        </p>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link
            href="/api/auth/signin?callbackUrl=/dashboard"
            className="btn"
            style={{
              background: 'white',
              color: '#667eea',
              padding: '1.25rem 3rem',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              border: 'none',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
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
              color: 'white',
              padding: '1.25rem 3rem',
              fontSize: '1.2rem',
              border: '2px solid white',
              transition: 'all 0.2s',
              textDecoration: 'none',
              display: 'inline-block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'white'
              e.currentTarget.style.color = '#667eea'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'white'
            }}
          >
            📖 Learn More
          </a>
        </div>

        <p style={{
          marginTop: '2rem',
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '0.9rem'
        }}>
          ✨ No credit card required • 🔒 Free forever • ⚡ Start in 30 seconds
        </p>
      </div>
    </section>
  )
}
