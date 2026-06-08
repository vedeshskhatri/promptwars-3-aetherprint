'use client'

import React, { useRef, useEffect } from 'react'
import { CarbonBreakdown } from '../../types'
import { DEFAULT_CARBON_DATA, COLORS } from '../../lib/constants'
import { getNebulaColor } from '../../lib/carbon-calculator'
import { randomInSphere, rotate3D, project3D, lerp, getLobeCenter, Point3D } from '../../lib/nebula-math'

// Helper to lerp hex colors smoothly in canvas
function lerpColor(c1: string, c2: string, amt: number): string {
  const r1 = parseInt(c1.substring(1, 3), 16)
  const g1 = parseInt(c1.substring(3, 5), 16)
  const b1 = parseInt(c1.substring(5, 7), 16)

  const r2 = parseInt(c2.substring(1, 3), 16)
  const g2 = parseInt(c2.substring(3, 5), 16)
  const b2 = parseInt(c2.substring(5, 7), 16)

  const r = Math.round(r1 + amt * (r2 - r1))
  const g = Math.round(g1 + amt * (g2 - g1))
  const b = Math.round(b1 + amt * (b2 - b1))

  const rs = r.toString(16).padStart(2, '0')
  const gs = g.toString(16).padStart(2, '0')
  const bs = b.toString(16).padStart(2, '0')

  return `#${rs}${gs}${bs}`
}

interface AetherCanvasProps {
  carbonData?: CarbonBreakdown | null // null = neutral/landing state
  interactive?: boolean // mouse parallax on/off
  size?: 'full' | 'half' | 'mini'
}

interface Particle {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  targetX: number
  targetY: number
  targetZ: number
  color: string
  size: number
  baseSize: number
  opacity: number
  category: string
}

export const AetherCanvas: React.FC<AetherCanvasProps> = ({
  carbonData,
  interactive = true,
  size = 'full',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  
  // Use a ref to store particles so they persist across renders and carbonData changes
  const particlesRef = useRef<Particle[]>([])
  
  // Keep track of current carbon data and target values
  const currentDataRef = useRef<CarbonBreakdown>(DEFAULT_CARBON_DATA)
  const targetColorRef = useRef<string>(COLORS.nebulaLow)
  const currentColorRef = useRef<string>(COLORS.nebulaLow)

  // Track mouse coordinates for parallax and attraction
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isHovering: false })

  // Initialize or update particles when carbonData changes
  useEffect(() => {
    // Determine data to use
    const activeData: CarbonBreakdown = carbonData
      ? carbonData
      : {
          transport: DEFAULT_CARBON_DATA.transport,
          energy: DEFAULT_CARBON_DATA.energy,
          diet: DEFAULT_CARBON_DATA.diet,
          consumption: DEFAULT_CARBON_DATA.consumption,
          flights: DEFAULT_CARBON_DATA.flights,
          total: DEFAULT_CARBON_DATA.total,
        }

    currentDataRef.current = activeData
    targetColorRef.current = getNebulaColor(activeData.total)

    const total = activeData.total
    // Particle count: 500 base + total * 150, clamped at 4000
    const targetCount = Math.min(4000, Math.max(500, Math.floor(500 + total * 150)))
    const currentParticles = particlesRef.current

    // Set up categories and their relative weights
    const categories: Array<keyof Omit<CarbonBreakdown, 'total'>> = [
      'transport',
      'energy',
      'diet',
      'consumption',
      'flights',
    ]

    // Determine target positions for all particles
    const newParticles: Particle[] = []

    // Base radius of the entire nebula
    const nebulaBaseRadius = 140 + Math.min(100, total * 8)

    for (let i = 0; i < targetCount; i++) {
      // Distribute particles: 20% to central core, 80% split among category lobes
      let category: keyof Omit<CarbonBreakdown, 'total'> | 'core' = 'core'
      if (i > targetCount * 0.2) {
        category = categories[(i - Math.floor(targetCount * 0.2)) % categories.length]
      }

      let lobeCenter: Point3D = { x: 0, y: 0, z: 0 }
      let lobeRadius = nebulaBaseRadius * 0.4

      if (category !== 'core') {
        lobeCenter = getLobeCenter(category, nebulaBaseRadius)
        // Lobe size depends on the emissions of that category
        const val = activeData[category]
        lobeRadius = Math.max(20, Math.min(180, 25 + val * 35))
      } else {
        // Core is smaller and denser
        lobeRadius = nebulaBaseRadius * 0.25
      }

      // Generate a random target position in the designated lobe
      const targetPos = randomInSphere(lobeCenter.x, lobeCenter.y, lobeCenter.z, lobeRadius)

      // Color variation: base color mixed with category indicator or random hue shift
      // Low footprint: teal-focused, High footprint: crimson-focused
      const particleBaseColor = targetColorRef.current

      // Particle size
      const baseSize = Math.random() * 1.8 + 0.6

      // Opacity
      const opacity = Math.random() * 0.6 + 0.25

      // If we already have a particle at this index, keep its current position and transition its target
      if (i < currentParticles.length) {
        const p = currentParticles[i]
        newParticles.push({
          ...p,
          targetX: targetPos.x,
          targetY: targetPos.y,
          targetZ: targetPos.z,
          opacity: opacity,
          baseSize: baseSize,
          color: particleBaseColor,
        })
      } else {
        // Create new particle at a random point, and set its target
        const startPos = randomInSphere(0, 0, 0, nebulaBaseRadius * 1.5)
        newParticles.push({
          x: startPos.x,
          y: startPos.y,
          z: startPos.z,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          vz: (Math.random() - 0.5) * 0.5,
          targetX: targetPos.x,
          targetY: targetPos.y,
          targetZ: targetPos.z,
          color: particleBaseColor,
          size: baseSize,
          baseSize: baseSize,
          opacity: opacity,
          category,
        })
      }
    }

    particlesRef.current = newParticles
  }, [carbonData])

  // Mouse event listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current || !interactive) return
      const rect = canvasRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      // Normalized coordinates from -1 to 1 relative to center
      mouseRef.current.targetX = (x / rect.width) * 2 - 1
      mouseRef.current.targetY = (y / rect.height) * 2 - 1
      mouseRef.current.isHovering = true
    }

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0
      mouseRef.current.targetY = 0
      mouseRef.current.isHovering = false
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [interactive])

  // Core Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    // Set initial size
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Camera parameters
    const focalLength = 350

    const render = () => {
      const width = canvas.width
      const height = canvas.height

      // 1. Clear background - absolute void (#000000)
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, width, height)

      // Interpolate the overall color towards target color
      currentColorRef.current = lerpColor(
        currentColorRef.current,
        targetColorRef.current,
        0.05
      )

      // Smoothly interpolate mouse parallax coordinates
      mouseRef.current.x = lerp(mouseRef.current.x, mouseRef.current.targetX, 0.05)
      mouseRef.current.y = lerp(mouseRef.current.y, mouseRef.current.targetY, 0.05)

      // Base rotation angles
      time += 0.005
      
      // Idle orbital rotation + mouse tilt (max 5 degrees = ~0.08 radians)
      const baseAngleY = time * 0.2 + mouseRef.current.x * 0.08
      const baseAngleX = Math.sin(time * 0.1) * 0.1 + mouseRef.current.y * 0.08

      // Breathing scale amplitude oscillation (sine wave)
      const breathScale = 1.0 + Math.sin(time * 1.5) * 0.04

      // Current particle list
      const particles = particlesRef.current

      // Projection and coordinate update
      const projectedParticles = []

      // Mouse attraction targets (in 3D space after rotation)
      // Map mouse from 2D screen space to estimated 3D attraction center
      const mouse3D = {
        x: mouseRef.current.x * (width / 4),
        y: mouseRef.current.y * (height / 4),
        z: 0,
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // 2. Morph: Lerp current coordinates to target positions
        // Lerp factor of 0.04 creates a smooth 2-3s morphing transition (120 frames)
        p.x = lerp(p.x, p.targetX * breathScale, 0.04)
        p.y = lerp(p.y, p.targetY * breathScale, 0.04)
        p.z = lerp(p.z, p.targetZ * breathScale, 0.04)

        // 3. Turbulent particle velocity (speed scales with total CO2e)
        const speedMultiplier = 0.05 + Math.min(0.5, currentDataRef.current.total * 0.03)
        p.x += Math.sin(p.y * 0.02 + time) * speedMultiplier
        p.y += Math.cos(p.z * 0.02 + time) * speedMultiplier
        p.z += Math.sin(p.x * 0.02 + time) * speedMultiplier

        // 4. Rotate point around X and Y camera axes
        const rotated = rotate3D(p, baseAngleX, baseAngleY)

        // 5. Mouse Interaction: Swirl/Attraction when cursor is hovering
        if (mouseRef.current.isHovering) {
          // Calculate distance in 3D rotated space
          const dx = mouse3D.x - rotated.x
          const dy = mouse3D.y - rotated.y
          const dist2D = Math.sqrt(dx * dx + dy * dy)
          
          if (dist2D < 120) {
            // Stronger pull if closer
            const pull = (1.0 - dist2D / 120) * 0.25
            
            // Add a swirl tangent force
            const angle = Math.atan2(dy, dx) + Math.PI / 2
            rotated.x += Math.cos(angle) * pull * 4.0
            rotated.y += Math.sin(angle) * pull * 4.0
            
            // Pull towards cursor
            rotated.x += Math.cos(angle - Math.PI / 2) * pull * 2.0
            rotated.y += Math.sin(angle - Math.PI / 2) * pull * 2.0
          }
        }

        // 6. Perspective Projection
        const projected = project3D(rotated, width, height, focalLength)

        if (projected) {
          const { x2d, y2d, scale } = projected
          // Particle size is perspective-correct (proportional to 1/z scale)
          p.size = p.baseSize * scale * 1.3
          
          projectedParticles.push({
            x: x2d,
            y: y2d,
            z: rotated.z,
            size: p.size,
            color: p.color,
            opacity: p.opacity * Math.min(1.0, scale),
          })
        }
      }

      // 7. Depth Sort: Sort particles by z (back-to-front)
      projectedParticles.sort((a, b) => b.z - a.z)

      // 8. Render Particles
      for (let i = 0; i < projectedParticles.length; i++) {
        const p = projectedParticles[i]
        
        // Skip drawing if out of bounds to save performance
        if (p.x < -20 || p.x > width + 20 || p.y < -20 || p.y > height + 20) {
          continue
        }

        // Draw soft glow particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, Math.max(0.2, p.size), 0, Math.PI * 2)
        
        // Convert hex current color to rgba
        const r = parseInt(currentColorRef.current.substring(1, 3), 16)
        const g = parseInt(currentColorRef.current.substring(3, 5), 16)
        const b = parseInt(currentColorRef.current.substring(5, 7), 16)
        
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])



  // Determine sizing classes
  let sizeClass = 'w-full h-full'
  if (size === 'half') {
    sizeClass = 'w-full md:w-3/5 h-[40vh] md:h-full'
  } else if (size === 'mini') {
    sizeClass = 'w-full h-[30vh] md:h-[45vh]'
  }

  return (
    <div className={`relative overflow-hidden select-none bg-black ${sizeClass}`}>
      <canvas
        ref={canvasRef}
        className="block w-full h-full cursor-none"
        aria-label="Atmospheric particle visualization representing your carbon footprint"
        role="img"
      />
    </div>
  )
}
