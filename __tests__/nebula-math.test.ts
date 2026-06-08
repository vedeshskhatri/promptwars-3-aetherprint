import {
  randomInSphere,
  rotate3D,
  project3D,
  lerp,
  getLobeCenter,
} from '../lib/nebula-math'

describe('Nebula Math Utility Tests', () => {
  // 1. randomInSphere — point lies within sphere radius
  test('randomInSphere returns a point within the specified radius', () => {
    const cx = 0
    const cy = 0
    const cz = 0
    const radius = 100

    // Run multiple times to account for randomness
    for (let i = 0; i < 20; i++) {
      const point = randomInSphere(cx, cy, cz, radius)
      const dist = Math.sqrt(point.x ** 2 + point.y ** 2 + point.z ** 2)
      expect(dist).toBeLessThanOrEqual(radius)
    }
  })

  // 2. randomInSphere — respects center offset
  test('randomInSphere respects center coordinates', () => {
    const cx = 50
    const cy = 100
    const cz = -30
    const radius = 20

    for (let i = 0; i < 10; i++) {
      const point = randomInSphere(cx, cy, cz, radius)
      const dist = Math.sqrt(
        (point.x - cx) ** 2 + (point.y - cy) ** 2 + (point.z - cz) ** 2
      )
      expect(dist).toBeLessThanOrEqual(radius)
    }
  })

  // 3. rotate3D — zero rotation returns same coordinates
  test('rotate3D with zero angles returns the original point', () => {
    const point = { x: 5, y: 3, z: -2 }
    const rotated = rotate3D(point, 0, 0)
    expect(rotated.x).toBeCloseTo(5, 5)
    expect(rotated.y).toBeCloseTo(3, 5)
    expect(rotated.z).toBeCloseTo(-2, 5)
  })

  // 4. rotate3D — 360 degree rotation returns to original
  test('rotate3D with full 2π rotation returns approximately original point', () => {
    const point = { x: 3, y: 4, z: 5 }
    const rotated = rotate3D(point, Math.PI * 2, Math.PI * 2)
    expect(rotated.x).toBeCloseTo(point.x, 4)
    expect(rotated.y).toBeCloseTo(point.y, 4)
    expect(rotated.z).toBeCloseTo(point.z, 4)
  })

  // 5. rotate3D — 90 degree Y rotation: x becomes z, z becomes -x
  test('rotate3D 90° Y-axis rotation maps x to z correctly', () => {
    const point = { x: 1, y: 0, z: 0 }
    const rotated = rotate3D(point, 0, Math.PI / 2)
    // After 90° Y rotation: x=0, y=0, z=1
    expect(rotated.x).toBeCloseTo(0, 5)
    expect(rotated.y).toBeCloseTo(0, 5)
    expect(rotated.z).toBeCloseTo(1, 5)
  })

  // 6. project3D — returns null for point behind camera
  test('project3D returns null when point is behind camera', () => {
    const focalLength = 300
    // z = -focalLength + 5 means zPerspective = 5, which is less than 10
    const point = { x: 0, y: 0, z: -focalLength + 5 }
    const result = project3D(point, 800, 600, focalLength)
    expect(result).toBeNull()
  })

  // 7. project3D — center point projects to viewport center
  test('project3D projects origin to viewport center', () => {
    const width = 800
    const height = 600
    const focalLength = 300
    // At z=0, perspective = focalLength/focalLength = 1, so x2d = width/2 + 0*1 = 400
    const point = { x: 0, y: 0, z: 0 }
    const result = project3D(point, width, height, focalLength)
    expect(result).not.toBeNull()
    expect(result!.x2d).toBeCloseTo(width / 2, 5)
    expect(result!.y2d).toBeCloseTo(height / 2, 5)
    expect(result!.scale).toBeCloseTo(1, 5)
  })

  // 8. project3D — closer point is larger (scale > 1)
  test('project3D returns scale > 1 for points closer than focalLength', () => {
    const result = project3D({ x: 0, y: 0, z: -100 }, 800, 600, 300)
    expect(result).not.toBeNull()
    expect(result!.scale).toBeGreaterThan(1)
  })

  // 9. lerp — basic interpolation
  test('lerp(0, 10, 0) = 0', () => {
    expect(lerp(0, 10, 0)).toBe(0)
  })

  test('lerp(0, 10, 1) = 10', () => {
    expect(lerp(0, 10, 1)).toBe(10)
  })

  test('lerp(0, 10, 0.5) = 5', () => {
    expect(lerp(0, 10, 0.5)).toBe(5)
  })

  test('lerp is linear — midpoint matches expectation', () => {
    expect(lerp(2, 8, 0.25)).toBeCloseTo(3.5, 5)
    expect(lerp(2, 8, 0.75)).toBeCloseTo(6.5, 5)
  })

  // 10. getLobeCenter — all categories return correct offsets
  test('getLobeCenter returns correct 3D offset for transport (right)', () => {
    const center = getLobeCenter('transport', 100)
    expect(center.x).toBeGreaterThan(0) // Right = positive X
    expect(center.y).toBe(0)
    expect(center.z).toBe(0)
  })

  test('getLobeCenter returns correct 3D offset for energy (top/negative Y)', () => {
    const center = getLobeCenter('energy', 100)
    expect(center.x).toBe(0)
    expect(center.y).toBeLessThan(0) // Top = negative Y in 2D projection
    expect(center.z).toBe(0)
  })

  test('getLobeCenter returns correct 3D offset for diet (left)', () => {
    const center = getLobeCenter('diet', 100)
    expect(center.x).toBeLessThan(0) // Left = negative X
    expect(center.y).toBe(0)
    expect(center.z).toBe(0)
  })

  test('getLobeCenter returns correct 3D offset for consumption (bottom)', () => {
    const center = getLobeCenter('consumption', 100)
    expect(center.x).toBe(0)
    expect(center.y).toBeGreaterThan(0) // Bottom = positive Y
    expect(center.z).toBe(0)
  })

  test('getLobeCenter returns correct 3D offset for flights (front/positive Z)', () => {
    const center = getLobeCenter('flights', 100)
    expect(center.x).toBe(0)
    expect(center.y).toBe(0)
    expect(center.z).toBeGreaterThan(0) // Front = positive Z
  })

  test('getLobeCenter returns center (0,0,0) for unknown category', () => {
    const center = getLobeCenter('unknown', 100)
    expect(center).toEqual({ x: 0, y: 0, z: 0 })
  })

  // 11. getLobeCenter — offset scales with radius
  test('getLobeCenter offset is proportional to radius', () => {
    const small = getLobeCenter('transport', 50)
    const large = getLobeCenter('transport', 200)
    // Large radius should produce a larger offset
    expect(Math.abs(large.x)).toBeGreaterThan(Math.abs(small.x))
  })
})
