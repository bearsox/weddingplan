import Anthropic from '@anthropic-ai/sdk'

function getClient() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })
}

export interface EmailSummary {
  summary: string
  actionItems: string[]
  hasActionItems: boolean
  priority: 'high' | 'medium' | 'low'
  category: string
}

export async function summarizeEmail(
  from: string,
  subject: string,
  body: string
): Promise<EmailSummary> {
  const prompt = `You are a wedding planning assistant. Focus on extracting ACTION ITEMS from this email.

From: ${from}
Subject: ${subject}
Body:
${body.slice(0, 3000)}

Respond in JSON format:
- summary: Focus on what ACTION is needed (e.g., "Venue wants deposit by Friday" or "Need to confirm guest count"). If no action needed, briefly state the email's purpose.
- actionItems: Array of specific tasks (e.g., ["Send $500 deposit to venue by Jan 20", "Reply to confirm appointment time"]). Be specific with amounts, dates, names.
- hasActionItems: true if action is required, false if informational only
- priority: "high" if has deadline within 2 weeks or requires immediate response, "medium" if needs attention soon, "low" if informational
- category: One of: "venue", "catering", "photography", "flowers", "music", "attire", "invitations", "guest_management", "honeymoon", "budget", "general"

Return only valid JSON, no other text.`

  try {
    const response = await getClient().messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    const result = JSON.parse(content.text)
    return {
      summary: result.summary || 'Unable to summarize email',
      actionItems: result.actionItems || [],
      hasActionItems: result.hasActionItems || false,
      priority: result.priority || 'low',
      category: result.category || 'general',
    }
  } catch (error) {
    console.error('Error summarizing email:', error)
    return {
      summary: 'Unable to summarize email',
      actionItems: [],
      hasActionItems: false,
      priority: 'low',
      category: 'general',
    }
  }
}

export async function extractTasksFromEmails(
  emails: Array<{ from: string; subject: string; body: string; date: string }>
): Promise<Array<{ title: string; dueDate?: string; priority: 'high' | 'medium' | 'low'; source: string }>> {
  if (emails.length === 0) return []

  const emailSummaries = emails
    .map(
      (e, i) =>
        `Email ${i + 1}:
From: ${e.from}
Subject: ${e.subject}
Date: ${e.date}
Body: ${e.body.slice(0, 1000)}`
    )
    .join('\n\n---\n\n')

  const prompt = `You are a helpful wedding planning assistant. Review these wedding-related emails and extract any action items or tasks.

${emailSummaries}

Extract specific, actionable tasks from these emails. For each task:
- title: Clear, actionable task description (e.g., "Respond to Rosewood Venue quote by Friday")
- dueDate: If mentioned or implied (ISO date format YYYY-MM-DD), otherwise null
- priority: "high" if has a deadline or requires quick response, "medium" if important, "low" if optional
- source: Brief description of which email (e.g., "Rosewood Venue inquiry")

Return a JSON array of tasks. Only include real, specific action items - not general observations.
Return only valid JSON array, no other text.`

  try {
    const response = await getClient().messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    return JSON.parse(content.text)
  } catch (error) {
    console.error('Error extracting tasks:', error)
    return []
  }
}
