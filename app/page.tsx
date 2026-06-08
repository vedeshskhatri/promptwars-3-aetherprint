'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { AetherCanvas } from '../components/nebula/AetherCanvas'
import { CarbonBreakdown } from '../types'

export default function LandingPage() {
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Map the custom state when transitioning.
  // Setting all values to 0 naturally collapses all particle targets to the center (implosion).
  const carbonData: CarbonBreakdown | null = isTransitioning
    ? {
        transport: 0,
        energy: 0,
        diet: 0,
        consumption: 0,
        flights: 0,
        total: 0,
      }
    : null // Default/neutral state

  const handleBegin = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      router.push('/map')
    }, 1200) // Wait for text fade out and particle collapse
  }

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
      {/* Background Nebula Canvas */}
      <div className="absolute inset-0 z-0">
        <AetherCanvas carbonData={carbonData} interactive={!isTransitioning} size="full" />
      </div>

      {/* Floating HUD UI Content */}
      <AnimatePresence>
        {!isTransitioning && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 text-center max-w-2xl px-6 flex flex-col items-center gap-6"
          >
            {/* Top technical coordinates */}
            <div className="font-mono text-[9px] text-[var(--accent)] tracking-[0.4em] uppercase opacity-75">
              ORBITAL RECORD // CO2EATMOSPHERE_SIG
            </div>

            {/* Giant display title */}
            <h1 className="font-serif text-5xl md:text-8xl tracking-[0.25em] text-[var(--text-primary)] leading-none select-none">
              AETHERPRINT
            </h1>

            {/* Subline */}
            <p className="text-sm md:text-base font-sans text-[var(--text-dim)] tracking-wider max-w-md leading-relaxed">
              Every breath of atmosphere carries your signature. Discover your invisible mark on the sky.
            </p>

            {/* Minimalist CTA Button */}
            <button
              onClick={handleBegin}
              className="mt-6 px-8 py-3.5 border border-[var(--accent)] text-[var(--accent)] font-mono text-[11px] tracking-[0.3em] uppercase hover:bg-[var(--accent)] hover:text-black transition-all duration-500 rounded-sm focus-visible-ring"
              style={{
                boxShadow: '0 0 15px rgba(0, 255, 204, 0.1)',
              }}
              aria-label="Begin carbon emission mapping"
            >
              BEGIN MAPPING
            </button>

            {/* Bottom technical specs */}
            <div className="absolute bottom-[-15vh] font-mono text-[9px] text-[var(--text-dim)] tracking-widest flex gap-8">
              <span>LAT_REF: 20.5937° N</span>
              <span>LON_REF: 78.9629° E</span>
              <span>VER: 2.5_FLASH</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
