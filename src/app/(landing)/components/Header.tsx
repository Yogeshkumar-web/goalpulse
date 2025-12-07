'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      transition: 'all 0.3s ease',
      backgroundColor: isScrolled ? 'rgba(15, 23, 42, 0.8)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(10px)' : 'none',
      borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🎯</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            GoalPulse
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '2rem' }} className="desktop-nav">
            <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Features</a>
            <a href="#how-it-works" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>How It Works</a>
            <a href="#testimonials" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Testimonials</a>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link href="/api/auth/signin?callbackUrl=/dashboard" className="btn btn-ghost desktop-only">
              Sign In
            </Link>
            <Link href="/api/auth/signin?callbackUrl=/dashboard" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
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
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <a href="#features" style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem' }} onClick={() => setIsMobileMenuOpen(false)}>Features</a>
          <a href="#how-it-works" style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem' }} onClick={() => setIsMobileMenuOpen(false)}>How It Works</a>
          <a href="#testimonials" style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem' }} onClick={() => setIsMobileMenuOpen(false)}>Testimonials</a>
          <Link href="/api/auth/signin?callbackUrl=/dashboard" className="btn btn-ghost" style={{ width: '100%', textAlign: 'center' }}>
            Sign In
          </Link>
        </div>
      )}

      <style jsx global>{`
        .desktop-nav {
          display: none;
        }
        
        .desktop-only {
          display: none;
        }
        
        .mobile-menu-btn {
          display: block;
        }
        
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          
          .desktop-only {
            display: block !important;
          }
          
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  )
}
