'use client'

import { createContext, useContext, useState, useCallback } from 'react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

type Toast = {
  id: string
  message: string
  type: ToastType
}

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(7)
    const newToast = { id, message, type }
    
    setToasts(prev => [...prev, newToast])
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  const getToastStyles = (type: ToastType) => {
    const baseStyles = {
      padding: 'var(--spacing-3) var(--spacing-4)',
      borderRadius: 'var(--radius-sm)',
      marginBottom: 'var(--spacing-2)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-2)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      animation: 'slideIn 0.3s ease-out',
      fontSize: '0.95rem',
      fontWeight: '500'
    }

    const typeStyles = {
      success: { backgroundColor: 'var(--success)', color: 'white' },
      error: { backgroundColor: 'var(--danger)', color: 'white' },
      warning: { backgroundColor: 'var(--warning)', color: 'white' },
      info: { backgroundColor: 'var(--primary)', color: 'white' }
    }

    return { ...baseStyles, ...typeStyles[type] }
  }

  const getIcon = (type: ToastType) => {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    }
    return icons[type]
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div style={{
        position: 'fixed',
        top: 'var(--spacing-4)',
        right: 'var(--spacing-4)',
        zIndex: 9999,
        maxWidth: '400px'
      }}>
        {toasts.map(toast => (
          <div key={toast.id} style={getToastStyles(toast.type)}>
            <span>{getIcon(toast.type)}</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
