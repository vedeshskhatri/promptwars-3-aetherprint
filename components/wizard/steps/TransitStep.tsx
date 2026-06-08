'use client'

import React from 'react'
import { TransportInputs } from '../../../types'

interface TransitStepProps {
  data: TransportInputs
  onChange: (data: Partial<TransportInputs>) => void
}

export const TransitStep: React.FC<TransitStepProps> = ({ data, onChange }) => {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="font-mono text-xs text-[var(--accent)] tracking-widest uppercase mb-1">
          Transit Layer / 01
        </h3>
        <p className="text-[11px] text-[var(--text-dim)] uppercase tracking-wider font-mono">
          MAP YOUR LOCOMOTION AND PHYSICAL KINETICS
        </p>
      </div>

      {/* Car Fuel Type */}
      <div className="flex flex-col gap-2">
        <label htmlFor="carFuelType" className="font-mono text-[10px] text-[var(--text-primary)] tracking-widest uppercase">
          Car Propulsion System
        </label>
        <select
          id="carFuelType"
          value={data.carFuelType}
          onChange={(e) =>
            onChange({
              carFuelType: e.target.value as TransportInputs['carFuelType'],
              // Reset km if fuel type is none
              carKmPerWeek: e.target.value === 'none' ? 0 : data.carKmPerWeek,
            })
          }
          className="w-full bg-[var(--void)] border border-[var(--hud-border)] rounded-sm p-2.5 text-xs text-[var(--text-primary)] focus-visible-ring uppercase font-mono"
        >
          <option value="none">No Private Automobile</option>
          <option value="petrol">Internal Combustion (Petrol)</option>
          <option value="diesel">Internal Combustion (Diesel)</option>
          <option value="electric">Electric Vehicle (EV)</option>
        </select>
      </div>

      {/* Car Distance (Only show if fuel type is not none) */}
      {data.carFuelType !== 'none' && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label htmlFor="carKmPerWeek" className="font-mono text-[10px] text-[var(--text-primary)] tracking-widest uppercase">
              Car Distance Travelled
            </label>
            <span className="font-mono text-[10px] text-[var(--accent)]">{data.carKmPerWeek} KM/WEEK</span>
          </div>
          <input
            id="carKmPerWeek"
            type="range"
            min="0"
            max="1000"
            step="10"
            value={data.carKmPerWeek}
            onChange={(e) => onChange({ carKmPerWeek: Number(e.target.value) })}
            className="w-full h-1 bg-[var(--hud-border)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)] slider focus-visible-ring"
          />
        </div>
      )}

      {/* Motorbike Distance */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label htmlFor="motorbikeKmPerWeek" className="font-mono text-[10px] text-[var(--text-primary)] tracking-widest uppercase">
            Two-Wheeler Mileage
          </label>
          <span className="font-mono text-[10px] text-[var(--accent)]">{data.motorbikeKmPerWeek} KM/WEEK</span>
        </div>
        <input
          id="motorbikeKmPerWeek"
          type="range"
          min="0"
          max="500"
          step="5"
          value={data.motorbikeKmPerWeek}
          onChange={(e) => onChange({ motorbikeKmPerWeek: Number(e.target.value) })}
          className="w-full h-1 bg-[var(--hud-border)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)] slider focus-visible-ring"
        />
      </div>

      {/* Public Transit Hours */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label htmlFor="publicTransitHoursPerWeek" className="font-mono text-[10px] text-[var(--text-primary)] tracking-widest uppercase">
            Public Transit (Bus, Rail, Metro)
          </label>
          <span className="font-mono text-[10px] text-[var(--accent)]">{data.publicTransitHoursPerWeek} HOURS/WEEK</span>
        </div>
        <input
          id="publicTransitHoursPerWeek"
          type="range"
          min="0"
          max="40"
          step="1"
          value={data.publicTransitHoursPerWeek}
          onChange={(e) => onChange({ publicTransitHoursPerWeek: Number(e.target.value) })}
          className="w-full h-1 bg-[var(--hud-border)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)] slider focus-visible-ring"
        />
      </div>
    </div>
  )
}
