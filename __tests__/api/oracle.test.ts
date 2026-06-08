/* eslint-disable @typescript-eslint/no-explicit-any */
import { POST } from '../../app/api/oracle/route'
import { NextRequest } from 'next/server'

// Set up mock environment variables before importing routes
process.env.GEMINI_API_KEY = 'mock_api_key'

// Attach mocks to the global object to prevent hoisting reference errors
;(global as any).mockGenerateContentStream = jest.fn()
;(global as any).mockGetGenerativeModel = jest.fn().mockReturnValue({
  generateContentStream: (global as any).mockGenerateContentStream,
})

jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: (...args: unknown[]) => {
          return (global as any).mockGetGenerativeModel(...args)
        },
      }
    }),
  }
})

describe('Oracle API Route tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global as any).mockGenerateContentStream.mockReset()
    ;(global as any).mockGetGenerativeModel.mockClear()
  })

  // 1. Missing carbonData -> 400
  test('POST with missing carbonData returns 400', async () => {
    const req = new NextRequest('http://localhost:3000/api/oracle', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'What is my largest atmospheric contribution?' }],
      }),
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain('Invalid request format')
  })

  // 2. Message over 600 chars -> 400
  test('POST with message exceeding 600 characters returns 400', async () => {
    const longMessage = 'a'.repeat(601)
    const req = new NextRequest('http://localhost:3000/api/oracle', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: longMessage }],
        carbonData: {
          total: 2.5,
          transport: 0.5,
          energy: 0.5,
          diet: 1.0,
          consumption: 0.5,
          flights: 0.0,
        },
      }),
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain('Invalid request format')
  })

  // 3. Valid Request -> calls Gemini & streams
  test('POST with valid request streams tokens from Gemini', async () => {
    const mockChunks = [
      { text: () => 'The ' },
      { text: () => 'atmosphere ' },
      { text: () => 'is beautiful.' },
    ]
    
    ;(global as any).mockGenerateContentStream.mockResolvedValue({
      stream: (async function* () {
        for (const chunk of mockChunks) {
          yield chunk
        }
      })(),
    })

    const req = new NextRequest('http://localhost:3000/api/oracle', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Compare my signature' }],
        carbonData: {
          total: 3.5,
          transport: 0.7,
          energy: 0.8,
          diet: 1.5,
          consumption: 0.5,
          flights: 0.0,
        },
      }),
    })

    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toBe('text/event-stream')

    // Read the stream output to confirm contents
    const reader = res.body?.getReader()
    const decoder = new TextDecoder()
    let outText = ''
    if (reader) {
      let done = false
      while (!done) {
        const { value, done: isDone } = await reader.read()
        done = isDone
        if (value) {
          outText += decoder.decode(value)
        }
      }
    }
    
    expect(outText).toContain('The ')
    expect(outText).toContain('atmosphere ')
    expect(outText).toContain('is beautiful.')
    
    expect((global as any).mockGetGenerativeModel).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'gemini-2.5-flash',
        systemInstruction: expect.stringContaining('Total: 3.50 tCO2e/year'),
      })
    )
  })

  // 4. Content-Type mismatch -> 400
  test('POST with invalid Content-Type returns 400', async () => {
    const req = new NextRequest('http://localhost:3000/api/oracle', {
      method: 'POST',
      headers: {
        'content-type': 'text/plain',
      },
      body: 'Some plain text body',
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain('Content-Type must be application/json')
  })
})
