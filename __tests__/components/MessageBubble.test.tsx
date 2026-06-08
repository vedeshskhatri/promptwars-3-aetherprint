import React from 'react'
import { render, screen } from '@testing-library/react'
import { MessageBubble } from '../../components/oracle/MessageBubble'
import { ChatMessage } from '../../types'

describe('MessageBubble Component Tests', () => {
  // 1. Renders user message with correct content
  test('renders user message content', () => {
    const message: ChatMessage = { role: 'user', content: 'How do I reduce my footprint?' }
    render(<MessageBubble message={message} />)
    expect(screen.getByText('How do I reduce my footprint?')).toBeInTheDocument()
  })

  // 2. Renders assistant message with correct content
  test('renders assistant message content', () => {
    const message: ChatMessage = { role: 'assistant', content: 'Focus on reducing flight emissions.' }
    render(<MessageBubble message={message} />)
    expect(screen.getByText(/Focus on reducing flight emissions/)).toBeInTheDocument()
  })

  // 3. User message is right-aligned (items-end class)
  test('user message has right-aligned container', () => {
    const message: ChatMessage = { role: 'user', content: 'Test user message' }
    const { container } = render(<MessageBubble message={message} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('items-end')
  })

  // 4. Assistant message is left-aligned (items-start class)
  test('assistant message has left-aligned container', () => {
    const message: ChatMessage = { role: 'assistant', content: 'Test assistant message' }
    const { container } = render(<MessageBubble message={message} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('items-start')
  })

  // 5. Message text is selectable (select-text class)
  test('message container has select-text class for text selection', () => {
    const message: ChatMessage = { role: 'user', content: 'Selectable text' }
    const { container } = render(<MessageBubble message={message} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('select-text')
  })
})
