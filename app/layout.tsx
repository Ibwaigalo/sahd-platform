// app/layout.tsx
import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CookieBanner from '@/components/ui/CookieBanner'
import QueryProvider from '@/components/providers/QueryProvider'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit',
})

export const metadata: Metadata = {
  title: {
    default: 'SAHD 2026 – Salon de l\'Action Humanitaire et du Développement au Mali',
    template: '%s | SAHD 2026',
  },
  description: 'La plateforme officielle du Salon de l\'Action Humanitaire et du Développement au Mali. 14–16 Mai 2026, Bamako. Inscriptions, Programme, Intervenants, Networking B2B.',
  keywords: ['SAHD', 'Mali', 'humanitaire', 'développement', 'ONG', 'Bamako', 'salon'],
  authors: [{ name: 'SAHD Mali' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://sahd-mali.org',
    siteName: 'SAHD 2026',
    title: 'SAHD 2026 – Salon de l\'Action Humanitaire et du Développement',
    description: '14–16 Mai 2026, Palais des Congrès de Bamako, Mali. Rejoignez la plateforme nationale de référence pour l\'action humanitaire.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SAHD 2026 – Mali',
    description: 'Salon de l\'Action Humanitaire et du Développement',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://sahd-mali.org'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={outfit.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="icon" href="/favicon-64.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon-64.png" />
      </head>
      <body className="font-sans bg-white text-gray-900 antialiased">
        <QueryProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <CookieBanner />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e3a8a',
                color: '#fff',
                borderRadius: '12px',
                fontFamily: 'Outfit, sans-serif',
              },
              success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  )
}
