'use client'

import React, { useRef, useEffect, useCallback } from 'react'

/**
 * Custom crosshair cursor that replaces the default browser cursor on desktop devices.
 * Uses direct DOM manipulation via refs to avoid React re-renders on every mouse move,
 * which would otherwise cause 60+ re-renders per second.
 */
export const NebulaCursor: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)
  const hRef = useRef<HTMLDivElement | null>(null)
  const vRef = useRef<HTMLDivElement | null>(null)
  const posRef = useRef({ x: -100, y: -100 })
  const rafRef = useRef<number>(0)
  const isVisibleRef = useRef(false)

  const flush = useCallback(() => {
    rafRef.current = 0
    if (!containerRef.current) return
    containerRef.current.style.left = `${posRef.current.x}px`
    containerRef.current.style.top = `${posRef.current.y}px`
  }, [])

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouch) return

    document.body.style.cursor = 'none'
    isVisibleRef.current = true
    if (containerRef.current) {
      containerRef.current.style.display = 'flex'
    }

    const updatePosition = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY }
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(flush)
      }
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

      // Directly mutate class lists to avoid re-renders
      if (ringRef.current) {
        if (isClickable) {
          ringRef.current.className = 'absolute rounded-full border border-[var(--accent)] transition-all duration-300 w-8 h-8 opacity-40 scale-100'
        } else {
          ringRef.current.className = 'absolute rounded-full border border-[var(--accent)] transition-all duration-300 w-0 h-0 opacity-0 scale-50'
        }
      }
      if (hRef.current) {
        hRef.current.style.width = isClickable ? '16px' : '10px'
      }
      if (vRef.current) {
        vRef.current.style.height = isClickable ? '16px' : '10px'
      }
    }

    window.addEventListener('mousemove', updatePosition, { passive: true })
    window.addEventListener('mouseover', handleMouseOver, { passive: true })

    return () => {
      window.removeEventListener('mousemove', updatePosition)
      window.removeEventListener('mouseover', handleMouseOver)
      document.body.style.cursor = 'auto'
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [flush])

  return (
    <div
      ref={containerRef}
      className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 items-center justify-center hidden"
      style={{ left: '-100px', top: '-100px' }}
      aria-hidden="true"
    >
      {/* Outer Glow ring when hovering interactive elements */}
      <div
        ref={ringRef}
        className="absolute rounded-full border border-[var(--accent)] transition-all duration-300 w-0 h-0 opacity-0 scale-50"
        style={{ borderColor: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }}
      />

      {/* Crosshair horizontal line */}
      <div
        ref={hRef}
        className="h-[1px] transition-all duration-200"
        style={{
          backgroundColor: 'var(--accent)',
          boxShadow: '0 0 3px var(--accent)',
          width: '10px',
        }}
      />

      {/* Crosshair vertical line */}
      <div
        ref={vRef}
        className="absolute w-[1px] transition-all duration-200"
        style={{
          backgroundColor: 'var(--accent)',
          boxShadow: '0 0 3px var(--accent)',
          height: '10px',
        }}
      />
    </div>
  )
}
export default NebulaCursor
