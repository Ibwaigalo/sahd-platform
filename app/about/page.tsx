'use client'
import { motion } from 'framer-motion'
import { eventInfo } from '@/lib/mock-data'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
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
      {/* Concept Officiel */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary-50 via-blue-50 to-indigo-50 relative overflow-hidden mb-16 md:mb-24">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-primary-400/10 to-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-accent-orange/5 to-primary-500/5 rounded-full blur-3xl" />
        <div className="max-w-6xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-blue-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-lg">
              📜 {t.about.concept_badge}
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-primary-900">{t.about.crisis_title}</h2>
          </motion.div>

          {/* Section 1: Intro avec image */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid lg:grid-cols-2 gap-8 items-center mb-12">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50">
              <p className="text-lg leading-relaxed text-gray-700">
                {lang === 'fr' 
                  ? "Au cœur du Sahel, le Mali se débat dans une crise d'une profondeur inouïe, sur le plan humanitaire et du développement. En 2024, près d'un tiers de sa population, soit 7,1 millions de personnes, dépend de l'aide humanitaire pour survivre, selon les Nations Unies."
                  : "In the heart of the Sahel, Mali is struggling with a crisis of unprecedented depth, on the humanitarian and development fronts. In 2024, nearly a third of its population, or 7.1 million people, depend on humanitarian aid to survive."}
              </p>
            </div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img src="/salon-01-intro.webp" alt="Humanitaire au Mali" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-accent-orange text-white px-4 py-2 rounded-xl font-bold shadow-lg">
                7,1M {lang === 'fr' ? 'personnes aidées' : 'people assisted'}
              </div>
            </motion.div>
          </motion.div>

          {/* Section 2: Conflits avec image */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="grid lg:grid-cols-2 gap-8 items-center mb-12">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
              className="relative order-2 lg:order-1">
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img src="/salon-02-conflits.webp" alt="Conflits au Mali" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-4 -right-4 bg-red-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg">
                378K {lang === 'fr' ? 'déplacés' : 'displaced'}
              </div>
            </motion.div>
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">⚔️</span>
                <h3 className="text-xl font-black text-red-700">{lang === 'fr' ? 'Conflits armés' : 'Armed conflicts'}</h3>
              </div>
              <p className="text-lg leading-relaxed text-gray-700">
                {lang === 'fr'
                  ? "Dans les régions du nord et du centre, les violences intercommunautaires et les activités des groupes armés ont délogé de leurs foyers 378 363 personnes, paralysant l'économie locale et déchirant le tissu social."
                  : "In the northern and central regions, inter-community violence and armed group activities have displaced 378,363 people, paralyzing the local economy."}
              </p>
            </div>
          </motion.div>

          {/* Section 3: Climat */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="grid lg:grid-cols-2 gap-8 items-center mb-12">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🌡️</span>
                <h3 className="text-xl font-black text-amber-700">{lang === 'fr' ? 'Changement climatique' : 'Climate change'}</h3>
              </div>
              <p className="text-lg leading-relaxed text-gray-700">
                {lang === 'fr'
                  ? "Sécheresses, inondations destructrices et dégradation des terres plongent 1,3 million de personnes dans l'insécurité alimentaire, dont 700 000 font face à une famine critique dans la seule région de Ménaka."
                  : "Droughts, destructive floods and land degradation push 1.3 million people into food insecurity, including 700,000 facing critical famine in the Ménaka region."}
              </p>
            </div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
              className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img src="/salon-03-climat.webp" alt="Insécurité alimentaire" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-amber-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg">
                1,3M {lang === 'fr' ? 'en insécurité alimentaire' : 'in food insecurity'}
              </div>
            </motion.div>
          </motion.div>

          {/* Section 4: Services publics */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="grid lg:grid-cols-2 gap-8 items-center mb-12">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}
              className="relative order-2 lg:order-1">
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img src="/salon-04-services.jpg" alt="Services au Mali" className="w-full h-full object-cover" />
              </div>
            </motion.div>
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🏥</span>
                <h3 className="text-xl font-black text-blue-700">{lang === 'fr' ? 'Services publics' : 'Public services'}</h3>
              </div>
              <p className="text-lg leading-relaxed text-gray-700 mb-4">
                {lang === 'fr'
                  ? "Les services publics s'effondrent : 1 700 écoles sont fermées, laissant 522 000 enfants sans éducation, et à peine 40 % des centres de santé fonctionnent normalement."
                  : "Public services are collapsing: 1,700 schools are closed, leaving 522,000 children without education, and barely 40% of health centers function normally."}
              </p>
              <div className="flex gap-4">
                <div className="bg-blue-100 rounded-xl p-4 text-center flex-1">
                  <div className="text-2xl font-black text-blue-700">1 700</div>
                  <div className="text-sm text-gray-600">{lang === 'fr' ? 'Écoles fermées' : 'Schools closed'}</div>
                </div>
                <div className="bg-red-100 rounded-xl p-4 text-center flex-1">
                  <div className="text-2xl font-black text-red-700">522K</div>
                  <div className="text-sm text-gray-600">{lang === 'fr' ? 'Enfants hors école' : 'Children out of school'}</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 5: Les plus vulnérables */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
            className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 mb-12 border border-red-100">
            <h3 className="text-2xl font-black text-red-800 mb-6 text-center">
              💔 {lang === 'fr' ? 'Les plus vulnérables paient le prix fort' : 'The most vulnerable pay the highest price'}
            </h3>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <p className="text-lg leading-relaxed text-gray-700">
                  {lang === 'fr'
                    ? "Des millions d'enfants sont privés d'eau potable et d'assainissement. Les femmes et les filles, exposées à des violences accrues, voient leurs voies de recours se réduire : 67 % des survivantes n'ont pas accès à des services de protection adaptés."
                    : "Millions of children are deprived of clean water and sanitation. Women and girls, exposed to increased violence, see their recourse channels shrink: 67% of survivors do not have access to appropriate protection services."}
                </p>
                <p className="text-lg leading-relaxed text-gray-700">
                  {lang === 'fr'
                    ? "Dans les campagnes, l'effondrement des systèmes agricoles et pastoraux menace les moyens de subsistance de 80 % des ménages."
                    : "In rural areas, the collapse of agricultural and pastoral systems threatens the livelihoods of 80% of households."}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 }}
                  className="rounded-2xl overflow-hidden shadow-lg aspect-square">
                  <img src="/salon-05-enfants.jpg" alt="Enfants vulnérables" className="w-full h-full object-cover" />
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.1 }}
                  className="rounded-2xl overflow-hidden shadow-lg aspect-square">
                  <img src="/salon-05-sante.jpg" alt="Santé" className="w-full h-full object-cover" />
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2 }}
                  className="rounded-2xl overflow-hidden shadow-lg aspect-square">
                  <img src="/salon-05-communaute.jpg" alt="Communauté" className="w-full h-full object-cover" />
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.3 }}
                  className="rounded-2xl overflow-hidden shadow-lg aspect-square">
                  <img src="/salon-05-femmes.jpg" alt="Femmes vulnérables" className="w-full h-full object-cover" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Section 6: Réponse collective */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}
            className="bg-gradient-to-br from-primary-900 to-blue-900 rounded-3xl p-8 md:p-12 shadow-2xl text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-black text-white mb-8">
              🤝 {lang === 'fr' ? 'La réponse collective s\'organise' : 'Collective response is organizing'}
            </h3>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="text-4xl font-black text-accent-orange mb-2">$276M</div>
                <p className="text-white/80">{lang === 'fr' ? 'Mobilisé par l\'ONU (2024)' : 'Mobilized by the UN (2024)'}</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="text-4xl font-black text-accent-orange mb-2">82</div>
                <p className="text-white/80">ONG (FONGIM)</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="text-4xl font-black text-accent-orange mb-2">4M+</div>
                <p className="text-white/80">{lang === 'fr' ? 'Maliens touchés' : 'Malians reached'}</p>
              </div>
            </div>
            <p className="text-lg text-white/90 leading-relaxed max-w-3xl mx-auto">
              {lang === 'fr'
                ? "L'aide vitale a touché plus de 4 millions de Maliens, soutenant l'eau, la santé, la nutrition, l'éducation, la sécurité alimentaire et la protection. Ces acteurs sont un pilier de l'économie locale, employant 6 347 personnes, dont plus de 5 977 Maliens."
                : "Vital aid has reached over 4 million Malians, supporting water, health, nutrition, education, food security and protection. These actors are a pillar of the local economy, employing 6,347 people."}
            </p>
          </motion.div>

          {/* Section 7: Mission SAHD */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}
            className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="bg-gradient-to-br from-primary-100 to-blue-100 rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-black text-primary-900 mb-4">
                🎯 {t.about.global_objective}
              </h3>
              <p className="text-lg leading-relaxed text-gray-700 mb-4">
                {lang === 'fr'
                  ? "Devant l'ampleur des efforts consentis et l'impact tangible de ces actions sur le quotidien des populations, il est devenu indispensable de leur offrir un écho, une visibilité à la mesure de leur engagement."
                  : "Given the scale of the efforts made and the tangible impact of these actions, it has become essential to give them an echo, a visibility commensurate with their commitment."}
              </p>
              <p className="text-lg leading-relaxed text-gray-700">
                {lang === 'fr'
                  ? "Plus qu'un événement, le SAHD-Mali se veut une plateforme essentielle pour mettre en lumière le travail remarquable accompli sur le terrain, valoriser les solutions durables et amplifier l'impact des interventions."
                  : "More than an event, SAHD-Mali aims to be an essential platform to highlight the remarkable work done on the ground, promote sustainable solutions and amplify the impact of interventions."}
              </p>
            </div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.6 }}
              className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img src="/salon-06-sahd.jpg" alt="SAHD 2026" className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 to-transparent rounded-3xl flex items-end p-6">
                <div className="text-white">
                  <div className="text-2xl font-black">SAHD-Mali 2026</div>
                  <div className="text-white/80">{lang === 'fr' ? 'Plateforme de l\'action humaniaire' : 'Humanitarian action platform'}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7 }}
            className="text-center mt-12">
            <Link href="/inscription" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-primary-700 hover:to-blue-700 transition-all shadow-xl">
              {t.about.participate} <ArrowRight size={20} />
            </Link>
          </motion.div>
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

      {/* NGOs - Coming Soon */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-accent-orange font-bold text-sm uppercase tracking-widest mb-2">{t.about.ngos_label}</p>
          <h2 className="text-3xl font-black text-primary-900 mb-8">{t.about.ngos_title}</h2>
          <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-3xl p-12 border border-primary-100">
            <div className="text-6xl mb-6">🔔</div>
            <h3 className="text-2xl font-black text-primary-900 mb-4">
              {lang === 'fr' ? 'Annonce imminente' : 'Coming soon'}
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto">
              {lang === 'fr' 
                ? "Les exposants confirmés seront annoncés prochainement. Restez connectés pour découvrir les organisations qui participeront au SAHD-Mali 2026."
                : "Confirmed exhibitors will be announced soon. Stay tuned to discover the organizations that will participate in SAHD-Mali 2026."}
            </p>
          </div>
          <div className="mt-8">
            <Link href="/inscription?cat=exposant" className="inline-flex items-center gap-2 bg-primary-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-800 transition-colors">
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
