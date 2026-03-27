'use client'
// components/ui/SponsoringContactCard.tsx
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react'
import { contactSponsoring } from '@/lib/mock-data'

export default function SponsoringContactCard({ compact = false }: { compact?: boolean }) {
  return (
    <div className="sponsoring-contact-card p-6 md:p-8">
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
          <div className="bg-accent-gold/20 p-3 rounded-xl flex-shrink-0 overflow-hidden">
            <img src="/sponsor-hands.webp" alt="Partenariat" className="w-14 h-14 object-cover rounded-lg" />
          </div>
          <div>
            <p className="text-white font-bold text-sm uppercase tracking-widest mb-1">
              CONTACT PARTENARIAT & SPONSORING – SAHD 2026
            </p>
            <h3 className="text-white font-black text-xl md:text-2xl">{contactSponsoring.name}</h3>
            <p className="text-white/60 text-sm">{contactSponsoring.title}</p>
          </div>
        </div>

        <div className={`grid ${compact ? 'grid-cols-1 gap-3' : 'sm:grid-cols-2 gap-4'}`}>
          <a href={`tel:${contactSponsoring.phone}`}
            className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-3 transition-all group">
            <Phone size={16} className="text-accent-gold flex-shrink-0" />
            <div>
              <div className="text-white/50 text-xs">Téléphone 1</div>
              <div className="text-white font-bold text-sm group-hover:text-accent-gold transition-colors">{contactSponsoring.phone}</div>
            </div>
          </a>

          <a href={`tel:${contactSponsoring.phone2}`}
            className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-3 transition-all group">
            <Phone size={16} className="text-accent-orange flex-shrink-0" />
            <div>
              <div className="text-white/50 text-xs">Téléphone 2</div>
              <div className="text-white font-bold text-sm group-hover:text-accent-orange transition-colors">{contactSponsoring.phone2}</div>
            </div>
          </a>

          <a href={`https://wa.me/${contactSponsoring.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-xl px-4 py-3 transition-all group">
            <MessageCircle size={16} className="text-accent-orange flex-shrink-0" />
            <div>
              <div className="text-white/50 text-xs">WhatsApp Direct</div>
              <div className="text-white font-bold text-sm group-hover:text-accent-orange transition-colors">{contactSponsoring.whatsapp}</div>
            </div>
          </a>

          <a href={`mailto:${contactSponsoring.email}`}
            className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-3 transition-all group">
            <Mail size={16} className="text-accent-gold flex-shrink-0" />
            <div>
              <div className="text-white/50 text-xs">Email Sponsoring</div>
              <div className="text-white font-bold text-sm group-hover:text-accent-gold transition-colors break-all">{contactSponsoring.email}</div>
            </div>
          </a>

          <a href={`mailto:${contactSponsoring.email2}`}
            className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-3 transition-all group">
            <Mail size={16} className="text-accent-orange flex-shrink-0" />
            <div>
              <div className="text-white/50 text-xs">Email Général</div>
              <div className="text-white font-bold text-sm group-hover:text-accent-orange transition-colors break-all">{contactSponsoring.email2}</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
