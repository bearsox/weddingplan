import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify ownership
  const existing = await prisma.task.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  })

  if (!existing) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }

  const body = await request.json()

  const task = await prisma.task.update({
    where: { id: params.id },
    data: {
      title: body.title ?? existing.title,
      description: body.description,
      completed: body.completed ?? existing.completed,
      completedAt: body.completed ? new Date() : null,
      priority: body.priority?.toUpperCase() ?? existing.priority,
      dueDate: body.dueDate ? new Date(body.dueDate) : existing.dueDate,
      snoozedUntil: body.snoozedUntil ? new Date(body.snoozedUntil) : null,
    },
  })

  return NextResponse.json(task)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify ownership
  const existing = await prisma.task.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  })

  if (!existing) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }

  await prisma.task.delete({
    where: { id: params.id },
  })

  return NextResponse.json({ success: true })
}
