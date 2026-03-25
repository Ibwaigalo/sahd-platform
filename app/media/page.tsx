'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Download, Image as ImageIcon, Film, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import { useLang } from '@/lib/lang-context'
import fr from '@/messages/fr.json'
import en from '@/messages/en.json'

import { mediaPhotos } from '@/lib/humanitarian-images'

const mockPhotos = mediaPhotos

const mockReplays = [
  { id: 1, titleFr: "Panel : Financement de l'action humanitaire", titleEn: 'Panel: Financing humanitarian action', duration: '1h 45min', dateFr: '14 Mai 2026', dateEn: 'May 14, 2026', thumb: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=320&h=180&fit=crop', views: 1240 },
  { id: 2, titleFr: "Cérémonie d'ouverture officielle SAHD 2026", titleEn: 'Official SAHD 2026 opening ceremony', duration: '45min', dateFr: '14 Mai 2026', dateEn: 'May 14, 2026', thumb: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=320&h=180&fit=crop', views: 3580 },
  { id: 3, titleFr: 'Atelier : Genre et développement inclusif', titleEn: 'Workshop: Gender and inclusive development', duration: '2h 10min', dateFr: '15 Mai 2026', dateEn: 'May 15, 2026', thumb: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=320&h=180&fit=crop', views: 870 },
]

const mockDocs = [
  { nameFr: 'Rapport SAHD 2026 – Edition complète', nameEn: 'SAHD 2026 Report – Complete edition', size: '8.2 MB', type: 'PDF', icon: '📄' },
  { nameFr: 'Communiqué de presse officiel', nameEn: 'Official press release', size: '1.1 MB', type: 'PDF', icon: '📰' },
  { nameFr: 'Résumé exécutif des panels', nameEn: 'Executive summary of panels', size: '3.4 MB', type: 'PDF', icon: '📋' },
  { nameFr: 'Annuaire des exposants SAHD', nameEn: 'SAHD exhibitors directory', size: '5.7 MB', type: 'PDF', icon: '📁' },
  { nameFr: 'Recommandations politiques', nameEn: 'Policy recommendations', size: '2.1 MB', type: 'PDF', icon: '🏛️' },
]

export default function MediaPage() {
  const [activeTab, setActiveTab] = useState('live')
  const [lightbox, setLightbox] = useState<typeof mockPhotos[0] | null>(null)
  const { lang } = useLang()
  const t = lang === 'fr' ? fr : en

  const tabs = [
    { id: 'live', label: t.media.live, icon: Film },
    { id: 'replays', label: t.media.replays, icon: Play },
    { id: 'photos', label: t.media.photos, icon: ImageIcon },
    { id: 'docs', label: t.media.docs, icon: FileText },
  ]

  const liveStreams = [
    { titleFr: 'Panel Financement', titleEn: 'Financing Panel' },
    { titleFr: 'Atelier Genre', titleEn: 'Gender Workshop' },
    { titleFr: 'B2B Networking', titleEn: 'B2B Networking' },
  ]

  return (
    <div className="pt-20">
      <div className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950/95 to-primary-900/95 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1920&h=600&fit=crop" 
          alt="Mali humanitarian action" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 max-w-7xl mx-auto text-center">
          <p className="text-accent-orange font-bold text-sm uppercase tracking-widest mb-3">{t.media.label}</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{t.media.title}</h1>
          <div className="section-divider mx-auto mb-6" />
          <p className="text-white/70">{t.media.desc}</p>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-4">
        <div className="max-w-7xl mx-auto flex overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 font-semibold text-sm whitespace-nowrap transition-all ${activeTab === tab.id ? 'border-primary-900 text-primary-900' : 'border-transparent text-gray-500 hover:text-primary-900'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Live */}
        {activeTab === 'live' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-600 font-bold text-sm">{t.media.live_label}</span>
              </div>
              <span className="text-gray-400 text-sm">{t.media.live_room}</span>
            </div>
            <div className="bg-gray-950 rounded-3xl overflow-hidden aspect-video flex items-center justify-center mb-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Play size={32} className="text-white ml-1" />
                </div>
                <p className="text-white font-bold text-xl">{t.media.live_title}</p>
                <p className="text-white/50 text-sm mt-2">{t.media.live_desc}</p>
                <button onClick={() => toast.success(t.media.notify_success)}
                  className="mt-4 bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-red-700 transition-colors">
                  {t.media.notify}
                </button>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {liveStreams.map((stream, i) => (
                <div key={i} className="bg-gray-100 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center">
                    <Film size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{lang === 'fr' ? stream.titleFr : stream.titleEn}</div>
                    <div className="text-gray-500 text-xs">{lang === 'fr' ? `Salle ${i + 1}` : `Room ${i + 1}`} · {t.media.coming_soon}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Replays */}
        {activeTab === 'replays' && (
          <div className="grid md:grid-cols-3 gap-6">
            {mockReplays.map((video, i) => (
              <motion.div key={video.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden card-lift">
                <div className="relative">
                  <img src={video.thumb} alt={lang === 'fr' ? video.titleFr : video.titleEn} className="w-full h-44 object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center">
                      <Play size={22} className="text-primary-900 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">{video.duration}</div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2">
                    {lang === 'fr' ? video.titleFr : video.titleEn}
                  </h3>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{lang === 'fr' ? video.dateFr : video.dateEn}</span>
                    <span>👁 {video.views.toLocaleString()} {t.media.views}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Photos */}
        {activeTab === 'photos' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {mockPhotos.map((photo, i) => (
              <motion.div key={photo.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                onClick={() => setLightbox(photo)} className="cursor-pointer overflow-hidden rounded-2xl group relative">
                <img src={photo.url} alt={lang === 'fr' ? photo.captionFr : photo.captionEn} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-3">
                  <p className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    {lang === 'fr' ? photo.captionFr : photo.captionEn}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Documents */}
        {activeTab === 'docs' && (
          <div className="max-w-2xl">
            <div className="space-y-3">
              {mockDocs.map((doc, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="text-3xl">{doc.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{lang === 'fr' ? doc.nameFr : doc.nameEn}</h3>
                    <p className="text-gray-500 text-sm">{doc.type} · {doc.size}</p>
                  </div>
                  <button onClick={() => toast.success(`${t.media.downloading} "${lang === 'fr' ? doc.nameFr : doc.nameEn}"...`)}
                    className="flex items-center gap-2 bg-primary-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary-800 transition-colors flex-shrink-0">
                    <Download size={14} /> {t.media.download}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <div className="relative max-w-4xl w-full">
            <img src={lightbox.url} alt={lang === 'fr' ? lightbox.captionFr : lightbox.captionEn} className="w-full rounded-2xl" />
            <p className="text-white text-center mt-4 font-semibold">{lang === 'fr' ? lightbox.captionFr : lightbox.captionEn}</p>
            <button className="absolute top-4 right-4 text-white/80 hover:text-white w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">✕</button>
          </div>
        </div>
      )}
    </div>
  )
}
