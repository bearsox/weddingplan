'use client'

import { useState, useEffect } from 'react'

interface EasterEggProps {
  isOpen: boolean
  onClose: () => void
}

interface Heart {
  id: number
  left: number
  delay: number
  duration: number
  size: number
}

export default function EasterEgg({ isOpen, onClose }: EasterEggProps) {
  const [hearts, setHearts] = useState<Heart[]>([])

  useEffect(() => {
    if (isOpen) {
      // Generate lots of hearts with random positions and timings
      const newHearts: Heart[] = []
      for (let i = 0; i < 50; i++) {
        newHearts.push({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 2,
          duration: 3 + Math.random() * 2,
          size: 16 + Math.random() * 24,
        })
      }
      setHearts(newHearts)
    } else {
      setHearts([])
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Floating hearts animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute text-red-500 animate-float-up"
            style={{
              left: `${heart.left}%`,
              bottom: '-50px',
              fontSize: `${heart.size}px`,
              animationDelay: `${heart.delay}s`,
              animationDuration: `${heart.duration}s`,
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      {/* Photo container */}
      <div
        className="relative max-w-md mx-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Photo with heart border */}
        <div className="relative p-2 bg-gradient-to-r from-pink-400 via-red-400 to-pink-400 rounded-2xl shadow-2xl">
          <img
            src="/couple.jpg"
            alt="Jared & Charlee"
            className="rounded-xl w-full h-auto"
          />
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <span className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-wedding-charcoal font-serif text-lg shadow-lg">
              Jared & Charlee 💕
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes scale-in {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-float-up {
          animation: float-up linear forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
