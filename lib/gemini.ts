import { GoogleGenerativeAI } from '@google/generative-ai'

// Use actual API key or fallback to a build-time mock key to prevent compilation failures on Vercel
const apiKey = process.env.GEMINI_API_KEY || 'MOCK_GEMINI_API_KEY_FOR_BUILD'

// Instantiate the Google Generative AI SDK client
export const genAI = new GoogleGenerativeAI(apiKey)
