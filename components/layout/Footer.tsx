'use client'
// components/layout/Footer.tsx
import Link from 'next/link'
import { Mail, Phone, MapPin, Twitter, Facebook, Linkedin, Youtube, ExternalLink } from 'lucide-react'
import { contactSponsoring, eventInfo } from '@/lib/mock-data'

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      {/* Contact Sponsoring Band */}
      <div className="bg-primary-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="sponsoring-contact-card p-8 md:p-10 max-w-4xl mx-auto">
            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-accent-gold/20 p-3 rounded-xl">
                  <span className="text-3xl">🤝</span>
                </div>
                <div>
                  <p className="text-accent-gold font-bold text-sm uppercase tracking-widest mb-1">
                    CONTACT PARTENARIAT & SPONSORING
                  </p>
                  <h3 className="text-white font-black text-2xl md:text-3xl">
                    {contactSponsoring.name}
                  </h3>
                  <p className="text-white/70 text-sm mt-1">{contactSponsoring.title}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <a
                  href={`tel:${contactSponsoring.phone}`}
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-5 py-4 transition-all group"
                >
                  <Phone size={18} className="text-accent-gold flex-shrink-0" />
                  <div>
                    <div className="text-xs text-white/50 mb-0.5">Téléphone / WhatsApp</div>
                    <div className="text-white font-bold group-hover:text-accent-gold transition-colors">
                      {contactSponsoring.phone}
                    </div>
                  </div>
                </a>

                <a
                  href={`mailto:${contactSponsoring.email}`}
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-5 py-4 transition-all group"
                >
                  <Mail size={18} className="text-accent-gold flex-shrink-0" />
                  <div>
                    <div className="text-xs text-white/50 mb-0.5">Email Sponsoring</div>
                    <div className="text-white font-bold group-hover:text-accent-gold transition-colors text-sm">
                      {contactSponsoring.email}
                    </div>
                  </div>
                </a>

                <a
                  href={`mailto:${contactSponsoring.email2}`}
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-5 py-4 transition-all group"
                >
                  <Mail size={18} className="text-accent-orange flex-shrink-0" />
                  <div>
                    <div className="text-xs text-white/50 mb-0.5">Email Général</div>
                    <div className="text-white font-bold group-hover:text-accent-orange transition-colors text-sm">
                      {contactSponsoring.email2}
                    </div>
                  </div>
                </a>

                <div className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-5 py-4">
                  <MapPin size={18} className="text-accent-gold flex-shrink-0" />
                  <div>
                    <div className="text-xs text-white/50 mb-0.5">Adresse</div>
                    <div className="text-white font-bold">{contactSponsoring.address}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo-sahd-web.png"
                alt="SAHD 2026"
                className="h-14 w-auto object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              {eventInfo.tagline}. 14–16 Mai 2026, Palais des Congrès, Bamako, Mali.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Twitter, url: '#', label: 'Twitter' },
                { icon: Facebook, url: '#', label: 'Facebook' },
                { icon: Linkedin, url: '#', label: 'LinkedIn' },
                { icon: Youtube, url: '#', label: 'YouTube' },
              ].map(({ icon: Icon, url, label }) => (
                <a
                  key={label}
                  href={url}
                  aria-label={label}
                  className="w-9 h-9 bg-white/10 hover:bg-primary-700 rounded-lg flex items-center justify-center text-white/60 hover:text-white transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Accueil' },
                { href: '/about', label: 'Le Salon' },
                { href: '/programme', label: 'Programme' },
                { href: '/intervenants', label: 'Intervenants' },
                { href: '/sponsors', label: 'Sponsors & Partenaires' },
                { href: '/media', label: 'Espace Média' },
                { href: '/contact', label: 'Contact' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/60 hover:text-accent-orange text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Espace Participants */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Participants</h4>
            <ul className="space-y-3">
              {[
                { href: '/inscription', label: "S'inscrire" },
                { href: '/dashboard', label: 'Mon tableau de bord' },
                { href: '/dashboard#badge', label: 'Mon badge' },
                { href: '/programme#panels', label: 'Réserver un panel' },
                { href: '/b2b', label: 'Espace B2B VIP' },
                { href: '/privacy', label: 'Politique de confidentialité' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/60 hover:text-accent-orange text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Contact Rapide</h4>
            <ul className="space-y-4">
              <li>
                <a href={`mailto:${contactSponsoring.email2}`} className="flex items-start gap-3 text-white/60 hover:text-accent-orange text-sm transition-colors">
                  <Mail size={16} className="mt-0.5 flex-shrink-0" />
                  {contactSponsoring.email2}
                </a>
              </li>
              <li>
                <a href={`tel:${contactSponsoring.phone}`} className="flex items-start gap-3 text-white/60 hover:text-accent-orange text-sm transition-colors">
                  <Phone size={16} className="mt-0.5 flex-shrink-0" />
                  {contactSponsoring.phone}
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-white/60 text-sm">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                  Palais des Congrès<br />Bamako, Mali
                </div>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-accent-orange/10 border border-accent-orange/20 rounded-xl">
              <p className="text-accent-orange text-xs font-semibold mb-1">📅 Dates de l'événement</p>
              <p className="text-white font-bold">14 – 16 Mai 2026</p>
              <p className="text-white/50 text-xs">Palais des Congrès, Bamako</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-white/40 text-xs">
          <p>© 2026 SAHD – Salon de l'Action Humanitaire et du Développement au Mali. Tous droits réservés.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Confidentialité</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Conditions</Link>
            <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
