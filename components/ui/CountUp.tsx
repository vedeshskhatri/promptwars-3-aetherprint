'use client'

import React, { useState, useEffect, useRef } from 'react'

interface CountUpProps {
  end: number
  duration?: number // duration in ms
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}

/**
 * Animated number counter that counts up from zero to a target value.
 * Uses requestAnimationFrame with easing and properly cancels on unmount/update.
 * Wrapped with React.memo to prevent unnecessary re-renders.
 */
export const CountUp: React.FC<CountUpProps> = React.memo(({
  end,
  duration = 1200,
  decimals = 1,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const [count, setCount] = useState(0)
  const countRef = useRef(0)

  useEffect(() => {
    let rafId: number
    let startTimestamp: number | null = null
    const startValue = 0

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)

      // Easing out quadratic: f(t) = t * (2 - t)
      const easeProgress = progress * (2 - progress)
      const currentValue = startValue + easeProgress * (end - startValue)

      countRef.current = currentValue
      setCount(currentValue)

      if (progress < 1) {
        rafId = window.requestAnimationFrame(step)
      } else {
        setCount(end)
      }
    }

    rafId = window.requestAnimationFrame(step)

    // Cancel animation on unmount or when end/duration changes
    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [end, duration])

  return (
    <span className={`font-mono ${className}`}>
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  )
})
CountUp.displayName = 'CountUp'
export default CountUp
