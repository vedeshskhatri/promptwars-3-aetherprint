import { GoogleGenerativeAI } from '@google/generative-ai'

// Server-side check: throw if the Gemini API key is missing
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined')
}

// Instantiate the Google Generative AI SDK client
export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
