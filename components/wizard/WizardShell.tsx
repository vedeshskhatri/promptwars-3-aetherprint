'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HUDPanel } from '../ui/HUDPanel'
import { CountUp } from '../ui/CountUp'
import { CarbonBreakdown } from '../../types'

interface WizardShellProps {
  breakdown: CarbonBreakdown
  accentColor: string
  activeStep: number
  setActiveStep: (step: number) => void
  onStepChange: (stepIndex: number) => void
  onComplete: () => void
  children: React.ReactNode
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
}

export const WizardShell: React.FC<WizardShellProps> = ({
  breakdown,
  accentColor,
  activeStep,
  setActiveStep,
  onStepChange,
  onComplete,
  children,
}) => {
  const [[, direction], setStepDirection] = useState([0, 0])

  const handleNext = () => {
    if (activeStep < 4) {
      setStepDirection([activeStep + 1, 1])
      setActiveStep(activeStep + 1)
      onStepChange(activeStep + 1)
    } else {
      onComplete()
    }
  }

  const handleBack = () => {
    if (activeStep > 0) {
      setStepDirection([activeStep - 1, -1])
      setActiveStep(activeStep - 1)
      onStepChange(activeStep - 1)
    }
  }

  return (
    <div className="w-full max-w-md relative z-10 px-4">
      {/* Step Indicators */}
      <div className="flex justify-center items-center gap-3 mb-6" aria-label="Wizard progress indicator">
        {[0, 1, 2, 3, 4].map((index) => {
          const isActive = activeStep === index
          const isCompleted = activeStep > index
          return (
            <button
              key={index}
              onClick={() => {
                const dir = index > activeStep ? 1 : -1
                setStepDirection([index, dir])
                setActiveStep(index)
                onStepChange(index)
              }}
              className="relative w-5 h-5 flex items-center justify-center rounded-full focus-visible-ring"
              aria-label={`Go to step ${index + 1}`}
              aria-current={isActive ? 'step' : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="activeWizardRing"
                  className="absolute w-4 h-4 rounded-full border"
                  style={{
                    borderColor: accentColor,
                    boxShadow: `0 0 10px ${accentColor}`,
                  }}
                />
              )}
              <div
                className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: isActive
                    ? accentColor
                    : isCompleted
                    ? 'var(--text-primary)'
                    : 'rgba(255, 255, 255, 0.15)',
                }}
              />
            </button>
          )
        })}
      </div>

      {/* Main Glassmorphic Panel */}
      <HUDPanel
        title="ATMOSPHERIC CALIBRATOR"
        subtitle={`STEP ${activeStep + 1} OF 5 // DATA INPUT`}
        glowColor={accentColor}
        className="w-full relative min-h-[350px] flex flex-col justify-between"
      >
        <div className="flex-grow mb-6 relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              aria-live="polite"
              className="w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Technical readout and buttons */}
        <div className="border-t border-[var(--hud-border)] pt-4 flex flex-col gap-4">
          <div className="flex justify-between items-center text-mono">
            <span className="font-mono text-[9px] text-[var(--text-dim)] uppercase tracking-wider">
              REAL-TIME ATMOSPHERIC ACCUMULATION:
            </span>
            <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
              <CountUp end={breakdown.total} decimals={2} duration={500} />{' '}
              <span className="text-[9px] text-[var(--text-dim)] uppercase tracking-wider">TCO₂E</span>
            </span>
          </div>

          <div className="flex justify-between items-center gap-4">
            <button
              onClick={handleBack}
              disabled={activeStep === 0}
              className={`px-4 py-2 font-mono text-[10px] tracking-widest uppercase rounded-sm border focus-visible-ring transition-all duration-300 ${
                activeStep === 0
                  ? 'border-[rgba(255,255,255,0.05)] text-[var(--text-dim)] opacity-40 cursor-not-allowed'
                  : 'border-[var(--hud-border)] text-[var(--text-primary)] hover:border-[var(--text-primary)]'
              }`}
              aria-label="Previous step"
            >
              &lt; RETURN
            </button>

            <button
              onClick={handleNext}
              className="px-5 py-2 font-mono text-[10px] tracking-widest uppercase rounded-sm border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-black focus-visible-ring transition-all duration-300"
              style={{
                boxShadow: `0 0 10px ${accentColor}25`,
              }}
              aria-label={activeStep === 4 ? 'Reveal my aetherprint' : 'Next step'}
            >
              {activeStep === 4 ? 'REVEAL SIGNATURE →' : 'PROCEED &gt;'}
            </button>
          </div>
        </div>
      </HUDPanel>
    </div>
  )
}
export default WizardShell
