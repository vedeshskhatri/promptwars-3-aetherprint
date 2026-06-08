'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AetherCanvas } from '../../components/nebula/AetherCanvas'
import { WizardShell } from '../../components/wizard/WizardShell'
import { TransitStep } from '../../components/wizard/steps/TransitStep'
import { EnergyStep } from '../../components/wizard/steps/EnergyStep'
import { SustenanceStep } from '../../components/wizard/steps/SustenanceStep'
import { ConsumptionStep } from '../../components/wizard/steps/ConsumptionStep'
import { AtmosphereStep } from '../../components/wizard/steps/AtmosphereStep'
import { EmissionInputs } from '../../types'
import { calculateCarbonBreakdown, getNebulaColor } from '../../lib/carbon-calculator'

// Realistic default inputs to give the initial nebula a beautiful shape
const initialInputs: EmissionInputs = {
  transport: {
    carKmPerWeek: 120,
    carFuelType: 'petrol',
    publicTransitHoursPerWeek: 5,
    motorbikeKmPerWeek: 0,
  },
  energy: {
    monthlyElectricityKwh: 250,
    renewableOffsetPercent: 20,
    cookingFuel: 'lpg',
  },
  diet: {
    dietType: 'omnivore',
    foodWasteLevel: 'medium',
    foodSourcePreference: 'local',
  },
  consumption: {
    monthlyClothingSpendInr: 4000,
    electronicsPurchasedPerYear: 1,
    onlineDeliveriesPerWeek: 3,
  },
  flights: {
    shortHaulFlightsPerYear: 2,
    longHaulFlightsPerYear: 0,
    flightClass: 'economy',
  },
}

export default function MapPage() {
  const router = useRouter()
  const [inputs, setInputs] = useState<EmissionInputs>(initialInputs)
  const [activeStep, setActiveStep] = useState(0)
  const [isRevealing, setIsRevealing] = useState(false)

  // Memoized derived state — only recalculates when inputs change
  const breakdown = useMemo(() => calculateCarbonBreakdown(inputs), [inputs])
  const accentColor = useMemo(() => getNebulaColor(breakdown.total), [breakdown.total])

  const updateTransport = useCallback((data: Partial<EmissionInputs['transport']>) => {
    setInputs((prev) => ({
      ...prev,
      transport: { ...prev.transport, ...data },
    }))
  }, [])

  const updateEnergy = useCallback((data: Partial<EmissionInputs['energy']>) => {
    setInputs((prev) => ({
      ...prev,
      energy: { ...prev.energy, ...data },
    }))
  }, [])

  const updateDiet = useCallback((data: Partial<EmissionInputs['diet']>) => {
    setInputs((prev) => ({
      ...prev,
      diet: { ...prev.diet, ...data },
    }))
  }, [])

  const updateConsumption = useCallback((data: Partial<EmissionInputs['consumption']>) => {
    setInputs((prev) => ({
      ...prev,
      consumption: { ...prev.consumption, ...data },
    }))
  }, [])

  const updateFlights = useCallback((data: Partial<EmissionInputs['flights']>) => {
    setInputs((prev) => ({
      ...prev,
      flights: { ...prev.flights, ...data },
    }))
  }, [])



  const handleComplete = () => {
    setIsRevealing(true)
    
    // Save to localStorage so /print can load it deterministically
    localStorage.setItem('aetherprint_inputs', JSON.stringify(inputs))
    localStorage.setItem('aetherprint_breakdown', JSON.stringify(breakdown))

    // Wait for nebula to morph completely, then redirect
    setTimeout(() => {
      router.push('/print')
    }, 1500)
  }

  return (
    <div
      className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden"
      style={{ '--accent': accentColor } as React.CSSProperties}
    >
      {/* Visually hidden h1 for screen reader heading hierarchy */}
      <h1 className="sr-only">AETHERPRINT Atmospheric Calibrator</h1>
      {/* Background Nebula */}
      <div className="absolute inset-0 z-0">
        <AetherCanvas 
          carbonData={isRevealing ? { ...breakdown, total: breakdown.total * 1.5 } : breakdown} 
          interactive={!isRevealing} 
          size="full" 
        />
      </div>

      {/* Floating HUD Wizard Panel */}
      {!isRevealing ? (
        <WizardShell
          breakdown={breakdown}
          accentColor={accentColor}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          onStepChange={() => {}}
          onComplete={handleComplete}
        >
          {activeStep === 0 && <TransitStep data={inputs.transport} onChange={updateTransport} />}
          {activeStep === 1 && <EnergyStep data={inputs.energy} onChange={updateEnergy} />}
          {activeStep === 2 && <SustenanceStep data={inputs.diet} onChange={updateDiet} />}
          {activeStep === 3 && <ConsumptionStep data={inputs.consumption} onChange={updateConsumption} />}
          {activeStep === 4 && <AtmosphereStep data={inputs.flights} onChange={updateFlights} />}
        </WizardShell>
      ) : (
        <div className="relative z-10 text-center font-mono">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="text-[10px] tracking-[0.4em] text-[var(--accent)] animate-pulse">
              ANALYZING ATMOSPHERIC PARTICLES //
            </div>
            <h2 className="text-xl text-[var(--text-primary)] uppercase tracking-[0.2em] font-serif">
              GENERATING SIGNATURE
            </h2>
          </motion.div>
        </div>
      )}
    </div>
  )
}
