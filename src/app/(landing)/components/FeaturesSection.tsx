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
      padding: '6rem 2rem',
      backgroundColor: '#1e293b'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 'bold',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
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
          gap: '2rem'
        }}>
          {features.map((feature, index) => (
            <div
              key={index}
              className="card"
              style={{
                padding: '2rem',
                textAlign: 'center',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)'
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
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
