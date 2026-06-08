'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AetherCanvas } from '../nebula/AetherCanvas'
import { HUDPanel } from '../ui/HUDPanel'
import { CountUp } from '../ui/CountUp'
import { CarbonBreakdown, EmissionInputs } from '../../types'
import { calculateCarbonBreakdown, getCarbonStatus, getNebulaColor } from '../../lib/carbon-calculator'
import { DEFAULT_CARBON_DATA } from '../../lib/constants'

interface SimulationModifiers {
  switchToEv: boolean
  goVegetarian: boolean
  reduceFlightsPercent: number
  renewableElectricityPercent: number
  cutOnlineDeliveriesPercent: number
}

// Convert flat breakdown back to a mock EmissionInputs block if none exists in storage
const getMockInputsFromBreakdown = (b: CarbonBreakdown): EmissionInputs => {
  return {
    transport: {
      carKmPerWeek: b.transport > 0.5 ? 120 : 0,
      carFuelType: b.transport > 0.5 ? 'petrol' : 'none',
      publicTransitHoursPerWeek: b.transport > 0.8 ? 5 : 0,
      motorbikeKmPerWeek: 0,
    },
    energy: {
      monthlyElectricityKwh: b.energy > 0.5 ? 250 : 0,
      renewableOffsetPercent: 0,
      cookingFuel: 'lpg',
    },
    diet: {
      dietType: b.diet > 3.0 ? 'meat-heavy' : b.diet > 2.0 ? 'omnivore' : b.diet > 1.6 ? 'vegetarian' : 'vegan',
      foodWasteLevel: 'medium',
      foodSourcePreference: 'local',
    },
    consumption: {
      monthlyClothingSpendInr: b.consumption > 0.3 ? 3000 : 0,
      electronicsPurchasedPerYear: 1,
      onlineDeliveriesPerWeek: b.consumption > 0.4 ? 3 : 0,
    },
    flights: {
      shortHaulFlightsPerYear: b.flights > 0.4 ? 2 : 0,
      longHaulFlightsPerYear: 0,
      flightClass: 'economy',
    },
  }
}

export const MorphingLab: React.FC = () => {
  const [originalInputs, setOriginalInputs] = useState<EmissionInputs | null>(null)
  const [originalBreakdown, setOriginalBreakdown] = useState<CarbonBreakdown | null>(null)

  // Modifiers state
  const [modifiers, setModifiers] = useState<SimulationModifiers>({
    switchToEv: false,
    goVegetarian: false,
    reduceFlightsPercent: 0,
    renewableElectricityPercent: 0,
    cutOnlineDeliveriesPercent: 0,
  })

  useEffect(() => {
    const storedInputs = localStorage.getItem('aetherprint_inputs')
    const storedBreakdown = localStorage.getItem('aetherprint_breakdown')

    let inputsBlock: EmissionInputs
    let breakdownBlock: CarbonBreakdown

    if (storedInputs && storedBreakdown) {
      inputsBlock = JSON.parse(storedInputs) as EmissionInputs
      breakdownBlock = JSON.parse(storedBreakdown) as CarbonBreakdown
    } else {
      breakdownBlock = {
        transport: DEFAULT_CARBON_DATA.transport,
        energy: DEFAULT_CARBON_DATA.energy,
        diet: DEFAULT_CARBON_DATA.diet,
        consumption: DEFAULT_CARBON_DATA.consumption,
        flights: DEFAULT_CARBON_DATA.flights,
        total: DEFAULT_CARBON_DATA.total,
      }
      inputsBlock = getMockInputsFromBreakdown(breakdownBlock)
    }

    setTimeout(() => {
      setOriginalInputs(inputsBlock)
      setOriginalBreakdown(breakdownBlock)
    }, 0)
  }, [])

  // Derive projected state during rendering to avoid synchronous setState inside useEffect
  let projectedBreakdown: CarbonBreakdown | null = null
  let projectedColor = '#00FFCC'

  if (originalInputs && originalBreakdown) {
    const projectedInputs: EmissionInputs = JSON.parse(JSON.stringify(originalInputs))

    if (modifiers.switchToEv && projectedInputs.transport.carFuelType !== 'none') {
      projectedInputs.transport.carFuelType = 'electric'
    }

    if (modifiers.goVegetarian) {
      const currentDiet = projectedInputs.diet.dietType
      if (currentDiet === 'omnivore' || currentDiet === 'meat-heavy' || currentDiet === 'flexitarian') {
        projectedInputs.diet.dietType = 'vegetarian'
      }
    }

    projectedInputs.energy.renewableOffsetPercent = Math.max(
      originalInputs.energy.renewableOffsetPercent,
      modifiers.renewableElectricityPercent
    )

    projectedInputs.flights.shortHaulFlightsPerYear = Math.max(
      0,
      Math.round(
        originalInputs.flights.shortHaulFlightsPerYear * (1 - modifiers.reduceFlightsPercent / 100)
      )
    )
    projectedInputs.flights.longHaulFlightsPerYear = Math.max(
      0,
      Math.round(
        originalInputs.flights.longHaulFlightsPerYear * (1 - modifiers.reduceFlightsPercent / 100)
      )
    )

    projectedInputs.consumption.onlineDeliveriesPerWeek = Math.max(
      0,
      Number(
        (
          originalInputs.consumption.onlineDeliveriesPerWeek *
          (1 - modifiers.cutOnlineDeliveriesPercent / 100)
        ).toFixed(1)
      )
    )

    projectedBreakdown = calculateCarbonBreakdown(projectedInputs)
    projectedColor = getNebulaColor(projectedBreakdown.total)
  }

  if (!originalInputs || !originalBreakdown || !projectedBreakdown) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center font-mono text-xs">
        CALIBRATING SIMULATORS...
      </div>
    )
  }

  const reduction = Math.max(0, originalBreakdown.total - projectedBreakdown.total)
  const reductionPercent = originalBreakdown.total > 0 ? (reduction / originalBreakdown.total) * 100 : 0
  const projectedStatus = getCarbonStatus(projectedBreakdown.total)

  return (
    <div
      className="relative w-full h-full bg-black flex flex-col md:flex-row overflow-hidden"
      style={{
        '--accent': projectedColor,
      } as React.CSSProperties}
    >
      {/* Return link */}
      <Link
        href="/print"
        className="absolute top-8 left-8 z-20 flex items-center gap-2 font-mono text-[9px] tracking-widest text-[var(--text-dim)] hover:text-[var(--text-primary)] transition-colors duration-300 focus-visible-ring"
        aria-label="Return to print results"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        RETURN TO RECORD
      </Link>

      {/* LEFT HALF (60% width) - Dual Nebula visualizer */}
      <div className="w-full md:w-3/5 h-[45vh] md:h-full relative flex flex-col justify-end border-b md:border-b-0 md:border-r border-[var(--hud-border)]">
        {/* Canvases split horizontally */}
        <div className="absolute inset-0 z-0 flex flex-row w-full h-full">
          {/* Left panel: Original Signature */}
          <div className="w-1/2 h-full border-r border-[rgba(255,255,255,0.03)] relative">
            <AetherCanvas carbonData={originalBreakdown} size="full" interactive={false} />
            <div className="absolute bottom-6 left-6 z-10 font-mono text-[9px] text-[var(--text-dim)] uppercase tracking-widest">
              CURRENT SIGNATURE //{' '}
              <span className="text-[var(--text-primary)] font-bold">
                {originalBreakdown.total.toFixed(2)}t
              </span>
            </div>
          </div>

          {/* Right panel: Simulated Signature */}
          <div className="w-1/2 h-full relative">
            <AetherCanvas carbonData={projectedBreakdown} size="full" interactive={false} />
            <div className="absolute bottom-6 left-6 z-10 font-mono text-[9px] text-[var(--accent)] uppercase tracking-widest animate-pulse">
              PROJECTED SIGNATURE //{' '}
              <span className="text-[var(--text-primary)] font-bold">
                {projectedBreakdown.total.toFixed(2)}t
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT HALF (40% width) - Sliders Controller */}
      <div className="w-full md:w-2/5 h-[55vh] md:h-full relative z-10 flex flex-col p-8 md:py-12 md:px-10 overflow-y-auto hud-scrollbar bg-black/85 backdrop-blur-md">
        <div className="flex flex-col gap-6 flex-grow">
          <div>
            <h1 className="font-mono text-xs text-[var(--text-dim)] tracking-[0.25em] uppercase mb-1">
              MORPHING LABORATORY //
            </h1>
            <h2 className="font-serif text-2xl tracking-wider text-[var(--text-primary)] uppercase">
              SIMULATE BEHAVIORAL CHANGES
            </h2>
          </div>

          {/* Technical feedback readout */}
          <HUDPanel
            title="SIMULATED OUTCOME"
            glowColor={projectedColor}
            animate={false}
            className="p-4 flex flex-col gap-2.5 bg-white/[0.01]"
          >
            <div className="flex justify-between items-baseline font-mono">
              <span className="text-[9px] text-[var(--text-dim)] uppercase tracking-widest">
                POTENTIAL EMISSIONS SAVINGS:
              </span>
              <span className="text-sm font-bold text-[var(--accent)]">
                -<CountUp end={reduction} decimals={2} duration={500} /> TCO₂E/YR
              </span>
            </div>
            
            <div className="flex justify-between items-baseline font-mono">
              <span className="text-[9px] text-[var(--text-dim)] uppercase tracking-widest">
                NET DECREASE PERCENTAGE:
              </span>
              <span className="text-sm font-bold text-[var(--accent)]">
                <CountUp end={reductionPercent} decimals={1} duration={500} />%
              </span>
            </div>

            <div className="flex justify-between items-baseline font-mono">
              <span className="text-[9px] text-[var(--text-dim)] uppercase tracking-widest">
                ATMOSPHERIC RANKING:
              </span>
              <span
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{
                  color:
                    projectedStatus === 'low'
                      ? 'var(--nebula-low)'
                      : projectedStatus === 'medium'
                      ? 'var(--nebula-mid)'
                      : 'var(--nebula-high)',
                }}
              >
                {projectedStatus} IMPACT
              </span>
            </div>
          </HUDPanel>

          {/* Modifier Controls */}
          <div className="flex flex-col gap-5 font-mono select-none">
            {/* EV Toggle */}
            {originalInputs.transport.carFuelType !== 'none' &&
              originalInputs.transport.carFuelType !== 'electric' && (
                <div className="flex items-center justify-between border-b border-[var(--hud-border)] pb-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[var(--text-primary)] uppercase tracking-wider">
                      CONVERT TO ELECTRIC PROPULSION
                    </span>
                    <span className="text-[8px] text-[var(--text-dim)] uppercase">
                      Switch fuel type to EV
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setModifiers((prev) => ({ ...prev, switchToEv: !prev.switchToEv }))
                    }
                    className={`px-3 py-1 text-[8px] tracking-widest uppercase border rounded-sm transition-all duration-300 focus-visible-ring ${
                      modifiers.switchToEv
                        ? 'border-[var(--accent)] text-[var(--accent)]'
                        : 'border-[var(--hud-border)] text-[var(--text-dim)] hover:text-[var(--text-primary)]'
                    }`}
                    aria-label="Toggle electric vehicle conversion"
                  >
                    {modifiers.switchToEv ? 'ACTIVE' : 'INACTIVE'}
                  </button>
                </div>
              )}

            {/* Diet Toggle */}
            {originalInputs.diet.dietType !== 'vegan' &&
              originalInputs.diet.dietType !== 'vegetarian' && (
                <div className="flex items-center justify-between border-b border-[var(--hud-border)] pb-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[var(--text-primary)] uppercase tracking-wider">
                      ADOPT VEGETARIAN SUSTENANCE
                    </span>
                    <span className="text-[8px] text-[var(--text-dim)] uppercase">
                      Remove animal carcass from diet
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setModifiers((prev) => ({ ...prev, goVegetarian: !prev.goVegetarian }))
                    }
                    className={`px-3 py-1 text-[8px] tracking-widest uppercase border rounded-sm transition-all duration-300 focus-visible-ring ${
                      modifiers.goVegetarian
                        ? 'border-[var(--accent)] text-[var(--accent)]'
                        : 'border-[var(--hud-border)] text-[var(--text-dim)] hover:text-[var(--text-primary)]'
                    }`}
                    aria-label="Toggle vegetarian diet"
                  >
                    {modifiers.goVegetarian ? 'ACTIVE' : 'INACTIVE'}
                  </button>
                </div>
              )}

            {/* Renewable Electricity Slider */}
            <div className="flex flex-col gap-2 border-b border-[var(--hud-border)] pb-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-[var(--text-primary)] uppercase tracking-wider">
                  SOLAR/WIND ELECTRICITY GRID OFFSET
                </span>
                <span className="text-[10px] text-[var(--accent)]">
                  {modifiers.renewableElectricityPercent}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={modifiers.renewableElectricityPercent}
                onChange={(e) =>
                  setModifiers((prev) => ({
                    ...prev,
                    renewableElectricityPercent: Number(e.target.value),
                  }))
                }
                className="w-full h-1 bg-[var(--hud-border)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)] slider focus-visible-ring"
                aria-label="Increase solar and wind electricity grid offset"
              />
            </div>

            {/* Flights Reduction Slider */}
            {(originalInputs.flights.shortHaulFlightsPerYear > 0 ||
              originalInputs.flights.longHaulFlightsPerYear > 0) && (
              <div className="flex flex-col gap-2 border-b border-[var(--hud-border)] pb-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-[var(--text-primary)] uppercase tracking-wider">
                    REDUCE AIR TRAVEL FREQUENCY
                  </span>
                  <span className="text-[10px] text-[var(--accent)]">
                    -{modifiers.reduceFlightsPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={modifiers.reduceFlightsPercent}
                  onChange={(e) =>
                    setModifiers((prev) => ({
                      ...prev,
                      reduceFlightsPercent: Number(e.target.value),
                    }))
                  }
                  className="w-full h-1 bg-[var(--hud-border)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)] slider focus-visible-ring"
                  aria-label="Reduce flight frequency percentage"
                />
              </div>
            )}

            {/* Online Deliveries Reduction Slider */}
            {originalInputs.consumption.onlineDeliveriesPerWeek > 0 && (
              <div className="flex flex-col gap-2 border-b border-[var(--hud-border)] pb-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-[var(--text-primary)] uppercase tracking-wider">
                    MINIMIZE LOGISTICS COURIERS
                  </span>
                  <span className="text-[10px] text-[var(--accent)]">
                    -{modifiers.cutOnlineDeliveriesPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={modifiers.cutOnlineDeliveriesPercent}
                  onChange={(e) =>
                    setModifiers((prev) => ({
                      ...prev,
                      cutOnlineDeliveriesPercent: Number(e.target.value),
                    }))
                  }
                  className="w-full h-1 bg-[var(--hud-border)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)] slider focus-visible-ring"
                  aria-label="Reduce courier deliveries percentage"
                />
              </div>
            )}
          </div>

          {/* Gemini CTA at bottom */}
          <Link
            href="/oracle"
            className="w-full py-3.5 mt-4 border border-[var(--accent)] text-[var(--accent)] font-mono text-[10px] tracking-[0.2em] uppercase rounded-sm flex items-center justify-center gap-2 hover:bg-[var(--accent)] hover:text-black transition-all duration-300 focus-visible-ring"
            style={{
              boxShadow: `0 0 15px ${projectedColor}20`,
            }}
            aria-label="Consult the Atmospherist on how to achieve these reductions"
          >
            ASK THE ATMOSPHERIST HOW TO ACHIEVE THIS →
          </Link>
        </div>
      </div>
    </div>
  )
}
export default MorphingLab
