import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not logged in' })
  }

  // Check if access token exists in database
  const account = await prisma.account.findFirst({
    where: { userId: session.user.id, provider: 'google' },
    select: {
      access_token: true,
      refresh_token: true,
      expires_at: true,
    },
  })

  return NextResponse.json({
    userId: session.user.id,
    email: session.user.email,
    hasAccessToken: !!account?.access_token,
    hasRefreshToken: !!account?.refresh_token,
    tokenExpiresAt: account?.expires_at
      ? new Date(account.expires_at * 1000).toISOString()
      : null,
    sessionHasToken: !!session.accessToken,
  })
}
