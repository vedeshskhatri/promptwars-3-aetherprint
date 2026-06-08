'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AetherCanvas } from '../../components/nebula/AetherCanvas'
import { ChatWindow } from '../../components/oracle/ChatWindow'
import { CarbonBreakdown } from '../../types'
import { DEFAULT_CARBON_DATA } from '../../lib/constants'
import { getNebulaColor } from '../../lib/carbon-calculator'

export default function OraclePage() {
  const [breakdown, setBreakdown] = useState<CarbonBreakdown | null>(null)
  const [accentColor, setAccentColor] = useState('#00FFCC')

  useEffect(() => {
    const storedBreakdown = localStorage.getItem('aetherprint_breakdown')
    let activeBreakdown: CarbonBreakdown

    if (storedBreakdown) {
      activeBreakdown = JSON.parse(storedBreakdown) as CarbonBreakdown
    } else {
      activeBreakdown = {
        transport: DEFAULT_CARBON_DATA.transport,
        energy: DEFAULT_CARBON_DATA.energy,
        diet: DEFAULT_CARBON_DATA.diet,
        consumption: DEFAULT_CARBON_DATA.consumption,
        flights: DEFAULT_CARBON_DATA.flights,
        total: DEFAULT_CARBON_DATA.total,
      }
    }

    setTimeout(() => {
      setBreakdown(activeBreakdown)
      setAccentColor(getNebulaColor(activeBreakdown.total))
    }, 0)
  }, [])

  if (!breakdown) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center font-mono text-xs">
        CONNECTING UPLINK...
      </div>
    )
  }

  return (
    <div
      className="relative w-full h-full bg-black flex flex-col md:flex-row overflow-hidden"
      style={{ '--accent': accentColor } as React.CSSProperties}
    >
      {/* Back button */}
      <Link
        href="/print"
        className="absolute top-8 left-8 z-20 flex items-center gap-2 font-mono text-[9px] tracking-widest text-[var(--text-dim)] hover:text-[var(--text-primary)] transition-colors duration-300 focus-visible-ring"
        aria-label="Return to your print results"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        RETURN TO RECORD
      </Link>

      {/* LEFT COLUMN: 40% width - Nebula Monitor */}
      <div className="w-full md:w-[40%] h-[35vh] md:h-full relative flex flex-col justify-end p-8 border-b md:border-b-0 md:border-r border-[var(--hud-border)]">
        <div className="absolute inset-0 z-0">
          {/* Renders mini canvas for oracle layout */}
          <AetherCanvas carbonData={breakdown} size="full" interactive={true} />
        </div>

        <div className="relative z-10 font-mono select-none">
          <span className="text-[9px] tracking-[0.3em] text-[var(--accent)] uppercase font-semibold">
            TELEMETRY DISPLAY
          </span>
          <h2 className="text-sm font-serif text-[var(--text-primary)] uppercase tracking-wider mt-1">
            ACTIVE SIGNATURE: {breakdown.total.toFixed(2)} TCO₂E
          </h2>
        </div>
      </div>

      {/* RIGHT COLUMN: 60% width - Chat window feed */}
      <div className="w-full md:w-[60%] h-[65vh] md:h-full relative z-10 flex flex-col p-8 md:p-12">
        <ChatWindow carbonData={breakdown} />
      </div>
    </div>
  )
}
