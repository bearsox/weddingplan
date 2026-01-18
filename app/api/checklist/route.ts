import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { defaultChecklist, getAllChecklistItems } from '@/lib/checklist-data'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    // Return default checklist for non-authenticated users
    return NextResponse.json({
      categories: defaultChecklist,
      progress: {},
    })
  }

  // Get user's checklist progress
  const progress = await prisma.checklistProgress.findMany({
    where: { userId: session.user.id },
  })

  const progressMap = progress.reduce(
    (acc, item) => {
      acc[item.itemId] = {
        completed: item.completed,
        completedAt: item.completedAt,
        notes: item.notes,
      }
      return acc
    },
    {} as Record<string, { completed: boolean; completedAt: Date | null; notes: string | null }>
  )

  return NextResponse.json({
    categories: defaultChecklist,
    progress: progressMap,
  })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { itemId, completed, notes } = body

  // Validate itemId exists in our checklist
  const item = getAllChecklistItems().find((i) => i.id === itemId)
  if (!item) {
    return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 })
  }

  const progress = await prisma.checklistProgress.upsert({
    where: {
      userId_itemId: {
        userId: session.user.id,
        itemId,
      },
    },
    update: {
      completed,
      completedAt: completed ? new Date() : null,
      notes,
    },
    create: {
      userId: session.user.id,
      itemId,
      completed,
      completedAt: completed ? new Date() : null,
      notes,
    },
  })

  return NextResponse.json(progress)
}
