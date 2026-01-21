'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

type HeaderProps = {
  isAuthenticated: boolean
  userName?: string
}

export default function Header({ isAuthenticated, userName }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      transition: 'all 0.3s ease',
      backgroundColor: isScrolled ? 'rgba(5, 5, 5, 0.8)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(16px)' : 'none',
      borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
      padding: isScrolled ? '1rem 0' : '1.5rem 0'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🎯</span>
          <span className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            GoalPulse
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {/* Auth Buttons */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {isAuthenticated ? (
              <>
                <span className="desktop-only" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {userName}
                </span>
                <button 
                  onClick={handleLogout}
                  className="btn btn-secondary" 
                  style={{ padding: '0.5rem 1.25rem' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              color: 'var(--text-primary)',
              fontSize: '1.5rem',
              padding: '0.5rem'
            }}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {isAuthenticated ? (
            <button 
              onClick={handleLogout}
              className="btn btn-secondary" 
              style={{ width: '100%', textAlign: 'center' }}
            >
              Logout
            </button>
          ) : (
            <Link href="/login" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }} onClick={() => setIsMobileMenuOpen(false)}>
              Login
            </Link>
          )}
        </div>
      )}

      <style jsx global>{`
        .desktop-nav { display: none; }
        .desktop-only { display: none; }
        .mobile-menu-btn { display: block; }
        .hover\\:text-primary:hover { color: var(--text-primary) !important; }
        
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .desktop-only { display: inline-block !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  )
}
