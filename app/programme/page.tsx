'use client'
// app/programme/page.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, MapPin, Users, Download, Filter } from 'lucide-react'
import { mockPanels, mockSpeakers } from '@/lib/mock-data'
import toast from 'react-hot-toast'
import type { Metadata } from 'next'

export default function ProgrammePage() {
  const [activeDay, setActiveDay] = useState(1)
  const [reservedPanels, setReservedPanels] = useState<string[]>([])

  const days = [
    { day: 1, date: '14 Mai 2026', theme: 'Financement & Gouvernance' },
    { day: 2, date: '15 Mai 2026', theme: 'Innovation & Technologie' },
    { day: 3, date: '16 Mai 2026', theme: 'Capitalisation & Perspectives' },
  ]

  const filteredPanels = mockPanels.filter(p => p.day === activeDay)

  const handleReserve = (panelId: string, panelTitle: string, isFull: boolean) => {
    if (isFull) {
      toast.success(`Vous avez été ajouté à la liste d'attente`)
      return
    }
    if (reservedPanels.includes(panelId)) {
      setReservedPanels(prev => prev.filter(id => id !== panelId))
      toast.success('Réservation annulée')
      return
    }
    setReservedPanels(prev => [...prev, panelId])
    toast.success(`✅ Panel réservé ! Vérifiez votre email.`)
  }

  const getSpeakersForPanel = (speakerIds: string[]) =>
    mockSpeakers.filter(s => speakerIds.includes(s.id))

  return (
    <div className="pt-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-950 to-primary-900 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-accent-orange font-bold text-sm uppercase tracking-widest mb-3">SAHD 2026</p>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Programme Officiel</h1>
            <div className="section-divider mx-auto mb-6" />
            <p className="text-white/70 max-w-2xl mx-auto">
              3 jours de panels, ateliers, networking et sessions plénières au Palais des Congrès de Bamako
            </p>
          </motion.div>
        </div>
      </div>

      {/* Day tabs */}
      <div className="bg-white sticky top-20 z-40 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-0">
            {days.map(({ day, date, theme }) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`flex-shrink-0 flex flex-col items-center px-8 py-4 border-b-2 transition-all font-medium ${
                  activeDay === day
                    ? 'border-primary-900 text-primary-900'
                    : 'border-transparent text-gray-500 hover:text-primary-900'
                }`}
              >
                <span className="font-black text-lg">Jour {day}</span>
                <span className="text-xs">{date}</span>
                <span className="text-xs text-gray-400 mt-0.5">{theme}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Panels */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {filteredPanels.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-6xl mb-4">📅</div>
            <p className="font-semibold">Programme en cours de finalisation pour ce jour</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPanels.map((panel, i) => {
              const isFull = panel.registered >= panel.capacity
              const isReserved = reservedPanels.includes(panel.id)
              const speakers = getSpeakersForPanel(panel.speakers)
              const fillPct = Math.min((panel.registered / panel.capacity) * 100, 100)

              return (
                <motion.div
                  key={panel.id}
                  id={panel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
                >
                  <div className="h-1.5" style={{ background: panel.color }} />
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Main content */}
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                            {panel.category}
                          </span>
                          {isFull && (
                            <span className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full">
                              Complet – Liste d'attente
                            </span>
                          )}
                        </div>

                        <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-3">{panel.title}</h2>
                        <p className="text-gray-600 leading-relaxed mb-5">{panel.description}</p>

                        {/* Meta info */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-5">
                          <div className="flex items-center gap-1.5">
                            <Clock size={15} className="text-primary-700" />
                            {panel.startTime} – {panel.endTime}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin size={15} className="text-primary-700" />
                            {panel.room}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users size={15} className="text-primary-700" />
                            {panel.registered}/{panel.capacity} participants
                          </div>
                        </div>

                        {/* Capacity bar */}
                        <div className="mb-5">
                          <div className="capacity-bar">
                            <div
                              className="capacity-fill"
                              style={{
                                width: `${fillPct}%`,
                                background: isFull ? '#ef4444' : fillPct > 80 ? '#f59e0b' : '#10B981',
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>Taux de remplissage : {Math.round(fillPct)}%</span>
                            <span>{isFull ? 'Aucune place disponible' : `${panel.capacity - panel.registered} places restantes`}</span>
                          </div>
                        </div>

                        {/* Speakers */}
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Intervenants</p>
                          <div className="flex flex-wrap gap-3">
                            {speakers.map(speaker => (
                              <div key={speaker.id} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                                <img src={speaker.avatar} alt={speaker.name} className="w-8 h-8 rounded-lg object-cover" />
                                <div>
                                  <div className="text-xs font-bold text-gray-800">{speaker.name}</div>
                                  <div className="text-xs text-gray-500">{speaker.organization}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* CTA sidebar */}
                      <div className="lg:w-48 flex flex-row lg:flex-col gap-3">
                        <button
                          onClick={() => handleReserve(panel.id, panel.title, isFull)}
                          className={`flex-1 lg:flex-none py-3 px-6 rounded-xl font-bold text-sm transition-all ${
                            isReserved
                              ? 'bg-accent-orange text-white hover:bg-red-500'
                              : isFull
                              ? 'bg-amber-500 text-white hover:bg-amber-600'
                              : 'bg-primary-900 text-white hover:bg-primary-700'
                          }`}
                        >
                          {isReserved ? '✅ Réservé' : isFull ? '⏳ Liste d\'attente' : 'Réserver'}
                        </button>
                        <button
                          onClick={() => toast.success('Export en cours...')}
                          className="flex-1 lg:flex-none py-3 px-6 rounded-xl font-bold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                        >
                          <Download size={14} /> Fiche
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Export button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => toast.success('Programme exporté en PDF')}
            className="inline-flex items-center gap-2 border border-primary-900 text-primary-900 px-8 py-3 rounded-xl font-bold hover:bg-primary-50 transition-colors"
          >
            <Download size={18} /> Télécharger le programme complet (PDF)
          </button>
        </div>
      </div>
    </div>
  )
}
