import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

export const authConfig = {
  providers: [Google],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isGoalPage = nextUrl.pathname.startsWith('/goals')
      const isSettings = nextUrl.pathname.startsWith('/settings')
      const isRoot = nextUrl.pathname === '/'
      const isLogin = nextUrl.pathname === '/login'

      // Redirect authenticated users from landing page or login page to dashboard
      if ((isRoot || isLogin) && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }

      // Protect dashboard and other app routes
      if (isDashboard || isGoalPage || isSettings) {
        if (isLoggedIn) return true
        return false // Redirect to signin
      }

      return true // Allow all other routes (landing page, etc)
    },
  },
} satisfies NextAuthConfig
