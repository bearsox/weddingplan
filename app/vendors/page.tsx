'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import VendorCard from '@/components/VendorCard'
import { vendorTypeLabels, VendorType } from '@/lib/vendor-questions'

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
  updatedAt: string
}

const statusLabels: Record<string, string> = {
  RESEARCHING: 'Researching',
  CONTACTED: 'Contacted',
  INTERVIEWED: 'Interviewed',
  BOOKED: 'Booked',
  REJECTED: 'Rejected',
}

const statusColors: Record<string, string> = {
  RESEARCHING: 'bg-gray-100 text-gray-600',
  CONTACTED: 'bg-blue-100 text-blue-600',
  INTERVIEWED: 'bg-yellow-100 text-yellow-600',
  BOOKED: 'bg-green-100 text-green-600',
  REJECTED: 'bg-red-100 text-red-600',
}

export default function VendorsPage() {
  const { data: session } = useSession()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newVendor, setNewVendor] = useState({
    name: '',
    type: 'venue' as VendorType,
    email: '',
    phone: '',
    website: '',
    priceRange: '',
  })

  useEffect(() => {
    if (session) {
      fetchVendors()
    } else {
      setLoading(false)
    }
  }, [session, filterType, filterStatus])

  async function fetchVendors() {
    try {
      const params = new URLSearchParams()
      if (filterType) params.set('type', filterType)
      if (filterStatus) params.set('status', filterStatus)

      const response = await fetch(`/api/vendors?${params}`)
      if (response.ok) {
        const data = await response.json()
        setVendors(data.vendors)
      }
    } catch (error) {
      console.error('Failed to fetch vendors:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddVendor(e: React.FormEvent) {
    e.preventDefault()

    try {
      const response = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVendor),
      })

      if (response.ok) {
        setNewVendor({
          name: '',
          type: 'venue',
          email: '',
          phone: '',
          website: '',
          priceRange: '',
        })
        setShowAddForm(false)
        fetchVendors()
      }
    } catch (error) {
      console.error('Failed to add vendor:', error)
    }
  }

  if (!session) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-serif text-wedding-charcoal">Vendor Tracker</h1>
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">🏪</div>
          <p className="text-gray-500 mb-4">Sign in to track your vendors</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-serif text-wedding-charcoal">Vendor Tracker</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif text-wedding-charcoal">Vendor Tracker</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary"
        >
          + Add Vendor
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="input w-auto"
        >
          <option value="">All Types</option>
          {Object.entries(vendorTypeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input w-auto"
        >
          <option value="">All Statuses</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Add Vendor Form */}
      {showAddForm && (
        <div className="card">
          <h2 className="text-xl font-semibold text-wedding-charcoal mb-4">Add New Vendor</h2>
          <form onSubmit={handleAddVendor} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor Name *
                </label>
                <input
                  type="text"
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  value={newVendor.type}
                  onChange={(e) => setNewVendor({ ...newVendor, type: e.target.value as VendorType })}
                  className="input"
                  required
                >
                  {Object.entries(vendorTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newVendor.email}
                  onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={newVendor.phone}
                  onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={newVendor.website}
                  onChange={(e) => setNewVendor({ ...newVendor, website: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range
                </label>
                <input
                  type="text"
                  value={newVendor.priceRange}
                  onChange={(e) => setNewVendor({ ...newVendor, priceRange: e.target.value })}
                  className="input"
                  placeholder="e.g., $5,000 - $8,000"
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
                Add Vendor
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vendors Grid */}
      {vendors.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">📋</div>
          <p className="text-gray-500 mb-4">No vendors yet. Start adding vendors to track!</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
          >
            Add Your First Vendor
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendors.map((vendor) => (
            <Link key={vendor.id} href={`/vendors/${vendor.id}`}>
              <VendorCard
                vendor={vendor}
                statusLabel={statusLabels[vendor.status]}
                statusColor={statusColors[vendor.status]}
                typeLabel={vendorTypeLabels[vendor.type as VendorType] || vendor.type}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
