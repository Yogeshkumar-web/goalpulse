import { auth } from '@/auth'
import { prisma } from '@/app/lib/prisma'
import { updateSettings } from '@/app/actions/settings'

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) return <div>Please sign in</div>

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { settings: true }
  })

  const settings = user?.settings ? JSON.parse(user.settings) : { theme: 'dark', notifications: true }

  async function handleUpdateSettings(formData: FormData) {
    'use server'
    await updateSettings(formData)
  }

  return (
    <div className="container">
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: 'var(--spacing-6)' }}>Settings</h1>
      
      <div className="card" style={{ maxWidth: '600px' }}>
        <form action={handleUpdateSettings} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 'bold' }}>Theme</label>
            <select 
              name="theme" 
              defaultValue={settings.theme}
              style={{ 
                width: '100%', 
                padding: 'var(--spacing-3)', 
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
            <input 
              type="checkbox" 
              name="notifications" 
              id="notifications" 
              defaultChecked={settings.notifications}
              style={{ width: '20px', height: '20px' }}
            />
            <label htmlFor="notifications">Enable In-App Notifications</label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}
