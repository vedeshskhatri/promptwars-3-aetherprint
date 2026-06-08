'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface NavItem {
  label: string
  path: string
  id: string
}

const navItems: NavItem[] = [
  { label: 'VOID', path: '/', id: 'void' },
  { label: 'MAP', path: '/map', id: 'map' },
  { label: 'PRINT', path: '/print', id: 'print' },
  { label: 'ORACLE', path: '/oracle', id: 'oracle' },
  { label: 'SIMULATE', path: '/simulate', id: 'simulate' },
]

export const NavDots: React.FC = () => {
  const pathname = usePathname()
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <nav 
      className="fixed top-8 right-8 z-[999] flex flex-col items-end gap-4 font-mono select-none"
      aria-label="Aetherprint main navigation"
    >
      {navItems.map((item) => {
        const isActive = pathname === item.path
        const isHovered = hoveredId === item.id

        return (
          <Link
            key={item.id}
            href={item.path}
            className="flex items-center gap-3 group focus:outline-none"
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            aria-label={`Navigate to ${item.label}`}
          >
            {/* Label - visible on hover or if active */}
            <AnimatePresence>
              {(isHovered || isActive) && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className={`text-[10px] tracking-[0.25em] font-medium transition-colors duration-300 ${
                    isActive ? 'text-[var(--accent)] font-bold' : 'text-[var(--text-dim)] group-hover:text-[var(--text-primary)]'
                  }`}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Dot indicator */}
            <div className="relative flex items-center justify-center w-4 h-4">
              {/* Outer ring glow when active */}
              {isActive && (
                <motion.div
                  layoutId="activeNavRing"
                  className="absolute w-3.5 h-3.5 rounded-full border border-[var(--accent)]"
                  style={{
                    boxShadow: '0 0 8px var(--accent)',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              {/* Inner solid dot */}
              <div
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'scale-125'
                    : 'bg-[rgba(240,237,232,0.2)] group-hover:bg-[var(--text-primary)] group-hover:scale-110'
                }`}
                style={{
                  backgroundColor: isActive ? 'var(--accent)' : undefined,
                }}
              />
            </div>
          </Link>
        )
      })}
    </nav>
  )
}
export default NavDots
