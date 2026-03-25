'use client'
import { useLang } from '@/lib/lang-context'
import fr from '@/messages/fr.json'
import en from '@/messages/en.json'

function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj) || path
}

export default function PrivacyPage() {
  const { lang } = useLang()
  const t = lang === 'fr' ? fr : en
  const s = t.privacy.sections

  return (
    <div className="pt-20">
      <div className="bg-primary-950 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-black text-white">{t.privacy.title}</h1>
          <p className="text-white/60 mt-2">{t.privacy.updated}</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-16 prose prose-lg">
        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-black text-primary-900">{s.data_collection}</h2>
            <p>{s.data_collection_text}</p>
          </section>
          <section>
            <h2 className="text-2xl font-black text-primary-900">{s.data_use}</h2>
            <p>{s.data_use_text}</p>
          </section>
          <section>
            <h2 className="text-2xl font-black text-primary-900">{s.legal_basis}</h2>
            <p>{s.legal_basis_text}</p>
          </section>
          <section>
            <h2 className="text-2xl font-black text-primary-900">{s.retention}</h2>
            <p>{s.retention_text}</p>
          </section>
          <section>
            <h2 className="text-2xl font-black text-primary-900">{s.rights}</h2>
            <p>{s.rights_text} <a href="mailto:privacy@sahd-mali.org" className="text-primary-700">privacy@sahd-mali.org</a></p>
          </section>
          <section>
            <h2 className="text-2xl font-black text-primary-900">{s.cookies}</h2>
            <p>{s.cookies_text}</p>
          </section>
          <section>
            <h2 className="text-2xl font-black text-primary-900">{s.contact}</h2>
            <p>{s.contact_text} <a href="mailto:privacy@sahd-mali.org" className="text-primary-700">privacy@sahd-mali.org</a></p>
          </section>
        </div>
      </div>
    </div>
  )
}
