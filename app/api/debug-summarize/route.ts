import { NextResponse } from 'next/server'
import { summarizeEmail } from '@/lib/claude'

export async function GET() {
  try {
    const result = await summarizeEmail(
      'test@venue.com',
      'Your venue booking deposit',
      'Hi! Thanks for choosing our venue. Please send a $500 deposit by January 25th to confirm your booking. Let us know if you have questions.'
    )

    return NextResponse.json({
      success: true,
      result,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })
  }
}
