'use client'
// app/about/page.tsx - VERSION CORRIGÉE TÉLÉCHARGEMENT PDF
import { motion } from 'framer-motion'
import { eventInfo, mockNGOs } from '@/lib/mock-data'
import Link from 'next/link'
import { ArrowRight, Download } from 'lucide-react'

const objectives = [
  { icon: '🤝', title: 'Fédérer les acteurs', desc: 'Rassembler ONG, institutions, bailleurs et gouvernement autour d\'une vision commune du développement durable au Mali.' },
  { icon: '💡', title: 'Partager les bonnes pratiques', desc: 'Capitaliser sur les expériences terrain et les innovations pour renforcer l\'efficacité de l\'action humanitaire.' },
  { icon: '🔗', title: 'Catalyser les partenariats', desc: 'Faciliter des rencontres B2B de qualité entre organisations complémentaires pour des collaborations durables.' },
  { icon: '📢', title: 'Porter le plaidoyer', desc: 'Amplifier la voix des acteurs humanitaires auprès des décideurs politiques et du grand public.' },
  { icon: '🌍', title: 'Rayonnement international', desc: 'Positionner le Mali comme hub régional de l\'action humanitaire et attirer des investissements pour le développement.' },
  { icon: '📊', title: 'Mesurer l\'impact', desc: 'Documenter et évaluer l\'impact des programmes pour une meilleure allocation des ressources.' },
]

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* === CONCEPT OFFICIEL - ESPACEMENT AUGMENTÉ === */}
      <section className="py-28 px-4 bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 relative overflow-hidden mb-16 md:mb-24">
        {/* Background blobs réduits */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-400/10 to-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-primary-500/5 to-accent-orange/5 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-8 shadow-lg">
              📜 Concept Officiel SAHD-Mali 2026
            </div>
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-primary-900 via-blue-900 to-emerald-700 bg-clip-text text-transparent mb-8">
              Le Document Fondateur
            </h1>
          </motion.div>

          {/* CHIFFRES - PLUS COMPACTS & ALIGNÉS */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50 mb-12 max-w-5xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-black text-primary-900 mb-8 text-center">Contexte de Crise au Mali</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* 7,1M PERSONNES */}
              <div className="text-center p-6 bg-gradient-to-b from-red-50 to-red-25 rounded-2xl border border-red-100">
                <div className="text-4xl font-black text-red-600 mb-2">7,1M</div>
                <p className="text-lg font-bold text-red-900 mb-1">Personnes aidées</p>
                <p className="text-sm text-gray-600">1/3 de la population (2024)</p>
              </div>
              
              {/* 276M$ ONU */}
              <div className="text-center p-6 bg-gradient-to-b from-blue-50 to-blue-25 rounded-2xl border border-blue-100">
                <div className="text-4xl font-black text-blue-600 mb-2">$276M</div>
                <p className="text-lg font-bold text-blue-900 mb-1">ONU 2024</p>
                <p className="text-sm text-gray-600">Aide humanitaire mondiale</p>
              </div>
              
              {/* 277Mrd FCFA */}
              <div className="text-center p-6 bg-gradient-to-b from-emerald-50 to-emerald-25 rounded-2xl border border-emerald-100">
                <div className="text-4xl font-black text-emerald-600 mb-2">277Mrd</div>
                <p className="text-lg font-bold text-emerald-900 mb-1">FCFA FONGIM</p>
                <p className="text-sm text-gray-600">82 ONG, 6 347 emplois</p>
              </div>
            </div>

            {/* Objectif global - DÉCALÉ VERS LE BAS */}
            <div className="mt-12 pt-10 border-t-4 border-primary-900/30">
              <p className="text-3xl font-black text-center mb-6 bg-gradient-to-r from-primary-900 to-blue-900 bg-clip-text text-transparent">
                🎯 Objectif Global
              </p>
              <p className="text-xl text-gray-800 text-center leading-relaxed max-w-2xl mx-auto">
                Valoriser et amplifier l'impact des interventions des Nations Unies et des ONG au Mali
              </p>
            </div>
          </motion.div>

          {/* ✅ CTA CORRIGÉ - <a> au lieu de <Link> */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <a 
              href="/api/pdf"
              download="CONCEPT-SAHD-MALI-2026.pdf"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-900 to-blue-900 hover:from-primary-800 hover:to-blue-800 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all group"
            >
              <Download size={24} className="group-hover:-translate-y-1 transition-transform" />
              Télécharger PDF Complet
            </a>
            <Link 
              href="/inscription" 
              className="inline-flex items-center gap-2 border-2 border-primary-900 text-primary-900 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-primary-50 transition-all"
            >
              Participer au SAHD <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* === SEPARATION VISUELLE NETTE === */}
      <div className="h-20 md:h-32 bg-gradient-to-b from-indigo-50 to-white" />

      {/* TES SECTIONS ORIGINALES - INCHANGÉES */}
      <div className="bg-gradient-to-br from-primary-950 to-primary-900 py-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-orange/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-accent-orange font-bold text-sm uppercase tracking-widest mb-3">Présentation</p>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 max-w-3xl leading-tight">
              Le Salon de l'Action Humanitaire et du Développement
            </h1>
            <div className="section-divider mb-6" />
            <p className="text-white/70 max-w-2xl text-lg leading-relaxed">
              {eventInfo.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Bannière stats orange - BIEN SÉPARÉE MAINTENANT */}
      <div className="bg-accent-orange py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          {Object.entries(eventInfo.stats).map(([key, val]) => (
            <div key={key}>
              <div className="text-white font-black text-3xl">{val}</div>
              <div className="text-white/70 text-sm capitalize mt-1">{key.replace('_', ' ')}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Vision */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-accent-orange font-bold text-sm uppercase tracking-widest mb-3">Notre vision</p>
              <h2 className="text-3xl font-black text-primary-900 mb-6">
                Un Mali humanitaire, solidaire et résilient
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Face aux défis humanitaires complexes que connaît le Mali — déplacements de populations, insécurité alimentaire, 
                changements climatiques, crise sécuritaire — le SAHD s'impose comme le espace de convergence et de solutions.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Notre plateforme rassemble chaque année les acteurs les plus influents du secteur pour co-construire 
                des réponses adaptées et durables aux défis humanitaires maliens.
              </p>
              <Link href="/inscription" className="inline-flex items-center gap-2 bg-primary-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-800 transition-colors">
                Participer au SAHD <ArrowRight size={18} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { year: '2026', label: '1ère édition', emoji: '🎉' },
                { year: '100+', label: 'ONG exposantes', emoji: '🏢' },
                { year: '3', label: 'Jours d\'événement', emoji: '📅' },
                { year: '15+', label: 'Pays participants', emoji: '🌍' },
              ].map(item => (
                <div key={item.label} className="bg-primary-50 rounded-2xl p-6 text-center">
                  <div className="text-4xl mb-2">{item.emoji}</div>
                  <div className="font-black text-primary-900 text-2xl">{item.year}</div>
                  <div className="text-gray-600 text-sm mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-accent-orange font-bold text-sm uppercase tracking-widest mb-3">Objectifs</p>
            <h2 className="text-3xl font-black text-primary-900">Nos 6 piliers stratégiques</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectives.map((obj, i) => (
              <motion.div
                key={obj.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-lift"
              >
                <div className="text-4xl mb-4">{obj.icon}</div>
                <h3 className="font-black text-primary-900 text-xl mb-2">{obj.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{obj.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ONG Exhibitors preview */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-accent-orange font-bold text-sm uppercase tracking-widest mb-2">ONG participantes</p>
              <h2 className="text-3xl font-black text-primary-900">Quelques exposants confirmés</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            {mockNGOs.map((ngo, i) => (
              <motion.div
                key={ngo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all"
              >
                <div className="text-4xl mb-3">{ngo.logo}</div>
                <div className="font-black text-primary-900 text-lg">{ngo.acronym}</div>
                <div className="text-gray-500 text-xs mt-1">{ngo.domain}</div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/inscription?cat=exposant" className="inline-flex items-center gap-2 border-2 border-primary-900 text-primary-900 px-8 py-3.5 rounded-2xl font-bold hover:bg-primary-50 transition-colors">
              Exposer votre ONG <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 px-4 bg-primary-900">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-accent-orange font-bold text-sm uppercase tracking-widest mb-3">📍 Lieu</p>
          <h2 className="text-3xl font-black text-white mb-3">Palais des Congrès de Bamako</h2>
          <p className="text-white/70">Bamako, République du Mali · 14, 15 & 16 Mai 2026</p>
        </div>
      </section>
    </div>
  )
}
