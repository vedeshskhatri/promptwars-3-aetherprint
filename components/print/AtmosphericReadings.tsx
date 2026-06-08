'use client'

import React from 'react'
import { CarbonBreakdown } from '../../types'

interface AtmosphericReadingsProps {
  breakdown: CarbonBreakdown
}

// Custom category thresholds for glyph status: ◆ green (< avg) | ◆ amber (at avg) | ◆ red (> avg)
const getCategoryStatus = (category: keyof Omit<CarbonBreakdown, 'total'>, value: number) => {
  const thresholds: Record<typeof category, { low: number; high: number }> = {
    transport: { low: 0.6, high: 1.2 },
    energy: { low: 0.8, high: 1.8 },
    diet: { low: 1.6, high: 2.2 },
    consumption: { low: 0.4, high: 0.8 },
    flights: { low: 0.1, high: 1.0 },
  }

  const { low, high } = thresholds[category]
  if (value < low) return { label: 'UNDER AVERAGE', color: 'var(--nebula-low, #00FFCC)' }
  if (value <= high) return { label: 'AT AVERAGE', color: 'var(--nebula-mid, #FF8C00)' }
  return { label: 'ABOVE AVERAGE', color: 'var(--nebula-high, #FF2244)' }
}

const formatCategoryName = (name: string) => {
  if (name === 'diet') return 'SUSTENANCE LAYER'
  if (name === 'consumption') return 'CONSUMPTION LAYER'
  return `${name.toUpperCase()} LAYER`
}

export const AtmosphericReadings: React.FC<AtmosphericReadingsProps> = ({ breakdown }) => {
  const categories: Array<keyof Omit<CarbonBreakdown, 'total'>> = [
    'transport',
    'energy',
    'diet',
    'consumption',
    'flights',
  ]

  return (
    <div className="flex flex-col gap-4 font-mono select-none" aria-label="Atmospheric category readings">
      {categories.map((cat) => {
        const val = breakdown[cat]
        const status = getCategoryStatus(cat, val)

        return (
          <div
            key={cat}
            className="flex flex-col gap-1 border-b border-[rgba(255,255,255,0.03)] pb-2 flex-grow"
          >
            {/* Category header and value */}
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] tracking-wider text-[var(--text-primary)]">
                {formatCategoryName(cat)}
              </span>
              <span className="text-xs font-bold text-[var(--text-primary)]">
                {val.toFixed(2)}{' '}
                <span className="text-[9px] text-[var(--text-dim)] uppercase">tCO₂e/yr</span>
              </span>
            </div>

            {/* Status indicators */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span
                  className="text-xs transition-colors duration-300"
                  style={{ color: status.color }}
                >
                  ◆
                </span>
                <span className="text-[8px] tracking-widest text-[var(--text-dim)] uppercase">
                  {status.label}
                </span>
              </div>
              <div className="text-[8px] text-[var(--text-dim)] uppercase tracking-widest">
                SYS.CALIBRATED_100%
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
export default AtmosphericReadings
