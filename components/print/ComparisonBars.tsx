'use client'

import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
} from 'recharts'

interface ComparisonBarsProps {
  total: number
  accentColor: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    payload?: {
      name: string
    }
  }>
}

// Recharts custom tooltip styled as a technical HUD readout
const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--void)] border border-[var(--hud-border)] p-2 rounded-sm font-mono text-[9px] text-[var(--text-primary)]">
        <p className="font-bold">{payload[0].payload?.name}</p>
        <p className="text-[var(--accent)] mt-0.5">
          {Number(payload[0].value).toFixed(2)} tCO₂e / yr
        </p>
      </div>
    )
  }
  return null
}

export const ComparisonBars: React.FC<ComparisonBarsProps> = ({ total, accentColor }) => {
  const data = [
    {
      name: 'YOUR SIGNATURE',
      value: total,
      color: accentColor,
    },
    {
      name: 'PARIS TARGET',
      value: 2.0,
      color: '#00FFCC', // Low color
    },
    {
      name: 'INDIA AVERAGE',
      value: 1.9,
      color: '#555555',
    },
    {
      name: 'GLOBAL AVERAGE',
      value: 4.7,
      color: '#888888',
    },
  ]

  return (
    <div className="w-full h-44 select-none font-mono" aria-label="Carbon comparison chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 15, left: -15, bottom: 5 }}
        >
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(240, 237, 232, 0.4)', fontSize: 8, fontFamily: 'var(--font-dm-mono)' }}
            domain={[0, Math.max(6.0, total + 1.0)]}
          />
          <YAxis
            dataKey="name"
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(240, 237, 232, 0.7)', fontSize: 7, fontFamily: 'var(--font-dm-mono)' }}
            width={90}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
          <Bar dataKey="value" barSize={8} radius={[0, 2, 2, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
export default ComparisonBars
