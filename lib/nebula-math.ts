export interface Point3D {
  x: number
  y: number
  z: number
}

/**
 * Generates a random point inside a sphere with a given center and radius.
 */
export function randomInSphere(cx: number, cy: number, cz: number, radius: number): Point3D {
  const u = Math.random()
  const v = Math.random()
  const theta = u * 2.0 * Math.PI
  const phi = Math.acos(2.0 * v - 1.0)
  const r = Math.cbrt(Math.random()) * radius // cubic root distribution for uniform density

  return {
    x: cx + r * Math.sin(phi) * Math.cos(theta),
    y: cy + r * Math.sin(phi) * Math.sin(theta),
    z: cz + r * Math.cos(phi),
  }
}

/**
 * Rotates a 3D point around the Y and X axes.
 */
export function rotate3D(point: Point3D, angleX: number, angleY: number): Point3D {
  // Rotate around Y-axis
  const cosY = Math.cos(angleY)
  const sinY = Math.sin(angleY)
  const x1 = point.x * cosY - point.z * sinY
  const z1 = point.x * sinY + point.z * cosY

  // Rotate around X-axis
  const cosX = Math.cos(angleX)
  const sinX = Math.sin(angleX)
  const y2 = point.y * cosX - z1 * sinX
  const z2 = point.y * sinX + z1 * cosX

  return { x: x1, y: y2, z: z2 }
}

/**
 * Projects a 3D point onto a 2D viewport.
 */
export function project3D(
  point: Point3D,
  width: number,
  height: number,
  focalLength: number,
): { x2d: number; y2d: number; scale: number } | null {
  const zPerspective = point.z + focalLength
  if (zPerspective <= 10) return null // behind camera or too close

  const scale = focalLength / zPerspective
  const x2d = width / 2 + point.x * scale
  const y2d = height / 2 + point.y * scale

  return { x2d, y2d, scale }
}

/**
 * Lerps value from start to end by a step factor.
 */
export function lerp(start: number, end: number, amt: number): number {
  return (1 - amt) * start + amt * end
}

/**
 * Returns a 3D offset (lobe center) for each emission category.
 */
export function getLobeCenter(category: string, radius: number): Point3D {
  const offset = radius * 0.6
  switch (category) {
    case 'transport':
      return { x: offset, y: 0, z: 0 } // Right
    case 'energy':
      return { x: 0, y: -offset, z: 0 } // Top (inverted Y is up in 2D)
    case 'diet':
      return { x: -offset, y: 0, z: 0 } // Left
    case 'consumption':
      return { x: 0, y: offset, z: 0 } // Bottom
    case 'flights':
      return { x: 0, y: 0, z: offset } // Front
    default:
      return { x: 0, y: 0, z: 0 } // Center
  }
}
