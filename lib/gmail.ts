import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface GmailMessage {
  id: string
  threadId: string
  snippet: string
  payload: {
    headers: Array<{ name: string; value: string }>
    body?: { data?: string }
    parts?: Array<{
      mimeType: string
      body?: { data?: string }
    }>
  }
  internalDate: string
}

interface GmailListResponse {
  messages?: Array<{ id: string; threadId: string }>
  nextPageToken?: string
}

export interface ParsedEmail {
  id: string
  threadId: string
  from: string
  to: string
  subject: string
  date: string
  snippet: string
  body: string
}

function decodeBase64(data: string): string {
  try {
    // Gmail uses URL-safe base64
    const base64 = data.replace(/-/g, '+').replace(/_/g, '/')
    return Buffer.from(base64, 'base64').toString('utf-8')
  } catch {
    return ''
  }
}

function getHeader(headers: Array<{ name: string; value: string }>, name: string): string {
  const header = headers.find((h) => h.name.toLowerCase() === name.toLowerCase())
  return header?.value || ''
}

function getEmailBody(message: GmailMessage): string {
  // Try to get body from payload.body
  if (message.payload.body?.data) {
    return decodeBase64(message.payload.body.data)
  }

  // Try to find text/plain or text/html part
  if (message.payload.parts) {
    for (const part of message.payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        return decodeBase64(part.body.data)
      }
    }
    for (const part of message.payload.parts) {
      if (part.mimeType === 'text/html' && part.body?.data) {
        // Strip HTML tags for plain text
        const html = decodeBase64(part.body.data)
        return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
      }
    }
  }

  // Fallback to snippet
  return message.snippet
}

export async function fetchGmailMessages(
  accessToken: string,
  maxResults: number = 10,
  query: string = ''
): Promise<ParsedEmail[]> {
  const baseUrl = 'https://gmail.googleapis.com/gmail/v1/users/me'

  // Wedding-related search query (empty = all recent emails)
  const weddingQuery = query || ''

  // Get list of message IDs
  const listUrl = `${baseUrl}/messages?maxResults=${maxResults}&q=${encodeURIComponent(weddingQuery)}`
  const listResponse = await fetch(listUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!listResponse.ok) {
    throw new Error(`Failed to fetch messages: ${listResponse.statusText}`)
  }

  const listData: GmailListResponse = await listResponse.json()

  if (!listData.messages || listData.messages.length === 0) {
    return []
  }

  // Fetch full message details
  const emails: ParsedEmail[] = await Promise.all(
    listData.messages.map(async (msg) => {
      const messageUrl = `${baseUrl}/messages/${msg.id}?format=full`
      const messageResponse = await fetch(messageUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      if (!messageResponse.ok) {
        throw new Error(`Failed to fetch message ${msg.id}`)
      }

      const message: GmailMessage = await messageResponse.json()
      const headers = message.payload.headers

      return {
        id: message.id,
        threadId: message.threadId,
        from: getHeader(headers, 'From'),
        to: getHeader(headers, 'To'),
        subject: getHeader(headers, 'Subject'),
        date: new Date(parseInt(message.internalDate)).toISOString(),
        snippet: message.snippet,
        body: getEmailBody(message),
      }
    })
  )

  return emails
}

export async function getGmailAccessToken(): Promise<string | null> {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    return null
  }

  return session.accessToken as string
}
