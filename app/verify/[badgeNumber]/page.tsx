'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { CheckCircle, Clock, MapPin, Building, Mail, Phone, Calendar, Users, MessageSquare } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/lib/lang-context'
import fr from '@/messages/fr.json'
import en from '@/messages/en.json'

interface Profile {
  id: string
  full_name: string
  organization: string
  email: string
  phone: string
  country: string
  category: string
  domain: string
  badge_number: string
  verified: boolean
  created_at: string
}

interface Panel {
  id: string
  title: string
  title_en: string
  day: number
  startTime: string
  room: string
  category: string
  category_en: string
  registered: number
  capacity: number
}

interface Meeting {
  id: string
  ngo_name: string
  ngo_acronym: string
  day: string
  time: string
  status: string
}

const categoryLabels: Record<string, { fr: string; en: string; color: string }> = {
  visiteur: { fr: 'Visiteur', en: 'Visitor', color: 'bg-gray-500' },
  participant: { fr: 'Participant', en: 'Participant', color: 'bg-blue-500' },
  exposant: { fr: 'Exposant', en: 'Exhibitor', color: 'bg-primary-600' },
  vip_b2b: { fr: 'VIP B2B', en: 'VIP B2B', color: 'bg-purple-600' },
}

const mockPanels: Panel[] = [
  { id: 'panel-1', title: 'Financement de l\'action humanitaire au Mali', title_en: 'Financing humanitarian action in Mali', day: 1, startTime: '09:00', room: 'Grande Salle', category: 'Plénière', category_en: 'Plenary', registered: 147, capacity: 200 },
  { id: 'panel-2', title: 'Genre, autonomisation et développement inclusif', title_en: 'Gender, empowerment and inclusive development', day: 1, startTime: '14:00', room: 'Salle Bleue A', category: 'Atelier', category_en: 'Workshop', registered: 89, capacity: 100 },
  { id: 'panel-3', title: 'Innovations technologiques au service de l\'humanitaire', title_en: 'Technological innovations for humanitarian action', day: 2, startTime: '10:00', room: 'Salle Innovation', category: 'Conférence', category_en: 'Conference', registered: 150, capacity: 150 },
]

export default function VerifyPage() {
  const params = useParams()
  const badgeNumber = params.badgeNumber as string
  const { lang } = useLang()
  const t = lang === 'fr' ? fr : en
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reservedPanels, setReservedPanels] = useState<string[]>([])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('badge_number', badgeNumber)
          .single()

        if (fetchError || !data) {
          setError(lang === 'fr' ? 'Badge non trouvé' : 'Badge not found')
          setLoading(false)
          return
        }

        setProfile(data)

        const { data: reservations } = await supabase
          .from('panel_reservations')
          .select('panel_id')
          .eq('user_id', data.user_id)

        if (reservations) {
          setReservedPanels(reservations.map(r => r.panel_id))
        }
      } catch (err) {
        console.error(err)
        setError(lang === 'fr' ? 'Erreur lors du chargement' : 'Loading error')
      }
      setLoading(false)
    }

    if (badgeNumber) {
      fetchProfile()
    }
  }, [badgeNumber, lang])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">❌</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">
            {lang === 'fr' ? 'Badge non trouvé' : 'Badge not found'}
          </h1>
          <p className="text-gray-500">
            {lang === 'fr' 
              ? 'Ce badge n\'existe pas dans notre système.' 
              : 'This badge does not exist in our system.'}
          </p>
          <div className="mt-6 p-4 bg-gray-100 rounded-xl">
            <p className="text-sm text-gray-500 font-mono">{badgeNumber}</p>
          </div>
        </div>
      </div>
    )
  }

  const catInfo = categoryLabels[profile.category] || categoryLabels['visiteur']
  const catLabel = lang === 'fr' ? catInfo.fr : catInfo.en
  const myReservedPanels = mockPanels.filter(p => reservedPanels.includes(p.id))

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 to-primary-900">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <img src="/logo-sahd-web.png" alt="SAHD 2026" className="h-16 mx-auto mb-4" style={{ filter: 'brightness(0) invert(1)' }} />
          <div className="inline-flex items-center gap-2 bg-accent-orange text-white px-4 py-2 rounded-full text-sm font-bold">
            {profile.verified ? (
              <><CheckCircle size={16} /> {lang === 'fr' ? 'Badge vérifié' : 'Verified badge'}</>
            ) : (
              <><Clock size={16} /> {lang === 'fr' ? 'En attente de validation' : 'Pending validation'}</>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
          <div className={`bg-gradient-to-r ${profile.category === 'vip_b2b' ? 'from-purple-600 to-purple-500' : 'from-primary-900 to-primary-700'} p-6 text-white`}>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-black">
                {profile.full_name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-black">{profile.full_name}</h1>
                <p className="text-white/80">{profile.organization}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`${catInfo.color} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                    {catLabel}
                  </span>
                  <span className="bg-white/20 text-white text-xs font-mono px-3 py-1 rounded-full">
                    {profile.badge_number}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Mail size={20} className="text-primary-600" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-semibold text-gray-900">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Phone size={20} className="text-primary-600" />
                <div>
                  <p className="text-xs text-gray-500">{lang === 'fr' ? 'Téléphone' : 'Phone'}</p>
                  <p className="text-sm font-semibold text-gray-900">{profile.phone || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <MapPin size={20} className="text-primary-600" />
                <div>
                  <p className="text-xs text-gray-500">{lang === 'fr' ? 'Pays' : 'Country'}</p>
                  <p className="text-sm font-semibold text-gray-900">{profile.country || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Building size={20} className="text-primary-600" />
                <div>
                  <p className="text-xs text-gray-500">{lang === 'fr' ? 'Domaine' : 'Domain'}</p>
                  <p className="text-sm font-semibold text-gray-900">{profile.domain || '—'}</p>
                </div>
              </div>
            </div>

            {reservedPanels.length > 0 ? (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar size={20} className="text-accent-orange" />
                  <h2 className="text-lg font-bold text-gray-900">
                    {lang === 'fr' ? 'Panels réservés' : 'Reserved panels'}
                  </h2>
                  <span className="bg-primary-100 text-primary-800 text-xs font-bold px-2 py-1 rounded-full">
                    {myReservedPanels.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {myReservedPanels.map(panel => (
                    <div key={panel.id} className="bg-gradient-to-r from-primary-50 to-blue-50 p-4 rounded-xl border border-primary-100">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">
                            {lang === 'fr' ? panel.title : panel.title_en}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-medium">
                              {lang === 'fr' ? 'Jour' : 'Day'} {panel.day}
                            </span>
                            <span>🕐 {panel.startTime}</span>
                            <span>📍 {panel.room}</span>
                          </div>
                        </div>
                        <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-gray-500">{lang === 'fr' ? 'Places' : 'Seats'}:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(panel.registered / panel.capacity) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-600">
                          {panel.registered}/{panel.capacity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-6 p-6 bg-gray-50 rounded-xl text-center">
                <Calendar size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500 font-medium">
                  {lang === 'fr' ? 'Aucun panel réservé' : 'No panels reserved'}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {lang === 'fr' 
                    ? 'Ce participant n\'a pas encore réservé de panels.' 
                    : 'This participant has not reserved any panels yet.'}
                </p>
              </div>
            )}

            {profile.category === 'vip_b2b' && (
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={20} className="text-purple-600" />
                  <h2 className="font-bold text-gray-900">VIP B2B</h2>
                </div>
                <p className="text-sm text-gray-600">
                  {lang === 'fr' 
                    ? 'Accès complet à l\'espace networking B2B, annuaire ONG et messagerie.' 
                    : 'Full access to B2B networking space, NGO directory and messaging.'}
                </p>
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-6 py-4 text-center">
            <p className="text-xs text-gray-400">
              SAHD 2026 · {lang === 'fr' ? 'Palais des Congrès de Bamako' : 'Congress Palace of Bamako'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              14, 15 & 16 Mai 2026
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href={`https://sahd-mali.org`} className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors">
            ← {lang === 'fr' ? 'Retour au site' : 'Back to site'}
          </a>
        </div>
      </div>
    </div>
  )
}
