import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify vendor ownership
  const vendor = await prisma.vendor.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  })

  if (!vendor) {
    return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
  }

  const body = await request.json()
  const { questionId, answer } = body

  if (!questionId) {
    return NextResponse.json({ error: 'Question ID is required' }, { status: 400 })
  }

  const questionAnswer = await prisma.vendorQuestion.upsert({
    where: {
      vendorId_questionId: {
        vendorId: params.id,
        questionId,
      },
    },
    update: { answer },
    create: {
      vendorId: params.id,
      questionId,
      answer,
    },
  })

  return NextResponse.json(questionAnswer)
}
