'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Task {
  id: string
  title: string
  source: 'checklist' | 'email'
  dueDate?: string
  priority: 'high' | 'medium' | 'low'
}

export default function UpcomingTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch('/api/tasks?limit=5&upcoming=true')
        if (response.ok) {
          const data = await response.json()
          setTasks(data.tasks || [])
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const priorityColors = {
    high: 'bg-red-100 text-red-600',
    medium: 'bg-yellow-100 text-yellow-600',
    low: 'bg-gray-100 text-gray-600',
  }

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-wedding-charcoal mb-4">Upcoming Tasks</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex items-center space-x-3">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="flex-1 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-wedding-charcoal">Upcoming Tasks</h3>
        <Link href="/tasks" className="text-sm text-wedding-sage hover:underline">
          View all
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">✨</div>
          <p className="text-gray-500">No upcoming tasks - you&apos;re all caught up!</p>
          <Link href="/checklist" className="text-wedding-sage hover:underline text-sm mt-2 inline-block">
            View checklist
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-start space-x-3 group">
              <input
                type="checkbox"
                className="mt-1 w-5 h-5 rounded border-gray-300 text-wedding-sage focus:ring-wedding-sage cursor-pointer"
                onChange={() => {
                  // Mark task as complete
                  fetch(`/api/tasks/${task.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ completed: true }),
                  })
                  setTasks(tasks.filter((t) => t.id !== task.id))
                }}
              />
              <div className="flex-1">
                <p className="text-sm text-wedding-charcoal group-hover:text-wedding-sage transition-colors">
                  {task.title}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  {task.dueDate && (
                    <span className="text-xs text-gray-500">{task.dueDate}</span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </span>
                  {task.source === 'email' && (
                    <span className="text-xs text-gray-400">from email</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
