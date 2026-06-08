import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Mono, Syne } from 'next/font/google'
import './globals.css'
import { GrainOverlay } from '../components/ui/GrainOverlay'
import { NebulaCursor } from '../components/ui/NebulaCursor'
import { NavDots } from '../components/ui/NavDots'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-dm-mono',
  weight: ['300', '400', '500'],
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'AETHERPRINT — Your Carbon Signature on the Sky',
  description:
    'A procedurally generated atmospheric particle signature mapped from your annual carbon emissions. Mapped using IPCC factors. Not a metric, an experience.',
  metadataBase: new URL('https://aetherprint.vercel.app'),
  openGraph: {
    title: 'AETHERPRINT — Your Carbon Signature on the Sky',
    description: 'Transform your carbon emissions footprint into a living atmospheric signature.',
    url: 'https://aetherprint.vercel.app',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Aetherprint Atmospheric Nebula',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AETHERPRINT — Your Carbon Signature on the Sky',
    description: 'Transform your carbon emissions footprint into a living atmospheric signature.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmMono.variable} ${syne.variable} h-full w-full`}
    >
      <body className="font-sans antialiased bg-black text-[#F0EDE8] w-full h-full overflow-hidden select-none relative">
        {/* Skip to main content link for screen readers */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only fixed top-4 left-4 z-[9999] px-4 py-2 bg-black border border-[var(--accent)] text-[var(--accent)] font-mono text-xs focus-visible-ring"
        >
          SKIP TO CONTENT
        </a>

        {/* Global effects and navigation */}
        <GrainOverlay />
        <NebulaCursor />
        <NavDots />

        <main id="main-content" className="w-full h-full relative" tabIndex={-1}>
          {children}
        </main>
      </body>
    </html>
  )
}
