'use client'
// components/layout/Navbar.tsx
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Globe, ChevronDown, User, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { useLang } from '@/lib/lang-context'

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
  const { lang, setLang } = useLang()
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
    setIsOpen(false)
  }

  const isActive = (href: string) => pathname === href

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-lg border-b border-gray-100' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <img
              src="/logo-sahd-web.png"
              alt="SAHD 2026"
              className="h-9 md:h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
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
          <div className="flex items-center gap-2">

            {/* Language Switcher — caché sur très petit écran */}
            <button
              onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
              className={`hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                scrolled
                  ? 'border-gray-200 text-gray-600 hover:border-primary-900 hover:text-primary-900'
                  : 'border-white/30 text-white hover:bg-white/10'
              }`}
            >
              <Globe size={12} />
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>

            {/* User connecté */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1 bg-primary-900 text-white px-3 py-2 rounded-xl text-xs font-semibold hover:bg-primary-800 transition-colors"
                >
                  <User size={14} />
                  <span className="hidden sm:block">Mon espace</span>
                  <ChevronDown size={12} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-12 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 min-w-[180px] z-50"
                    >
                      <Link href="/dashboard" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-sm text-gray-700">
                        <User size={16} /> Mon tableau de bord
                      </Link>
                      <Link href="/b2b" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-sm text-gray-700">
                        🤝 Espace B2B VIP
                      </Link>
                      <hr className="my-1" />
                      <button onClick={handleSignOut}
                        className="flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-sm text-red-600 w-full">
                        <LogOut size={16} /> Déconnexion
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login"
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors border ${
                    scrolled
                      ? 'text-primary-900 border-primary-900 hover:bg-primary-50'
                      : 'text-white border-white/30 hover:bg-white/10'
                  }`}>
                  {lang === 'fr' ? 'Se connecter' : 'Login'}
                </Link>
                <Link href="/inscription"
                  className="bg-accent-orange text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-amber-500 transition-colors">
                  {lang === 'fr' ? "S'inscrire" : 'Register'}
                </Link>
              </div>
            )}

            {/* Bouton menu hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-lg ${scrolled ? 'text-gray-700' : 'text-white'}`}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
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
              className="lg:hidden bg-white border-t border-gray-100 py-2 overflow-hidden"
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

              <div className="px-6 pt-3 pb-4 border-t border-gray-100 mt-2 space-y-2">
                {!user ? (
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)}
                      className="block text-center border border-primary-900 text-primary-900 px-6 py-3 rounded-xl font-bold text-sm">
                      {lang === 'fr' ? 'Se connecter' : 'Login'}
                    </Link>
                    <Link href="/inscription" onClick={() => setIsOpen(false)}
                      className="block text-center bg-accent-orange text-white px-6 py-3 rounded-xl font-bold text-sm">
                      {lang === 'fr' ? "S'inscrire" : 'Register'}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}
                      className="block text-center bg-primary-900 text-white px-6 py-3 rounded-xl font-bold text-sm">
                      Mon espace
                    </Link>
                    <button onClick={handleSignOut}
                      className="block w-full text-center border border-red-300 text-red-600 px-6 py-3 rounded-xl font-bold text-sm">
                      Déconnexion
                    </button>
                  </>
                )}

                {/* Language switcher dans le menu mobile */}
                <button
                  onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
                  className="flex items-center justify-center gap-2 w-full text-gray-500 text-sm py-2"
                >
                  <Globe size={14} />
                  {lang === 'fr' ? 'Switch to English' : 'Passer en Français'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}