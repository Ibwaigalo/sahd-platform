'use client'
// app/sponsors/page.tsx
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { mockSponsors } from '@/lib/mock-data'
import SponsoringContactCard from '@/components/ui/SponsoringContactCard'
import Link from 'next/link'

const tiers = [
  { key: 'platine', label: 'Partenaires Platine', emoji: '💎', bg: 'from-slate-700 to-slate-600' },
  { key: 'or', label: 'Partenaires Or', emoji: '🏆', bg: 'from-amber-700 to-amber-600' },
  { key: 'argent', label: 'Partenaires Argent', emoji: '🥈', bg: 'from-gray-600 to-gray-500' },
  { key: 'media', label: 'Partenaires Médias', emoji: '📺', bg: 'from-purple-700 to-purple-600' },
]

const packages = [
  {
    name: 'Pack Platine',
    price: '10 000 000 FCFA',
    color: 'from-slate-800 to-slate-700',
    badge: '💎',
    features: [
      'Logo en tête de toutes communications',
      'Stand premium 6x6m (emplacement A)',
      'Prise de parole en plénière (20 min)',
      '20 badges VIP B2B',
      'Publicité vidéo sur écrans',
      'Rapport post-événement exclusif',
      'Couverture médiatique dédiée',
      'Accès liste participants',
    ],
  },
  {
    name: 'Pack Or',
    price: '5 000 000 FCFA',
    color: 'from-amber-700 to-amber-600',
    badge: '🥇',
    popular: true,
    features: [
      'Logo sur supports principaux',
      'Stand 3x3m (emplacement B)',
      'Prise de parole en panel (10 min)',
      '10 badges participants',
      'Mention dans communiqués presse',
      'Profil sponsor sur plateforme',
      'Networking VIP access',
    ],
  },
  {
    name: 'Pack Argent',
    price: '2 000 000 FCFA',
    color: 'from-gray-600 to-gray-500',
    badge: '🥈',
    features: [
      'Logo sur bannières événement',
      'Stand 2x2m',
      '5 badges participants',
      'Mention réseaux sociaux',
      'Profil sur site web',
    ],
  },
]

export default function SponsorsPage() {
  return (
    <div className="pt-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-950 to-primary-900 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-accent-orange font-bold text-sm uppercase tracking-widest mb-3">SAHD 2026</p>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Sponsors & Partenaires</h1>
            <div className="section-divider mx-auto mb-6" />
            <p className="text-white/70 max-w-2xl mx-auto">
              Ils soutiennent la mission du SAHD et contribuent au développement de l'action humanitaire au Mali
            </p>
          </motion.div>
        </div>
      </div>

      {/* CONTACT SPONSORING - Prominent section at top */}
      <section className="bg-primary-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-white mb-2">Rejoignez nos partenaires</h2>
            <p className="text-white/60">Contactez-nous pour un devis personnalisé</p>
          </div>
          <SponsoringContactCard />
        </div>
      </section>

      {/* Sponsors by tier */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {tiers.map((tier, ti) => {
            const sponsors = mockSponsors[tier.key as keyof typeof mockSponsors] || []
            return (
              <motion.div
                key={tier.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: ti * 0.1 }}
                className="mb-14"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`bg-gradient-to-r ${tier.bg} text-white px-5 py-2 rounded-full font-bold text-sm flex items-center gap-2`}>
                    <span>{tier.emoji}</span> {tier.label}
                  </div>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <div className={`grid gap-4 ${
                  tier.key === 'platine' ? 'grid-cols-1 sm:grid-cols-2' :
                  tier.key === 'or' ? 'grid-cols-2 sm:grid-cols-3' :
                  'grid-cols-3 sm:grid-cols-4'
                }`}>
                  {sponsors.map(sponsor => (
                    <a
                      key={sponsor.id}
                      href={sponsor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl hover:border-primary-300 hover:shadow-lg transition-all p-5 sponsor-card group ${
                        tier.key === 'platine' ? 'p-8' : 'p-5'
                      }`}
                    >
                      <span className={tier.key === 'platine' ? 'text-5xl' : 'text-3xl'}>{sponsor.logo}</span>
                      <div className="flex-1 min-w-0">
                        <div className={`font-bold text-gray-800 group-hover:text-primary-900 transition-colors truncate ${
                          tier.key === 'platine' ? 'text-xl' : 'text-sm'
                        }`}>{sponsor.name}</div>
                        {sponsor.description && (
                          <div className="text-gray-500 text-xs truncate">{sponsor.description}</div>
                        )}
                      </div>
                      <ExternalLink size={14} className="text-gray-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Sponsoring packages */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-accent-orange font-bold text-sm uppercase tracking-widest mb-3">Offres</p>
            <h2 className="text-3xl font-black text-primary-900">Packages de sponsoring</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg, i) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl overflow-hidden ${pkg.popular ? 'ring-2 ring-accent-gold shadow-2xl scale-105' : 'shadow-lg'}`}
              >
                {pkg.popular && (
                  <div className="absolute top-4 right-4 bg-accent-gold text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                    Le plus choisi
                  </div>
                )}
                <div className={`bg-gradient-to-br ${pkg.color} p-6 text-white`}>
                  <div className="text-4xl mb-3">{pkg.badge}</div>
                  <h3 className="font-black text-2xl">{pkg.name}</h3>
                  <p className="text-white/80 text-lg font-bold mt-1">{pkg.price}</p>
                </div>
                <div className="bg-white p-6">
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-accent-orange font-bold mt-0.5">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="mailto:sponsoring@sahd-mali.org"
                    className="block text-center bg-primary-900 text-white py-3 rounded-xl font-bold hover:bg-primary-800 transition-colors"
                  >
                    Nous contacter →
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom contact card */}
      <section className="bg-primary-900 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-black text-white mb-2">Besoin d'un package sur mesure ?</h2>
          <p className="text-white/60 mb-8">Nous créons des offres adaptées à vos objectifs</p>
          <SponsoringContactCard />
        </div>
      </section>
    </div>
  )
}
