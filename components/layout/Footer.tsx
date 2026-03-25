'use client'
import Link from 'next/link'
import { Mail, Phone, MapPin, Twitter, Facebook, Linkedin, Youtube } from 'lucide-react'
import { contactSponsoring, eventInfo } from '@/lib/mock-data'

export default function Footer() {
  return (
    <div className="bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <img src="/logo-sahd-web.png" alt="SAHD 2026" className="h-14 w-auto object-contain mb-4" />
            <p className="text-white/60 text-sm leading-relaxed mb-6">{eventInfo.tagline}. 14-16 Mai 2026, Bamako, Mali.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-3">
              {[{href:'/',label:'Accueil'},{href:'/about',label:'Le Salon'},{href:'/programme',label:'Programme'},{href:'/intervenants',label:'Intervenants'},{href:'/sponsors',label:'Sponsors'},{href:'/contact',label:'Contact'}].map(link => (
                <li key={link.href}><Link href={link.href} className="text-white/60 hover:text-white text-sm">{link.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Participants</h4>
            <ul className="space-y-3">
              {[{href:'/inscription',label:"S'inscrire"},{href:'/dashboard',label:'Mon tableau de bord'},{href:'/b2b',label:'Espace B2B VIP'},{href:'/privacy',label:'Confidentialite'}].map(link => (
                <li key={link.href}><Link href={link.href} className="text-white/60 hover:text-white text-sm">{link.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Contact Rapide</h4>
            <ul className="space-y-4">
              <li><a href={"mailto:"+contactSponsoring.email2} className="flex items-center gap-3 text-white/60 hover:text-white text-sm"><Mail size={16} />{contactSponsoring.email2}</a></li>
              <li><a href={"tel:"+contactSponsoring.phone} className="flex items-center gap-3 text-white/60 hover:text-white text-sm"><Phone size={16} />{contactSponsoring.phone}</a></li>
              <li><div className="flex items-center gap-3 text-white/60 text-sm"><MapPin size={16} />Bamako, Mali</div></li>
            </ul>
            <div className="mt-6 p-4 bg-accent-orange/10 border border-accent-orange/20 rounded-xl">
              <p className="text-accent-orange text-xs font-semibold mb-1">Dates de l'evenement</p>
              <p className="text-white font-bold">14 - 16 Mai 2026</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-white/40 text-xs">
          <p>2026 SAHD - Salon de l'Action Humanitaire et du Developpement au Mali.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">Confidentialite</Link>
            <Link href="/admin" className="hover:text-white">Admin</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
