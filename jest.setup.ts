/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom'

// Set up mock environment variables for test execution
process.env.GEMINI_API_KEY = 'mock_gemini_api_key_for_testing'

// 1. Polyfill TextEncoder and TextDecoder
const { TextEncoder, TextDecoder } = require('util')
;(global as any).TextEncoder = TextEncoder
;(global as any).TextDecoder = TextDecoder

// 2. Polyfill Web Streams
const { ReadableStream, WritableStream, TransformStream } = require('stream/web')
;(global as any).ReadableStream = ReadableStream
;(global as any).WritableStream = WritableStream
;(global as any).TransformStream = TransformStream

// 3. Polyfill MessageChannel and MessagePort
const { MessageChannel, MessagePort } = require('worker_threads')
;(global as any).MessageChannel = MessageChannel
;(global as any).MessagePort = MessagePort

// 4. Import undici after the polyfills are in place
const { Request, Response, Headers } = require('undici')
;(global as any).Request = Request
;(global as any).Response = Response
;(global as any).Headers = Headers

