'use client'

import React, { useState, useEffect } from 'react'

export const NebulaCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    // Disable default cursor if on desktop
    const checkCursorSupport = () => {
      // Check if device supports touch
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      if (!isTouch) {
        document.body.style.cursor = 'none'
        setIsVisible(true)
      }
    };

    checkCursorSupport()

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isClickable =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('a') ||
        target.closest('button') ||
        target.getAttribute('role') === 'button' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.classList.contains('slider')
      
      setIsHovered(!!isClickable)
    }

    window.addEventListener('mousemove', updatePosition)
    window.addEventListener('mouseover', handleMouseOver)

    return () => {
      window.removeEventListener('mousemove', updatePosition)
      window.removeEventListener('mouseover', handleMouseOver)
      document.body.style.cursor = 'auto'
    }
  }, [])

  if (!isVisible) return null

  return (
    <div
      className="fixed pointer-events-none z-[9999] transition-transform duration-75 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {/* Outer Glow ring when hovering interactive elements */}
      <div
        className={`absolute rounded-full border border-[var(--accent)] transition-all duration-300 ${
          isHovered ? 'w-8 h-8 opacity-40 scale-100' : 'w-0 h-0 opacity-0 scale-50'
        }`}
        style={{
          borderColor: 'var(--accent)',
          boxShadow: '0 0 8px var(--accent)',
        }}
      />

      {/* Crosshair horizontal line */}
      <div
        className="h-[1px] transition-all duration-200"
        style={{
          backgroundColor: 'var(--accent)',
          boxShadow: '0 0 3px var(--accent)',
          width: isHovered ? '16px' : '10px',
        }}
      />

      {/* Crosshair vertical line */}
      <div
        className="absolute w-[1px] transition-all duration-200"
        style={{
          backgroundColor: 'var(--accent)',
          boxShadow: '0 0 3px var(--accent)',
          height: isHovered ? '16px' : '10px',
        }}
      />
    </div>
  )
}
export default NebulaCursor
