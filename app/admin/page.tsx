'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Download, LogOut, Check, X, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [activeSection, setActiveSection] = useState('dashboard')
  const [registrations, setRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    total: 0, visiteur: 0, participant: 0, exposant: 0, vip_b2b: 0
  })

  const handleLogin = () => {
    if (password === 'AdminSAHD2026') {
      setAuthed(true)
      toast.success('Bienvenue, Administrateur')
    } else {
      toast.error('Mot de passe incorrect')
    }
  }

  const fetchRegistrations = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Erreur chargement données')
      console.error(error)
    } else {
      setRegistrations(data || [])
      const total = data?.length || 0
      const visiteur = data?.filter(r => r.category === 'visiteur').length || 0
      const participant = data?.filter(r => r.category === 'participant').length || 0
      const exposant = data?.filter(r => r.category === 'exposant').length || 0
      const vip_b2b = data?.filter(r => r.category === 'vip_b2b').length || 0
      setStats({ total, visiteur, participant, exposant, vip_b2b })
    }
    setLoading(false)
  }

  useEffect(() => {
    if (authed) fetchRegistrations()
  }, [authed])

  const handleVerify = async (id: string, verified: boolean, profile: any) => {
    const { error } = await supabase
      .from('profiles')
      .update({ verified })
      .eq('id', id)

    if (error) {
      toast.error('Erreur mise à jour')
      return
    }

    // Envoyer email de validation si approuvé
    if (verified) {
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'validation',
            to: profile.email,
            name: profile.full_name,
            organization: profile.organization,
            category: profile.category,
            badgeNumber: profile.badge_number,
          }),
        })
        toast.success('Inscription validée ✓ — Email envoyé !')
      } catch (emailErr) {
        console.error('Email error:', emailErr)
        toast.success('Inscription validée ✓')
      }
    } else {
      toast.success('Inscription refusée')
    }

    fetchRegistrations()
  }

  const handleExportCSV = () => {
    const headers = ['Nom', 'Organisation', 'Email', 'Téléphone', 'Catégorie', 'Domaine', 'Pays', 'Badge', 'Validé', 'Date']
    const rows = registrations.map(r => [
      r.full_name, r.organization, r.email, r.phone,
      r.category, r.domain, r.country, r.badge_number,
      r.verified ? 'Oui' : 'Non',
      new Date(r.created_at).toLocaleDateString('fr-FR')
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'inscriptions-sahd-2026.csv'
    a.click()
    toast.success('Export CSV téléchargé !')
  }

  if (!authed) {
    return (
      <div className="pt-20 min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="bg-gray-900 rounded-3xl p-10 max-w-sm w-full border border-gray-800">
          <div className="text-center mb-8">
            <img src="/logo-sahd-white.png" alt="SAHD" className="h-16 w-auto mx-auto mb-4" />
            <h1 className="text-white font-black text-2xl">Back-office Admin</h1>
            <p className="text-gray-500 text-sm mt-1">SAHD 2026 – Accès restreint</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Mot de passe admin"
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-primary-500"
          />
          <button onClick={handleLogin}
            className="w-full bg-primary-900 text-white py-3 rounded-xl font-bold hover:bg-primary-800 transition-colors">
            Se connecter
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-900 py-6 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo-sahd-white.png" alt="SAHD" className="h-14 w-auto" />
            <div>
              <h1 className="text-white font-black text-2xl">Back-office SAHD 2026</h1>
              <p className="text-white/60 text-sm">Administration de la plateforme</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchRegistrations}
              className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-xl text-sm hover:bg-white/20 transition-colors">
              <RefreshCw size={16} /> Actualiser
            </button>
            <button onClick={() => setAuthed(false)}
              className="flex items-center gap-2 bg-red-500/20 text-red-300 px-4 py-2 rounded-xl text-sm hover:bg-red-500/30 transition-colors">
              <LogOut size={16} /> Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Nav tabs */}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="max-w-7xl mx-auto flex gap-1">
          {[
            { id: 'dashboard', label: '📊 Dashboard' },
            { id: 'registrations', label: '👥 Inscriptions' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveSection(tab.id)}
              className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
                activeSection === tab.id
                  ? 'border-primary-900 text-primary-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Dashboard */}
        {activeSection === 'dashboard' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[
                { label: 'Total inscrits', value: stats.total, color: 'bg-primary-900' },
                { label: 'Visiteurs', value: stats.visiteur, color: 'bg-gray-600' },
                { label: 'Participants', value: stats.participant, color: 'bg-blue-700' },
                { label: 'Exposants', value: stats.exposant, color: 'bg-primary-700' },
                { label: 'VIP B2B', value: stats.vip_b2b, color: 'bg-primary-950' },
              ].map(stat => (
                <div key={stat.label} className={`${stat.color} rounded-2xl p-6 text-white text-center`}>
                  <div className="text-3xl font-black">{stat.value}</div>
                  <div className="text-white/70 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-black text-primary-900 text-lg mb-4">Dernières inscriptions</h3>
              {registrations.slice(0, 5).map(r => (
                <div key={r.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-semibold text-gray-900">{r.full_name}</p>
                    <p className="text-gray-500 text-sm">{r.organization} · {r.category}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    r.verified ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {r.verified ? 'Validé' : 'En attente'}
                  </span>
                </div>
              ))}
              {registrations.length === 0 && (
                <p className="text-gray-400 text-center py-8">Aucune inscription pour le moment</p>
              )}
            </div>
          </div>
        )}

        {/* Inscriptions */}
        {activeSection === 'registrations' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-primary-900">
                Inscriptions ({registrations.length})
              </h2>
              <button onClick={handleExportCSV}
                className="flex items-center gap-2 bg-primary-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-800 transition-colors">
                <Download size={16} /> Exporter CSV
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-400">Chargement...</div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-primary-900 text-white">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold">Nom</th>
                        <th className="text-left px-4 py-3 font-semibold">Organisation</th>
                        <th className="text-left px-4 py-3 font-semibold">Email</th>
                        <th className="text-left px-4 py-3 font-semibold">Catégorie</th>
                        <th className="text-left px-4 py-3 font-semibold">Pays</th>
                        <th className="text-left px-4 py-3 font-semibold">Badge</th>
                        <th className="text-left px-4 py-3 font-semibold">Statut</th>
                        <th className="text-left px-4 py-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((r, i) => (
                        <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3 font-semibold text-gray-900">{r.full_name}</td>
                          <td className="px-4 py-3 text-gray-600">{r.organization}</td>
                          <td className="px-4 py-3 text-gray-600">{r.email}</td>
                          <td className="px-4 py-3">
                            <span className="bg-primary-100 text-primary-800 text-xs font-bold px-2 py-1 rounded-full">
                              {r.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{r.country}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs font-mono">{r.badge_number}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                              r.verified ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                            }`}>
                              {r.verified ? '✓ Validé' : '⏳ En attente'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              {!r.verified && (
                                <button onClick={() => handleVerify(r.id, true, r)}
                                  className="bg-green-100 text-green-700 p-1.5 rounded-lg hover:bg-green-200 transition-colors"
                                  title="Valider">
                                  <Check size={14} />
                                </button>
                              )}
                              {r.verified && (
                                <button onClick={() => handleVerify(r.id, false, r)}
                                  className="bg-red-100 text-red-700 p-1.5 rounded-lg hover:bg-red-200 transition-colors"
                                  title="Refuser">
                                  <X size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {registrations.length === 0 && (
                    <p className="text-gray-400 text-center py-12">Aucune inscription pour le moment</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}