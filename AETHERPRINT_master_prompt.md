# ⚡ AETHERPRINT — MASTER PROMPT FOR ANTIGRAVITY
## Prompt Wars Challenge 3 | Carbon Footprint Platform
### A concept that has never existed before.

---

> **HOW TO USE:**
> 1. Open Antigravity
> 2. Upload the **SKILL.md** file to the conversation first
> 3. Then paste the full prompt below
> 4. Answer the questions Antigravity asks (guide at the bottom)

---

---
---

# ═══════════════════════════════════════════════════
# PASTE THIS ENTIRE BLOCK INTO ANTIGRAVITY:
# ═══════════════════════════════════════════════════

```
A SKILL.md file has been uploaded to this conversation. Before you write any frontend code, design any UI, or choose any colors or fonts — read the SKILL.md file thoroughly and internalize every rule in it. Every frontend decision you make must comply with it. Reference it explicitly when you begin building the UI.

You are a world-class senior engineer and creative director. You are about to build something that has never existed before — not in any hackathon, portfolio, or production app. The judges evaluating this must stop scrolling and say "What IS this?"

Before you write a single line of code, ask me the following questions ONE AT A TIME. Wait for my answer before asking the next.

1. "What is your Google Gemini API key? It will go into .env.local and be gitignored immediately."
2. "What is your GitHub username? I need this for the README."
3. "What is your Vercel deployment URL going to be called? (e.g. aetherprint) — this goes in the README deployed link placeholder."

Once all 3 are answered, start building. Do not start before all 3 are answered.

---

# THE PROJECT: AETHERPRINT
## "Your emissions are not a number. They are a mark on the sky."

---

## CONCEPT (read this fully before anything else):

Most carbon footprint apps show you a pie chart and a number. AETHERPRINT does something that has never been done:

It takes your carbon emission data and generates a living, breathing, procedurally rendered **atmospheric signature** — a nebula-like particle cloud that is uniquely yours. No two people's Aetherprint looks the same. Your cloud's color, density, turbulence, and shape are all computed from your real emission data.

The core emotional hook: You are not looking at a statistic. You are looking at YOUR mark on the atmosphere — the actual invisible imprint your choices leave on the sky every year. Beautiful if you live lightly. Volatile and dark if you don't.

This is NOT a dashboard. It is an **experience**.

---

## DESIGN DIRECTION (mandatory — also follow SKILL.md for all implementation):

Aesthetic: **"Cosmic Observatory meets Scientific Brutalism"**

- Background: Absolute void — pure #000000, no gradients, no texture on the base layer
- The nebula particle canvas FILLS the viewport and IS the background
- UI elements float over it as translucent HUD panels — like a space mission control interface
- Typography:
  - Display/Hero: "Cormorant Garamond" — tall, refined, slightly haunting
  - Data/Numbers: "DM Mono" — monospaced, technical, precise
  - Body: "Syne" — geometric, futuristic, not overused
- Color system (CSS variables only):
  - --void: #000000
  - --nebula-low: #00FFCC (clean teal — healthy atmosphere)
  - --nebula-mid: #FF8C00 (amber — warming atmosphere)
  - --nebula-high: #FF2244 (crimson — toxic atmosphere)
  - --hud-glass: rgba(255, 255, 255, 0.04)
  - --hud-border: rgba(255, 255, 255, 0.08)
  - --text-primary: #F0EDE8 (warm off-white, not pure white)
  - --text-dim: rgba(240, 237, 232, 0.45)
  - --accent: interpolated from nebula color based on footprint level
- Grain overlay: 3% SVG noise filter over the entire page (use featureTurbulence)
- Custom cursor: A small crosshair (+) in the current nebula accent color
- Every number on screen: count-up animation on enter
- Page transitions: Framer Motion with fade + scale (0.97 → 1.0)
- No shadows — use glow effects instead (box-shadow: 0 0 20px var(--nebula-low) at 20% opacity)
- Scrollbar: hidden. Navigation is internal/single-page-style routing.

The nebula itself:
- Built with HTML5 Canvas2D + requestAnimationFrame (no Three.js — keep it lightweight and cross-device)
- Particles: 2000–4000 points in 3D-projected space (use perspective projection manually)
- Particle properties computed from emission data:
  - count: mapped from total CO2e (more emissions = denser cloud)
  - speed: higher emission = more turbulent particle velocity
  - color: interpolated between --nebula-low and --nebula-high based on footprint vs Paris target (2.0t)
  - spread radius: proportional to total footprint
  - each emission category (transport, energy, diet, shopping) controls a different "lobe" of the nebula
- The nebula gently rotates and breathes even when idle (sine-wave amplitude oscillation)
- On HOVER: particles near the cursor get attracted and swirl — micro-interaction
- On new data submitted: particles morph with an easing transition (lerp all values over 2s)

---

## TECH STACK (mandatory, exact):

- Framework: Next.js 14 (App Router) with TypeScript (strict: true in tsconfig)
- Styling: Tailwind CSS + global CSS variables (no Tailwind for color — use CSS vars)
- Animation: Framer Motion (UI) + Canvas2D requestAnimationFrame (nebula)
- AI: Google Gemini 2.5 Flash via @google/generative-ai SDK
  - Model string: "gemini-2.5-flash"
  - Use streaming API for the AI coach responses
- Charts: Recharts (secondary data viz only — the nebula is the MAIN visual)
- Fonts: next/font/google — Cormorant_Garamond, DM_Mono, Syne
- Validation: Zod (all form inputs + API route bodies)
- Testing: Jest + React Testing Library
- Icons: Lucide React (minimal usage — don't icon-spam)
- Confetti: canvas-confetti (for achievements only)
- Linting: ESLint + Prettier (pre-configure both)
- .env.local: GEMINI_API_KEY — validated at server startup, throw if undefined

---

## PAGES AND FEATURES (build ALL of them):

### PAGE 1: / — THE VOID (Landing)
- Full-viewport canvas: the nebula renders immediately on load with a "generic/neutral" state
- Centered text overlaid: "AETHERPRINT" in Cormorant Garamond, massive, letter-spaced
- Subline: "Every breath of atmosphere carries your signature. Discover yours."
- Single CTA button: "BEGIN MAPPING" — floats, no background, just a border in --nebula-low color
- Subtle scroll-triggered parallax: nebula responds to mouse position (tilt effect, max 5deg)
- On CTA click: nebula particles converge toward center (implosion), then route to /map

### PAGE 2: /map — THE EMISSION MAP (Calculator)
- Multi-step wizard. 5 steps. No page reloads — just Framer Motion AnimatePresence between steps
- The nebula canvas STAYS visible behind the wizard at all times (semi-transparent HUD panel overlaid)
- As user fills in each category, the nebula UPDATES IN REAL TIME — they watch their atmosphere form
- Each step is a category:

  STEP 1 — TRANSIT LAYER
  - Car usage: km/week, fuel type (Petrol 0.21 kgCO2/km | Diesel 0.17 | Electric 0.05 | None)
  - Public transit: hours/week (factor: 0.089 kgCO2/km, avg 20km/h = 0.089×20×h×52)
  - Motorbike: km/week (factor: 0.113 kgCO2/km)

  STEP 2 — ENERGY LAYER
  - Monthly electricity (kWh) — India grid: 0.82 kgCO2/kWh
  - Renewable energy % offset (slider 0–100%)
  - Cooking fuel: LPG (factor: 3.0 kgCO2/kg, avg 12kg/month) | Electric | Induction | Biogas

  STEP 3 — SUSTENANCE LAYER
  - Diet type: Vegan (1.5 tCO2/yr) | Vegetarian (1.7) | Flexitarian (2.2) | Omnivore (2.5) | Meat-heavy (3.3)
  - Food waste level: None / Low / Medium / High (multipliers: 1.0 / 1.05 / 1.12 / 1.22)
  - Local vs imported food preference (multiplier: 1.0 local, 1.15 imported)

  STEP 4 — CONSUMPTION LAYER
  - Monthly spend on clothing (₹) — factor: 0.008 kgCO2/₹
  - Electronics purchases per year (count × 80 kgCO2 avg)
  - Online deliveries per week (factor: 0.5 kgCO2/delivery)

  STEP 5 — ATMOSPHERE LAYER (flights)
  - Short-haul flights/year (factor: 255 kgCO2 per flight avg)
  - Long-haul flights/year (factor: 1620 kgCO2 per flight avg)
  - Class: Economy (1.0×) | Business (2.9×) | First (4.0×)

- Progress indicator: 5 dots at top, current one glows in nebula color
- Each step: animated slide-in from right, slide-out to left
- "REVEAL MY AETHERPRINT" final button — triggers nebula full morph animation, routes to /print

### PAGE 3: /print — THE AETHERPRINT (Results)

This is the money page. Make it feel like a museum exhibit.

LEFT HALF (60% width):
- The nebula canvas, now full and rendered with the user's actual data
- Underneath: user's unique "AETHERPRINT ID" — a hash generated from their inputs, displayed in DM Mono
- Caption: "Annual Carbon Signature — [calculated] tCO2e"

RIGHT HALF (40% width, scrollable HUD panel):
- "ATMOSPHERIC READINGS" header (all caps, DM Mono, --text-dim color)
- Five "instrument readouts" — one per category — each showing:
  - Category name
  - Individual tCO2e
  - Status glyph: ◆ green (below avg) | ◆ amber (at avg) | ◆ red (above avg)
- Divider
- Three comparison bars (Recharts HorizontalBar):
  - Your total vs India average (1.9t)
  - Your total vs Global average (4.7t)
  - Your total vs Paris Target (2.0t)
- "Carbon Equivalence" section — 3 rotating cards showing facts like:
  - "= [X] return flights Mumbai → Delhi"
  - "= [X] kg of beef"
  - "= [X] trees needed to absorb in one year"
- CTA: "CONSULT THE ATMOSPHERIST →" (routes to /oracle)
- Secondary CTA: "SIMULATE CHANGE →" (routes to /simulate)

### PAGE 4: /oracle — THE ATMOSPHERIST (Gemini 2.5 Flash AI Coach)

- The full-page vibe: like communicating with an orbital AI station
- Left: nebula canvas (smaller, 40% width, showing user's current print)
- Right: chat interface styled as a terminal/transmission feed

Gemini system prompt (inject user's full carbon data into it):
"""
You are The Atmospherist — an orbital AI that monitors Earth's atmosphere. You speak like a calm, precise scientific intelligence that also carries a deep reverence for the planet. You are not preachy. You are not generic. You have access to this person's exact atmospheric signature data:

Total: {TOTAL} tCO2e/year
Transport: {TRANSPORT} tCO2e
Energy: {ENERGY} tCO2e  
Diet: {DIET} tCO2e
Consumption: {CONSUMPTION} tCO2e
Flights: {FLIGHTS} tCO2e
India Average: 1.9t | Global Average: 4.7t | Paris Target: 2.0t

Your job: Give this person specific, quantified, actionable intelligence about their signature. Reference their exact numbers. Speak in precise terms. End every response with one sentence that acknowledges the beauty of the atmosphere being worth protecting. Maximum 4 sentences per response.
"""

- Streaming responses: use Gemini streaming, display tokens as they arrive (typewriter style)
- Pre-built prompt chips (floating above input):
  - "What is my largest atmospheric contribution?"
  - "Give me 3 specific actions for this month"
  - "How does my signature compare globally?"
  - "What would my print look like in 5 years?"
  - "Design me a 30-day reduction protocol"
- Message history: stored in React state, sent with each API call
- Input: single line, no send button — press Enter to send
- Rate limit: 10 requests/minute per IP in the API route
- API route: /api/oracle (POST, server-side only — key never touches client)

### PAGE 5: /simulate — THE MORPHING LAB

- Side-by-side: "CURRENT SIGNATURE" nebula vs "PROJECTED SIGNATURE" nebula
- User adjusts sliders that modify their inputs:
  - "Switch to EV" toggle
  - "Go vegetarian" toggle
  - "Reduce flights by [slider]%"
  - "Switch to renewable electricity [slider]%"
  - "Cut online deliveries by [slider]%"
- As sliders move, the right-side nebula morphs in real time
- Shows: "Potential reduction: [X] tCO2e/year ([Y]%)"
- Shows: "New ranking: [recalculated comparison]"
- This is a PURE client-side calculator — no API calls
- Gemini CTA at bottom: "Ask The Atmospherist how to achieve this →"

### NAV:
- Minimal floating nav: top-right corner, always visible
- 5 dots + label on hover: VOID / MAP / PRINT / ORACLE / SIMULATE
- Current page dot glows in nebula accent color
- No hamburger menu — dots only on mobile too (they expand on touch)

---

## API ROUTE — /api/oracle (POST):

Request body schema (Zod):
```typescript
z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().max(600)
  })).max(20),
  carbonData: z.object({
    total: z.number().min(0).max(200),
    transport: z.number().min(0),
    energy: z.number().min(0),
    diet: z.number().min(0),
    consumption: z.number().min(0),
    flights: z.number().min(0)
  })
})
```

- Validate Content-Type: application/json
- Rate limit: simple in-memory Map<ip, {count, resetAt}>
- Build Gemini system prompt by injecting carbonData values
- Use streaming: for await (const chunk of stream) { ... }
- Return: ReadableStream (text/event-stream)
- Never log user messages in production
- On error: return { error: "Atmospheric interference. Try again." } (never expose raw errors)

---

## CARBON CALCULATION ENGINE (lib/carbon-calculator.ts):

Pure functions only. No side effects. Fully typed.

```typescript
export interface EmissionInputs {
  transport: TransportInputs
  energy: EnergyInputs
  diet: DietInputs
  consumption: ConsumptionInputs
  flights: FlightInputs
}

export interface CarbonBreakdown {
  transport: number  // tCO2e/year
  energy: number
  diet: number
  consumption: number
  flights: number
  total: number
}

export function calculateCarbonBreakdown(inputs: EmissionInputs): CarbonBreakdown
export function getCarbonStatus(total: number): 'low' | 'medium' | 'high'  // <2.0 | 2.0-4.7 | >4.7
export function getNebulaColor(total: number): string  // interpolated hex
export function getCarbonEquivalents(total: number): CarbonEquivalent[]
export function generateAetherID(inputs: EmissionInputs): string  // deterministic hash
```

Write all of these. They are the foundation.

---

## THE NEBULA ENGINE (components/nebula/AetherCanvas.tsx):

This is the most important component. Implement it as:

```typescript
interface AetherCanvasProps {
  carbonData?: CarbonBreakdown | null  // null = neutral/landing state
  interactive?: boolean  // mouse parallax on/off
  size?: 'full' | 'half' | 'mini'
}
```

Canvas implementation:
- Use useRef for the canvas element
- useEffect for the animation loop
- Particle struct: { x, y, z, vx, vy, vz, targetX, targetY, targetZ, color, size, opacity }
- On carbonData change: lerp all particle targets to new positions over 120 frames
- Perspective projection: x2d = (x / (z + focalLength)) * focalLength + cx
- Each emission category = a spherical "lobe" in 3D space, offset from center
- Particle count scales with total (500 base + total × 150, clamped at 4000)
- Mouse tracking: on mousemove, calculate angle from center, shift all particles by ±15px
- requestAnimationFrame loop: clear canvas → sort particles by z → draw back-to-front
- Particle size: proportional to (1 / z) — perspective-correct
- Color: lerp between --nebula-low and --nebula-high based on footprint level
- Cleanup: cancelAnimationFrame on unmount

---

## TESTING (mandatory for scoring):

`__tests__/carbon-calculator.test.ts`:
- Test calculateCarbonBreakdown with all-zero inputs → all zeros
- Test each emission factor individually (e.g., petrol car 100km/week = 0.21×100×52/1000 tCO2)
- Test getCarbonStatus: 1.5t → low, 3.0t → medium, 6.0t → high
- Test generateAetherID: same inputs → same ID; different inputs → different ID
- Test getNebulaColor: 0t → returns low color, 10t → returns high color
- Min 12 test cases covering edge cases (0 values, maximum values, mixed)

`__tests__/api/oracle.test.ts`:
- Mock @google/generative-ai
- Test: missing carbonData → 400
- Test: message over 600 chars → 400
- Test: valid request → calls Gemini with correct system prompt injection
- Test: rate limit exceeded → 429

`__tests__/components/AetherCanvas.test.tsx`:
- Renders without crashing with null carbonData
- Renders without crashing with valid carbonData
- Canvas element is present in DOM

---

## SECURITY (mandatory for scoring):

- GEMINI_API_KEY: loaded server-side only, validated on startup in lib/gemini.ts:
  ```typescript
  if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not defined')
  ```
- .env.local listed in .gitignore — verify this
- .env.example committed with: GEMINI_API_KEY=your_key_here
- Content Security Policy in next.config.js (allow fonts.googleapis.com, none else external)
- All API route inputs: Zod-validated before any processing
- No dangerouslySetInnerHTML anywhere
- API errors: never expose raw error messages to client

---

## ACCESSIBILITY (mandatory for scoring):

- Skip-to-content link at very top of layout
- Canvas: aria-label="Atmospheric particle visualization representing your carbon footprint"
- All wizard steps: aria-live="polite" announcement on step change
- All buttons: descriptive aria-label if icon-only
- Form inputs: proper <label> elements, not just placeholders
- Color is never the only indicator — pair with text/icon always
- Keyboard navigation: full tab order, visible focus rings (2px solid current nebula color)
- Focus trap in any modal
- Contrast: all text minimum 4.5:1 against dark background
- Recharts: add aria-label to all chart containers

---

## FILE STRUCTURE:

```
aetherprint/
├── app/
│   ├── layout.tsx              # Root layout: fonts, grain overlay, custom cursor, nav
│   ├── page.tsx                # /void — landing
│   ├── map/page.tsx            # /map — wizard calculator  
│   ├── print/page.tsx          # /print — results + nebula
│   ├── oracle/page.tsx         # /oracle — AI coach
│   ├── simulate/page.tsx       # /simulate — morphing lab
│   └── api/oracle/route.ts     # Server-side Gemini route
├── components/
│   ├── nebula/
│   │   └── AetherCanvas.tsx    # THE nebula particle engine
│   ├── wizard/
│   │   ├── WizardShell.tsx
│   │   ├── steps/TransitStep.tsx
│   │   ├── steps/EnergyStep.tsx
│   │   ├── steps/SustenanceStep.tsx
│   │   ├── steps/ConsumptionStep.tsx
│   │   └── steps/AtmosphereStep.tsx
│   ├── print/
│   │   ├── AtmosphericReadings.tsx
│   │   ├── ComparisonBars.tsx
│   │   └── CarbonEquivalents.tsx
│   ├── oracle/
│   │   ├── ChatWindow.tsx
│   │   ├── MessageBubble.tsx
│   │   └── PromptChips.tsx
│   ├── simulate/
│   │   └── MorphingLab.tsx
│   └── ui/
│       ├── HUDPanel.tsx        # Glassmorphic floating panel component
│       ├── NebulaCursor.tsx    # Custom cursor component
│       ├── CountUp.tsx         # Number animation component
│       ├── NavDots.tsx         # Floating dot navigation
│       └── GrainOverlay.tsx    # SVG noise texture overlay
├── lib/
│   ├── carbon-calculator.ts    # All pure calculation functions
│   ├── gemini.ts               # Gemini client + key validation
│   ├── nebula-math.ts          # Particle system math utilities
│   └── constants.ts            # Emission factors, equivalents, challenge data
├── types/
│   └── index.ts                # All TypeScript interfaces
├── __tests__/
│   ├── carbon-calculator.test.ts
│   ├── api/oracle.test.ts
│   └── components/AetherCanvas.test.tsx
├── public/
│   └── favicon.ico
├── .env.local                  # GITIGNORED
├── .env.example                # Committed: GEMINI_API_KEY=your_key_here
├── .gitignore                  # Must include .env.local, node_modules, .next
├── README.md
├── tailwind.config.ts
├── tsconfig.json               # strict: true
├── jest.config.ts
├── .eslintrc.json
├── .prettierrc
└── next.config.js              # CSP headers
```

---

## README.md (generate this exactly):

```markdown
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
git clone https://github.com/[GITHUB_USERNAME]/aetherprint
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
[DEPLOYED_LINK]
```

---

## BUILD ORDER (follow exactly, tell me after each step):

**Step 1** — Project setup
- Create Next.js 14 app with TypeScript strict, Tailwind, ESLint, Prettier
- Install ALL dependencies in one go: framer-motion recharts @google/generative-ai zod lucide-react canvas-confetti jest @testing-library/react @testing-library/jest-dom
- Set up tsconfig strict mode, jest.config.ts, .eslintrc, .prettierrc
- Create .env.local with GEMINI_API_KEY, create .gitignore, create .env.example
- After: "✅ Step 1 complete. Run npm run dev — you should see Next.js default page."

**Step 2** — Types + Constants + Calculator engine
- Write ALL types in types/index.ts
- Write lib/constants.ts with ALL emission factors
- Write lib/carbon-calculator.ts with ALL pure functions
- Write lib/nebula-math.ts
- Write __tests__/carbon-calculator.test.ts
- After: "✅ Step 2 complete. Run npm test — all calculator tests should pass."

**Step 3** — Nebula Engine
- Build components/nebula/AetherCanvas.tsx (full particle system)
- Test it renders on a blank page
- After: "✅ Step 3 complete. Tell me: does the nebula animate on screen?"

**Step 4** — UI primitives + Layout
- HUDPanel, NebulaCursor, CountUp, NavDots, GrainOverlay
- Root layout.tsx: fonts, grain, cursor, nav, global CSS variables
- After: "✅ Step 4 complete. Check the cursor and grain overlay."

**Step 5** — Landing page /
- Full landing page with nebula + hero text + CTA
- After: "✅ Step 5 complete. Check the landing page — does it feel right?"

**Step 6** — Calculator wizard /map
- All 5 wizard steps with real-time nebula update
- After: "✅ Step 6 complete. Fill in the form — does the nebula change as you type?"

**Step 7** — Results page /print
- Atmospheric readings, comparison bars, equivalents
- After: "✅ Step 7 complete. Do the readings match what you entered?"

**Step 8** — Gemini API route + Oracle page /oracle
- lib/gemini.ts, api/oracle/route.ts, full chat interface
- After: "✅ Step 8 complete. Send a message — does The Atmospherist respond with your data?"

**Step 9** — Morphing Lab /simulate
- Sliders + dual nebula + real-time comparison
- After: "✅ Step 9 complete. Move a slider — does the right nebula change?"

**Step 10** — API tests + accessibility pass
- Write remaining tests
- Full ARIA audit: add all labels, fix tab order, add skip link
- After: "✅ Step 10 complete. Run npm test — all tests should pass."

**Step 11** — Final polish + README + deploy prep
- Generate README.md with my details
- Verify .gitignore is correct
- Final ESLint + Prettier pass
- next.config.js CSP headers
- After: "✅ AETHERPRINT is ready. Push to GitHub, add GEMINI_API_KEY to Vercel environment variables, deploy."

If anything is ambiguous at any step, ask me before proceeding. Show me code before and after any major decisions.
```

---

---
---

# ═══════════════════════════════════
# YOUR ANSWERS — HAVE THESE READY:
# ═══════════════════════════════════

| Question Antigravity asks | Your answer |
|---|---|
| Gemini API Key | Get from → aistudio.google.com/app/apikey → Create key → starts with `AIza...` |
| GitHub username | Your GitHub username |
| Vercel URL slug | `aetherprint` (your app will be at aetherprint.vercel.app) |

---

# ═══════════════════════════════════
# GET YOUR GEMINI 2.5 FLASH KEY:
# ═══════════════════════════════════

1. Go to → https://aistudio.google.com/app/apikey
2. Log in with Google
3. Click **"Create API key"** → **"Create API key in new project"**
4. Copy the key (starts with `AIza...`)
5. Give it to Antigravity when asked — it goes into `.env.local` which is gitignored

> Gemini 2.5 Flash is free tier — generous quota, fast, supports streaming.
> The model string used in code is: `"gemini-2.5-flash"`

---

# ═══════════════════════════════════
# DEPLOY BEFORE SUBMITTING:
# ═══════════════════════════════════

1. Push to GitHub → public repo, branch: `main`
2. Go to vercel.com → Add New Project → Import your repo
3. Under **Environment Variables** → add `GEMINI_API_KEY` = your key
4. Deploy → get your `https://aetherprint.vercel.app` URL
5. Submit that as your Deployed Link
6. Repo size will be well under 10MB (no binary assets)

---

# ══════════════════════════
# WHY THIS WINS:
# ══════════════════════════

| Criteria | What we built |
|---|---|
| Never seen before | ✅ Carbon footprint as a particle nebula. No one has done this. |
| Code Quality | ✅ TypeScript strict, clean module structure, ESLint + Prettier |
| Security | ✅ Gemini key server-side only, Zod validation, CSP headers |
| Efficiency | ✅ Canvas2D (no heavy 3D lib), Next.js App Router, lazy loading |
| Testing | ✅ Jest unit tests covering every emission factor + API route |
| Accessibility | ✅ Full ARIA, keyboard nav, focus management, skip link |
| Time Multiplier | ✅ Submit today — you're #2/29619. One day-1 submission locks the rank. |
