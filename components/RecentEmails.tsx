'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface EmailSummary {
  id: string
  from: string
  subject: string
  summary: string
  date: string
  hasActionItems: boolean
}

export default function RecentEmails() {
  const { data: session } = useSession()
  const [emails, setEmails] = useState<EmailSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEmails() {
      if (!session) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/emails?limit=3')
        if (response.ok) {
          const data = await response.json()
          setEmails(data.emails || [])
        }
      } catch (error) {
        console.error('Failed to fetch emails:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEmails()
  }, [session])

  if (!session) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-wedding-charcoal mb-4">Recent Emails</h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-3">📧</div>
          <p className="text-gray-500 mb-4">Sign in to see your wedding email summaries</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-wedding-charcoal mb-4">Recent Emails</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-wedding-charcoal">Recent Emails</h3>
        <Link href="/emails" className="text-sm text-wedding-sage hover:underline">
          View all
        </Link>
      </div>

      {emails.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-gray-500">No wedding emails found yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {emails.map((email) => (
            <div key={email.id} className="border-l-2 border-wedding-sage pl-4 py-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-wedding-charcoal text-sm truncate">
                    {email.subject}
                  </p>
                  <p className="text-xs text-gray-500 mb-1">{email.from}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{email.summary}</p>
                </div>
                {email.hasActionItems && (
                  <span className="ml-2 px-2 py-1 bg-wedding-dustyrose/20 text-wedding-dustyrose text-xs rounded-full">
                    Action needed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
