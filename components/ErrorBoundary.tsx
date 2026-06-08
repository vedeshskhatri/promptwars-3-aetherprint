'use client'

import React, { Component, ErrorInfo } from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * React Error Boundary that catches JavaScript errors anywhere in its
 * child component tree and displays a themed fallback UI instead of crashing.
 * Required for production resilience — prevents a single component failure
 * from taking down the entire application.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Only log in development to avoid leaking stack traces in production
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorBoundary] Caught error:', error.message)
      console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack)
    }
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div
          className="w-full h-full bg-black flex flex-col items-center justify-center gap-4 font-mono text-xs text-[var(--text-dim,rgba(240,237,232,0.62))]"
          role="alert"
          aria-live="assertive"
        >
          <div className="text-[#FF2244] text-sm tracking-[0.2em] uppercase">
            ATMOSPHERIC DISTURBANCE DETECTED
          </div>
          <p className="text-[9px] tracking-widest uppercase max-w-sm text-center leading-relaxed">
            A system anomaly was encountered. Refresh to re-establish atmospheric connection.
          </p>
          <button
            onClick={this.handleRetry}
            className="mt-2 px-4 py-2 border border-[rgba(255,255,255,0.08)] text-[rgba(240,237,232,0.62)] text-[9px] tracking-widest uppercase hover:border-[rgba(240,237,232,0.62)] transition-all duration-300 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00FFCC]"
          >
            RETRY CONNECTION
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
