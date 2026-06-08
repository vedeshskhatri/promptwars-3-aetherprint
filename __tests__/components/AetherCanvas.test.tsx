import React from 'react'
import { render, screen } from '@testing-library/react'
import { AetherCanvas } from '../../components/nebula/AetherCanvas'
import { CarbonBreakdown } from '../../types'

// Mock the canvas getContext API so it does not error in Jest/jsdom
beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
  })
})

describe('AetherCanvas Component tests', () => {
  // 1. Renders without crashing with null carbonData
  test('renders with null carbonData (default landing state)', () => {
    render(<AetherCanvas carbonData={null} />)
    const canvasElement = screen.getByLabelText(/Atmospheric particle visualization representing your carbon footprint/i)
    expect(canvasElement).toBeInTheDocument()
    expect(canvasElement.tagName).toBe('CANVAS')
  })

  // 2. Renders without crashing with valid carbonData
  test('renders with valid carbonData breakdown', () => {
    const validBreakdown: CarbonBreakdown = {
      transport: 1.2,
      energy: 0.9,
      diet: 1.5,
      consumption: 0.4,
      flights: 1.6,
      total: 5.6,
    }

    render(<AetherCanvas carbonData={validBreakdown} />)
    const canvasElement = screen.getByLabelText(/Atmospheric particle visualization representing your carbon footprint/i)
    expect(canvasElement).toBeInTheDocument()
  })

  // 3. Canvas element is present in the DOM
  test('verifies canvas role and presence in DOM', () => {
    render(<AetherCanvas carbonData={null} />)
    const canvasElement = screen.getByRole('img')
    expect(canvasElement).toBeInTheDocument()
  })
})
