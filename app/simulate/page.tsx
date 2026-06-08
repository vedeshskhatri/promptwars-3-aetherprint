import React from 'react'
import { MorphingLab } from '../../components/simulate/MorphingLab'

export const metadata = {
  title: 'AETHERPRINT — Morphing Lab Simulator',
  description: 'Simulate behavioral changes and watch your atmospheric signature nebula morph in real time.',
}

export default function SimulatePage() {
  return (
    <div className="w-full h-full">
      <MorphingLab />
    </div>
  )
}
