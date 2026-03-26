'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Star, Calendar, X, Check, MessageSquare, Building2, Briefcase, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/lib/lang-context'
import fr from '@/messages/fr.json'
import en from '@/messages/en.json'

interface MatchResult {
  user_id: string
  full_name: string
  organization: string
  category: string
  domains: string[]
  looking_for: string | null
  offering: string | null
  match_score: number
  shared_domains: string[]
  badge_number: string | null
}

interface MatchmakingCardProps {
  match: MatchResult
  onRequestMeeting: (match: MatchResult) => void
  isVIP: boolean
}

const DOMAIN_LABELS: Record<string, { fr: string; en: string }> = {
  'sante': { fr: 'Santé', en: 'Health' },
  'education': { fr: 'Éducation', en: 'Education' },
  'nutrition': { fr: 'Nutrition', en: 'Nutrition' },
  'eau': { fr: 'Eau/Assainissement', en: 'Water/Sanitation' },
  'protection': { fr: 'Protection', en: 'Protection' },
  'genre': { fr: 'Genre', en: 'Gender' },
  'climat': { fr: 'Climat', en: 'Climate' },
  'securite-alimentaire': { fr: 'Sécurité Alimentaire', en: 'Food Security' },
  'financement': { fr: 'Financement', en: 'Funding' },
  'technologie': { fr: 'Technologie', en: 'Technology' },
  'coordination': { fr: 'Coordination', en: 'Coordination' },
  'economie': { fr: 'Économie', en: 'Economy' },
  'environnement': { fr: 'Environnement', en: 'Environment' },
}

const categoryColors: Record<string, string> = {
  vip_b2b: 'bg-amber-500',
  exposant: 'bg-primary-700',
  participant: 'bg-blue-600',
  admin: 'bg-red-600',
}

const categoryLabels: Record<string, { fr: string; en: string }> = {
  vip_b2b: { fr: 'VIP B2B', en: 'VIP B2B' },
  exposant: { fr: 'Exposant', en: 'Exhibitor' },
  participant: { fr: 'Participant', en: 'Participant' },
  admin: { fr: 'Admin', en: 'Admin' },
}

export default function MatchmakingCard({ match, onRequestMeeting, isVIP }: MatchmakingCardProps) {
  const { lang } = useLang()
  const t = lang === 'fr' ? fr : en
  const getDomainLabel = (domain: string) => DOMAIN_LABELS[domain]?.[lang] || domain

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-900 to-primary-700 flex items-center justify-center text-white font-bold text-lg">
            {match.full_name.split(' ').map(n => n[0]).slice(0, 2).join('')}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{match.full_name}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Building2 size={12} />
              {match.organization}
            </p>
          </div>
        </div>
        <span className={`${categoryColors[match.category] || 'bg-gray-500'} text-white text-xs px-2 py-1 rounded-full font-medium`}>
          {categoryLabels[match.category]?.[lang] || match.category}
        </span>
      </div>

      {match.shared_domains.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Star size={14} className="text-amber-500" />
            <span className="text-sm font-medium text-amber-700">
              {lang === 'fr' ? 'Domaines communs' : 'Shared domains'}
            </span>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              {Math.round(match.match_score * 100)}% {lang === 'fr' ? 'match' : 'match'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {match.shared_domains.map(domain => (
              <span key={domain} className="text-xs bg-primary-50 text-primary-800 px-2 py-1 rounded-full">
                {getDomainLabel(domain)}
              </span>
            ))}
          </div>
        </div>
      )}

      {match.offering && (
        <div className="mb-3 p-3 bg-green-50 rounded-lg">
          <p className="text-xs font-medium text-green-800 mb-1 flex items-center gap-1">
            <ArrowRight size={12} /> {lang === 'fr' ? 'Propose' : 'Offering'}
          </p>
          <p className="text-sm text-green-700">{match.offering}</p>
        </div>
      )}

      {match.looking_for && (
        <div className="mb-3 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs font-medium text-blue-800 mb-1 flex items-center gap-1">
            <Briefcase size={12} /> {lang === 'fr' ? 'Recherche' : 'Seeking'}
          </p>
          <p className="text-sm text-blue-700">{match.looking_for}</p>
        </div>
      )}

      {isVIP && (
        <button
          onClick={() => onRequestMeeting(match)}
          className="w-full mt-4 bg-primary-900 text-white py-2.5 rounded-xl font-semibold hover:bg-primary-800 transition-colors flex items-center justify-center gap-2"
        >
          <Calendar size={16} />
          {lang === 'fr' ? 'Proposer un rendez-vous' : 'Request a meeting'}
        </button>
      )}
    </motion.div>
  )
}

interface MeetingModalProps {
  match: MatchResult
  onClose: () => void
  onSuccess: () => void
}

export function MeetingModal({ match, onClose, onSuccess }: MeetingModalProps) {
  const { lang } = useLang()
  const t = lang === 'fr' ? fr : en
  const [selectedDay, setSelectedDay] = useState('2026-05-14')
  const [selectedTime, setSelectedTime] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const days = lang === 'fr' 
    ? [{ value: '2026-05-14', label: '14 Mai 2026' }, { value: '2026-05-15', label: '15 Mai 2026' }, { value: '2026-05-16', label: '16 Mai 2026' }]
    : [{ value: '2026-05-14', label: 'May 14, 2026' }, { value: '2026-05-15', label: 'May 15, 2026' }, { value: '2026-05-16', label: 'May 16, 2026' }]
  
  const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30']

  const handleSubmit = async () => {
    if (!selectedTime) {
      toast.error(lang === 'fr' ? 'Sélectionnez un créneau' : 'Select a time slot')
      return
    }

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const res = await fetch('/api/matchmaking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request_meeting',
          userId: user.id,
          targetUserId: match.user_id,
          meetingDate: selectedDay,
          meetingTime: selectedTime,
          message: message || null
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')

      toast.success(lang === 'fr' ? 'Demande envoyée !' : 'Request sent!')
      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-primary-900">
            {lang === 'fr' ? 'Demande de rendez-vous' : 'Meeting Request'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-900 to-primary-700 flex items-center justify-center text-white font-bold">
            {match.full_name.split(' ').map(n => n[0]).slice(0, 2).join('')}
          </div>
          <div>
            <p className="font-semibold">{match.full_name}</p>
            <p className="text-sm text-gray-500">{match.organization}</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {lang === 'fr' ? 'Jour' : 'Day'}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {days.map(day => (
              <button
                key={day.value}
                onClick={() => setSelectedDay(day.value)}
                className={`py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                  selectedDay === day.value
                    ? 'bg-primary-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {lang === 'fr' ? 'Horaire' : 'Time'}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {times.map(time => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                  selectedTime === time
                    ? 'bg-primary-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {lang === 'fr' ? 'Message (optionnel)' : 'Message (optional)'}
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={lang === 'fr' ? 'Présentez-vous et expliquez pourquoi vous souhaitez cette rencontre...' : 'Introduce yourself and explain why you want to meet...'}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-700 resize-none"
            rows={3}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
          >
            {lang === 'fr' ? 'Annuler' : 'Cancel'}
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedTime}
            className="flex-1 py-3 bg-primary-900 text-white rounded-xl font-medium hover:bg-primary-800 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-spin">↻</span>
            ) : (
              <>
                <Check size={16} />
                {lang === 'fr' ? 'Envoyer' : 'Send'}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

interface RecommendedSectionProps {
  userId: string
  isVIP: boolean
}

export function RecommendedSection({ userId, isVIP }: RecommendedSectionProps) {
  const { lang } = useLang()
  const t = lang === 'fr' ? fr : en
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch(`/api/matchmaking?userId=${userId}&limit=6`)
        const data = await res.json()
        if (data.matches) {
          setMatches(data.matches)
        }
      } catch (error) {
        console.error('Failed to fetch matches:', error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchMatches()
    }
  }, [userId])

  if (loading) {
    return (
      <div className="py-8 flex justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-900 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (matches.length === 0) {
    return null
  }

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
          <Star size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-primary-900">
            {lang === 'fr' ? 'Recommandés pour vous' : 'Recommended for you'}
          </h2>
          <p className="text-sm text-gray-500">
            {lang === 'fr' 
              ? `${matches.length} partenaires potentiels identifiés`
              : `${matches.length} potential partners identified`}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.slice(0, 6).map(match => (
          <MatchmakingCard
            key={match.user_id}
            match={match}
            onRequestMeeting={setSelectedMatch}
            isVIP={isVIP}
          />
        ))}
      </div>

      {selectedMatch && (
        <MeetingModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
          onSuccess={() => setMatches(prev => prev.filter(m => m.user_id !== selectedMatch.user_id))}
        />
      )}
    </div>
  )
}
