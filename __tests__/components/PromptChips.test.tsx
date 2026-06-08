import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { PromptChips } from '../../components/oracle/PromptChips'

describe('PromptChips Component Tests', () => {
  // 1. Renders all 5 prompt buttons
  test('renders all 5 suggested prompt chips', () => {
    const onSelect = jest.fn()
    render(<PromptChips onSelect={onSelect} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBe(5)
  })

  // 2. Clicking a chip calls onSelect with the prompt text
  test('clicking a chip calls onSelect with the prompt text', () => {
    const onSelect = jest.fn()
    render(<PromptChips onSelect={onSelect} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledWith('What is my largest atmospheric contribution?')
  })

  // 3. Buttons are disabled when disabled=true
  test('all chips are disabled when disabled prop is true', () => {
    const onSelect = jest.fn()
    render(<PromptChips onSelect={onSelect} disabled={true} />)
    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => {
      expect(button).toBeDisabled()
    })
  })

  // 4. Clicking disabled chip does not call onSelect
  test('clicking disabled chip does not call onSelect', () => {
    const onSelect = jest.fn()
    render(<PromptChips onSelect={onSelect} disabled={true} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    expect(onSelect).not.toHaveBeenCalled()
  })

  // 5. Container has correct group role for accessibility
  test('chip container has role=group with accessible label', () => {
    const onSelect = jest.fn()
    render(<PromptChips onSelect={onSelect} />)
    const group = screen.getByRole('group', { name: /suggested questions/i })
    expect(group).toBeInTheDocument()
  })
})
