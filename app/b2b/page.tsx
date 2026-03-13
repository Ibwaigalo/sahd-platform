'use client'
// app/b2b/page.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MessageSquare, Users, Star, Search, Filter } from 'lucide-react'
import { mockNGOs } from '@/lib/mock-data'
import toast from 'react-hot-toast'

const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30']
const days = ['14 Mai 2026', '15 Mai 2026', '16 Mai 2026']

export default function B2BPage() {
  const [activeSection, setActiveSection] = useState<'directory' | 'meetings' | 'chat'>('directory')
  const [selectedNGO, setSelectedNGO] = useState<typeof mockNGOs[0] | null>(null)
  const [meetingModal, setMeetingModal] = useState<typeof mockNGOs[0] | null>(null)
  const [selectedDay, setSelectedDay] = useState(days[0])
  const [selectedTime, setSelectedTime] = useState('')

  const handleRequestMeeting = () => {
    if (!selectedTime) {
      toast.error('Veuillez sélectionner un créneau')
      return
    }
    toast.success(`✅ Demande de RDV envoyée à ${meetingModal?.name} pour le ${selectedDay} à ${selectedTime}`)
    setMeetingModal(null)
    setSelectedTime('')
  }

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-950 to-primary-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="vip-badge">VIP</span>
            <span className="text-white/60 text-sm">Accès restreint – Exposants & Participants B2B</span>
          </div>
          <h1 className="text-3xl font-black text-white">Espace Networking B2B</h1>
          <p className="text-white/70 mt-1">Rencontrez des partenaires stratégiques, planifiez des rendez-vous et échangez en direct</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="max-w-7xl mx-auto flex gap-0">
          {[
            { id: 'directory', label: 'Annuaire ONG', icon: Users },
            { id: 'meetings', label: 'Mes RDV', icon: Calendar },
            { id: 'chat', label: 'Messagerie', icon: MessageSquare },
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-semibold text-sm transition-all ${
                  activeSection === tab.id
                    ? 'border-primary-900 text-primary-900'
                    : 'border-transparent text-gray-500 hover:text-primary-900'
                }`}
              >
                <Icon size={16} /> {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Directory */}
        {activeSection === 'directory' && (
          <div>
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  placeholder="Rechercher une ONG..."
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-primary-700 bg-white"
                />
              </div>
              <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-600 px-5 py-3 rounded-2xl font-medium hover:bg-gray-50">
                <Filter size={16} /> Filtrer par domaine
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockNGOs.map((ngo, i) => (
                <motion.div
                  key={ngo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-lift"
                >
                  <div className="bg-gradient-to-br from-primary-50 to-blue-50 p-6 flex items-start gap-4">
                    <div className="w-14 h-14 bg-primary-900 rounded-xl flex items-center justify-center text-3xl">
                      {ngo.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-black text-primary-900 text-lg leading-tight">{ngo.acronym}</h3>
                          <p className="text-gray-600 text-sm truncate">{ngo.name}</p>
                        </div>
                      </div>
                      <span className="bg-primary-100 text-primary-800 text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block">
                        {ngo.domain}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">{ngo.description}</p>
                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                      {[
                        { label: 'Staff', value: ngo.employees },
                        { label: 'Bénéficiaires', value: ngo.beneficiaires },
                        { label: 'Régions', value: ngo.regions.length },
                      ].map(stat => (
                        <div key={stat.label} className="bg-gray-50 rounded-lg p-2">
                          <div className="font-black text-primary-900 text-sm">{stat.value}</div>
                          <div className="text-gray-500 text-xs">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setMeetingModal(ngo)}
                        className="flex-1 bg-primary-900 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-primary-800 transition-colors"
                      >
                        📅 Demander RDV
                      </button>
                      <button
                        onClick={() => toast.success(`Message envoyé à ${ngo.acronym}`)}
                        className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors"
                      >
                        💬
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Meetings */}
        {activeSection === 'meetings' && (
          <div className="max-w-2xl">
            <h2 className="font-black text-primary-900 text-xl mb-6">Mes rendez-vous B2B</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
              <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-semibold mb-1">Aucun RDV planifié</p>
              <p className="text-gray-400 text-sm">Parcourez l'annuaire et demandez des rendez-vous avec les ONG partenaires</p>
              <button
                onClick={() => setActiveSection('directory')}
                className="mt-4 bg-primary-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-800 transition-colors"
              >
                Voir l'annuaire →
              </button>
            </div>
          </div>
        )}

        {/* Chat */}
        {activeSection === 'chat' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h2 className="font-bold text-gray-900">Messagerie B2B (Temps réel)</h2>
                <p className="text-xs text-gray-500">Propulsé par Supabase Realtime</p>
              </div>
              <div className="h-80 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <MessageSquare size={40} className="mx-auto mb-2 opacity-30" />
                  <p className="font-semibold text-sm">Connectez-vous pour accéder à la messagerie</p>
                  <p className="text-xs mt-1">Supabase Realtime activé après configuration</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Meeting Request Modal */}
      {meetingModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setMeetingModal(null)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-black text-primary-900 mb-1">Demander un RDV</h2>
            <p className="text-gray-500 text-sm mb-6">avec {meetingModal.name} ({meetingModal.acronym})</p>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Choisir un jour</label>
              <div className="flex gap-2">
                {days.map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedDay === d ? 'bg-primary-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {d.split(' ')[0]} {d.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Choisir un créneau (30 min)</label>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedTime === t ? 'bg-accent-orange text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setMeetingModal(null)}
                className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleRequestMeeting}
                className="flex-1 bg-primary-900 text-white py-3 rounded-xl font-bold hover:bg-primary-800 transition-colors"
              >
                Confirmer →
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
