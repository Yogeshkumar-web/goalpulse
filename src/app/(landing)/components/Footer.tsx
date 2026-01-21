import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      padding: 'var(--spacing-16) var(--spacing-4) var(--spacing-12)',
      marginTop: 'var(--spacing-16)'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 'var(--spacing-8)',
        marginBottom: 'var(--spacing-8)'
      }}>
        {/* Brand Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--spacing-4)' }}>
            <span style={{ fontSize: '1.5rem' }}>🎯</span>
            <span className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              GoalPulse
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            Track progress. Build momentum. Achieve more.
          </p>
        </div>

        {/* Product Links */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: 'var(--spacing-4)', color: 'var(--text-primary)' }}>Product</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link href="/auth/register" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', transition: 'color 0.2s' }}>Get Started</Link>
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: 'var(--spacing-4)', color: 'var(--text-primary)' }}>Company</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', transition: 'color 0.2s' }}>About</a>
            <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', transition: 'color 0.2s' }}>Contact</a>
            <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', transition: 'color 0.2s' }}>Privacy</a>
            <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', transition: 'color 0.2s' }}>Terms</a>
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: 'var(--spacing-4)', color: 'var(--text-primary)' }}>Connect</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', fontSize: '1.5rem', transition: 'transform 0.2s' }}>𝕏</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', fontSize: '1.5rem', transition: 'transform 0.2s' }}>in</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', fontSize: '1.5rem', transition: 'transform 0.2s' }}>⚙</a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div style={{
        borderTop: '1px solid var(--border)',
        paddingTop: 'var(--spacing-8)',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontSize: '0.875rem'
      }}>
        © {new Date().getFullYear()} GoalPulse. All rights reserved.
      </div>
    </footer>
  )
}
