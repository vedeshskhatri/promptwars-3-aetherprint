'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, Terminal } from 'lucide-react'
import { AetherCanvas } from '../../components/nebula/AetherCanvas'
import { AtmosphericReadings } from '../../components/print/AtmosphericReadings'
import { ComparisonBars } from '../../components/print/ComparisonBars'
import { CarbonEquivalents } from '../../components/print/CarbonEquivalents'
import { CountUp } from '../../components/ui/CountUp'
import { CarbonBreakdown, EmissionInputs } from '../../types'
import { generateAetherID, getNebulaColor } from '../../lib/carbon-calculator'
import { DEFAULT_CARBON_DATA } from '../../lib/constants'
import confetti from 'canvas-confetti'

export default function PrintPage() {
  const [breakdown, setBreakdown] = useState<CarbonBreakdown | null>(null)
  const [aetherID, setAetherID] = useState('AE-VOID-0000')
  const [accentColor, setAccentColor] = useState('#00FFCC')

  useEffect(() => {
    // Read from localStorage on mount
    const storedInputs = localStorage.getItem('aetherprint_inputs')
    const storedBreakdown = localStorage.getItem('aetherprint_breakdown')

    let activeBreakdown: CarbonBreakdown
    let activeAetherID = 'AE-VOID-0000'

    if (storedInputs && storedBreakdown) {
      const parsedInputs = JSON.parse(storedInputs) as EmissionInputs
      activeBreakdown = JSON.parse(storedBreakdown) as CarbonBreakdown
      activeAetherID = generateAetherID(parsedInputs)

      // Trigger achievement confetti if carbon emissions are low (<2.0t Paris target)
      if (activeBreakdown.total < 2.0) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00FFCC', '#00E5FF', '#2979FF'],
        })
      }
    } else {
      // Fallback if accessed directly
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
      setAetherID(activeAetherID)
      setAccentColor(getNebulaColor(activeBreakdown.total))
    }, 0)
  }, [])

  if (!breakdown) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center font-mono text-xs">
        RETRIEVING SPECTRAL READING...
      </div>
    )
  }

  return (
    <div
      className="relative w-full h-full bg-black flex flex-col md:flex-row overflow-hidden"
      style={{ '--accent': accentColor } as React.CSSProperties}
    >
      {/* LEFT HALF (60% width) - The Nebula Exhibit */}
      <div className="w-full md:w-3/5 h-[50vh] md:h-full relative flex flex-col justify-end p-8 border-b md:border-b-0 md:border-r border-[var(--hud-border)]">
        {/* Canvas takes full width of parent container */}
        <div className="absolute inset-0 z-0">
          <AetherCanvas carbonData={breakdown} size="full" interactive={true} />
        </div>

        {/* Text overlaid underneath the Nebula */}
        <div className="relative z-10 flex flex-col gap-1.5 font-mono select-none">
          <div className="text-[10px] tracking-[0.4em] text-[var(--accent)] uppercase font-semibold">
            ATMOSPHERIC SIGNATURE RECORD
          </div>
          
          <h2 className="text-xl md:text-2xl font-serif text-[var(--text-primary)] leading-tight tracking-wide">
            AETHERPRINT ID: <span className="font-mono text-sm tracking-widest">{aetherID}</span>
          </h2>
          
          <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-widest">
            ANNUAL CARBON FOOTPRINT READOUT //{' '}
            <span className="text-[var(--text-primary)] font-bold">
              <CountUp end={breakdown.total} decimals={2} duration={1000} /> TCO₂E
            </span>
          </p>
        </div>

        {/* Floating eco-shield badge for low emitters */}
        {breakdown.total < 2.0 && (
          <div className="absolute top-8 left-8 z-10 font-mono text-[9px] text-[var(--accent)] border border-[var(--accent)] px-3 py-1.5 rounded-sm bg-black/60 backdrop-blur-sm flex items-center gap-2 tracking-widest">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            PARIS ALIGNED
          </div>
        )}
      </div>

      {/* RIGHT HALF (40% width) - The Readings Dashboard */}
      <div className="w-full md:w-2/5 h-[50vh] md:h-full relative z-10 flex flex-col p-8 md:py-12 md:px-10 overflow-y-auto hud-scrollbar bg-black/85 backdrop-blur-md">
        
        {/* Readings HUD Card */}
        <div className="flex flex-col gap-6 flex-grow">
          <div>
            <h1 className="font-mono text-xs text-[var(--text-dim)] tracking-[0.25em] uppercase mb-1">
              METEOROLOGICAL DIAGNOSTIC //
            </h1>
            <h2 className="font-serif text-2xl tracking-wider text-[var(--text-primary)] uppercase">
              ATMOSPHERIC READINGS
            </h2>
          </div>

          {/* Instrument breakdown */}
          <AtmosphericReadings breakdown={breakdown} />

          <div className="h-[1px] bg-[var(--hud-border)] w-full" />

          {/* Comparison charts */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[9px] text-[var(--text-dim)] uppercase tracking-widest">
              VOLUMETRIC BENCHMARKS (TCO₂E/YR)
            </span>
            <ComparisonBars total={breakdown.total} accentColor={accentColor} />
          </div>

          <div className="h-[1px] bg-[var(--hud-border)] w-full" />

          {/* Carbon Equivalents Slider */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[9px] text-[var(--text-dim)] uppercase tracking-widest">
              CARBON EMISSION EQUIVALENCE READOUTS
            </span>
            <CarbonEquivalents total={breakdown.total} />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 mt-4">
            <Link
              href="/oracle"
              className="w-full py-3 border border-[var(--accent)] text-[var(--accent)] font-mono text-[10px] tracking-[0.2em] uppercase rounded-sm flex items-center justify-center gap-2 hover:bg-[var(--accent)] hover:text-black transition-all duration-300 focus-visible-ring"
              style={{
                boxShadow: `0 0 15px ${accentColor}15`,
              }}
              aria-label="Consult the Atmospherist AI Coach"
            >
              <Terminal className="w-3.5 h-3.5" />
              CONSULT THE ATMOSPHERIST →
            </Link>

            <Link
              href="/simulate"
              className="w-full py-3 border border-[var(--hud-border)] text-[var(--text-primary)] font-mono text-[10px] tracking-[0.2em] uppercase rounded-sm flex items-center justify-center hover:border-[var(--text-primary)] transition-all duration-300 focus-visible-ring"
              aria-label="Simulate changes to your carbon footprint"
            >
              SIMULATE BEHAVIORAL SHIFTS →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
