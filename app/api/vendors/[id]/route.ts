import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const vendor = await prisma.vendor.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      questionAnswers: true,
    },
  })

  if (!vendor) {
    return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
  }

  return NextResponse.json(vendor)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  // Verify ownership
  const existing = await prisma.vendor.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  })

  if (!existing) {
    return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
  }

  const vendor = await prisma.vendor.update({
    where: { id: params.id },
    data: {
      name: body.name,
      type: body.type,
      status: body.status,
      email: body.email,
      phone: body.phone,
      website: body.website,
      address: body.address,
      priceRange: body.priceRange,
      rating: body.rating,
      notes: body.notes,
      pros: body.pros,
      cons: body.cons,
    },
  })

  return NextResponse.json(vendor)
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
  const existing = await prisma.vendor.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  })

  if (!existing) {
    return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
  }

  await prisma.vendor.delete({
    where: { id: params.id },
  })

  return NextResponse.json({ success: true })
}
