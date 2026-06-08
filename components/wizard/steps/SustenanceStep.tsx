'use client'

import React from 'react'
import { DietInputs } from '../../../types'

interface SustenanceStepProps {
  data: DietInputs
  onChange: (data: Partial<DietInputs>) => void
}

export const SustenanceStep: React.FC<SustenanceStepProps> = ({ data, onChange }) => {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="font-mono text-xs text-[var(--accent)] tracking-widest uppercase mb-1">
          Sustenance Layer / 03
        </h3>
        <p className="text-[11px] text-[var(--text-dim)] uppercase tracking-wider font-mono">
          EVALUATE NUTRITIONAL IMPACT AND WASTE COMPOSITION
        </p>
      </div>

      {/* Diet Type */}
      <div className="flex flex-col gap-2">
        <label htmlFor="dietType" className="font-mono text-[10px] text-[var(--text-primary)] tracking-widest uppercase">
          Dietary Profile
        </label>
        <select
          id="dietType"
          value={data.dietType}
          onChange={(e) =>
            onChange({
              dietType: e.target.value as DietInputs['dietType'],
            })
          }
          className="w-full bg-[var(--void)] border border-[var(--hud-border)] rounded-sm p-2.5 text-xs text-[var(--text-primary)] focus-visible-ring uppercase font-mono"
        >
          <option value="vegan">Vegan (Zero animal products)</option>
          <option value="vegetarian">Vegetarian (Dairy/Egg inclusive)</option>
          <option value="flexitarian">Flexitarian (Minimal meats)</option>
          <option value="omnivore">Omnivore (Standard diet)</option>
          <option value="meat-heavy">Meat-Heavy (Frequent red meat)</option>
        </select>
      </div>

      {/* Food Waste Level */}
      <div className="flex flex-col gap-2">
        <label htmlFor="foodWasteLevel" className="font-mono text-[10px] text-[var(--text-primary)] tracking-widest uppercase">
          Food Waste Proportion
        </label>
        <select
          id="foodWasteLevel"
          value={data.foodWasteLevel}
          onChange={(e) =>
            onChange({
              foodWasteLevel: e.target.value as DietInputs['foodWasteLevel'],
            })
          }
          className="w-full bg-[var(--void)] border border-[var(--hud-border)] rounded-sm p-2.5 text-xs text-[var(--text-primary)] focus-visible-ring uppercase font-mono"
        >
          <option value="none">Zero Waste (All consumed)</option>
          <option value="low">Low Waste (Occasional discards)</option>
          <option value="medium">Medium Waste (Typical household level)</option>
          <option value="high">High Waste (Frequent spoilage/surplus)</option>
        </select>
      </div>

      {/* Food Source Preference */}
      <div className="flex flex-col gap-2">
        <label htmlFor="foodSourcePreference" className="font-mono text-[10px] text-[var(--text-primary)] tracking-widest uppercase">
          Agricultural Supply Source
        </label>
        <select
          id="foodSourcePreference"
          value={data.foodSourcePreference}
          onChange={(e) =>
            onChange({
              foodSourcePreference: e.target.value as DietInputs['foodSourcePreference'],
            })
          }
          className="w-full bg-[var(--void)] border border-[var(--hud-border)] rounded-sm p-2.5 text-xs text-[var(--text-primary)] focus-visible-ring uppercase font-mono"
        >
          <option value="local">Locally Cultivated & Seasonal</option>
          <option value="imported">Globally Sourced & Processed</option>
        </select>
      </div>
    </div>
  )
}
