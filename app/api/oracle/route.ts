import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { genAI } from '../../../lib/gemini'

// Request Zod validation schema
const requestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().max(600),
      })
    )
    .max(20),
  carbonData: z.object({
    total: z.number().min(0).max(200),
    transport: z.number().min(0),
    energy: z.number().min(0),
    diet: z.number().min(0),
    consumption: z.number().min(0),
    flights: z.number().min(0),
  }),
})

// Simple in-memory IP rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export async function POST(req: NextRequest) {
  try {
    // 1. Validate Content-Type
    const contentType = req.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Atmospheric interference. Content-Type must be application/json.' },
        { status: 400 }
      )
    }

    // 2. Simple IP-based Rate Limiter (Max 10 requests / minute)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || '127.0.0.1'
    const now = Date.now()
    const limitWindow = 60 * 1000 // 1 minute
    const limitCount = 10

    let clientLimit = rateLimitMap.get(ip)

    if (!clientLimit || now > clientLimit.resetAt) {
      clientLimit = { count: 1, resetAt: now + limitWindow }
      rateLimitMap.set(ip, clientLimit)
    } else {
      clientLimit.count++
      if (clientLimit.count > limitCount) {
        return NextResponse.json(
          { error: 'Atmospheric interference. Transmission rate exceeded.' },
          { status: 429 }
        )
      }
    }

    // 3. Parse and Validate Request Body using Zod
    const body = await req.json()
    const parseResult = requestSchema.safeParse(body)
    
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Atmospheric interference. Invalid request format.' },
        { status: 400 }
      )
    }

    const { messages, carbonData } = parseResult.data

    // 4. Construct the Gemini System Prompt
    const systemPrompt = `You are The Atmospherist — an orbital AI that monitors Earth's atmosphere. You speak like a calm, precise scientific intelligence that also carries a deep reverence for the planet. You are not preachy. You are not generic. You have access to this person's exact atmospheric signature data:

Total: ${carbonData.total.toFixed(2)} tCO2e/year
Transport: ${carbonData.transport.toFixed(2)} tCO2e
Energy: ${carbonData.energy.toFixed(2)} tCO2e  
Diet: ${carbonData.diet.toFixed(2)} tCO2e
Consumption: ${carbonData.consumption.toFixed(2)} tCO2e
Flights: ${carbonData.flights.toFixed(2)} tCO2e
India Average: 1.9t | Global Average: 4.7t | Paris Target: 2.0t

Your job: Give this person specific, quantified, actionable intelligence about their signature. Reference their exact numbers. Speak in precise terms. End every response with one sentence that acknowledges the beauty of the atmosphere being worth protecting. Maximum 4 sentences per response.`

    // 5. Initialize the Gemini 2.5 Flash Model
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt,
    })

    // Map conversation history to the format required by Gemini SDK
    // Gemini roles: 'user' or 'model'
    const contents = messages.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }))

    // Start streaming from Gemini
    const responseStream = await model.generateContentStream({
      contents,
    })

    // 6. Return standard SSE Stream
    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream.stream) {
            const chunkText = chunk.text()
            if (chunkText) {
              // Format as SSE chunk data
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunkText })}\n\n`))
            }
          }
          controller.close()
        } catch {
          // Send error placeholder and close
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ text: ' [Atmospheric interference encountered]' })}\n\n`
            )
          )
          controller.close()
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch {
    // Return masked error to client to avoid leaks
    return NextResponse.json(
      { error: 'Atmospheric interference. Try again.' },
      { status: 500 }
    )
  }
}
