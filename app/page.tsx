'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Play, Users, ChevronDown } from 'lucide-react'
import { mockPanels, mockSponsors } from '@/lib/mock-data'
import { humanitarianImages } from '@/lib/humanitarian-images'
import CountdownTimer from '@/components/ui/CountdownTimer'
import SponsoringContactCard from '@/components/ui/SponsoringContactCard'
import { useLang } from '@/lib/lang-context'
import fr from '@/messages/fr.json'
import en from '@/messages/en.json'

export default function HomePage() {
  const { lang } = useLang()
  const t = lang === 'fr' ? fr : en

  const stats = [
    { value: '2 000+', label: lang === 'fr' ? 'Participants' : 'Participants', icon: '👥' },
    { value: '100+', label: lang === 'fr' ? 'ONG exposantes' : 'Exhibiting NGOs', icon: '🏢' },
    { value: '50+', label: lang === 'fr' ? 'Intervenants' : 'Speakers', icon: '🎤' },
    { value: '20+', label: lang === 'fr' ? 'Panels & ateliers' : 'Panels & workshops', icon: '📊' },
    { value: '15+', label: lang === 'fr' ? 'Pays représentés' : 'Countries', icon: '🌍' },
    { value: '3', label: lang === 'fr' ? "Jours d'événements" : 'Event days', icon: '📅' },
  ]

  const pillars = [
    { icon: '🤝', title: lang === 'fr' ? 'Networking B2B' : 'B2B Networking', desc: lang === 'fr' ? 'Rencontres qualifiées entre ONG, bailleurs et secteur privé' : 'Qualified meetings between NGOs, donors and private sector', color: 'from-primary-900 to-primary-700' },
    { icon: '📚', title: lang === 'fr' ? 'Capitalisation' : 'Capitalisation', desc: lang === 'fr' ? 'Partage de bonnes pratiques et expériences terrain' : 'Sharing best practices and field experiences', color: 'from-primary-800 to-primary-600' },
    { icon: '💡', title: lang === 'fr' ? 'Innovation' : 'Innovation', desc: lang === 'fr' ? "Solutions technologiques pour l'humanitaire" : 'Technological solutions for humanitarian action', color: 'from-accent-orange to-amber-500' },
    { icon: '🎯', title: lang === 'fr' ? 'Plaidoyer' : 'Advocacy', desc: lang === 'fr' ? 'Dialogue politique entre acteurs et autorités' : 'Policy dialogue between actors and authorities', color: 'from-primary-950 to-primary-800' },
  ]

  const upcomingPanels = mockPanels.slice(0, 3)

  return (
    <div className="overflow-x-hidden w-full max-w-[100vw]">
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden w-full"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1920&h=1080&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(11,24,95,0.95) 0%, rgba(11,24,95,0.80) 60%, rgba(254,166,33,0.20) 100%)' }} />
        <div className="relative w-full max-w-7xl mx-auto px-4 pt-20 md:pt-32 pb-16">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="w-full">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="w-full">
                <div className="flex items-center gap-2 bg-accent-orange/20 border border-accent-orange/30 text-accent-orange px-3 py-1.5 rounded-full text-xs font-semibold mb-4 w-fit max-w-full">
                  <span className="w-2 h-2 bg-accent-orange rounded-full animate-pulse flex-shrink-0" />
                  <span className="truncate">{t.home.badge}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl xl:text-6xl font-black text-white leading-tight mb-4 w-full">
                  {t.home.title1}{' '}
                  <span className="text-gradient-orange block">{t.home.title2}</span>
                  <span className="text-accent-orange">{t.home.title3}</span>
                </h1>
                <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6 w-full">
                  {t.home.desc}
                </p>
                <div className="flex flex-col gap-3 w-full">
                  <Link href="/inscription" className="flex items-center justify-center gap-2 bg-accent-orange text-white px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-amber-500 transition-all shadow-xl w-full">
                    {t.home.cta_register} <ArrowRight size={16} />
                  </Link>
                  <Link href="/programme" className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-white/20 transition-all w-full">
                    <Play size={16} /> {t.home.cta_programme}
                  </Link>
                </div>
              </motion.div>
            </div>

            <div className="w-full space-y-4 mt-4 lg:mt-0">
              <div className="bg-primary-900/80 backdrop-blur-xl border border-accent-orange/40 rounded-3xl p-5 md:p-8 w-full overflow-hidden">
                <p className="text-accent-orange font-bold text-xs mb-4 text-center uppercase tracking-widest">
                  🚀 {t.home.countdown}
                </p>
                <CountdownTimer targetDate="2026-05-14T09:00:00" />
              </div>
              <div className="grid grid-cols-3 gap-2 w-full">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-primary-900/40 backdrop-blur border border-white/20 rounded-2xl p-2 md:p-4 text-center">
                    <div className="text-lg md:text-2xl mb-1">{stat.icon}</div>
                    <div className="text-sm md:text-xl font-black text-accent-orange leading-none">{stat.value}</div>
                    <div className="text-white/60 text-xs mt-1 leading-tight">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center gap-1 text-white/40 text-xs mt-8">
            <span>{lang === 'fr' ? 'Découvrir' : 'Discover'}</span>
            <ChevronDown size={18} />
          </motion.div>
        </div>
      </section>

      {/* About Strip */}
      <section className="bg-gradient-to-r from-primary-900 to-primary-800 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="text-white">
            <p className="text-accent-orange font-bold text-xs uppercase tracking-widest mb-1">📍 Bamako, Mali</p>
            <p className="text-base md:text-2xl font-black">
              {lang === 'fr' ? 'Palais des Congrès · 14, 15 & 16 Mai 2026' : 'Congress Palace · May 14, 15 & 16, 2026'}
            </p>
          </div>
          <Link href="/inscription" className="flex-shrink-0 bg-accent-orange text-white px-6 py-3 rounded-xl font-black hover:bg-amber-500 transition-colors text-sm">
            {lang === 'fr' ? 'Réserver ma place →' : 'Book my seat →'}
          </Link>
        </div>
      </section>

      {/* Crisis Context */}
      <section className="py-16 md:py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 md:mb-16">
            <p className="text-accent-orange font-bold text-xs uppercase tracking-widest mb-3">
              {lang === 'fr' ? 'Contexte de crise' : 'Crisis context'}
            </p>
            <h2 className="text-2xl md:text-4xl font-black text-primary-900 mb-4">
              {lang === 'fr' ? 'Le Mali a besoin de solidarité' : 'Mali needs solidarity'}
            </h2>
            <div className="section-divider mx-auto mb-6" />
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              {lang === 'fr'
                ? 'Face aux défis humanitaires croissants, le SAHD crée l\'espace de convergence pour les acteurs du développement.'
                : 'Facing growing humanitarian challenges, SAHD creates the convergence space for development actors.'}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
            {[
              { icon: '👥', value: '8.8M', label: lang === 'fr' ? 'Personnes dans le besoin' : 'People in need', color: 'from-red-500 to-red-600' },
              { icon: '🏠', value: '700K+', label: lang === 'fr' ? 'Déplacés internes' : 'Internally displaced', color: 'from-orange-500 to-orange-600' },
              { icon: '🌾', value: '1.4M', label: lang === 'fr' ? 'En insécurité alimentaire' : 'Food insecure', color: 'from-amber-500 to-amber-600' },
              { icon: '🏥', value: '2.5M', label: lang === 'fr' ? 'Besoins humanitaires ($)' : 'Humanitarian needs ($)', color: 'from-primary-600 to-primary-700' },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card-lift">
                <div className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 md:p-6 text-white text-center h-full`}>
                  <div className="text-3xl md:text-4xl mb-2">{stat.icon}</div>
                  <div className="text-xl md:text-3xl font-black mb-1">{stat.value}</div>
                  <div className="text-white/80 text-xs md:text-sm">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[...humanitarianImages.volunteers, ...humanitarianImages.crisis].slice(0, 8).map((img, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="relative overflow-hidden rounded-2xl aspect-square group">
                <img src={img} alt={`Humanitarian action ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/about" className="inline-flex items-center gap-2 bg-primary-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-800 transition-colors">
              {lang === 'fr' ? 'En savoir plus sur le contexte' : 'Learn more about the context'} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Mission & Pillars */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 md:mb-16">
            <p className="text-accent-orange font-bold text-xs uppercase tracking-widest mb-3">
              {lang === 'fr' ? 'Notre vision' : 'Our vision'}
            </p>
            <h2 className="text-2xl md:text-4xl font-black text-primary-900 mb-4">
              {lang === 'fr' ? 'Pourquoi le SAHD ?' : 'Why SAHD?'}
            </h2>
            <div className="section-divider mx-auto mb-6" />
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-lg leading-relaxed">
              {lang === 'fr'
                ? "Le SAHD rassemble chaque année les acteurs humanitaires, bailleurs de fonds, ONG et institutions pour faire avancer l'action humanitaire et le développement durable au Mali."
                : 'SAHD brings together humanitarian actors, donors, NGOs and institutions every year to advance humanitarian action and sustainable development in Mali.'}
            </p>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {pillars.map((pillar, i) => (
              <motion.div key={pillar.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card-lift">
                <div className={`bg-gradient-to-br ${pillar.color} rounded-2xl p-4 md:p-6 h-full text-white`}>
                  <div className="text-2xl md:text-4xl mb-2 md:mb-3">{pillar.icon}</div>
                  <h3 className="font-bold text-sm md:text-xl mb-1 md:mb-2">{pillar.title}</h3>
                  <p className="text-white/80 text-xs leading-relaxed">{pillar.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programme Teaser */}
      <section className="py-16 md:py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
            <div>
              <p className="text-accent-orange font-bold text-xs uppercase tracking-widest mb-2">Programme</p>
              <h2 className="text-2xl md:text-4xl font-black text-primary-900">
                {lang === 'fr' ? 'Panels à ne pas manquer' : 'Must-see panels'}
              </h2>
            </div>
            <Link href="/programme" className="text-primary-700 font-semibold flex items-center gap-2 text-sm">
              {lang === 'fr' ? 'Voir tout le programme' : 'View full programme'} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            {upcomingPanels.map((panel, i) => (
              <motion.div key={panel.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden card-lift">
                <div className="h-2" style={{ background: panel.color }} />
                <div className="p-4 md:p-5">
                  <div className="flex flex-wrap justify-between items-start mb-3 gap-2">
                    <span className="bg-primary-50 text-primary-800 text-xs font-bold px-2 py-1 rounded-full">
                      {lang === 'fr' ? 'Jour' : 'Day'} {panel.day} · {panel.startTime}
                    </span>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {lang === 'fr' ? panel.category : panel.category_en}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2">
                    {lang === 'fr' ? panel.title : panel.title_en}
                  </h3>
                  <p className="text-gray-500 text-xs mb-4 leading-relaxed line-clamp-2">
                    {lang === 'fr' ? panel.description : panel.description_en}
                  </p>
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{lang === 'fr' ? 'Places disponibles' : 'Available seats'}</span>
                      <span className={panel.registered >= panel.capacity ? 'text-red-500 font-bold' : 'text-accent-orange font-bold'}>
                        {panel.registered >= panel.capacity
                          ? (lang === 'fr' ? 'Complet' : 'Full')
                          : `${panel.capacity - panel.registered} ${lang === 'fr' ? 'restantes' : 'remaining'}`}
                      </span>
                    </div>
                    <div className="capacity-bar">
                      <div className="capacity-fill" style={{ width: `${Math.min((panel.registered / panel.capacity) * 100, 100)}%`, background: panel.registered >= panel.capacity ? '#ef4444' : '#FEA621' }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <Users size={12} /> {panel.registered}/{panel.capacity}
                    </div>
                    <Link href={`/programme#${panel.id}`} className={`text-xs font-bold px-3 py-2 rounded-xl transition-colors ${panel.registered >= panel.capacity ? 'bg-gray-100 text-gray-500' : 'bg-primary-900 text-white hover:bg-primary-700'}`}>
                      {panel.registered >= panel.capacity
                        ? (lang === 'fr' ? "Liste d'attente" : 'Waitlist')
                        : (lang === 'fr' ? 'Réserver' : 'Book')}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Speakers */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-accent-orange font-bold text-xs uppercase tracking-widest mb-2">
            {lang === 'fr' ? 'Intervenants' : 'Speakers'}
          </p>
          <h2 className="text-2xl md:text-4xl font-black text-primary-900 mb-4">
            {lang === 'fr' ? 'Nos experts invités' : 'Our invited experts'}
          </h2>
          <p className="text-gray-500">
            {lang === 'fr' ? 'Les intervenants seront bientôt annoncés.' : 'Speakers will be announced soon.'}
          </p>
        </div>
      </section>

      {/* Sponsors strip */}
      <section className="py-12 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-6 font-medium">{t.home.partners}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...mockSponsors.platine, ...mockSponsors.or].map(sponsor => (
              <a key={sponsor.id} href={sponsor.url} target="_blank" rel="noopener noreferrer" 
                className="flex flex-col items-center gap-2 bg-white px-4 py-4 rounded-2xl border border-gray-200 sponsor-card shadow-sm hover:shadow-lg hover:border-primary-200 transition-all">
                {sponsor.logoUrl ? (
                  <img src={sponsor.logoUrl} alt={sponsor.name} className="h-10 w-auto object-contain" />
                ) : (
                  <span className="text-3xl">{sponsor.logo}</span>
                )}
                <span className="font-bold text-gray-700 text-xs text-center">{sponsor.name}</span>
              </a>
            ))}
          </div>
          <Link href="/sponsors" className="inline-flex items-center gap-2 mt-6 text-primary-700 font-semibold hover:text-primary-900 transition-colors text-sm">
            {t.home.become_partner} <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* CTA Contact Sponsoring */}
      <section className="py-16 px-4 bg-primary-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
              {lang === 'fr' ? 'Intéressé par un partenariat ?' : 'Interested in a partnership?'}
            </h2>
            <p className="text-white/70 text-sm">
              {lang === 'fr' ? 'Contactez notre responsable partenariats directement' : 'Contact our partnership manager directly'}
            </p>
          </div>
          <SponsoringContactCard />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="w-16 h-16 bg-primary-50 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6">🌍</div>
            <h2 className="text-2xl md:text-4xl font-black text-primary-900 mb-4">{t.home.join_title}</h2>
            <p className="text-gray-600 text-sm md:text-lg mb-8 leading-relaxed">{t.home.join_desc}</p>
            <div className="flex flex-col gap-3 justify-center">
              <Link href="/inscription" className="bg-primary-900 text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-primary-800 transition-colors shadow-xl w-full">
                {t.home.free_register}
              </Link>
              <Link href="/inscription?cat=exposant" className="border-2 border-primary-900 text-primary-900 px-8 py-4 rounded-2xl font-bold text-base hover:bg-primary-50 transition-colors w-full">
                {t.home.expose_ngo}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
