'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Task {
  id: string
  title: string
  description?: string
  source: string
  priority: string
  completed: boolean
  dueDate?: string
  dueDateRaw?: string
}

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-600 border-red-200',
  medium: 'bg-yellow-100 text-yellow-600 border-yellow-200',
  low: 'bg-gray-100 text-gray-600 border-gray-200',
}

export default function TasksPage() {
  const { data: session } = useSession()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  })

  useEffect(() => {
    if (session) {
      fetchTasks()
    } else {
      setLoading(false)
    }
  }, [session, filter])

  async function fetchTasks() {
    try {
      const params = new URLSearchParams()
      if (filter === 'pending') params.set('completed', 'false')
      if (filter === 'completed') params.set('completed', 'true')

      const response = await fetch(`/api/tasks?${params}`)
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

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault()

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      })

      if (response.ok) {
        setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' })
        setShowAddForm(false)
        fetchTasks()
      }
    } catch (error) {
      console.error('Failed to add task:', error)
    }
  }

  async function handleToggleTask(taskId: string, completed: boolean) {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed } : t))
    )

    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      })

      // Remove from list if filtering
      if (filter !== 'all') {
        setTasks((prev) => prev.filter((t) => t.id !== taskId))
      }
    } catch (error) {
      console.error('Failed to update task:', error)
      // Revert on error
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: !completed } : t))
      )
    }
  }

  async function handleDeleteTask(taskId: string) {
    if (!confirm('Delete this task?')) return

    setTasks((prev) => prev.filter((t) => t.id !== taskId))

    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error('Failed to delete task:', error)
      fetchTasks()
    }
  }

  if (!session) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-serif text-wedding-charcoal">Task Inbox</h1>
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">✅</div>
          <p className="text-gray-500 mb-4">Sign in to manage your tasks</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-serif text-wedding-charcoal">Task Inbox</h1>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif text-wedding-charcoal">Task Inbox</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary"
        >
          + Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {[
          { value: 'pending', label: 'Pending' },
          { value: 'completed', label: 'Completed' },
          { value: 'all', label: 'All' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value as typeof filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-wedding-sage text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <div className="card">
          <h2 className="text-xl font-semibold text-wedding-charcoal mb-4">Add New Task</h2>
          <form onSubmit={handleAddTask} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Title *
              </label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="input"
                placeholder="e.g., Call venue to confirm date"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="input"
                placeholder="Additional details..."
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="input"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="input"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">✨</div>
          <p className="text-gray-500 mb-4">
            {filter === 'completed'
              ? 'No completed tasks yet'
              : 'No pending tasks - you\'re all caught up!'}
          </p>
          {filter === 'pending' && (
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              Add a Task
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`card flex items-start space-x-4 ${
                task.completed ? 'opacity-60' : ''
              }`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) => handleToggleTask(task.id, e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-gray-300 text-wedding-sage focus:ring-wedding-sage cursor-pointer"
              />
              <div className="flex-1">
                <p
                  className={`font-medium text-wedding-charcoal ${
                    task.completed ? 'line-through' : ''
                  }`}
                >
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                )}
                <div className="flex items-center space-x-3 mt-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${
                      priorityColors[task.priority]
                    }`}
                  >
                    {task.priority}
                  </span>
                  {task.dueDate && (
                    <span className="text-xs text-gray-500">Due: {task.dueDate}</span>
                  )}
                  {task.source === 'email' && (
                    <span className="text-xs text-wedding-dustyrose">from email</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
