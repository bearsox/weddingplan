import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ tasks: [] })
  }

  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '20')
  const upcoming = searchParams.get('upcoming') === 'true'
  const completed = searchParams.get('completed')

  const where: Record<string, unknown> = { userId: session.user.id }

  if (upcoming) {
    where.completed = false
    where.OR = [
      { dueDate: { lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } },
      { dueDate: null },
    ]
  }

  if (completed !== null && completed !== undefined) {
    where.completed = completed === 'true'
  }

  const tasks = await prisma.task.findMany({
    where,
    orderBy: [
      { priority: 'asc' }, // HIGH = 0, MEDIUM = 1, LOW = 2
      { dueDate: 'asc' },
      { createdAt: 'desc' },
    ],
    take: limit,
  })

  return NextResponse.json({
    tasks: tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      source: t.source.toLowerCase(),
      priority: t.priority.toLowerCase(),
      completed: t.completed,
      dueDate: t.dueDate?.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      dueDateRaw: t.dueDate?.toISOString(),
    })),
  })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { title, description, source, sourceId, priority, dueDate } = body

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }

  const task = await prisma.task.create({
    data: {
      userId: session.user.id,
      title,
      description,
      source: source?.toUpperCase() || 'MANUAL',
      sourceId,
      priority: priority?.toUpperCase() || 'MEDIUM',
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  })

  return NextResponse.json(task)
}
