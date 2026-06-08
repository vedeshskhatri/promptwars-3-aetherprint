import React from 'react'
import { render, screen } from '@testing-library/react'
import { HUDPanel } from '../../components/ui/HUDPanel'

describe('HUDPanel Component tests', () => {
  test('renders children correctly', () => {
    render(
      <HUDPanel title="PANEL TITLE" animate={false}>
        <div data-testid="hud-child">Panel Content Child</div>
      </HUDPanel>
    )
    expect(screen.getByTestId('hud-child')).toBeInTheDocument()
    expect(screen.getByText('PANEL TITLE')).toBeInTheDocument()
    expect(screen.getByText(/SYS.READY/i)).toBeInTheDocument()
  })

  test('renders subtitle when provided', () => {
    render(
      <HUDPanel title="MAIN TITLE" subtitle="SUB DIAGNOSTIC" animate={false}>
        <div>Content</div>
      </HUDPanel>
    )
    expect(screen.getByText('MAIN TITLE')).toBeInTheDocument()
    expect(screen.getByText('SUB DIAGNOSTIC')).toBeInTheDocument()
  })

  test('renders without headers if title is not provided', () => {
    render(
      <HUDPanel animate={false}>
        <div>Plain Content</div>
      </HUDPanel>
    )
    expect(screen.queryByText(/SYS.READY/i)).not.toBeInTheDocument()
    expect(screen.getByText('Plain Content')).toBeInTheDocument()
  })

  test('renders correctly with animate=true (motion wrapper)', () => {
    render(
      <HUDPanel title="ANIMATED TITLE" animate={true}>
        <div>Animated Content</div>
      </HUDPanel>
    )
    expect(screen.getByText('ANIMATED TITLE')).toBeInTheDocument()
    expect(screen.getByText('Animated Content')).toBeInTheDocument()
  })
})
