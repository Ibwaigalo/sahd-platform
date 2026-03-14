'use client'
// components/layout/Navbar.tsx
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Globe, ChevronDown, User, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

const navLinks = [
  { href: '/', label: 'Accueil', label_en: 'Home' },
  { href: '/about', label: 'Le Salon', label_en: 'About' },
  { href: '/programme', label: 'Programme', label_en: 'Programme' },
  { href: '/intervenants', label: 'Intervenants', label_en: 'Speakers' },
  { href: '/sponsors', label: 'Sponsors', label_en: 'Sponsors' },
  { href: '/media', label: 'Média', label_en: 'Media' },
  { href: '/contact', label: 'Contact', label_en: 'Contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [lang, setLang] = useState<'fr' | 'en'>('fr')
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    toast.success('Déconnexion réussie')
    setUserMenuOpen(false)
  }

  const isActive = (href: string) => pathname === href

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-lg border-b border-gray-100' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo-sahd-web.png"
              alt="SAHD 2026"
              className="h-12 w-auto object-contain group-hover:scale-105 transition-transform"
            />
            <div className="hidden sm:block">
              <div className={`text-xs leading-tight ${scrolled ? 'text-gray-500' : 'text-white/70'}`}>
                {lang === 'fr' ? '14–16 Mai · Bamako' : 'May 14–16 · Bamako'}
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? 'bg-primary-900/10 text-primary-900 font-semibold'
                    : scrolled
                    ? 'text-gray-700 hover:text-primary-900 hover:bg-primary-50'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {lang === 'fr' ? link.label : link.label_en}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                scrolled
                  ? 'border-gray-200 text-gray-600 hover:border-primary-900 hover:text-primary-900'
                  : 'border-white/30 text-white hover:bg-white/10'
              }`}
            >
              <Globe size={14} />
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>

            {/* User / CTA */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-primary-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-800 transition-colors"
                >
                  <User size={16} />
                  <span className="hidden sm:block">Mon espace</span>
                  <ChevronDown size={14} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-12 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 min-w-[180px]"
                    >
                      <Link href="/dashboard" className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-sm text-gray-700">
                        <User size={16} /> Mon tableau de bord
                      </Link>
                      <Link href="/b2b" className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-sm text-gray-700">
                        🤝 Espace B2B VIP
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-sm text-red-600 w-full"
                      >
                        <LogOut size={16} /> Déconnexion
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
  <div className="flex items-center gap-2">
    <Link
      href="/login"
      className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
        scrolled
          ? 'text-primary-900 hover:bg-primary-50 border border-primary-900'
          : 'text-white hover:bg-white/10 border border-white/30'
      }`}
    >
      {lang === 'fr' ? 'Se connecter' : 'Login'}
    </Link>
    <Link
      href="/inscription"
      className="bg-accent-orange text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-amber-500 transition-colors"
    >
      {lang === 'fr' ? "S'inscrire" : 'Register'}
    </Link>
  </div>
)}

            {/* Mobile menu */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-lg ${scrolled ? 'text-gray-700' : 'text-white'}`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-100 py-4"
            >
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-6 py-3 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-primary-900 bg-primary-50 font-semibold'
                      : 'text-gray-700 hover:text-primary-900 hover:bg-gray-50'
                  }`}
                >
                  {lang === 'fr' ? link.label : link.label_en}
                </Link>
              ))}
              <div className="px-6 pt-4 border-t border-gray-100 mt-2">
                <Link
                  href="/inscription"
                  onClick={() => setIsOpen(false)}
                  className="block text-center bg-primary-900 text-white px-6 py-3 rounded-xl font-bold"
                >
                  {lang === 'fr' ? "S'inscrire" : 'Register'}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
