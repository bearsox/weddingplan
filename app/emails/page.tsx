'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'

interface Email {
  id: string
  threadId: string
  from: string
  subject: string
  date: string
  summary: string
  hasActionItems: boolean
  priority: string
  category: string
  actionItems: string[]
}

const categoryLabels: Record<string, string> = {
  venue: '🏛️ Venue',
  catering: '🍽️ Catering',
  photography: '📸 Photography',
  flowers: '💐 Flowers',
  music: '🎵 Music',
  attire: '👗 Attire',
  invitations: '💌 Invitations',
  guest_management: '👥 Guests',
  honeymoon: '✈️ Honeymoon',
  budget: '💰 Budget',
  general: '📧 General',
}

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-600',
  medium: 'bg-yellow-100 text-yellow-600',
  low: 'bg-gray-100 text-gray-600',
}

export default function EmailsPage() {
  const { data: session } = useSession()
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [extractingTasks, setExtractingTasks] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)

  useEffect(() => {
    if (session) {
      fetchEmails()
    } else {
      setLoading(false)
    }
  }, [session])

  async function fetchEmails(refresh = false) {
    if (refresh) setRefreshing(true)
    else setLoading(true)

    try {
      const response = await fetch(`/api/emails?limit=20${refresh ? '&refresh=true' : ''}`)
      if (response.ok) {
        const data = await response.json()
        setEmails(data.emails || [])
      }
    } catch (error) {
      console.error('Failed to fetch emails:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  async function extractTasks() {
    if (emails.length === 0) return

    setExtractingTasks(true)
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emails: emails.slice(0, 10).map((e) => ({
            from: e.from,
            subject: e.subject,
            body: e.summary, // Use summary as body approximation
            date: e.date,
          })),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        alert(`Extracted ${data.count} tasks! View them in the Tasks page.`)
      }
    } catch (error) {
      console.error('Failed to extract tasks:', error)
    } finally {
      setExtractingTasks(false)
    }
  }

  if (!session) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-serif text-wedding-charcoal">Email Summaries</h1>
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">📧</div>
          <p className="text-gray-500 mb-4">
            Connect your Gmail to see AI-powered summaries of your wedding emails
          </p>
          <button onClick={() => signIn('google')} className="btn-primary">
            Sign in with Google
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-serif text-wedding-charcoal">Email Summaries</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif text-wedding-charcoal">Email Summaries</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={extractTasks}
            disabled={extractingTasks || emails.length === 0}
            className="btn-secondary text-sm disabled:opacity-50"
          >
            {extractingTasks ? 'Extracting...' : '✨ Extract Tasks'}
          </button>
          <button
            onClick={() => fetchEmails(true)}
            disabled={refreshing}
            className="btn-primary text-sm disabled:opacity-50"
          >
            {refreshing ? 'Refreshing...' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      {emails.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-gray-500 mb-4">
            No wedding-related emails found. We search for emails mentioning venues, photographers, caterers, and more.
          </p>
          <button
            onClick={() => fetchEmails(true)}
            className="btn-primary"
          >
            Refresh Emails
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Email List */}
          <div className="lg:col-span-1 space-y-3">
            {emails.map((email) => (
              <button
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                className={`w-full text-left card hover:shadow-md transition-shadow ${
                  selectedEmail?.id === email.id ? 'ring-2 ring-wedding-sage' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-wedding-charcoal truncate">
                      {email.subject}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{email.from}</p>
                  </div>
                  {email.hasActionItems && (
                    <span className="ml-2 w-2 h-2 bg-wedding-dustyrose rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[email.priority]}`}>
                    {email.priority}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(email.date).toLocaleDateString()}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Email Detail */}
          <div className="lg:col-span-2">
            {selectedEmail ? (
              <div className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-wedding-charcoal">
                      {selectedEmail.subject}
                    </h2>
                    <p className="text-sm text-gray-500">{selectedEmail.from}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(selectedEmail.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className="text-sm">
                    {categoryLabels[selectedEmail.category] || selectedEmail.category}
                  </span>
                </div>

                <div className="bg-wedding-cream/50 rounded-lg p-4 mb-4">
                  <h3 className="font-medium text-wedding-charcoal mb-2">AI Summary</h3>
                  <p className="text-gray-600">{selectedEmail.summary}</p>
                </div>

                {selectedEmail.actionItems.length > 0 && (
                  <div className="border-t border-gray-100 pt-4">
                    <h3 className="font-medium text-wedding-charcoal mb-2">
                      Action Items
                    </h3>
                    <ul className="space-y-2">
                      {selectedEmail.actionItems.map((item, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-wedding-sage">•</span>
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="card text-center py-12">
                <p className="text-gray-500">Select an email to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
