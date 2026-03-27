'use client'
import { motion } from 'framer-motion'
import { useLang } from '@/lib/lang-context'
import fr from '@/messages/fr.json'
import en from '@/messages/en.json'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function ProgrammePage() {
  const { lang } = useLang()
  const t = lang === 'fr' ? fr : en

  return (
    <div className="pt-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-950 to-primary-900 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-accent-orange font-bold text-sm uppercase tracking-widest mb-3">{t.programme.label}</p>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{t.programme.title}</h1>
            <div className="section-divider mx-auto mb-6" />
            <p className="text-white/70 max-w-2xl mx-auto">{t.programme.desc}</p>
          </motion.div>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-3xl p-12 border border-primary-100 text-center">
          <div className="text-7xl mb-6">🔔</div>
          <h2 className="text-3xl font-black text-primary-900 mb-4">
            {lang === 'fr' ? 'Programme en cours de finalisation' : 'Programme being finalized'}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto mb-8">
            {lang === 'fr'
              ? "Le programme officiel du SAHD-Mali 2026 sera bientôt disponible. Restez connectés pour découvrir les panels, ateliers et sessions qui animeront les 3 jours de l'événement."
              : "The official SAHD-Mali 2026 programme will be available soon. Stay tuned to discover the panels, workshops and sessions that will animate the 3 days of the event."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-white rounded-2xl p-6 shadow-md flex-1">
              <div className="text-3xl font-black text-primary-900 mb-2">14</div>
              <div className="text-sm text-gray-600">{lang === 'fr' ? 'Mai 2026' : 'May 2026'}</div>
              <div className="text-xs text-gray-500 mt-1">{t.programme.day1_theme}</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md flex-1">
              <div className="text-3xl font-black text-primary-900 mb-2">15</div>
              <div className="text-sm text-gray-600">{lang === 'fr' ? 'Mai 2026' : 'May 2026'}</div>
              <div className="text-xs text-gray-500 mt-1">{t.programme.day2_theme}</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md flex-1">
              <div className="text-3xl font-black text-primary-900 mb-2">16</div>
              <div className="text-sm text-gray-600">{lang === 'fr' ? 'Mai 2026' : 'May 2026'}</div>
              <div className="text-xs text-gray-500 mt-1">{t.programme.day3_theme}</div>
            </div>
          </div>
          <div className="mt-8">
            <Link href="/inscription" className="inline-flex items-center gap-2 bg-primary-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-800 transition-colors">
              {lang === 'fr' ? "S'inscrire pour être notifié" : "Register to be notified"} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
