'use client'

import React from 'react'
import { ChatMessage } from '../../types'

interface MessageBubbleProps {
  message: ChatMessage
}

/**
 * Renders a single chat message bubble in the Oracle chat interface.
 * Styled differently for user vs assistant messages.
 * Wrapped with React.memo so only the new message triggers re-render during streaming,
 * not all previous messages.
 */
export const MessageBubble: React.FC<MessageBubbleProps> = React.memo(({ message }) => {
  const isUser = message.role === 'user'

  return (
    <div
      className={`flex flex-col gap-1 font-mono text-[11px] mb-4 select-text leading-relaxed ${
        isUser ? 'items-end' : 'items-start'
      }`}
    >
      {/* Sender Tag */}
      <span
        className={`text-[8px] tracking-widest ${isUser ? 'text-[var(--accent)]' : 'text-[var(--text-dim)]'}`}
        aria-hidden="true"
      >
        {isUser ? 'USER_FEED // INPUT' : 'ORBITAL_AI // TRANSMISSION'}
      </span>

      {/* Bubble text wrapper */}
      <div
        className={`max-w-[85%] rounded border p-3 ${
          isUser
            ? 'bg-[rgba(255,255,255,0.02)] border-[var(--accent)] text-[var(--accent)]'
            : 'bg-[var(--hud-glass)] border-[var(--hud-border)] text-[var(--text-primary)]'
        }`}
        style={{
          boxShadow: isUser ? '0 0 10px rgba(0, 255, 204, 0.05)' : undefined,
        }}
      >
        <p className="whitespace-pre-wrap">
          {!isUser && <span className="text-[var(--accent)] mr-1" aria-hidden="true">❖</span>}
          {message.content}
        </p>
      </div>
    </div>
  )
})
MessageBubble.displayName = 'MessageBubble'
export default MessageBubble
