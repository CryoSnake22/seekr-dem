'use client'

import { useState, useEffect, useRef } from 'react'
import type { ChatMessage } from '@/lib/types/backend'

interface AIChatProps {
  accessToken: string
  includeProfileContext?: boolean
}

export function AIChat({ accessToken, includeProfileContext = true }: AIChatProps) {
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [streamingContent, setStreamingContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const WS_URL = process.env.NEXT_PUBLIC_BACKEND_WS_URL || 'ws://localhost:8000'

  // Fetch chat history on mount
  useEffect(() => {
    fetchHistory()
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, streamingContent])

  // WebSocket connection
  useEffect(() => {
    const websocket = new WebSocket(`${WS_URL}/api/v1/ai/chat/ws`)

    websocket.onopen = () => {
      console.log('WebSocket connected')
      setConnected(true)
      setError(null)

      // Send initial auth message
      websocket.send(JSON.stringify({
        token: accessToken,
        message: '',
        include_profile_context: includeProfileContext
      }))
    }

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === 'chunk') {
          // Append chunk to streaming content
          setStreamingContent(prev => prev + (data.content || ''))
        } else if (data.type === 'done') {
          // Finalize message
          if (streamingContent) {
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: streamingContent,
              timestamp: new Date().toISOString()
            }])
            setStreamingContent('')
          }
          setLoading(false)
        } else if (data.type === 'error') {
          setError(data.error || 'An error occurred')
          setStreamingContent('')
          setLoading(false)
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err)
      }
    }

    websocket.onerror = (event) => {
      console.error('WebSocket error:', event)
      setError('Connection error. Please try again.')
      setConnected(false)
      setLoading(false)
    }

    websocket.onclose = () => {
      console.log('WebSocket disconnected')
      setConnected(false)
      setLoading(false)
    }

    setWs(websocket)

    return () => {
      websocket.close()
    }
  }, [accessToken, includeProfileContext])

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/backend/ai/history?limit=50')
      const result = await response.json()

      if (result.data?.conversation_history) {
        setMessages(result.data.conversation_history)
      }
    } catch (err) {
      console.error('Failed to fetch chat history:', err)
    }
  }

  const sendMessage = () => {
    if (!ws || !currentMessage.trim() || loading || !connected) return

    // Add user message to UI
    const userMessage: ChatMessage = {
      role: 'user',
      content: currentMessage,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, userMessage])

    // Send to WebSocket
    ws.send(JSON.stringify({
      message: currentMessage,
      include_profile_context: includeProfileContext
    }))

    setCurrentMessage('')
    setLoading(true)
    setError(null)
    setStreamingContent('')
  }

  const clearHistory = async () => {
    if (!confirm('Are you sure you want to clear all chat history?')) return

    try {
      const response = await fetch('/api/backend/ai/history', {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.data?.success) {
        setMessages([])
        setError(null)
      } else {
        setError('Failed to clear history')
      }
    } catch (err) {
      setError('Failed to clear history')
    }
  }

  return (
    <div className="flex flex-col h-[640px] w-full max-w-5xl mx-auto bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="text-base">🤖</span>
          </div>
          <div>
            <h2 className="font-semibold">AI Career Advisor</h2>
            <p className="text-xs text-neutral-400">Personalized guidance trained on your profile</p>
          </div>
          <div className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-emerald-400' : 'bg-red-500'}`} />
        </div>
        <button
          onClick={clearHistory}
          disabled={messages.length === 0}
          className="px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg border border-white/10 disabled:opacity-50"
        >
          Clear
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-5 overflow-y-auto" ref={scrollRef}>
        {messages.length === 0 && !streamingContent && (
          <div className="text-center text-neutral-500 py-12">
            <div className="text-5xl mb-4 opacity-50">🤖</div>
            <p className="text-sm text-neutral-300">Start a conversation with your AI career advisor.</p>
            <p className="text-xs mt-2">
              Ask about skills, career paths, interview prep, or personalized planning.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  🤖
                </div>
              )}
              <div className={`p-3 rounded-xl max-w-[80%] border ${msg.role === 'user' ? 'bg-primary text-black border-primary/30' : 'bg-white/5 text-neutral-200 border-white/10'}`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0 text-white">
                  👤
                </div>
              )}
            </div>
          ))}

          {/* Streaming message */}
          {streamingContent && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                🤖
              </div>
              <div className="p-3 rounded-xl max-w-[80%] bg-white/5 text-neutral-200 border border-white/10">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{streamingContent}</p>
                <div className="mt-2 flex gap-1">
                  <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="px-4 py-2 bg-red-500/10 text-red-300 text-xs border-t border-red-500/20">
          {error}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-[#0B0B0B]">
        <div className="flex gap-2">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            placeholder="Ask me anything about your career..."
            disabled={loading || !connected}
            className="flex-1 px-3 py-2 bg-transparent border border-white/10 rounded-lg text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/60 disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !connected || !currentMessage.trim()}
            className="px-4 py-2 bg-primary text-black rounded-lg font-semibold hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳' : 'Send'}
          </button>
        </div>
        {!connected && (
          <p className="text-xs text-neutral-500 mt-2">
            Connecting to AI advisor...
          </p>
        )}
      </div>
    </div>
  )
}
