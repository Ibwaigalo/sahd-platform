'use client'
// components/ui/CookieBanner.tsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('sahd_cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem('sahd_cookie_consent', 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem('sahd_cookie_consent', 'declined')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-gray-950 border-t border-gray-800 p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-1">
              <p className="text-white font-semibold text-sm mb-1">🍪 Nous utilisons des cookies</p>
              <p className="text-gray-400 text-sm">
                Ce site utilise des cookies pour améliorer votre expérience et analyser notre trafic, conformément au RGPD.{' '}
                <Link href="/privacy" className="text-accent-orange underline">En savoir plus</Link>
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={decline}
                className="px-5 py-2.5 rounded-xl border border-gray-600 text-gray-300 text-sm font-medium hover:border-gray-400 transition-colors"
              >
                Refuser
              </button>
              <button
                onClick={accept}
                className="px-5 py-2.5 rounded-xl bg-accent-orange text-white text-sm font-bold hover:bg-green-500 transition-colors"
              >
                Accepter
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
