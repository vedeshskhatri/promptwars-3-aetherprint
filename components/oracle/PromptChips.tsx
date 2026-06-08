'use client'

import React from 'react'

interface PromptChipsProps {
  onSelect: (prompt: string) => void
  disabled?: boolean
}

const prompts = [
  'What is my largest atmospheric contribution?',
  'Give me 3 specific actions for this month',
  'How does my signature compare globally?',
  'What would my print look like in 5 years?',
  'Design me a 30-day reduction protocol',
]

/**
 * Renders a set of suggested question chips for the Oracle chat interface.
 * Clicking a chip sends the suggestion directly to the AI.
 * Wrapped with React.memo since the chips never change content.
 */
export const PromptChips: React.FC<PromptChipsProps> = React.memo(({ onSelect, disabled = false }) => {
  return (
    <div
      className="flex flex-wrap gap-2 mb-4 font-mono select-none"
      role="group"
      aria-label="Suggested questions"
    >
      {prompts.map((p, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(p)}
          disabled={disabled}
          aria-label={`Send question: ${p}`}
          className={`text-[9px] tracking-wider uppercase border border-[var(--hud-border)] rounded-full px-3 py-1.5 transition-all duration-300 focus-visible-ring text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] ${
            disabled ? 'opacity-40 cursor-not-allowed border-[var(--hud-border)] hover:text-[var(--text-primary)]' : ''
          }`}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.01)',
          }}
        >
          {p}
        </button>
      ))}
    </div>
  )
})
PromptChips.displayName = 'PromptChips'
export default PromptChips
