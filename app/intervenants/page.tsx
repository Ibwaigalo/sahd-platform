'use client'
import { useLang } from '@/lib/lang-context'
import fr from '@/messages/fr.json'
import en from '@/messages/en.json'

export default function IntervenantsPage() {
  const { lang } = useLang()
  const t = lang === 'fr' ? fr : en

  return (
    <div className="pt-20">
      <div className="bg-gradient-to-br from-primary-950 to-primary-900 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-accent-orange font-bold text-sm uppercase tracking-widest mb-3">{t.speakers.label}</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{t.speakers.title}</h1>
          <div className="section-divider mx-auto" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 text-lg">
          {lang === 'fr' ? 'Les intervenants seront bientôt annoncés.' : 'Speakers will be announced soon.'}
        </p>
      </div>
    </div>
  )
}
