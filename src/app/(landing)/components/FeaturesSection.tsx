'use client'

export default function FeaturesSection() {
  const features = [
    {
      icon: '📊',
      title: 'Visual Progress Tracking',
      description: 'See your progress with beautiful charts and momentum scores that keep you motivated.'
    },
    {
      icon: '✅',
      title: 'Daily Task Management',
      description: 'Break down goals into daily tasks and track completion with simple checkboxes.'
    },
    {
      icon: '🔥',
      title: 'Momentum & Streaks',
      description: 'Build momentum with streak tracking and watch your consistency grow over time.'
    },
    {
      icon: '💪',
      title: 'Motivational Feedback',
      description: 'Get instant feedback and encouragement based on your daily performance.'
    },
    {
      icon: '📈',
      title: 'Deadline Tracking',
      description: 'Stay on track with visual deadline progress and time remaining indicators.'
    },
    {
      icon: '🎯',
      title: 'Goal Health Status',
      description: 'Monitor goal health with color-coded indicators: Healthy, Risky, or Critical.'
    }
  ]

  return (
    <section id="features" style={{
      padding: 'var(--spacing-16) 0',
      backgroundColor: 'var(--background)'
    }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-12)' }}>
          <h2 className="text-gradient" style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 'bold',
            marginBottom: 'var(--spacing-4)'
          }}>
            Everything You Need to Succeed
          </h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
            Powerful features designed to keep you motivated and on track
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--spacing-8)'
        }}>
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card"
              style={{
                padding: 'var(--spacing-8)',
                textAlign: 'center',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)'
                e.currentTarget.style.boxShadow = 'var(--glow-primary)'
                e.currentTarget.style.borderColor = 'var(--primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-4)' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: 'var(--spacing-2)' }}>
                {feature.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
