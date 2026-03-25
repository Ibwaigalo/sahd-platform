'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Linkedin, ExternalLink } from 'lucide-react'
import { mockSpeakers } from '@/lib/mock-data'
import { useLang } from '@/lib/lang-context'
import fr from '@/messages/fr.json'
import en from '@/messages/en.json'

export default function IntervenantsPage() {
  const [search, setSearch] = useState('')
  const [selectedDomain, setSelectedDomain] = useState('all')
  const [selectedSpeaker, setSelectedSpeaker] = useState<typeof mockSpeakers[0] | null>(null)
  const { lang } = useLang()
  const t = lang === 'fr' ? fr : en

  const domains = ['all', ...Array.from(new Set(mockSpeakers.map(s => s.domain)))]

  const filtered = mockSpeakers.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.organization.toLowerCase().includes(search.toLowerCase())
    const matchDomain = selectedDomain === 'all' || s.domain === selectedDomain
    return matchSearch && matchDomain
  })

  return (
    <div className="pt-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-950 to-primary-900 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-accent-orange font-bold text-sm uppercase tracking-widest mb-3">{t.speakers.label}</p>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{t.speakers.title}</h1>
            <div className="section-divider mx-auto mb-6" />
            <p className="text-white/70 max-w-2xl mx-auto">
              {mockSpeakers.length} {lang === 'fr' ? 'experts de haut niveau issus de l\'humanitaire, du développement et des institutions internationales' : 'high-level experts from humanitarian, development and international institutions'}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder={t.speakers.search_placeholder} value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100" />
          </div>
          <div className="flex flex-wrap gap-2">
            {domains.slice(0, 5).map(d => (
              <button key={d} onClick={() => setSelectedDomain(d)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${selectedDomain === d ? 'bg-primary-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300'}`}>
                {d === 'all' ? `${t.speakers.all} (${mockSpeakers.length})` : d}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((speaker, i) => (
            <motion.div key={speaker.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedSpeaker(speaker)}
              className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden cursor-pointer card-lift group">
              <div className="relative">
                <img src={speaker.avatar} alt={speaker.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                {speaker.featured && (
                  <div className="absolute top-3 right-3 bg-accent-gold text-white text-xs font-bold px-2 py-1 rounded-full">
                    ⭐ {t.speakers.featured}
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-black text-gray-900 text-lg leading-tight">{speaker.name}</h3>
                <p className="text-primary-700 font-semibold text-sm mt-0.5">{speaker.title}</p>
                <p className="text-gray-500 text-sm">{speaker.organization}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="bg-primary-50 text-primary-800 text-xs px-3 py-1 rounded-full font-medium">
                    {lang === 'fr' ? speaker.domain : speaker.domain_en}
                  </span>
                  <a href={speaker.linkedin} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-blue-600 hover:text-blue-800 transition-colors">
                    <Linkedin size={16} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">🔍</div>
            <p className="font-semibold">{t.speakers.not_found}</p>
          </div>
        )}
      </div>

      {/* Speaker Modal */}
      {selectedSpeaker && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedSpeaker(null)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="relative">
              <img src={selectedSpeaker.avatar} alt={selectedSpeaker.name} className="w-full h-56 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button onClick={() => setSelectedSpeaker(null)}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/40 transition-colors">✕</button>
              <div className="absolute bottom-4 left-6 text-white">
                <h2 className="text-2xl font-black">{selectedSpeaker.name}</h2>
                <p className="text-white/80">{selectedSpeaker.title} – {selectedSpeaker.organization}</p>
              </div>
            </div>
            <div className="p-6">
              <div className="flex gap-2 mb-4">
                <span className="bg-primary-50 text-primary-800 text-xs px-3 py-1 rounded-full font-bold">
                  {lang === 'fr' ? selectedSpeaker.domain : selectedSpeaker.domain_en}
                </span>
                {selectedSpeaker.featured && <span className="bg-amber-50 text-amber-700 text-xs px-3 py-1 rounded-full font-bold">{t.speakers.featured_badge}</span>}
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                {lang === 'fr' ? selectedSpeaker.bio : selectedSpeaker.bio_en}
              </p>
              <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">{t.speakers.sessions} : {selectedSpeaker.sessions.length} {t.speakers.panels}</p>
                <a href={selectedSpeaker.linkedin} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors">
                  <Linkedin size={16} /> LinkedIn <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
