/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { render, screen } from '@testing-library/react'
import { ComparisonBars } from '../../components/print/ComparisonBars'

// Mock the recharts responsive container and chart elements to render children synchronously
jest.mock('recharts', () => {
  const OriginalRecharts = jest.requireActual('recharts')
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  }
})

describe('ComparisonBars Component tests', () => {
  test('renders comparison bars elements correctly', () => {
    render(<ComparisonBars total={5.2} accentColor="#FF2244" />)
    
    // Verifies accessibility labels are present in DOM
    const chartContainer = screen.getByLabelText(/Carbon footprint comparison chart/i)
    expect(chartContainer).toBeInTheDocument()
  })
})
