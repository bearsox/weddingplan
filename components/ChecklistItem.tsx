'use client'

interface ChecklistItemProps {
  id: string
  title: string
  description?: string
  completed: boolean
  onToggle: (completed: boolean) => void
}

export default function ChecklistItem({
  id,
  title,
  description,
  completed,
  onToggle,
}: ChecklistItemProps) {
  return (
    <label
      htmlFor={id}
      className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
        completed
          ? 'bg-wedding-sage/10'
          : 'hover:bg-gray-50'
      }`}
    >
      <input
        type="checkbox"
        id={id}
        checked={completed}
        onChange={(e) => onToggle(e.target.checked)}
        className="mt-0.5 w-5 h-5 rounded border-gray-300 text-wedding-sage focus:ring-wedding-sage cursor-pointer"
      />
      <div className="flex-1">
        <span
          className={`text-wedding-charcoal ${
            completed ? 'line-through text-gray-400' : ''
          }`}
        >
          {title}
        </span>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </label>
  )
}
