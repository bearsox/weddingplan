'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { getQuestionsForVendorType, vendorTypeLabels, VendorType } from '@/lib/vendor-questions'

interface Vendor {
  id: string
  name: string
  type: string
  status: string
  email?: string
  phone?: string
  website?: string
  address?: string
  priceRange?: string
  rating?: number
  notes?: string
  pros?: string
  cons?: string
  questionAnswers: Array<{
    questionId: string
    answer?: string
  }>
}

const statusOptions = [
  { value: 'RESEARCHING', label: 'Researching' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'INTERVIEWED', label: 'Interviewed' },
  { value: 'BOOKED', label: 'Booked' },
  { value: 'REJECTED', label: 'Rejected' },
]

export default function VendorDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'info' | 'questions' | 'notes'>('info')

  useEffect(() => {
    if (session) {
      fetchVendor()
    }
  }, [session, params.id])

  async function fetchVendor() {
    try {
      const response = await fetch(`/api/vendors/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setVendor(data)
      } else {
        router.push('/vendors')
      }
    } catch (error) {
      console.error('Failed to fetch vendor:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(updates: Partial<Vendor>) {
    if (!vendor) return

    setSaving(true)
    try {
      const response = await fetch(`/api/vendors/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const updated = await response.json()
        setVendor({ ...vendor, ...updated })
      }
    } catch (error) {
      console.error('Failed to save vendor:', error)
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveAnswer(questionId: string, answer: string) {
    try {
      await fetch(`/api/vendors/${params.id}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, answer }),
      })

      // Update local state
      setVendor((prev) => {
        if (!prev) return prev
        const existingIndex = prev.questionAnswers.findIndex(
          (qa) => qa.questionId === questionId
        )
        const newAnswers = [...prev.questionAnswers]
        if (existingIndex >= 0) {
          newAnswers[existingIndex] = { questionId, answer }
        } else {
          newAnswers.push({ questionId, answer })
        }
        return { ...prev, questionAnswers: newAnswers }
      })
    } catch (error) {
      console.error('Failed to save answer:', error)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this vendor?')) return

    try {
      const response = await fetch(`/api/vendors/${params.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/vendors')
      }
    } catch (error) {
      console.error('Failed to delete vendor:', error)
    }
  }

  if (!session) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">Please sign in to view vendor details</p>
      </div>
    )
  }

  if (loading || !vendor) {
    return (
      <div className="card animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const questions = getQuestionsForVendorType(vendor.type as VendorType)
  const answersMap = vendor.questionAnswers.reduce(
    (acc, qa) => {
      acc[qa.questionId] = qa.answer || ''
      return acc
    },
    {} as Record<string, string>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => router.push('/vendors')}
            className="text-sm text-wedding-sage hover:underline mb-2"
          >
            ← Back to Vendors
          </button>
          <h1 className="text-3xl font-serif text-wedding-charcoal">{vendor.name}</h1>
          <p className="text-gray-500">
            {vendorTypeLabels[vendor.type as VendorType] || vendor.type}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={vendor.status}
            onChange={(e) => handleSave({ status: e.target.value })}
            className="input w-auto"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-600 text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500">Rating:</span>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleSave({ rating: star })}
            className={`text-2xl transition-colors ${
              star <= (vendor.rating || 0)
                ? 'text-wedding-gold'
                : 'text-gray-300 hover:text-wedding-gold/50'
            }`}
          >
            ★
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'info', label: 'Contact Info' },
            { id: 'questions', label: 'Questions' },
            { id: 'notes', label: 'Notes' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'info' | 'questions' | 'notes')}
              className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-wedding-sage text-wedding-sage'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="card">
        {activeTab === 'info' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={vendor.email || ''}
                onChange={(e) => setVendor({ ...vendor, email: e.target.value })}
                onBlur={() => handleSave({ email: vendor.email })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={vendor.phone || ''}
                onChange={(e) => setVendor({ ...vendor, phone: e.target.value })}
                onBlur={() => handleSave({ phone: vendor.phone })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                value={vendor.website || ''}
                onChange={(e) => setVendor({ ...vendor, website: e.target.value })}
                onBlur={() => handleSave({ website: vendor.website })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range
              </label>
              <input
                type="text"
                value={vendor.priceRange || ''}
                onChange={(e) => setVendor({ ...vendor, priceRange: e.target.value })}
                onBlur={() => handleSave({ priceRange: vendor.priceRange })}
                className="input"
                placeholder="e.g., $5,000 - $8,000"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={vendor.address || ''}
                onChange={(e) => setVendor({ ...vendor, address: e.target.value })}
                onBlur={() => handleSave({ address: vendor.address })}
                className="input"
              />
            </div>
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="space-y-6">
            <p className="text-sm text-gray-500">
              Use these questions when interviewing this vendor. Click to expand and record their answers.
            </p>
            {questions.map((q) => (
              <div key={q.id} className="border border-gray-200 rounded-lg p-4">
                <p className="font-medium text-wedding-charcoal mb-2">
                  {q.question}
                </p>
                {q.tip && (
                  <p className="text-sm text-wedding-sage mb-2">💡 {q.tip}</p>
                )}
                <textarea
                  value={answersMap[q.id] || ''}
                  onChange={(e) => {
                    const newAnswers = { ...answersMap, [q.id]: e.target.value }
                    setVendor({
                      ...vendor,
                      questionAnswers: Object.entries(newAnswers).map(([questionId, answer]) => ({
                        questionId,
                        answer,
                      })),
                    })
                  }}
                  onBlur={() => handleSaveAnswer(q.id, answersMap[q.id] || '')}
                  placeholder="Record their answer here..."
                  className="input min-h-[80px]"
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                General Notes
              </label>
              <textarea
                value={vendor.notes || ''}
                onChange={(e) => setVendor({ ...vendor, notes: e.target.value })}
                onBlur={() => handleSave({ notes: vendor.notes })}
                className="input min-h-[120px]"
                placeholder="Add any notes about this vendor..."
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-green-600 mb-1">
                  ✓ Pros
                </label>
                <textarea
                  value={vendor.pros || ''}
                  onChange={(e) => setVendor({ ...vendor, pros: e.target.value })}
                  onBlur={() => handleSave({ pros: vendor.pros })}
                  className="input min-h-[100px]"
                  placeholder="What do you like about this vendor?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-red-600 mb-1">
                  ✗ Cons
                </label>
                <textarea
                  value={vendor.cons || ''}
                  onChange={(e) => setVendor({ ...vendor, cons: e.target.value })}
                  onBlur={() => handleSave({ cons: vendor.cons })}
                  className="input min-h-[100px]"
                  placeholder="Any concerns or drawbacks?"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {saving && (
        <div className="fixed bottom-4 right-4 bg-wedding-sage text-white px-4 py-2 rounded-lg shadow-lg">
          Saving...
        </div>
      )}
    </div>
  )
}
