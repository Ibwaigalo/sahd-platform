'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { contactSponsoring } from '@/lib/mock-data'
import SponsoringContactCard from '@/components/ui/SponsoringContactCard'
import toast from 'react-hot-toast'
import { useLang } from '@/lib/lang-context'
import fr from '@/messages/fr.json'
import en from '@/messages/en.json'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', org: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const { lang } = useLang()
  const t = lang === 'fr' ? fr : en

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    toast.success(t.contact.success)
    setFormData({ name: '', email: '', org: '', subject: '', message: '' })
  }

  return (
    <div className="pt-20">
      <div className="bg-gradient-to-br from-primary-950 to-primary-900 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{t.contact.title}</h1>
          <div className="section-divider mx-auto mb-6" />
          <p className="text-white/70 max-w-xl mx-auto">{t.contact.desc}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div>
            <h2 className="text-2xl font-black text-primary-900 mb-8">{t.contact.coordinates}</h2>
            <div className="space-y-4 mb-10">
              {[
                { icon: Mail, label: t.contact.email_label, value: contactSponsoring.email2, href: `mailto:${contactSponsoring.email2}` },
                { icon: Phone, label: t.contact.phone_label, value: contactSponsoring.phone, href: `tel:${contactSponsoring.phone}` },
                { icon: Phone, label: t.contact.phone_label2, value: contactSponsoring.phone2, href: `tel:${contactSponsoring.phone2}` },
                { icon: MapPin, label: t.contact.address_label, value: t.contact.address_value, href: '#' },
              ].map(({ icon: Icon, label, value, href }) => (
                <a key={label} href={href} className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-primary-50 transition-colors group">
                  <div className="w-10 h-10 bg-primary-900 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">{label}</div>
                    <div className="font-semibold text-gray-900 group-hover:text-primary-900 transition-colors">{value}</div>
                  </div>
                </a>
              ))}
            </div>
            <h3 className="text-lg font-black text-primary-900 mb-4">{t.contact.sponsoring_title}</h3>
            <SponsoringContactCard compact />
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <h2 className="text-2xl font-black text-primary-900 mb-6">{t.contact.form_title}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.contact.name} *</label>
                  <input required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder={t.contact.name_placeholder}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.contact.email} *</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    placeholder="email@example.com"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.contact.org}</label>
                <input value={formData.org} onChange={e => setFormData(p => ({ ...p, org: e.target.value }))}
                  placeholder={t.contact.org_placeholder}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.contact.subject} *</label>
                <select required value={formData.subject} onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-700 bg-white transition-all">
                  <option value="">{t.contact.subject_placeholder}</option>
                  {t.contact.subjects.map((s: string) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.contact.message} *</label>
                <textarea required value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                  rows={5} placeholder={t.contact.message_placeholder}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100 transition-all resize-none" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-primary-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                <Send size={18} />
                {loading ? t.contact.sending : t.contact.send}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
