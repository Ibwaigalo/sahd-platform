'use client'
// app/page.tsx
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Play, Users, ChevronDown } from 'lucide-react'
import { mockSpeakers, mockPanels, mockSponsors } from '@/lib/mock-data'
import CountdownTimer from '@/components/ui/CountdownTimer'
import SponsoringContactCard from '@/components/ui/SponsoringContactCard'

const stats = [
  { value: '2 000+', label: 'Participants', icon: '👥' },
  { value: '100+', label: 'ONG exposantes', icon: '🏢' },
  { value: '50+', label: 'Intervenants', icon: '🎤' },
  { value: '20+', label: 'Panels & ateliers', icon: '📊' },
  { value: '15+', label: 'Pays représentés', icon: '🌍' },
  { value: '3', label: 'Jours d\'événements', icon: '📅' },
]

const pillars = [
  { icon: '🤝', title: 'Networking B2B', desc: 'Rencontres qualifiées entre ONG, bailleurs et secteur privé', color: 'from-primary-900 to-primary-700' },
  { icon: '📚', title: 'Capitalisation', desc: 'Partage de bonnes pratiques et expériences terrain', color: 'from-primary-800 to-primary-600' },
  { icon: '💡', title: 'Innovation', desc: 'Solutions technologiques pour l\'humanitaire', color: 'from-accent-orange to-amber-500' },
  { icon: '🎯', title: 'Plaidoyer', desc: 'Dialogue politique entre acteurs et autorités', color: 'from-primary-950 to-primary-800' },
]

export default function HomePage() {
  const featuredSpeakers = mockSpeakers.filter(s => s.featured).slice(0, 4)
  const upcomingPanels = mockPanels.slice(0, 3)

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          backgroundImage: 'url(/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Overlay bleu foncé + orange */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, rgba(11,24,95,0.92) 0%, rgba(11,24,95,0.75) 50%, rgba(254,166,33,0.25) 100%)'
        }} />

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-20 right-20 w-96 h-96 bg-accent-orange/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, delay: 2 }}
            className="absolute bottom-20 left-10 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, -30, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-1/3 left-1/4 w-2 h-2 bg-accent-orange rounded-full opacity-60"
          />
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
            className="absolute top-2/3 right-1/4 w-3 h-3 bg-accent-orange rounded-full opacity-40"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="inline-flex items-center gap-2 bg-accent-orange/20 border border-accent-orange/30 text-accent-orange px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  <span className="w-2 h-2 bg-accent-orange rounded-full animate-pulse" />
                  1ère Édition · 14–16 Mai 2026 · Bamako, Mali
                </div>

                {/* Logo in hero */}
                <div className="mb-6">
                  <img
                    src="/logo-sahd-web.png"
                    alt="SAHD – Salon de l'Action Humanitaire et du Développement"
                    className="h-20 w-auto object-contain"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </div>

                <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-white leading-tight mb-4">
                  Salon de l'Action{' '}
                  <span className="text-gradient-orange block">Humanitaire & du</span>
                  <span className="text-accent-orange">Développement</span>
                </h1>

                <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-lg">
                  La plateforme nationale de référence pour{' '}
                  <strong className="text-white">promouvoir les ONG</strong>, catalyser les partenariats
                  stratégiques et construire un <strong className="text-white">Mali solidaire et durable</strong>.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/inscription"
                    className="inline-flex items-center justify-center gap-2 bg-accent-orange text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-amber-500 transition-all shadow-2xl shadow-orange-500/25 hover:scale-105"
                  >
                    S'inscrire maintenant <ArrowRight size={20} />
                  </Link>
                  <Link
                    href="/programme"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all"
                  >
                    <Play size={18} /> Voir le programme
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Right: Countdown + Stats */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Countdown */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                <p className="text-white/60 text-sm font-medium mb-4 text-center uppercase tracking-widest">
                  Compte à rebours
                </p>
                <CountdownTimer targetDate="2026-05-14T09:00:00" />
              </div>

              {/* Quick stats grid */}
              <div className="grid grid-cols-3 gap-3">
                {stats.slice(0, 6).map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 text-center"
                  >
                    <div className="text-xl mb-1">{stat.icon}</div>
                    <div className="text-white font-black text-lg leading-none">{stat.value}</div>
                    <div className="text-white/50 text-xs mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 flex flex-col items-center gap-2 text-xs"
          >
            <span>Découvrir</span>
            <ChevronDown size={20} />
          </motion.div>
        </div>
      </section>

      {/* About Strip */}
      <section className="bg-gradient-to-r from-primary-900 to-primary-800 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white text-center md:text-left">
            <p className="text-accent-orange font-bold text-sm uppercase tracking-widest mb-1">📍 Bamako, Mali</p>
            <p className="text-2xl font-black">Palais des Congrès · 14, 15 & 16 Mai 2026</p>
          </div>
          <Link
            href="/inscription"
            className="flex-shrink-0 bg-accent-orange text-white px-8 py-3.5 rounded-xl font-black hover:bg-amber-500 transition-colors"
          >
            Réserver ma place →
          </Link>
        </div>
      </section>

      {/* Mission & Pillars */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-accent-orange font-bold text-sm uppercase tracking-widest mb-3">Notre vision</p>
            <h2 className="text-4xl font-black text-primary-900 mb-4">Pourquoi le SAHD ?</h2>
            <div className="section-divider mx-auto mb-6" />
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Le SAHD rassemble chaque année les acteurs humanitaires, bailleurs de fonds, ONG et institutions
              pour faire avancer l'action humanitaire et le développement durable au Mali.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-lift"
              >
                <div className={`bg-gradient-to-br ${pillar.color} rounded-2xl p-6 h-full text-white`}>
                  <div className="text-4xl mb-4">{pillar.icon}</div>
                  <h3 className="font-bold text-xl mb-2">{pillar.title}</h3>
                  <p className="text-white/80 text-sm leading-relaxed">{pillar.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programme Teaser */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <p className="text-accent-orange font-bold text-sm uppercase tracking-widest mb-2">Programme</p>
              <h2 className="text-4xl font-black text-primary-900">Panels à ne pas manquer</h2>
            </div>
            <Link href="/programme" className="text-primary-700 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
              Voir tout le programme <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {upcomingPanels.map((panel, i) => (
              <motion.div
                key={panel.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden card-lift"
              >
                <div className="h-2" style={{ background: panel.color }} />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-primary-50 text-primary-800 text-xs font-bold px-3 py-1 rounded-full">
                      Jour {panel.day} · {panel.startTime}
                    </span>
                    <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">{panel.category}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg leading-snug mb-3">{panel.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-2">{panel.description}</p>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Places disponibles</span>
                      <span className={panel.registered >= panel.capacity ? 'text-red-500 font-bold' : 'text-accent-orange font-bold'}>
                        {panel.registered >= panel.capacity ? 'Complet' : `${panel.capacity - panel.registered} restantes`}
                      </span>
                    </div>
                    <div className="capacity-bar">
                      <div
                        className="capacity-fill"
                        style={{
                          width: `${Math.min((panel.registered / panel.capacity) * 100, 100)}%`,
                          background: panel.registered >= panel.capacity ? '#ef4444' : '#FEA621',
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                      <Users size={13} /> {panel.registered}/{panel.capacity}
                    </div>
                    <Link
                      href={`/programme#${panel.id}`}
                      className={`text-sm font-bold px-4 py-2 rounded-xl transition-colors ${
                        panel.registered >= panel.capacity
                          ? 'bg-gray-100 text-gray-500'
                          : 'bg-primary-900 text-white hover:bg-primary-700'
                      }`}
                    >
                      {panel.registered >= panel.capacity ? "Liste d'attente" : 'Réserver'}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Speakers */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <p className="text-accent-orange font-bold text-sm uppercase tracking-widest mb-2">Intervenants</p>
              <h2 className="text-4xl font-black text-primary-900">Nos experts invités</h2>
            </div>
            <Link href="/intervenants" className="text-primary-700 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
              Voir tous les intervenants <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredSpeakers.map((speaker, i) => (
              <motion.div
                key={speaker.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-b from-gray-50 to-white rounded-2xl p-6 text-center border border-gray-100 card-lift group"
              >
                <div className="relative inline-block mb-4">
                  <img
                    src={speaker.avatar}
                    alt={speaker.name}
                    className="w-20 h-20 rounded-2xl object-cover mx-auto group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-accent-orange w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{speaker.name}</h3>
                <p className="text-primary-700 font-semibold text-sm mb-1">{speaker.title}</p>
                <p className="text-gray-500 text-xs mb-3">{speaker.organization}</p>
                <span className="bg-primary-50 text-primary-800 text-xs px-3 py-1 rounded-full font-medium">
                  {speaker.domain}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors strip */}
      <section className="py-16 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 text-sm uppercase tracking-widest mb-8 font-medium">Nos partenaires</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[...mockSponsors.platine, ...mockSponsors.or].map(sponsor => (
              <a key={sponsor.id} href={sponsor.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white px-6 py-3 rounded-xl border border-gray-200 sponsor-card shadow-sm hover:shadow-md transition-all">
                <span className="text-2xl">{sponsor.logo}</span>
                <span className="font-bold text-gray-700 text-sm">{sponsor.name}</span>
              </a>
            ))}
          </div>
          <Link href="/sponsors" className="inline-flex items-center gap-2 mt-8 text-primary-700 font-semibold hover:text-primary-900 transition-colors">
            Devenir partenaire <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* CTA Contact Sponsoring */}
      <section className="py-20 px-4 bg-primary-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white mb-3">Intéressé par un partenariat ?</h2>
            <p className="text-white/70">Contactez notre responsable partenariats directement</p>
          </div>
          <SponsoringContactCard />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">
              🌍
            </div>
            <h2 className="text-4xl font-black text-primary-900 mb-4">
              Rejoignez le mouvement SAHD
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Que vous soyez ONG, institution, bailleur ou professionnel du développement,
              le SAHD est votre rendez-vous annuel incontournable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/inscription"
                className="bg-primary-900 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-primary-800 transition-colors shadow-xl"
              >
                Inscription gratuite visiteur
              </Link>
              <Link
                href="/inscription?cat=exposant"
                className="border-2 border-primary-900 text-primary-900 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-primary-50 transition-colors"
              >
                Exposer mon ONG
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}