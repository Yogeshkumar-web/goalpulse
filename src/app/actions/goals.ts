'use server'

import { prisma } from '@/app/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getGoals() {
  const session = await auth()
  if (!session?.user?.id) return { success: true, data: [] }

  try {
    const goals = await prisma.goal.findMany({
      where: { userId: session.user.id },
      include: {
        tasks: true,
        logs: {
          orderBy: { date: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, data: goals }
  } catch (error) {
    console.error('Failed to fetch goals:', error)
    return { success: false, error: 'Failed to fetch goals' }
  }
}

export async function createGoal(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const deadlineStr = formData.get('deadline') as string
  
  if (!title || !deadlineStr) {
    return { success: false, error: 'Title and deadline are required' }
  }

  try {
    await prisma.goal.create({
      data: {
        userId: session.user.id,
        title,
        description,
        deadline: new Date(deadlineStr),
        status: 'ACTIVE'
      }
    })

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to create goal:', error)
    return { success: false, error: 'Failed to create goal' }
  }
}

export async function deleteGoal(id: string) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

  try {
    // Verify ownership
    const goal = await prisma.goal.findUnique({ where: { id } })
    if (goal?.userId !== session.user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    await prisma.goal.delete({ where: { id } })
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete goal:', error)
    return { success: false, error: 'Failed to delete goal' }
  }
}
