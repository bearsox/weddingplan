import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || !session.accessToken) {
    return NextResponse.json({ error: 'Not logged in or no access token' })
  }

  try {
    // Try to fetch Gmail messages directly
    const response = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5',
      {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      }
    )

    const status = response.status
    const data = await response.json()

    return NextResponse.json({
      gmailApiStatus: status,
      gmailResponse: data,
      accessTokenPreview: session.accessToken.substring(0, 20) + '...',
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to call Gmail API',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
