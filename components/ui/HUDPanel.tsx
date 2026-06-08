'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface HUDPanelProps {
  children: React.ReactNode
  className?: string
  title?: string
  subtitle?: string
  glowColor?: string // CSS variable or hex color
  animate?: boolean
}

export const HUDPanel: React.FC<HUDPanelProps> = ({
  children,
  className = '',
  title,
  subtitle,
  glowColor = 'var(--accent, #00FFCC)',
  animate = true,
}) => {
  const panelContent = (
    <div
      className={`relative rounded border p-6 bg-[var(--hud-glass)] border-[var(--hud-border)] text-[var(--text-primary)] backdrop-blur-md overflow-hidden ${className}`}
      style={{
        boxShadow: `0 0 25px ${glowColor}10`, // 10% opacity glow
      }}
    >
      {/* Decorative sci-fi corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[var(--accent)]" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[var(--accent)]" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[var(--accent)]" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[var(--accent)]" />

      {/* Decorative technical line or badge */}
      {title && (
        <div className="mb-4 border-b border-[var(--hud-border)] pb-2 flex items-center justify-between">
          <div>
            <h2 className="font-mono text-xs tracking-[0.2em] text-[var(--text-primary)] uppercase">
              {title}
            </h2>
            {subtitle && (
              <p className="font-mono text-[9px] text-[var(--text-dim)] uppercase tracking-wider mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <div className="font-mono text-[9px] text-[var(--accent)] animate-pulse">
            SYS.READY //
          </div>
        </div>
      )}

      {children}
    </div>
  )

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {panelContent}
      </motion.div>
    )
  }

  return panelContent
}
