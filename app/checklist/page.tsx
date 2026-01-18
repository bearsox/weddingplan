'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import ChecklistItem from '@/components/ChecklistItem'

interface Category {
  id: string
  name: string
  timeframe: string
  description: string
  items: Array<{
    id: string
    title: string
    description?: string
  }>
}

interface Progress {
  [itemId: string]: {
    completed: boolean
    completedAt: string | null
    notes: string | null
  }
}

export default function ChecklistPage() {
  const { data: session } = useSession()
  const [categories, setCategories] = useState<Category[]>([])
  const [progress, setProgress] = useState<Progress>({})
  const [loading, setLoading] = useState(true)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['18-months']))

  useEffect(() => {
    async function fetchChecklist() {
      try {
        const response = await fetch('/api/checklist')
        if (response.ok) {
          const data = await response.json()
          setCategories(data.categories)
          setProgress(data.progress)
        }
      } catch (error) {
        console.error('Failed to fetch checklist:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchChecklist()
  }, [])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  const handleToggleItem = async (itemId: string, completed: boolean) => {
    if (!session) {
      alert('Please sign in to save your progress')
      return
    }

    // Optimistic update
    setProgress((prev) => ({
      ...prev,
      [itemId]: {
        completed,
        completedAt: completed ? new Date().toISOString() : null,
        notes: prev[itemId]?.notes || null,
      },
    }))

    try {
      await fetch('/api/checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, completed }),
      })
    } catch (error) {
      console.error('Failed to update item:', error)
      // Revert on error
      setProgress((prev) => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          completed: !completed,
        },
      }))
    }
  }

  const getCategoryProgress = (category: Category) => {
    const completed = category.items.filter((item) => progress[item.id]?.completed).length
    return { completed, total: category.items.length }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-serif text-wedding-charcoal">Wedding Checklist</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif text-wedding-charcoal">Wedding Checklist</h1>
        {!session && (
          <p className="text-sm text-wedding-dustyrose">Sign in to save your progress</p>
        )}
      </div>

      <div className="space-y-4">
        {categories.map((category) => {
          const { completed, total } = getCategoryProgress(category)
          const isExpanded = expandedCategories.has(category.id)
          const progressPercent = total > 0 ? (completed / total) * 100 : 0

          return (
            <div key={category.id} className="card">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-wedding-charcoal">
                      {category.name}
                    </h2>
                    <p className="text-sm text-gray-500">{category.description}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className="text-sm font-medium text-wedding-sage">
                        {completed}/{total}
                      </span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                        <div
                          className="h-2 bg-wedding-sage rounded-full transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-gray-400 text-xl">
                      {isExpanded ? '−' : '+'}
                    </span>
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                  {category.items.map((item) => (
                    <ChecklistItem
                      key={item.id}
                      id={item.id}
                      title={item.title}
                      description={item.description}
                      completed={progress[item.id]?.completed || false}
                      onToggle={(completed) => handleToggleItem(item.id, completed)}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
