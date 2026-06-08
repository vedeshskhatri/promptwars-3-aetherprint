# AETHERPRINT
### Your Carbon Footprint as a Living Atmospheric Signature

> A concept that has never been built before. Your emissions are not a number — they are a mark on the sky.

## Chosen Vertical
Carbon Footprint Awareness Platform

## What Makes This Different
Every carbon footprint app shows you a pie chart. AETHERPRINT generates a **living particle nebula** unique to your exact emission profile — computed from real IPCC emission factors across 5 categories. As your inputs change, your atmospheric signature morphs in real time.

## Approach & Logic
1. **Emission Engine**: Pure TypeScript functions with IPCC/EPA 2023 emission factors. Every category produces a deterministic tCO2e value.
2. **Nebula Renderer**: Canvas2D particle system with perspective projection. Particle count, velocity, spread, and color are all mapped from emission data. No two signatures look the same.
3. **The Atmospherist**: Gemini 2.5 Flash with carbon data injected into the system prompt. Streaming responses via server-side API route. Never exposes API key to client.
4. **Morphing Lab**: Fully client-side simulation — sliders adjust inputs, nebula morphs in real time, comparison updates instantly.

## How It Works
1. Visit `/map` — complete the 5-step emission wizard
2. Watch your nebula form in real time as you input data
3. See your `/print` — your unique Aetherprint with atmospheric readings
4. Talk to The Atmospherist at `/oracle` for personalized reduction intelligence
5. Simulate behavioral changes at `/simulate` — watch your nebula heal

## Tech Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 14 App Router + TypeScript |
| AI | Google Gemini 2.5 Flash (streaming) |
| Visualization | Canvas2D + requestAnimationFrame |
| Animation | Framer Motion |
| Styling | Tailwind CSS + CSS Variables |
| Testing | Jest + React Testing Library |
| Validation | Zod |
| Deployment | Vercel |

## Setup
```bash
git clone https://github.com/vedeshskhatri/aetherprint
cd aetherprint
npm install
cp .env.example .env.local
# Add your Gemini API key to .env.local
npm run dev
```

## Assumptions
- India electricity grid factor: 0.82 kgCO2/kWh (CEA 2023)
- Transport emission factors: IPCC AR6 (2023)
- Diet emission ranges: Oxford Martin School study (Poore & Nemecek)
- Paris Target comparison baseline: 2.0 tCO2e/person/year
- India average comparison: 1.9 tCO2e/person/year (World Bank 2022)

## Deployed
https://aetherprint.vercel.app
