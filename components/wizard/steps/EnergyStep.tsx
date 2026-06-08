'use client'

import React from 'react'
import { EnergyInputs } from '../../../types'

interface EnergyStepProps {
  data: EnergyInputs
  onChange: (data: Partial<EnergyInputs>) => void
}

export const EnergyStep: React.FC<EnergyStepProps> = ({ data, onChange }) => {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="font-mono text-xs text-[var(--accent)] tracking-widest uppercase mb-1">
          Energy Layer / 02
        </h3>
        <p className="text-[11px] text-[var(--text-dim)] uppercase tracking-wider font-mono">
          MEASURE HOUSEHOLD UTILITY LOAD AND EMISSION DISSIPATION
        </p>
      </div>

      {/* Monthly Electricity */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label htmlFor="monthlyElectricityKwh" className="font-mono text-[10px] text-[var(--text-primary)] tracking-widest uppercase">
            Monthly Grid Consumption
          </label>
          <span className="font-mono text-[10px] text-[var(--accent)]">{data.monthlyElectricityKwh} KWH/MONTH</span>
        </div>
        <input
          id="monthlyElectricityKwh"
          type="range"
          min="0"
          max="1500"
          step="10"
          value={data.monthlyElectricityKwh}
          onChange={(e) => onChange({ monthlyElectricityKwh: Number(e.target.value) })}
          className="w-full h-1 bg-[var(--hud-border)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)] slider focus-visible-ring"
        />
        <p className="font-mono text-[8px] text-[var(--text-dim)] uppercase">
          India grid carbon density: 0.82 kgCO₂/kWh
        </p>
      </div>

      {/* Renewable Energy Offset */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label htmlFor="renewableOffsetPercent" className="font-mono text-[10px] text-[var(--text-primary)] tracking-widest uppercase">
            Renewable Source Offset
          </label>
          <span className="font-mono text-[10px] text-[var(--accent)]">{data.renewableOffsetPercent}% OFFSET</span>
        </div>
        <input
          id="renewableOffsetPercent"
          type="range"
          min="0"
          max="100"
          step="5"
          value={data.renewableOffsetPercent}
          onChange={(e) => onChange({ renewableOffsetPercent: Number(e.target.value) })}
          className="w-full h-1 bg-[var(--hud-border)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)] slider focus-visible-ring"
        />
      </div>

      {/* Cooking Fuel */}
      <div className="flex flex-col gap-2">
        <label htmlFor="cookingFuel" className="font-mono text-[10px] text-[var(--text-primary)] tracking-widest uppercase">
          Thermal Cooking Source
        </label>
        <select
          id="cookingFuel"
          value={data.cookingFuel}
          onChange={(e) =>
            onChange({
              cookingFuel: e.target.value as EnergyInputs['cookingFuel'],
            })
          }
          className="w-full bg-[var(--void)] border border-[var(--hud-border)] rounded-sm p-2.5 text-xs text-[var(--text-primary)] focus-visible-ring uppercase font-mono"
        >
          <option value="lpg">Liquefied Petroleum Gas (LPG cylinder)</option>
          <option value="electric">Standard Electric Coil</option>
          <option value="induction">High-Efficiency Induction</option>
          <option value="biogas">Biogas (Waste-to-Energy)</option>
        </select>
      </div>
    </div>
  )
}
