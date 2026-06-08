'use client'

import React from 'react'
import { FlightInputs } from '../../../types'

interface AtmosphereStepProps {
  data: FlightInputs
  onChange: (data: Partial<FlightInputs>) => void
}

export const AtmosphereStep: React.FC<AtmosphereStepProps> = ({ data, onChange }) => {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="font-mono text-xs text-[var(--accent)] tracking-widest uppercase mb-1">
          Atmosphere Layer / 05
        </h3>
        <p className="text-[11px] text-[var(--text-dim)] uppercase tracking-wider font-mono">
          DETERMINE AERODYNAMIC FLIGHT PATHS AND ALTITUDE EMISSIONS
        </p>
      </div>

      {/* Short-haul flights per year */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label htmlFor="shortHaulFlightsPerYear" className="font-mono text-[10px] text-[var(--text-primary)] tracking-widest uppercase">
            Short-Haul Flights (&lt; 3 Hours)
          </label>
          <span className="font-mono text-[10px] text-[var(--accent)]">{data.shortHaulFlightsPerYear} FLIGHTS/YEAR</span>
        </div>
        <input
          id="shortHaulFlightsPerYear"
          type="range"
          min="0"
          max="20"
          step="1"
          value={data.shortHaulFlightsPerYear}
          onChange={(e) => onChange({ shortHaulFlightsPerYear: Number(e.target.value) })}
          className="w-full h-1 bg-[var(--hud-border)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)] slider focus-visible-ring"
        />
        <p className="font-mono text-[8px] text-[var(--text-dim)] uppercase">
          Factor: 255 kgCO₂ per flight average
        </p>
      </div>

      {/* Long-haul flights per year */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label htmlFor="longHaulFlightsPerYear" className="font-mono text-[10px] text-[var(--text-primary)] tracking-widest uppercase">
            Long-Haul Flights (&gt; 3 Hours)
          </label>
          <span className="font-mono text-[10px] text-[var(--accent)]">{data.longHaulFlightsPerYear} FLIGHTS/YEAR</span>
        </div>
        <input
          id="longHaulFlightsPerYear"
          type="range"
          min="0"
          max="10"
          step="1"
          value={data.longHaulFlightsPerYear}
          onChange={(e) => onChange({ longHaulFlightsPerYear: Number(e.target.value) })}
          className="w-full h-1 bg-[var(--hud-border)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)] slider focus-visible-ring"
        />
        <p className="font-mono text-[8px] text-[var(--text-dim)] uppercase">
          Factor: 1620 kgCO₂ per flight average
        </p>
      </div>

      {/* Flight Class */}
      <div className="flex flex-col gap-2">
        <label htmlFor="flightClass" className="font-mono text-[10px] text-[var(--text-primary)] tracking-widest uppercase">
          Cabin Seating Configuration
        </label>
        <select
          id="flightClass"
          value={data.flightClass}
          onChange={(e) =>
            onChange({
              flightClass: e.target.value as FlightInputs['flightClass'],
            })
          }
          className="w-full bg-[var(--void)] border border-[var(--hud-border)] rounded-sm p-2.5 text-xs text-[var(--text-primary)] focus-visible-ring uppercase font-mono"
        >
          <option value="economy">Economy Cabin (1.0x factor)</option>
          <option value="business">Business Cabin (2.9x space weight factor)</option>
          <option value="first">First Class Cabin (4.0x space weight factor)</option>
        </select>
      </div>
    </div>
  )
}
