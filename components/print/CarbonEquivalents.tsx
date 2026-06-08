'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plane, Beef, Trees } from 'lucide-react'
import { getCarbonEquivalents } from '../../lib/carbon-calculator'

interface CarbonEquivalentsProps {
  total: number
}

/**
 * Rotating carousel of carbon equivalent comparisons (flights, beef, trees).
 * Uses useMemo for the equivalents calculation and aria-live for screen reader announcements.
 * Wrapped with React.memo since total rarely changes.
 */
export const CarbonEquivalents: React.FC<CarbonEquivalentsProps> = React.memo(({ total }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  // Memoize — only recalculates when total changes
  const equivalents = useMemo(() => getCarbonEquivalents(total), [total])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % equivalents.length)
    }, 4500) // Rotate every 4.5 seconds

    return () => clearInterval(timer)
  }, [equivalents.length])

  const current = equivalents[currentIndex]

  // Map icon strings to components
  const renderIcon = (iconName: string): React.ReactNode => {
    const props = { className: 'w-6 h-6 text-[var(--accent)]', 'aria-hidden': true as const }
    if (iconName === 'Plane') return <Plane {...props} />
    if (iconName === 'Beef') return <Beef {...props} />
    if (iconName === 'Trees') return <Trees {...props} />
    return <Trees {...props} />
  }

  return (
    <section
      className="w-full relative min-h-[110px] border border-[var(--hud-border)] rounded bg-[rgba(255,255,255,0.02)] p-4 flex flex-col justify-between overflow-hidden select-none font-mono"
      aria-label="Carbon emission equivalents"
    >
      {/* Top indicator dots — decorative only */}
      <div className="flex justify-end gap-1 mb-2" aria-hidden="true">
        {equivalents.map((_, idx) => (
          <div
            key={idx}
            className={`w-1 h-1 rounded-full transition-all duration-300 ${
              currentIndex === idx ? 'bg-[var(--accent)] w-3' : 'bg-[rgba(255,255,255,0.15)]'
            }`}
          />
        ))}
      </div>

      {/* Screen reader live region to announce rotating equivalents */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {current.value.toLocaleString()} {current.unit} — {current.label}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
          className="flex items-center gap-4 flex-grow"
          aria-hidden="true"
        >
          {/* Circular icon container with accent border */}
          <div className="flex items-center justify-center p-3.5 rounded-full border border-[var(--hud-border)] bg-black/40">
            {renderIcon(current.icon)}
          </div>

          <div className="flex flex-col gap-1 flex-grow">
            {/* The calculated value */}
            <span className="text-sm font-bold text-[var(--text-primary)]">
              {current.value.toLocaleString()}{' '}
              <span className="text-[10px] text-[var(--accent)] font-medium uppercase">
                {current.unit}
              </span>
            </span>
            {/* Context/description label */}
            <span className="text-[9px] text-[var(--text-dim)] uppercase tracking-wider leading-relaxed">
              {current.label}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
})
CarbonEquivalents.displayName = 'CarbonEquivalents'
export default CarbonEquivalents
