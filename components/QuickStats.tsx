'use client'

import { useEffect, useState } from 'react'

interface Stats {
  totalTasks: number
  completedTasks: number
  upcomingDeadlines: number
  vendorsBooked: number
}

export default function QuickStats() {
  const [stats, setStats] = useState<Stats>({
    totalTasks: 0,
    completedTasks: 0,
    upcomingDeadlines: 0,
    vendorsBooked: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/checklist/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statItems = [
    {
      label: 'Tasks Completed',
      value: `${stats.completedTasks}/${stats.totalTasks}`,
      icon: '✓',
      color: 'bg-wedding-sage/10 text-wedding-sage',
    },
    {
      label: 'Progress',
      value: stats.totalTasks > 0
        ? `${Math.round((stats.completedTasks / stats.totalTasks) * 100)}%`
        : '0%',
      icon: '📊',
      color: 'bg-wedding-gold/10 text-wedding-gold',
    },
    {
      label: 'Upcoming Deadlines',
      value: stats.upcomingDeadlines.toString(),
      icon: '📅',
      color: 'bg-wedding-dustyrose/10 text-wedding-dustyrose',
    },
    {
      label: 'Vendors Booked',
      value: stats.vendorsBooked.toString(),
      icon: '🎯',
      color: 'bg-purple-100 text-purple-600',
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-10 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <div key={item.label} className="card">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center text-xl`}>
              {item.icon}
            </div>
            <div>
              <div className="text-2xl font-bold text-wedding-charcoal">{item.value}</div>
              <div className="text-xs text-gray-500">{item.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
