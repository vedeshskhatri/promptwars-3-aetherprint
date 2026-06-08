'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Terminal } from 'lucide-react'
import { MessageBubble } from './MessageBubble'
import { PromptChips } from './PromptChips'
import { ChatMessage, CarbonBreakdown } from '../../types'
import { HUDPanel } from '../ui/HUDPanel'

interface ChatWindowProps {
  carbonData: CarbonBreakdown
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ carbonData }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'AETHER_SYSTEM ONLINE. Transmission established. I am The Atmospherist. I have charted your signature. Ask me how we can clear your mark from the sky.',
    },
  ])
  const [inputVal, setInputVal] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [srAnnouncement, setSrAnnouncement] = useState('')

  const chatEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Scroll to bottom on message updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isSending) return

    const userMessage: ChatMessage = { role: 'user', content: text.substring(0, 600) }
    const updatedMessages = [...messages, userMessage]
    
    setInputVal('')
    setIsSending(true)
    setMessages([...updatedMessages, { role: 'assistant', content: '' }])
    setSrAnnouncement(`Sent question: ${text}. Streaming response.`)

    try {
      const response = await fetch('/api/oracle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.slice(-15), // Send last 15 messages for context
          carbonData,
        }),
      })

      if (!response.ok) {
        throw new Error('API connection failed')
      }

      if (!response.body) {
        throw new Error('Response body not readable')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let done = false
      let buffer = ''

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        const chunk = decoder.decode(value, { stream: !done })
        buffer += chunk

        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // Keep incomplete lines

        for (const line of lines) {
          const cleaned = line.trim()
          if (cleaned.startsWith('data: ')) {
            try {
              const dataStr = cleaned.slice(6)
              const parsed = JSON.parse(dataStr)
              const token = parsed.text

              setMessages((prev) => {
                const copy = [...prev]
                const last = copy[copy.length - 1]
                if (last && last.role === 'assistant') {
                  last.content += token
                }
                return copy
              })
            } catch {
              // Ignore partial chunk parsing errors
            }
          }
        }
      }
      setSrAnnouncement('Response complete.')
    } catch {
      setMessages((prev) => {
        const copy = [...prev]
        const last = copy[copy.length - 1]
        if (last && last.role === 'assistant') {
          last.content = 'Atmospheric interference detected. Signal lost. Please transmit again.'
        }
        return copy
      })
      setSrAnnouncement('Encountered transmission error.')
    } finally {
      setIsSending(false)
      // Refocus input
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(inputVal)
  }

  return (
    <HUDPanel
      title="ATMOSPHERIST TRANSMISSION FEED"
      subtitle="SECURE CHANNEL // GEMINI_2.5_FLASH"
      glowColor="var(--accent)"
      className="w-full h-[75vh] md:h-full flex flex-col justify-between"
      animate={true}
    >
      {/* Screen Reader Announcement */}
      <div className="sr-only" aria-live="polite">
        {srAnnouncement}
      </div>

      {/* Messages Scroll Container */}
      <div 
        className="flex-grow overflow-y-auto pr-2 mb-4 hud-scrollbar flex flex-col"
        role="log"
        aria-label="Orbital AI chat history"
      >
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}
        {isSending && messages[messages.length - 1].content === '' && (
          <div className="font-mono text-[9px] text-[var(--accent)] animate-pulse flex items-center gap-2 mb-4">
            <span className="animate-spin">◌</span> CONNECTING TO BEAM PATH...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Footer Interface: Chips + Input Form */}
      <div>
        {/* Suggestion Chips */}
        <PromptChips onSelect={handleSendMessage} disabled={isSending} />

        {/* Input Form */}
        <form onSubmit={handleFormSubmit} className="relative flex items-center border border-[var(--hud-border)] rounded-sm bg-black/45 focus-within:border-[var(--accent)] transition-all duration-300">
          <div className="pl-3.5 pr-2.5 text-[var(--text-dim)]">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          
          <label htmlFor="terminal-input" className="sr-only">
            Transmit message to the Atmospherist
          </label>
          <input
            ref={inputRef}
            id="terminal-input"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isSending}
            placeholder={isSending ? 'TRANSMITTING...' : 'ENTER ENQUIRY COMMAND...'}
            maxLength={600}
            className="w-full py-3 pr-10 bg-transparent font-mono text-[10px] text-[var(--text-primary)] border-none focus:outline-none placeholder-[var(--text-dim)] select-text disabled:opacity-50"
            style={{ caretColor: 'var(--accent)' }}
          />

          {/* Enter key badge indicator */}
          <div className="absolute right-3.5 font-mono text-[8px] text-[var(--text-dim)] tracking-wider pointer-events-none select-none uppercase">
            [ENTER]
          </div>
        </form>
      </div>
    </HUDPanel>
  )
}
export default ChatWindow
