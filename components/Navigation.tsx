'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'
import EasterEgg from './EasterEgg'

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/checklist', label: 'Checklist' },
  { href: '/vendors', label: 'Vendors' },
  { href: '/emails', label: 'Emails' },
  { href: '/tasks', label: 'Tasks' },
  { href: '/settings', label: 'Settings' },
]

export default function Navigation() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [showEasterEgg, setShowEasterEgg] = useState(false)

  return (
    <>
      <EasterEgg isOpen={showEasterEgg} onClose={() => setShowEasterEgg(false)} />
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowEasterEgg(true)}
              className="text-2xl hover:scale-125 transition-transform cursor-pointer"
              aria-label="Easter egg"
            >
              💒
            </button>
            <Link href="/" className="font-serif text-xl text-wedding-charcoal">
              J & C
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${
                  pathname === item.href ? 'nav-link-active' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth Button */}
          <div className="flex items-center">
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : session ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 hidden sm:block">
                  {session.user?.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-wedding-dustyrose hover:text-wedding-charcoal transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="btn-primary text-sm"
              >
                Sign in with Google
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex overflow-x-auto space-x-1 pb-3 -mx-4 px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link whitespace-nowrap text-sm ${
                pathname === item.href ? 'nav-link-active' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
    </>
  )
}
