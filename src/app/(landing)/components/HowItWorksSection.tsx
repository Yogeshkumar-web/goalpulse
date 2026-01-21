'use client'

export default function HowItWorksSection() {
  const steps = [
    {
      number: '1',
      title: 'Create Your Goal',
      description: 'Set a clear goal with a deadline and description of what you want to achieve.',
      icon: '🎯'
    },
    {
      number: '2',
      title: 'Add Daily Tasks',
      description: 'Break down your goal into daily tasks that move you closer to success.',
      icon: '✅'
    },
    {
      number: '3',
      title: 'Track Progress',
      description: 'Mark tasks complete each day and watch your momentum and streaks grow.',
      icon: '📈'
    },
    {
      number: '4',
      title: 'Stay Motivated',
      description: 'Get visual feedback, motivational quotes, and celebrate your achievements.',
      icon: '🎉'
    }
  ]

  return (
    <section id="how-it-works" style={{
      padding: 'var(--spacing-16) 0',
      backgroundColor: 'var(--surface)'
    }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-12)' }}>
          <h2 className="text-gradient" style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 'bold',
            marginBottom: 'var(--spacing-4)'
          }}>
            How It Works
          </h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
            Four simple steps to transform your goals into reality
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--spacing-8)',
          position: 'relative'
        }}>
          {steps.map((step, index) => (
            <div key={index} style={{ position: 'relative', textAlign: 'center' }}>
              {/* Connector Line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="connector-line" />
              )}
              
              <style jsx>{`
                .connector-line {
                  position: absolute;
                  top: 50px;
                  left: 50%;
                  width: 100%;
                  height: 2px;
                  background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
                  opacity: 0.3;
                  z-index: 0;
                  display: none;
                }
                
                @media (min-width: 768px) {
                  .connector-line {
                    display: block;
                  }
                }
              `}</style>

              {/* Step Number Circle */}
              <div style={{
                width: '100px',
                height: '100px',
                margin: '0 auto 1.5rem',
                borderRadius: '50%',
                background: 'var(--surface-hover)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                fontWeight: 'bold',
                position: 'relative',
                zIndex: 1,
                boxShadow: 'var(--shadow-lg)'
              }}>
                {step.icon}
              </div>

              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: 'var(--spacing-2)'
              }}>
                {step.title}
              </h3>

              <p style={{
                color: 'var(--text-secondary)',
                lineHeight: '1.6',
                fontSize: '1rem'
              }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
