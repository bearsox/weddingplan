'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Settings {
  weddingDate: string
  partner1Name: string
  partner2Name: string
  weddingEmail?: string
}

interface ApiUsage {
  error?: string
  note?: string
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const [apiUsage, setApiUsage] = useState<ApiUsage | null>(null)
  const [settings, setSettings] = useState<Settings>({
    weddingDate: '2027-06-21',
    partner1Name: 'Jared',
    partner2Name: 'Charlee',
    weddingEmail: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchSettings()
    fetchApiUsage()
  }, [])

  async function fetchApiUsage() {
    try {
      const response = await fetch('/api/usage')
      if (response.ok) {
        const data = await response.json()
        setApiUsage(data)
      }
    } catch (error) {
      console.error('Failed to fetch API usage:', error)
    }
  }

  async function fetchSettings() {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings({
          weddingDate: data.weddingDate || '2027-06-21',
          partner1Name: data.partner1Name || 'Jared',
          partner2Name: data.partner2Name || 'Charlee',
          weddingEmail: data.weddingEmail || '',
        })
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()

    if (!session) {
      // Save to localStorage for non-authenticated users
      localStorage.setItem('weddingDate', settings.weddingDate)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        // Also update localStorage for the countdown
        localStorage.setItem('weddingDate', settings.weddingDate)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-serif text-wedding-charcoal">Settings</h1>
        <div className="card animate-pulse">
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif text-wedding-charcoal">Settings</h1>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Wedding Details */}
        <div className="card">
          <h2 className="text-xl font-semibold text-wedding-charcoal mb-4">
            Wedding Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wedding Date
              </label>
              <input
                type="date"
                value={settings.weddingDate}
                onChange={(e) =>
                  setSettings({ ...settings, weddingDate: e.target.value })
                }
                className="input max-w-xs"
              />
              <p className="text-sm text-gray-500 mt-1">
                This is used for the countdown timer on the dashboard
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Partner 1 Name
                </label>
                <input
                  type="text"
                  value={settings.partner1Name}
                  onChange={(e) =>
                    setSettings({ ...settings, partner1Name: e.target.value })
                  }
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Partner 2 Name
                </label>
                <input
                  type="text"
                  value={settings.partner2Name}
                  onChange={(e) =>
                    setSettings({ ...settings, partner2Name: e.target.value })
                  }
                  className="input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Email Settings */}
        {session && (
          <div className="card">
            <h2 className="text-xl font-semibold text-wedding-charcoal mb-4">
              Email Settings
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wedding Email Address
              </label>
              <input
                type="email"
                value={settings.weddingEmail || ''}
                onChange={(e) =>
                  setSettings({ ...settings, weddingEmail: e.target.value })
                }
                className="input max-w-md"
                placeholder="yourwedding@gmail.com"
              />
              <p className="text-sm text-gray-500 mt-1">
                The email address you use for wedding-related communications
              </p>
            </div>
          </div>
        )}

        {/* Account Info */}
        {session && (
          <div className="card">
            <h2 className="text-xl font-semibold text-wedding-charcoal mb-4">
              Account
            </h2>
            <div className="flex items-center space-x-4">
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <p className="font-medium text-wedding-charcoal">
                  {session.user?.name}
                </p>
                <p className="text-sm text-gray-500">{session.user?.email}</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                ✓ Connected to Google - Gmail access enabled for email summaries
              </p>
            </div>
          </div>
        )}

        {/* API Usage */}
        {session && (
          <div className="card">
            <h2 className="text-xl font-semibold text-wedding-charcoal mb-4">
              Claude API Usage
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              The AI email summaries use Claude API credits. Check your usage and balance:
            </p>
            <a
              href="https://console.anthropic.com/settings/billing"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-block text-sm"
            >
              View API Usage & Billing →
            </a>
            {apiUsage && !apiUsage.error && (
              <pre className="mt-4 p-3 bg-gray-100 rounded text-xs overflow-auto">
                {JSON.stringify(apiUsage, null, 2)}
              </pre>
            )}
          </div>
        )}

        {/* Save Button */}
        <div className="flex items-center space-x-4">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          {saved && (
            <span className="text-wedding-sage">✓ Settings saved!</span>
          )}
        </div>
      </form>

      {/* Setup Instructions */}
      {!session && (
        <div className="card bg-wedding-cream/50">
          <h2 className="text-xl font-semibold text-wedding-charcoal mb-4">
            Getting Started
          </h2>
          <div className="space-y-4 text-gray-600">
            <p>
              To unlock all features, sign in with your Google account. This enables:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Saving your checklist progress</li>
              <li>Tracking vendors</li>
              <li>AI-powered email summaries from your wedding inbox</li>
              <li>Automatic task extraction from emails</li>
            </ul>
          </div>
        </div>
      )}

      {/* API Keys Info */}
      <div className="card bg-gray-50">
        <h2 className="text-xl font-semibold text-wedding-charcoal mb-4">
          For Developers
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          This app requires the following environment variables to be set:
        </p>
        <ul className="text-sm text-gray-600 space-y-1 font-mono">
          <li>• DATABASE_URL - Vercel Postgres connection string</li>
          <li>• NEXTAUTH_SECRET - Random secret for NextAuth</li>
          <li>• GOOGLE_CLIENT_ID - Google OAuth client ID</li>
          <li>• GOOGLE_CLIENT_SECRET - Google OAuth client secret</li>
          <li>• ANTHROPIC_API_KEY - Claude API key for email summaries</li>
        </ul>
      </div>
    </div>
  )
}
