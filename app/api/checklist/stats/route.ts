import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getAllChecklistItems } from '@/lib/checklist-data'

export async function GET() {
  const session = await getServerSession(authOptions)
  const allItems = getAllChecklistItems()

  if (!session?.user?.id) {
    return NextResponse.json({
      totalTasks: allItems.length,
      completedTasks: 0,
      upcomingDeadlines: 0,
      vendorsBooked: 0,
    })
  }

  // Get completed checklist items
  const completedItems = await prisma.checklistProgress.count({
    where: {
      userId: session.user.id,
      completed: true,
    },
  })

  // Get upcoming tasks (not completed, due in next 30 days)
  const upcomingTasks = await prisma.task.count({
    where: {
      userId: session.user.id,
      completed: false,
      dueDate: {
        lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        gte: new Date(),
      },
    },
  })

  // Get booked vendors
  const bookedVendors = await prisma.vendor.count({
    where: {
      userId: session.user.id,
      status: 'BOOKED',
    },
  })

  return NextResponse.json({
    totalTasks: allItems.length,
    completedTasks: completedItems,
    upcomingDeadlines: upcomingTasks,
    vendorsBooked: bookedVendors,
  })
}
