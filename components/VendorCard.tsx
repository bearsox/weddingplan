'use client'

interface Vendor {
  id: string
  name: string
  type: string
  status: string
  email?: string
  phone?: string
  website?: string
  priceRange?: string
  rating?: number
}

interface VendorCardProps {
  vendor: Vendor
  statusLabel: string
  statusColor: string
  typeLabel: string
}

export default function VendorCard({
  vendor,
  statusLabel,
  statusColor,
  typeLabel,
}: VendorCardProps) {
  return (
    <div className="card hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-wedding-charcoal">{vendor.name}</h3>
          <p className="text-sm text-gray-500">{typeLabel}</p>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${statusColor}`}>
          {statusLabel}
        </span>
      </div>

      {vendor.priceRange && (
        <p className="mt-2 text-sm text-wedding-sage font-medium">
          {vendor.priceRange}
        </p>
      )}

      {vendor.rating && (
        <div className="mt-2 flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-lg ${
                star <= vendor.rating! ? 'text-wedding-gold' : 'text-gray-300'
              }`}
            >
              ★
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center space-x-4 text-sm text-gray-500">
        {vendor.email && (
          <span className="truncate" title={vendor.email}>
            ✉️ {vendor.email}
          </span>
        )}
        {vendor.phone && (
          <span>📞 {vendor.phone}</span>
        )}
      </div>
    </div>
  )
}
