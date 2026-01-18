import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' })
  }

  try {
    // Fetch usage from Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/usage', {
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
    })

    if (!response.ok) {
      // Try the billing endpoint instead
      const billingResponse = await fetch('https://api.anthropic.com/v1/organizations/billing', {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
      })

      if (billingResponse.ok) {
        const data = await billingResponse.json()
        return NextResponse.json(data)
      }

      return NextResponse.json({
        error: 'Could not fetch usage',
        note: 'Check your balance at console.anthropic.com'
      })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to fetch usage',
      note: 'Check your balance at console.anthropic.com'
    })
  }
}
