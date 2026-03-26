'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MessageSquare, Users, Search, Filter, Star, Check, X, Clock, Building2, Briefcase } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/lib/lang-context'
import { RecommendedSection, MeetingModal } from '@/components/MatchmakingCard'
import { RealtimeChat, ConversationsList } from '@/components/RealtimeChat'
import fr from '@/messages/fr.json'
import en from '@/messages/en.json'

function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj) || path
}

const DOMAIN_LABELS: Record<string, { fr: string; en: string }> = {
  'sante': { fr: 'Santé', en: 'Health' },
  'education': { fr: 'Éducation', en: 'Education' },
  'nutrition': { fr: 'Nutrition', en: 'Nutrition' },
  'eau': { fr: 'Eau/Assainissement', en: 'Water & Sanitation' },
  'protection': { fr: 'Protection', en: 'Protection' },
  'genre': { fr: 'Genre', en: 'Gender' },
  'climat': { fr: 'Climat', en: 'Climate' },
  'securite-alimentaire': { fr: 'Sécurité Alimentaire', en: 'Food Security' },
  'financement': { fr: 'Financement', en: 'Funding' },
  'technologie': { fr: 'Technologie', en: 'Technology' },
}

const categoryColors: Record<string, string> = {
  vip_b2b: 'bg-amber-500',
  exposant: 'bg-primary-700',
  participant: 'bg-blue-600',
}

const categoryLabels: Record<string, { fr: string; en: string }> = {
  vip_b2b: { fr: 'VIP B2B', en: 'VIP B2B' },
  exposant: { fr: 'Exposant', en: 'Exhibitor' },
  participant: { fr: 'Participant', en: 'Participant' },
}

interface MeetingRequest {
  id: string
  requester_id: string
  target_id: string
  meeting_date: string
  meeting_time: string
  status: string
  message?: string
  requester?: { full_name: string; organization: string }
  target?: { full_name: string; organization: string }
}

export default function B2BPage() {
  const { lang } = useLang()
  const t = lang === 'fr' ? fr : en
  const getLabel = (key: string) => getNestedValue(t.b2b, key) || key
  
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [activeSection, setActiveSection] = useState<'directory' | 'meetings' | 'chat'>('directory')
  const [meetingModal, setMeetingModal] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDomain, setFilterDomain] = useState<string | null>(null)
  const [allParticipants, setAllParticipants] = useState<any[]>([])
  const [meetingRequests, setMeetingRequests] = useState<MeetingRequest[]>([])
  const [selectedChatUser, setSelectedChatUser] = useState<{ id: string; name: string; org: string } | null>(null)
  const [loading, setLoading] = useState(true)

  const isVIP = currentUser?.category === 'vip_b2b' || currentUser?.category === 'exposant'

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      setCurrentUser({ ...profile, id: user.id })

      const { data: participants } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('verified', true)
        .neq('user_id', user.id)
        .not('category', 'eq', 'visiteur')
        .order('created_at', { ascending: false })
        .limit(50)
      
      setAllParticipants(participants || [])

      const { data: requests } = await supabase
        .from('meeting_requests')
        .select(`
          *,
          requester:user_profiles!requester_id(full_name, organization),
          target:user_profiles!target_id(full_name, organization)
        `)
        .or(`requester_id.eq.${user.id},target_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
      
      setMeetingRequests(requests || [])
      setLoading(false)
    }

    fetchData()

    const channel = supabase
      .channel('meeting-requests')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'meeting_requests'
      }, () => {
        fetchData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleResponse = async (requestId: string, accept: boolean) => {
    try {
      const { error } = await supabase
        .from('meeting_requests')
        .update({ status: accept ? 'accepted' : 'declined' })
        .eq('id', requestId)

      if (error) throw error

      toast.success(
        accept 
          ? (lang === 'fr' ? 'Rendez-vous confirmé !' : 'Meeting confirmed!')
          : (lang === 'fr' ? 'Demande déclinée' : 'Request declined')
      )

      const { data: requests } = await supabase
        .from('meeting_requests')
        .select(`
          *,
          requester:user_profiles!requester_id(full_name, organization),
          target:user_profiles!target_id(full_name, organization)
        `)
        .or(`requester_id.eq.${currentUser?.id},target_id.eq.${currentUser?.id}`)
      
      setMeetingRequests(requests || [])
    } catch (error) {
      toast.error(lang === 'fr' ? 'Erreur' : 'Error')
    }
  }

  const filteredParticipants = allParticipants.filter(p => {
    const matchSearch = !searchQuery || 
      p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.organization?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchDomain = !filterDomain || p.domains?.includes(filterDomain)
    return matchSearch && matchDomain
  })

  const formatDate = (date: string) => {
    const d = new Date(date)
    return d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'short'
    })
  }

  if (loading) {
    return (
      <div className="pt-20 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary-900 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-primary-950 to-primary-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="vip-badge">VIP</span>
            <span className="text-white/60 text-sm">{getLabel('restricted')}</span>
          </div>
          <h1 className="text-3xl font-black text-white">{getLabel('title')}</h1>
          <p className="text-white/70 mt-1">{getLabel('subtitle')}</p>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-4">
        <div className="max-w-7xl mx-auto flex gap-0">
          {[
            { id: 'directory', labelKey: 'tabs.directory', icon: Users },
            { id: 'meetings', labelKey: 'tabs.meetings', icon: Calendar },
            { id: 'chat', labelKey: 'tabs.chat', icon: MessageSquare },
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
                <Icon size={16} /> {getLabel(tab.labelKey)}
              </button>
            )
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeSection === 'directory' && (
          <div>
            {currentUser && isVIP && (
              <RecommendedSection userId={currentUser.id} isVIP={isVIP} />
            )}

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-primary-900">
                {lang === 'fr' ? 'Tous les participants' : 'All participants'}
              </h2>
              <span className="text-sm text-gray-500">
                {filteredParticipants.length} {lang === 'fr' ? 'participants' : 'participants'}
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'fr' ? 'Rechercher par nom ou organisation...' : 'Search by name or organization...'}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-primary-700 bg-white"
                />
              </div>
              <select
                value={filterDomain || ''}
                onChange={(e) => setFilterDomain(e.target.value || null)}
                className="px-5 py-3 border border-gray-300 rounded-2xl bg-white focus:outline-none focus:border-primary-700"
              >
                <option value="">{lang === 'fr' ? 'Tous les domaines' : 'All domains'}</option>
                {Object.entries(DOMAIN_LABELS).map(([key, labels]) => (
                  <option key={key} value={key}>{labels[lang]}</option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredParticipants.map((participant, i) => (
                <motion.div
                  key={participant.id || participant.user_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-900 to-primary-700 flex items-center justify-center text-white font-bold text-sm">
                      {participant.full_name?.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">{participant.full_name}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1 truncate">
                        <Building2 size={12} />
                        {participant.organization}
                      </p>
                    </div>
                    <span className={`${categoryColors[participant.category] || 'bg-gray-500'} text-white text-xs px-2 py-1 rounded-full font-medium flex-shrink-0`}>
                      {categoryLabels[participant.category]?.[lang] || participant.category}
                    </span>
                  </div>

                  {participant.domains?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {participant.domains.slice(0, 3).map((domain: string) => (
                        <span key={domain} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          {DOMAIN_LABELS[domain]?.[lang] || domain}
                        </span>
                      ))}
                      {participant.domains.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                          +{participant.domains.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {participant.looking_for && (
                    <p className="text-xs text-blue-600 mb-3 line-clamp-1 flex items-center gap-1">
                      <Briefcase size={10} />
                      {participant.looking_for}
                    </p>
                  )}

                  {isVIP && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => setMeetingModal(participant)}
                        className="flex-1 bg-primary-900 text-white py-2 rounded-xl text-sm font-semibold hover:bg-primary-800 transition-colors flex items-center justify-center gap-1"
                      >
                        <Calendar size={14} />
                        {lang === 'fr' ? 'RDV' : 'Meeting'}
                      </button>
                      <button
                        onClick={() => setSelectedChatUser({
                          id: participant.user_id,
                          name: participant.full_name,
                          org: participant.organization
                        })}
                        className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors"
                      >
                        <MessageSquare size={14} />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'meetings' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="font-black text-primary-900 text-xl mb-6">{getLabel('meetings.title')}</h2>
            
            {meetingRequests.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-semibold mb-1">{getLabel('meetings.empty_title')}</p>
                <p className="text-gray-400 text-sm">{getLabel('meetings.empty_desc')}</p>
                <button
                  onClick={() => setActiveSection('directory')}
                  className="mt-4 bg-primary-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-800 transition-colors"
                >
                  {lang === 'fr' ? 'Explorer les participants' : 'Browse participants'} →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {meetingRequests.map(request => {
                  const isIncoming = request.target_id === currentUser?.id
                  const otherPerson = isIncoming ? request.requester : request.target
                  
                  return (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-white rounded-2xl p-5 border ${
                        request.status === 'pending' ? 'border-amber-200' : 'border-gray-100'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-900 to-primary-700 flex items-center justify-center text-white font-bold">
                            {otherPerson?.full_name?.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{otherPerson?.full_name}</h3>
                            <p className="text-sm text-gray-500">{otherPerson?.organization}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          request.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          request.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          request.status === 'declined' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {request.status === 'pending' ? (lang === 'fr' ? 'En attente' : 'Pending') :
                           request.status === 'accepted' ? (lang === 'fr' ? 'Confirmé' : 'Confirmed') :
                           request.status === 'declined' ? (lang === 'fr' ? 'Décliné' : 'Declined') :
                           (lang === 'fr' ? 'Annulé' : 'Cancelled')}
                        </span>
                      </div>

                      <div className="mt-4 p-3 bg-gray-50 rounded-xl flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="text-sm font-medium">{formatDate(request.meeting_date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-gray-400" />
                          <span className="text-sm font-medium">{request.meeting_time}</span>
                        </div>
                      </div>

                      {request.message && (
                        <p className="mt-3 text-sm text-gray-600 italic">"{request.message}"</p>
                      )}

                      {isIncoming && request.status === 'pending' && (
                        <div className="mt-4 flex gap-3">
                          <button
                            onClick={() => handleResponse(request.id, true)}
                            className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                          >
                            <Check size={16} />
                            {lang === 'fr' ? 'Accepter' : 'Accept'}
                          </button>
                          <button
                            onClick={() => handleResponse(request.id, false)}
                            className="flex-1 bg-red-100 text-red-600 py-2.5 rounded-xl font-semibold hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                          >
                            <X size={16} />
                            {lang === 'fr' ? 'Décliner' : 'Decline'}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeSection === 'chat' && (
          <div className="max-w-4xl mx-auto">
            {selectedChatUser ? (
              <div>
                <button
                  onClick={() => setSelectedChatUser(null)}
                  className="mb-4 text-sm text-primary-900 hover:underline flex items-center gap-1"
                >
                  ← {lang === 'fr' ? 'Retour à la liste' : 'Back to list'}
                </button>
                <RealtimeChat
                  currentUserId={currentUser?.id}
                  targetUserId={selectedChatUser.id}
                  targetName={selectedChatUser.name}
                  targetOrganization={selectedChatUser.org}
                />
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <h2 className="font-bold text-gray-900">{getLabel('chat.title')}</h2>
                  <p className="text-xs text-gray-500">{lang === 'fr' ? 'Propulsé par Supabase Realtime' : 'Powered by Supabase Realtime'}</p>
                </div>
                <div className="p-4">
                  <ConversationsList
                    currentUserId={currentUser?.id}
                    onSelectConversation={(id, name, org) => setSelectedChatUser({ id, name, org })}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {meetingModal && currentUser && (
        <MeetingModal
          match={{
            user_id: meetingModal.user_id,
            full_name: meetingModal.full_name,
            organization: meetingModal.organization,
            category: meetingModal.category,
            domains: meetingModal.domains || [],
            looking_for: meetingModal.looking_for,
            offering: meetingModal.offering,
            match_score: 0,
            shared_domains: [],
            badge_number: meetingModal.badge_number
          }}
          onClose={() => setMeetingModal(null)}
          onSuccess={() => setActiveSection('meetings')}
        />
      )}
    </div>
  )
}
