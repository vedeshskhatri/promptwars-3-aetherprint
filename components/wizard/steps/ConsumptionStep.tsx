'use client'

import React from 'react'
import { ConsumptionInputs } from '../../../types'

interface ConsumptionStepProps {
  data: ConsumptionInputs
  onChange: (data: Partial<ConsumptionInputs>) => void
}

export const ConsumptionStep: React.FC<ConsumptionStepProps> = ({ data, onChange }) => {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="font-mono text-xs text-[var(--accent)] tracking-widest uppercase mb-1">
          Consumption Layer / 04
        </h3>
        <p className="text-[11px] text-[var(--text-dim)] uppercase tracking-wider font-mono">
          MONITOR CONSUMER PURCHASE HABITS AND DISTRIBUTION LOGISTICS
        </p>
      </div>

      {/* Monthly Clothing Spend */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label htmlFor="monthlyClothingSpendInr" className="font-mono text-[10px] text-[var(--text-primary)] tracking-widest uppercase">
            Monthly Apparel Expenditures
          </label>
          <span className="font-mono text-[10px] text-[var(--accent)]">₹{data.monthlyClothingSpendInr} / MONTH</span>
        </div>
        <input
          id="monthlyClothingSpendInr"
          type="range"
          min="0"
          max="25000"
          step="500"
          value={data.monthlyClothingSpendInr}
          onChange={(e) => onChange({ monthlyClothingSpendInr: Number(e.target.value) })}
          className="w-full h-1 bg-[var(--hud-border)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)] slider focus-visible-ring"
        />
        <p className="font-mono text-[8px] text-[var(--text-dim)] uppercase">
          Apparel Factor: 0.008 kgCO₂/₹ spent
        </p>
      </div>

      {/* Electronics purchases per year */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label htmlFor="electronicsPurchasedPerYear" className="font-mono text-[10px] text-[var(--text-primary)] tracking-widest uppercase">
            Annual Personal Hardware Acquisitions
          </label>
          <span className="font-mono text-[10px] text-[var(--accent)]">{data.electronicsPurchasedPerYear} DEVICES/YEAR</span>
        </div>
        <input
          id="electronicsPurchasedPerYear"
          type="range"
          min="0"
          max="10"
          step="1"
          value={data.electronicsPurchasedPerYear}
          onChange={(e) => onChange({ electronicsPurchasedPerYear: Number(e.target.value) })}
          className="w-full h-1 bg-[var(--hud-border)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)] slider focus-visible-ring"
        />
        <p className="font-mono text-[8px] text-[var(--text-dim)] uppercase">
          Averages: 80 kgCO₂ per mobile/laptop device lifecycle
        </p>
      </div>

      {/* Online deliveries per week */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label htmlFor="onlineDeliveriesPerWeek" className="font-mono text-[10px] text-[var(--text-primary)] tracking-widest uppercase">
            Courier Deliveries (e-Commerce & Food)
          </label>
          <span className="font-mono text-[10px] text-[var(--accent)]">{data.onlineDeliveriesPerWeek} SHIPMENTS/WEEK</span>
        </div>
        <input
          id="onlineDeliveriesPerWeek"
          type="range"
          min="0"
          max="15"
          step="1"
          value={data.onlineDeliveriesPerWeek}
          onChange={(e) => onChange({ onlineDeliveriesPerWeek: Number(e.target.value) })}
          className="w-full h-1 bg-[var(--hud-border)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)] slider focus-visible-ring"
        />
        <p className="font-mono text-[8px] text-[var(--text-dim)] uppercase">
          Delivery Factor: 0.5 kgCO₂ per shipment logistics
        </p>
      </div>
    </div>
  )
}
