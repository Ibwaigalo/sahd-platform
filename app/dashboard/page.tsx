'use client'
// app/dashboard/page.tsx
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Download, QrCode, User, Calendar, MessageSquare, ChevronRight, LogOut } from 'lucide-react'
import { mockPanels } from '@/lib/mock-data'
import toast from 'react-hot-toast'
import QRCode from 'qrcode.react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'badge' | 'panels' | 'messages'>('overview')
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const badgeRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)

      // Récupérer l'utilisateur connecté
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        toast.error('Vous devez être connecté')
        router.push('/inscription')
        return
      }

      // Récupérer le profil depuis la table profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', user.email)
        .single()

      if (error || !data) {
        toast.error('Profil introuvable')
        setLoading(false)
        return
      }

      setProfile(data)
      setLoading(false)
    }

    fetchProfile()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Déconnecté')
    router.push('/')
  }

  const handleDownloadBadge = async () => {
    toast.success('Badge en cours de génération...')
    setTimeout(() => toast.success('Badge téléchargé !'), 1500)
  }

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: User },
    { id: 'badge', label: 'Mon Badge', icon: QrCode },
    { id: 'panels', label: 'Mes Panels', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ]

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Chargement de votre espace...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Aucun profil trouvé.</p>
          <Link href="/inscription" className="bg-primary-900 text-white px-6 py-3 rounded-xl font-bold">
            S'inscrire
          </Link>
        </div>
      </div>
    )
  }

  const qrData = `https://sahd-mali.org/verify/${profile.badge_number}`

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-800 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white font-black text-2xl">
                {profile.full_name?.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">{profile.full_name}</h1>
                <p className="text-white/70">{profile.organization}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {profile.category}
                  </span>
                  <span className="bg-accent-orange/20 text-accent-orange text-xs font-bold px-3 py-1 rounded-full">
                    ✓ Inscription confirmée
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-xl text-sm hover:bg-white/20 transition-colors"
            >
              <LogOut size={16} /> Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-8">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-primary-900 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Icon size={16} /> {tab.label}
              </button>
            )
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-black text-primary-900 text-lg mb-5">Mes informations</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Nom complet', value: profile.full_name },
                  { label: 'Organisation', value: profile.organization },
                  { label: 'Email', value: profile.email },
                  { label: 'Téléphone', value: profile.phone },
                  { label: 'Catégorie', value: profile.category },
                  { label: 'Domaine', value: profile.domain },
                  { label: 'Pays', value: profile.country },
                  { label: 'N° Badge', value: profile.badge_number },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">{label}</div>
                    <div className="font-semibold text-gray-800">{value || '—'}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-6 text-white">
                <QrCode size={28} className="mb-3" />
                <h3 className="font-black text-lg mb-1">Mon Badge</h3>
                <p className="text-white/70 text-sm mb-4">Badge #{profile.badge_number?.split('-').pop()}</p>
                <button
                  onClick={() => setActiveTab('badge')}
                  className="w-full bg-white text-primary-900 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors"
                >
                  Voir et télécharger →
                </button>
              </div>

              <div className="bg-accent-orange/10 border border-accent-orange/20 rounded-2xl p-5">
                <p className="text-accent-orange font-bold text-sm mb-1">📅 14–16 Mai 2026</p>
                <p className="text-gray-600 text-sm">Palais des Congrès, Bamako</p>
              </div>

              <div className={`rounded-2xl p-5 border ${profile.verified ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                <p className={`font-bold text-sm ${profile.verified ? 'text-green-700' : 'text-orange-700'}`}>
                  {profile.verified ? '✅ Inscription validée' : '⏳ En attente de validation'}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {profile.verified ? 'Votre badge est prêt' : 'Validation sous 24-48h'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Badge Tab */}
        {activeTab === 'badge' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div
                ref={badgeRef}
                style={{
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 60%, #10B981 100%)',
                  padding: '40px',
                  color: 'white',
                  position: 'relative',
                  minHeight: '400px',
                }}
              >
                <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 12px', borderRadius: '8px', fontWeight: '900', fontSize: '18px' }}>SAHD</div>
                    <div>
                      <div style={{ fontSize: '11px', opacity: 0.7 }}>1ère Édition</div>
                      <div style={{ fontSize: '13px', fontWeight: '600' }}>14–16 Mai 2026</div>
                    </div>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '11px', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>Participant</div>
                    <div style={{ fontSize: '26px', fontWeight: '900', lineHeight: 1.1 }}>{profile.full_name}</div>
                    <div style={{ fontSize: '16px', opacity: 0.85, marginTop: '4px' }}>{profile.organization}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '8px 14px', display: 'inline-block', marginBottom: '20px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700' }}>{profile.category}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ background: 'white', borderRadius: '12px', padding: '8px' }}>
                      <QRCode value={qrData} size={90} fgColor="#1e3a8a" bgColor="white" />
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', opacity: 0.6, marginBottom: '4px' }}>N° Badge</div>
                      <div style={{ fontSize: '13px', fontWeight: '700', fontFamily: 'monospace' }}>{profile.badge_number}</div>
                      <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '8px' }}>Bamako, Mali</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <button
                  onClick={handleDownloadBadge}
                  className="w-full bg-primary-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-800 transition-colors"
                >
                  <Download size={20} /> Télécharger mon badge (PDF)
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Panels Tab */}
        {activeTab === 'panels' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="font-black text-primary-900 text-xl mb-6">Mes réservations de panels</h2>
            <div className="space-y-4">
              {mockPanels.map(panel => (
                <div key={panel.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-4">
                  <div className="w-1 rounded-full flex-shrink-0" style={{ background: panel.color, minHeight: '60px' }} />
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="bg-primary-50 text-primary-800 text-xs font-bold px-3 py-1 rounded-full">
                        Jour {panel.day} · {panel.startTime}
                      </span>
                      <span className="bg-accent-orange/10 text-accent-orange text-xs font-bold px-3 py-1 rounded-full">✓ Confirmé</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{panel.title}</h3>
                    <p className="text-gray-500 text-sm">{panel.room}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h2 className="font-bold text-gray-900">Messagerie interne</h2>
              </div>
              <div className="p-8 text-center text-gray-400">
                <MessageSquare size={48} className="mx-auto mb-3 opacity-30" />
                <p className="font-semibold">Aucun message pour le moment</p>
                <p className="text-sm mt-1">La messagerie B2B est disponible dans l'espace VIP</p>
                <Link href="/b2b" className="mt-4 inline-block bg-primary-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-800 transition-colors">
                  Accéder à l'espace B2B →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}