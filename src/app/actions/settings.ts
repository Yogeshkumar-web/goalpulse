'use server'

import { prisma } from '@/app/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function updateSettings(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

  const theme = formData.get('theme') as string
  const notifications = formData.get('notifications') === 'on'

  const settings = {
    theme,
    notifications
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        settings: JSON.stringify(settings)
      }
    })

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to update settings:', error)
    return { success: false, error: 'Failed to update settings' }
  }
}
