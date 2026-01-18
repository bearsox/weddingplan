import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { extractTasksFromEmails } from '@/lib/claude'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { emails } = body

  if (!emails || !Array.isArray(emails)) {
    return NextResponse.json({ error: 'Emails array is required' }, { status: 400 })
  }

  try {
    // Extract tasks from emails using Claude
    const extractedTasks = await extractTasksFromEmails(emails)

    // Create tasks in database
    const createdTasks = await Promise.all(
      extractedTasks.map(async (task) => {
        return prisma.task.create({
          data: {
            userId: session.user.id,
            title: task.title,
            source: 'EMAIL',
            sourceId: task.source,
            priority: task.priority.toUpperCase() as 'HIGH' | 'MEDIUM' | 'LOW',
            dueDate: task.dueDate ? new Date(task.dueDate) : null,
          },
        })
      })
    )

    return NextResponse.json({
      tasks: createdTasks,
      count: createdTasks.length,
    })
  } catch (error) {
    console.error('Error extracting tasks:', error)
    return NextResponse.json(
      { error: 'Failed to extract tasks' },
      { status: 500 }
    )
  }
}
