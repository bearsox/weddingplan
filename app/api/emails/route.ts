import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { fetchGmailMessages } from '@/lib/gmail'
import { summarizeEmail } from '@/lib/claude'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '10')
  const refresh = searchParams.get('refresh') === 'true'

  try {
    // Check cache first (unless refresh is requested)
    if (!refresh) {
      const cachedEmails = await prisma.emailCache.findMany({
        orderBy: { date: 'desc' },
        take: limit,
      })

      if (cachedEmails.length > 0) {
        return NextResponse.json({
          emails: cachedEmails.map((e) => ({
            id: e.emailId,
            threadId: e.threadId,
            from: e.from,
            subject: e.subject,
            date: e.date.toISOString(),
            summary: e.summary,
            hasActionItems: e.hasActionItems,
            priority: e.priority,
            category: e.category,
            actionItems: e.actionItems ? JSON.parse(e.actionItems) : [],
          })),
          cached: true,
        })
      }
    }

    // Fetch from Gmail
    const emails = await fetchGmailMessages(session.accessToken, limit)

    // Process and cache emails
    const processedEmails = await Promise.all(
      emails.map(async (email) => {
        // Check if already processed
        const existing = await prisma.emailCache.findUnique({
          where: { emailId: email.id },
        })

        if (existing && existing.processedAt) {
          return {
            id: existing.emailId,
            threadId: existing.threadId,
            from: existing.from,
            subject: existing.subject,
            date: existing.date.toISOString(),
            summary: existing.summary,
            hasActionItems: existing.hasActionItems,
            priority: existing.priority,
            category: existing.category,
            actionItems: existing.actionItems ? JSON.parse(existing.actionItems) : [],
          }
        }

        // Summarize with Claude
        const summary = await summarizeEmail(email.from, email.subject, email.body)

        // Cache the result
        await prisma.emailCache.upsert({
          where: { emailId: email.id },
          update: {
            summary: summary.summary,
            actionItems: JSON.stringify(summary.actionItems),
            hasActionItems: summary.hasActionItems,
            priority: summary.priority,
            category: summary.category,
            processedAt: new Date(),
          },
          create: {
            emailId: email.id,
            threadId: email.threadId,
            from: email.from,
            subject: email.subject,
            snippet: email.snippet,
            body: email.body,
            date: new Date(email.date),
            summary: summary.summary,
            actionItems: JSON.stringify(summary.actionItems),
            hasActionItems: summary.hasActionItems,
            priority: summary.priority,
            category: summary.category,
            processedAt: new Date(),
          },
        })

        return {
          id: email.id,
          threadId: email.threadId,
          from: email.from,
          subject: email.subject,
          date: email.date,
          summary: summary.summary,
          hasActionItems: summary.hasActionItems,
          priority: summary.priority,
          category: summary.category,
          actionItems: summary.actionItems,
        }
      })
    )

    return NextResponse.json({ emails: processedEmails, cached: false })
  } catch (error) {
    console.error('Error fetching emails:', error)
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    )
  }
}
