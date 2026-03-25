'use client'
import { motion } from 'framer-motion'
import { eventInfo, mockNGOs } from '@/lib/mock-data'
import Link from 'next/link'
import { ArrowRight, Download } from 'lucide-react'
import { useLang } from '@/lib/lang-context'
import fr from '@/messages/fr.json'
import en from '@/messages/en.json'
import { humanitarianImages } from '@/lib/humanitarian-images'

export default function AboutPage() {
  const { lang } = useLang()
  const t = lang === 'fr' ? fr : en

  const objectives = [
    { icon: '🤝', title: lang === 'fr' ? 'Fédérer les acteurs' : 'Unite stakeholders', desc: lang === 'fr' ? "Rassembler ONG, institutions, bailleurs et gouvernement autour d'une vision commune du développement durable au Mali." : 'Bring together NGOs, institutions, donors and government around a common vision of sustainable development in Mali.' },
    { icon: '💡', title: lang === 'fr' ? 'Partager les bonnes pratiques' : 'Share best practices', desc: lang === 'fr' ? "Capitaliser sur les expériences terrain et les innovations pour renforcer l'efficacité de l'action humanitaire." : 'Build on field experiences and innovations to strengthen the effectiveness of humanitarian action.' },
    { icon: '🔗', title: lang === 'fr' ? 'Catalyser les partenariats' : 'Catalyze partnerships', desc: lang === 'fr' ? 'Faciliter des rencontres B2B de qualité entre organisations complémentaires pour des collaborations durables.' : 'Facilitate quality B2B meetings between complementary organizations for lasting collaborations.' },
    { icon: '📢', title: lang === 'fr' ? 'Porter le plaidoyer' : 'Lead advocacy', desc: lang === 'fr' ? "Amplifier la voix des acteurs humanitaires auprès des décideurs politiques et du grand public." : 'Amplify the voice of humanitarian actors to policymakers and the general public.' },
    { icon: '🌍', title: lang === 'fr' ? 'Rayonnement international' : 'International outreach', desc: lang === 'fr' ? "Positionner le Mali comme hub régional de l'action humanitaire et attirer des investissements pour le développement." : 'Position Mali as a regional hub for humanitarian action and attract development investments.' },
    { icon: '📊', title: lang === 'fr' ? "Mesurer l'impact" : 'Measure impact', desc: lang === 'fr' ? "Documenter et évaluer l'impact des programmes pour une meilleure allocation des ressources." : 'Document and evaluate the impact of programs for better resource allocation.' },
  ]

  return (
    <div className="pt-20">
      {/* Humanitarian Images Showcase */}
      <section className="py-12 px-4 bg-gradient-to-br from-primary-900 to-primary-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-accent-orange font-bold text-sm uppercase tracking-widest mb-2">Action Humanitaire</p>
            <h2 className="text-2xl md:text-3xl font-black text-white">L'humanitaire en images</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {humanitarianImages.volunteers.map((img, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                className="overflow-hidden rounded-xl aspect-square">
                <img src={img} alt={`Action humanitaire ${i + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Concept Officiel */}
      <section className="py-28 px-4 bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 relative overflow-hidden mb-16 md:mb-24">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-400/10 to-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-primary-500/5 to-accent-orange/5 rounded-full blur-3xl" />
        <div className="max-w-6xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-8 shadow-lg">
              📜 {t.about.concept_badge}
            </div>
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-primary-900 via-blue-900 to-emerald-700 bg-clip-text text-transparent mb-8">
              {t.about.founding_doc}
            </h1>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50 mb-12 max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-primary-900 mb-8 text-center">{t.about.crisis_title}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-b from-red-50 to-red-25 rounded-2xl border border-red-100">
                <div className="text-4xl font-black text-red-600 mb-2">7,1M</div>
                <p className="text-lg font-bold text-red-900 mb-1">{t.about.people_helped}</p>
                <p className="text-sm text-gray-600">{t.about.population}</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-b from-blue-50 to-blue-25 rounded-2xl border border-blue-100">
                <div className="text-4xl font-black text-blue-600 mb-2">$276M</div>
                <p className="text-lg font-bold text-blue-900 mb-1">ONU 2024</p>
                <p className="text-sm text-gray-600">{t.about.un_aid}</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-b from-emerald-50 to-emerald-25 rounded-2xl border border-emerald-100">
                <div className="text-4xl font-black text-emerald-600 mb-2">277Mrd</div>
                <p className="text-lg font-bold text-emerald-900 mb-1">FCFA FONGIM</p>
                <p className="text-sm text-gray-600">{t.about.fongim}</p>
              </div>
            </div>
            <div className="mt-12 pt-10 border-t-4 border-primary-900/30">
              <p className="text-3xl font-black text-center mb-6 bg-gradient-to-r from-primary-900 to-blue-900 bg-clip-text text-transparent">
                🎯 {t.about.global_objective}
              </p>
              <p className="text-xl text-gray-800 text-center leading-relaxed max-w-2xl mx-auto">
                {t.about.global_objective_desc}
              </p>
            </div>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <a href="/api/pdf" download="CONCEPT-SAHD-MALI-2026.pdf"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-900 to-blue-900 hover:from-primary-800 hover:to-blue-800 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl transition-all group">
              <Download size={24} className="group-hover:-translate-y-1 transition-transform" />
              {t.about.download_pdf}
            </a>
            <Link href="/inscription" className="inline-flex items-center gap-2 border-2 border-primary-900 text-primary-900 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-primary-50 transition-all">
              {t.about.participate} <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <div className="h-20 md:h-32 bg-gradient-to-b from-indigo-50 to-white" />

      {/* Header */}
      <div className="bg-gradient-to-br from-primary-950 to-primary-900 py-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-orange/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-accent-orange font-bold text-sm uppercase tracking-widest mb-3">{t.about.presentation}</p>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 max-w-3xl leading-tight">{t.about.main_title}</h1>
            <div className="section-divider mb-6" />
            <p className="text-white/70 max-w-2xl text-lg leading-relaxed">
              {lang === 'fr' ? eventInfo.description : eventInfo.description_en}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
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
              <p className="text-accent-orange font-bold text-sm uppercase tracking-widest mb-3">{t.about.vision_label}</p>
              <h2 className="text-3xl font-black text-primary-900 mb-6">{t.about.vision_title}</h2>
              <p className="text-gray-600 leading-relaxed mb-4">{t.about.vision_p1}</p>
              <p className="text-gray-600 leading-relaxed mb-6">{t.about.vision_p2}</p>
              <Link href="/inscription" className="inline-flex items-center gap-2 bg-primary-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-800 transition-colors">
                {t.about.participate} <ArrowRight size={18} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { year: '2026', label: t.about.edition, image: humanitarianImages.volunteers[0] },
                { year: '100+', label: t.about.ngo_count, image: humanitarianImages.community[0] },
                { year: '3', label: t.about.event_days, image: humanitarianImages.conference[0] },
                { year: '15+', label: t.about.countries, image: humanitarianImages.crisis[0] },
              ].map((item, i) => (
                <motion.div key={item.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-primary-50 rounded-2xl p-6 text-center overflow-hidden relative group">
                  <img src={item.image} alt={item.label} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative z-10">
                    <div className="font-black text-primary-900 text-2xl">{item.year}</div>
                    <div className="text-gray-600 text-sm mt-1">{item.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-accent-orange font-bold text-sm uppercase tracking-widest mb-3">{t.about.objectives_label}</p>
            <h2 className="text-3xl font-black text-primary-900">{t.about.objectives_title}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectives.map((obj, i) => (
              <motion.div key={obj.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-lift">
                <div className="text-4xl mb-4">{obj.icon}</div>
                <h3 className="font-black text-primary-900 text-xl mb-2">{obj.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{obj.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NGOs */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-accent-orange font-bold text-sm uppercase tracking-widest mb-2">{t.about.ngos_label}</p>
              <h2 className="text-3xl font-black text-primary-900">{t.about.ngos_title}</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {mockNGOs.map((ngo, i) => (
              <motion.div key={ngo.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <img src={humanitarianImages.community[i % humanitarianImages.community.length]} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-primary-900/80" />
                </div>
                <div className="relative z-10">
                  <div className="text-4xl mb-3">{ngo.logo}</div>
                  <div className="font-black text-primary-900 text-lg">{ngo.acronym}</div>
                  <div className="text-gray-500 text-xs mt-1">{lang === 'fr' ? ngo.domain : ngo.domain_en}</div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/inscription?cat=exposant" className="inline-flex items-center gap-2 border-2 border-primary-900 text-primary-900 px-8 py-3.5 rounded-2xl font-bold hover:bg-primary-50 transition-colors">
              {t.about.expose_ngo} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 px-4 bg-primary-900">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-accent-orange font-bold text-sm uppercase tracking-widest mb-3">📍 {t.about.location_label}</p>
          <h2 className="text-3xl font-black text-white mb-3">{t.about.location_title}</h2>
          <p className="text-white/70">{t.about.location_desc}</p>
        </div>
      </section>
    </div>
  )
}
