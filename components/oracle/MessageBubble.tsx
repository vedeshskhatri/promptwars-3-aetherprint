'use client'

import React from 'react'
import { ChatMessage } from '../../types'

interface MessageBubbleProps {
  message: ChatMessage
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user'

  return (
    <div
      className={`flex flex-col gap-1 font-mono text-[11px] mb-4 select-text leading-relaxed ${
        isUser ? 'items-end' : 'items-start'
      }`}
    >
      {/* Sender Tag */}
      <span className={`text-[8px] tracking-widest ${isUser ? 'text-[var(--accent)]' : 'text-[var(--text-dim)]'}`}>
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
        {/* Typewriter-like caret indicator on the active message */}
        <p className="whitespace-pre-wrap">
          {!isUser && <span className="text-[var(--accent)] mr-1">❖</span>}
          {message.content}
        </p>
      </div>
    </div>
  )
}
export default MessageBubble
