import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const status = searchParams.get('status')

  const where: Record<string, unknown> = { userId: session.user.id }
  if (type) where.type = type
  if (status) where.status = status

  const vendors = await prisma.vendor.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json({ vendors })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, type, email, phone, website, address, priceRange, notes } = body

  if (!name || !type) {
    return NextResponse.json({ error: 'Name and type are required' }, { status: 400 })
  }

  const vendor = await prisma.vendor.create({
    data: {
      userId: session.user.id,
      name,
      type,
      email,
      phone,
      website,
      address,
      priceRange,
      notes,
    },
  })

  return NextResponse.json(vendor)
}
