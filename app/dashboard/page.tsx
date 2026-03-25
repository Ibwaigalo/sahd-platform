'use client'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Download, QrCode, User, Calendar, MessageSquare, LogOut, CheckCircle, Clock, MapPin, Phone, Mail, Globe, Star } from 'lucide-react'
import { mockPanels } from '@/lib/mock-data'
import toast from 'react-hot-toast'
import QRCode from 'qrcode.react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLang } from '@/lib/lang-context'
import fr from '@/messages/fr.json'
import en from '@/messages/en.json'

function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj) || path
}

const categoryColors: Record<string, string> = {
  visiteur: 'from-gray-600 to-gray-500',
  participant: 'from-blue-700 to-blue-600',
  exposant: 'from-primary-800 to-primary-700',
  vip_b2b: 'from-amber-600 to-amber-500',
}

const categoryLabels: Record<string, { fr: string; en: string; badge: string; color: string }> = {
  visiteur: { fr: 'Visiteur Standard', en: 'Standard Visitor', badge: 'VISITOR', color: '#6b7280' },
  participant: { fr: 'Participant Payant', en: 'Paying Participant', badge: 'PARTICIPANT', color: '#1d4ed8' },
  exposant: { fr: 'Exposant ONG', en: 'NGO Exhibitor', badge: 'EXHIBITOR', color: '#1e3a8a' },
  vip_b2b: { fr: 'VIP B2B', en: 'VIP B2B', badge: 'VIP B2B', color: '#d97706' },
}

export default function DashboardPage() {
  const { lang } = useLang()
  const t = lang === 'fr' ? fr : en
  const getLabel = (key: string) => getNestedValue(t.dashboard, key) || key
  
  const [activeTab, setActiveTab] = useState<'overview' | 'badge' | 'panels' | 'messages'>('overview')
  const [profile, setProfile] = useState<any>(null)
  const [reservedPanels, setReservedPanels] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [downloadingBadge, setDownloadingBadge] = useState(false)
  const badgeRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        toast.error(lang === 'fr' ? 'Vous devez être connecté' : 'You must be logged in')
        router.push('/login')
        return
      }
      const { data, error } = await supabase.from('profiles').select('*').eq('email', user.email).single()
      if (error || !data) {
        toast.error(lang === 'fr' ? 'Profil introuvable' : 'Profile not found')
        setLoading(false)
        return
      }
      setProfile(data)
      const { data: panelData } = await supabase
        .from('panel_reservations')
        .select('panel_id')
        .eq('user_id', user.id)
      if (panelData) setReservedPanels(panelData.map((p: any) => p.panel_id))
      setLoading(false)
    }
    fetchProfile()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success(lang === 'fr' ? 'Déconnecté' : 'Logged out')
    router.push('/')
  }

  const handleDownloadBadge = async () => {
    setDownloadingBadge(true)
    toast.loading(lang === 'fr' ? 'Génération du badge PDF...' : 'Generating PDF badge...')
    try {
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default
      if (!badgeRef.current) return
      const canvas = await html2canvas(badgeRef.current, { scale: 3, useCORS: true, backgroundColor: null })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [100, 65] })
      pdf.addImage(imgData, 'PNG', 0, 0, 100, 65)
      pdf.save(`Badge-SAHD-${profile.badge_number}.pdf`)
      toast.dismiss()
      toast.success(lang === 'fr' ? '✅ Badge téléchargé !' : '✅ Badge downloaded!')
    } catch (err) {
      toast.dismiss()
      toast.error(lang === 'fr' ? 'Erreur lors de la génération' : 'Error generating badge')
      console.error(err)
    } finally {
      setDownloadingBadge(false)
    }
  }

  const myPanels = mockPanels.filter(p =>
    reservedPanels.includes(p.id) || reservedPanels.length === 0
  )

  const tabs = [
    { id: 'overview', labelKey: 'overview', icon: User },
    { id: 'badge', labelKey: 'my_badge', icon: QrCode },
    { id: 'panels', labelKey: 'my_panels', icon: Calendar },
    { id: 'messages', labelKey: 'tab_messages', icon: MessageSquare },
  ]

  const qrData = `https://sahd-mali.org/verify/${profile?.badge_number}`
  const catInfo = categoryLabels[profile?.category] || categoryLabels['visiteur']
  const catLabel = lang === 'fr' ? catInfo.fr : catInfo.en
  const catGradient = categoryColors[profile?.category] || categoryColors['visiteur']

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">{getLabel('loading')}</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <p className="text-gray-600 mb-4 font-semibold">{getLabel('no_profile')}</p>
          <Link href="/inscription" className="bg-primary-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-800 transition-colors">
            {getLabel('register')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      <div className={`bg-gradient-to-r ${catGradient} py-12 px-4`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white font-black text-2xl border-2 border-white/30">
                {profile.full_name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">{profile.full_name}</h1>
                <p className="text-white/80 text-sm">{profile.organization}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {catLabel}
                  </span>
                  {profile.verified
                    ? <span className="bg-green-400/30 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><CheckCircle size={10} /> {getLabel('status.validated')}</span>
                    : <span className="bg-orange-400/30 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><Clock size={10} /> {getLabel('status.pending')}</span>
                  }
                </div>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-white/15 text-white px-4 py-2 rounded-xl text-sm hover:bg-white/25 transition-colors border border-white/20">
              <LogOut size={16} /> {getLabel('logout')}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: '🎫', labelKey: 'stats.badge_number', value: profile.badge_number?.split('-').pop() || '—' },
            { icon: '📅', labelKey: 'stats.panels_reserved', value: reservedPanels.length || mockPanels.length },
            { icon: '🌍', labelKey: 'stats.country', value: profile.country || '—' },
            { icon: '🏢', labelKey: 'stats.domain', value: profile.domain?.split(' ')[0] || '—' },
          ].map(stat => (
            <div key={stat.labelKey} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="font-black text-primary-900 text-lg leading-tight">{stat.value}</div>
              <div className="text-gray-500 text-xs mt-1">{getLabel(stat.labelKey)}</div>
            </div>
          ))}
        </div>

        <div className="flex overflow-x-auto gap-2 mb-8">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all flex-shrink-0 ${
                  activeTab === tab.id ? 'bg-primary-900 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}>
                <Icon size={16} /> {getLabel(tab.labelKey)}
              </button>
            )
          })}
        </div>

        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-black text-primary-900 text-lg mb-5">{getLabel('my_info')}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { labelKey: 'labels.full_name', value: profile.full_name, icon: User },
                  { labelKey: 'labels.organization', value: profile.organization, icon: Globe },
                  { labelKey: 'labels.email', value: profile.email, icon: Mail },
                  { labelKey: 'labels.phone', value: profile.phone, icon: Phone },
                  { labelKey: 'labels.category', value: catLabel, icon: Star },
                  { labelKey: 'labels.domain', value: profile.domain, icon: Globe },
                  { labelKey: 'labels.country', value: profile.country, icon: MapPin },
                  { labelKey: 'labels.badge_number', value: profile.badge_number, icon: QrCode },
                ].map(({ labelKey, value, icon: Icon }) => (
                  <div key={labelKey} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3.5">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-primary-700" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-gray-500 mb-0.5">{getLabel(labelKey)}</div>
                      <div className="font-semibold text-gray-800 text-sm truncate">{value || '—'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className={`bg-gradient-to-br ${catGradient} rounded-2xl p-6 text-white`}>
                <QrCode size={28} className="mb-3 opacity-80" />
                <h3 className="font-black text-lg mb-1">{getLabel('badge.title')}</h3>
                <p className="text-white/70 text-sm mb-4">#{profile.badge_number?.split('-').pop()}</p>
                <button onClick={() => setActiveTab('badge')} className="w-full bg-white/20 hover:bg-white/30 text-white py-2.5 rounded-xl font-bold text-sm transition-colors border border-white/20">
                  {getLabel('badge.download')}
                </button>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <p className="text-accent-orange font-bold text-xs uppercase tracking-widest mb-3">📅 {getLabel('event.dates').split(' ')[0]}</p>
                <p className="font-black text-primary-900">{getLabel('event.dates')}</p>
                <p className="text-gray-500 text-sm flex items-center gap-1 mt-1"><MapPin size={12} /> {getLabel('event.location')}</p>
              </div>

              <div className={`rounded-2xl p-5 border ${profile.verified ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                <p className={`font-bold text-sm flex items-center gap-2 ${profile.verified ? 'text-green-700' : 'text-orange-700'}`}>
                  {profile.verified ? <><CheckCircle size={16} /> {getLabel('status.validated')}</> : <><Clock size={16} /> {getLabel('status.pending')}</>}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {profile.verified ? getLabel('status.validated_desc') : getLabel('status.pending_desc')}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-2">
                <p className="font-bold text-gray-700 text-sm mb-3">{getLabel('quick_actions')}</p>
                {[
                  { labelKey: 'actions.download_badge', action: () => { setActiveTab('badge'); handleDownloadBadge() }, icon: Download },
                  { labelKey: 'actions.view_program', href: '/programme', icon: Calendar },
                  { labelKey: 'actions.b2b_space', href: '/b2b', icon: MessageSquare },
                ].map((item, i) => (
                  item.href
                    ? <Link key={i} href={item.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                        <item.icon size={16} className="text-primary-700" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-primary-900">{getLabel(item.labelKey)}</span>
                      </Link>
                    : <button key={i} onClick={item.action} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors w-full group">
                        <item.icon size={16} className="text-primary-700" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-primary-900">{getLabel(item.labelKey)}</span>
                      </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'badge' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
            <p className="text-center text-gray-500 text-sm mb-6">{lang === 'fr' ? 'Voici votre badge officiel SAHD 2026. Téléchargez-le en PDF pour l\'imprimer ou le présenter sur votre téléphone.' : 'Here is your official SAHD 2026 badge. Download it as PDF to print or present on your phone.'}</p>

            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6">
              <div ref={badgeRef} style={{
                background: `linear-gradient(135deg, ${catInfo.color} 0%, #0b185f 100%)`,
                padding: '32px',
                position: 'relative',
                minHeight: '280px',
                overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: -40, left: -40, width: 140, height: 140, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src="/logo-sahd-web.png" alt="SAHD Logo" style={{ height: 40, width: 'auto', objectFit: 'contain' }} />
                      <div style={{ color: 'white' }}>
                        <div style={{ fontSize: 10, opacity: 0.65 }}>{lang === 'fr' ? '1ère Édition' : '1st Edition'}</div>
                        <div style={{ fontSize: 12, fontWeight: 700 }}>{getLabel('event.dates')}</div>
                      </div>
                    </div>
                    <div style={{ background: catInfo.color, border: '2px solid rgba(255,255,255,0.4)', borderRadius: 8, padding: '4px 10px', fontSize: 10, fontWeight: 800, color: 'white', letterSpacing: 1 }}>
                      {catInfo.badge}
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 10, opacity: 0.6, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4, color: 'white' }}>{lang === 'fr' ? 'Participant' : 'Participant'}</div>
                    <div style={{ fontSize: 24, fontWeight: 900, lineHeight: 1.1, color: 'white' }}>{profile.full_name}</div>
                    <div style={{ fontSize: 14, opacity: 0.85, marginTop: 4, color: 'white' }}>{profile.organization}</div>
                    <div style={{ fontSize: 12, opacity: 0.65, marginTop: 2, color: 'white' }}>{profile.domain}</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
                    <div style={{ background: 'white', borderRadius: 12, padding: 8, flexShrink: 0 }}>
                      <QRCode value={qrData} size={85} fgColor="#1e3a8a" bgColor="white" level="H" />
                    </div>
                    <div style={{ color: 'white' }}>
                      <div style={{ fontSize: 9, opacity: 0.55, marginBottom: 3 }}>{getLabel('labels.badge_number').toUpperCase()}</div>
                      <div style={{ fontSize: 11, fontWeight: 800, fontFamily: 'monospace', letterSpacing: 0.5 }}>{profile.badge_number}</div>
                      <div style={{ fontSize: 9, opacity: 0.55, marginTop: 8 }}>📍 {getLabel('event.location').split(',')[0]}</div>
                      <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>{getLabel('event.location').split(',')[1] || ''}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <button onClick={handleDownloadBadge} disabled={downloadingBadge}
                  className="w-full bg-primary-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-800 transition-colors disabled:opacity-60">
                  <Download size={18} />
                  {downloadingBadge ? getLabel('badge.generating') : getLabel('badge.download_pdf')}
                </button>
                <p className="text-center text-gray-400 text-xs">{getLabel('badge.qr_info')}</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-700">
              <p className="font-bold mb-1">💡 {getLabel('badge.instructions_title')}</p>
              <ul className="space-y-1 text-xs text-blue-600">
                <li>• {getLabel('badge.instructions')[0] || (lang === 'fr' ? 'Téléchargez et imprimez votre badge ou gardez-le sur votre téléphone' : 'Download and print your badge or keep it on your phone')}</li>
                <li>• {getLabel('badge.instructions')[1] || (lang === 'fr' ? 'Présentez le QR code à l\'entrée du Palais des Congrès' : 'Present the QR code at the Congress Palace entrance')}</li>
                <li>• {getLabel('badge.instructions')[2] || (lang === 'fr' ? 'Le badge est personnel et non transférable' : 'The badge is personal and non-transferable')}</li>
              </ul>
            </div>
          </motion.div>
        )}

        {activeTab === 'panels' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black text-primary-900 text-xl">{getLabel('panels.title')}</h2>
              <Link href="/programme" className="text-primary-700 font-semibold text-sm hover:text-primary-900 transition-colors">
                {getLabel('panels.reserve_panel')}
              </Link>
            </div>

            {myPanels.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <div className="text-5xl mb-4">📅</div>
                <p className="font-semibold text-gray-600 mb-2">{getLabel('panels.empty_title')}</p>
                <p className="text-gray-400 text-sm mb-6">{getLabel('panels.empty_desc')}</p>
                <Link href="/programme" className="bg-primary-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-800 transition-colors">
                  {getLabel('panels.view_program')}
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myPanels.map(panel => (
                  <div key={panel.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="h-1.5" style={{ background: panel.color }} />
                    <div className="p-5 flex gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="bg-primary-50 text-primary-800 text-xs font-bold px-3 py-1 rounded-full">
                            {getLabel('panels.day')} {panel.day} · {panel.startTime} – {panel.endTime}
                          </span>
                          <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle size={10} /> {getLabel('panels.confirmed')}
                          </span>
                        </div>
                        <h3 className="font-black text-gray-900 mb-1">{panel.title}</h3>
                        <p className="text-gray-500 text-sm flex items-center gap-1">
                          <MapPin size={12} /> {panel.room}
                        </p>
                        <p className="text-gray-400 text-xs mt-2 line-clamp-2">{panel.description}</p>
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <div className="text-center bg-gray-50 rounded-xl p-3 border border-gray-100">
                          <div className="text-lg font-black text-primary-900">{panel.startTime}</div>
                          <div className="text-xs text-gray-500">{getLabel('panels.hour')}</div>
                        </div>
                        <Link href={`/programme#${panel.id}`} className="text-xs text-primary-700 font-semibold text-center hover:text-primary-900 transition-colors">
                          {getLabel('panels.details')}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'messages' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <h2 className="font-bold text-gray-900">{getLabel('messages.title')}</h2>
                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">{getLabel('messages.count')}</span>
              </div>
              <div className="p-12 text-center text-gray-400">
                <MessageSquare size={52} className="mx-auto mb-4 opacity-20" />
                <p className="font-semibold text-gray-600 mb-1">{getLabel('messages.empty_title')}</p>
                <p className="text-sm mb-6">{getLabel('messages.empty_desc')}</p>
                <Link href="/b2b" className="inline-flex items-center gap-2 bg-primary-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary-800 transition-colors">
                  {getLabel('messages.access_b2b')}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
