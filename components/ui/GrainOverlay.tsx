'use client'

import React from 'react'

/**
 * Decorative full-screen SVG film grain overlay that adds atmospheric texture.
 * Wrapped with React.memo since it has no props and never needs to re-render.
 */
export const GrainOverlay: React.FC = React.memo(() => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[999] w-full h-full opacity-35 mix-blend-overlay"
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        className="block"
        aria-hidden="true"
        role="presentation"
      >
        <filter id="aetherNoise">
          {/* Base frequency 0.75 creates a fine, microscopic film grain */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
            result="noise"
          />
          {/* Apply color matrix to isolate grain opacity to 3% */}
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.03 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#aetherNoise)" />
      </svg>
    </div>
  )
})
GrainOverlay.displayName = 'GrainOverlay'
export default GrainOverlay
