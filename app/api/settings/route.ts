import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({
      weddingDate: '2027-06-21',
      partner1Name: 'Jared',
      partner2Name: 'Charlee',
    })
  }

  const settings = await prisma.settings.findUnique({
    where: { userId: session.user.id },
  })

  if (!settings) {
    return NextResponse.json({
      weddingDate: '2027-06-21',
      partner1Name: 'Jared',
      partner2Name: 'Charlee',
    })
  }

  return NextResponse.json({
    weddingDate: settings.weddingDate?.toISOString().split('T')[0],
    partner1Name: settings.partner1Name,
    partner2Name: settings.partner2Name,
    weddingEmail: settings.weddingEmail,
  })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { weddingDate, partner1Name, partner2Name, weddingEmail } = body

  const settings = await prisma.settings.upsert({
    where: { userId: session.user.id },
    update: {
      weddingDate: weddingDate ? new Date(weddingDate) : undefined,
      partner1Name,
      partner2Name,
      weddingEmail,
    },
    create: {
      userId: session.user.id,
      weddingDate: weddingDate ? new Date(weddingDate) : null,
      partner1Name: partner1Name || 'Jared',
      partner2Name: partner2Name || 'Charlee',
      weddingEmail,
    },
  })

  return NextResponse.json(settings)
}
