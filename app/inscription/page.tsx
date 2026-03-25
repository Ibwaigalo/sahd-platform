'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check, User, Building2, Star, Crown, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useLang } from '@/lib/lang-context'
import fr from '@/messages/fr.json'
import en from '@/messages/en.json'

const categories = [
  {
    id: 'visiteur',
    label: 'categories.visiteur',
    price: 'categories.visiteur_price',
    icon: User,
    color: 'from-gray-600 to-gray-500',
    featuresKey: 'categories.visiteur_features',
    popular: false,
  },
  {
    id: 'participant',
    label: 'categories.participant',
    price: 'categories.participant_price',
    icon: Building2,
    color: 'from-blue-700 to-blue-600',
    featuresKey: 'categories.participant_features',
    popular: false,
  },
  {
    id: 'exposant',
    label: 'categories.exposant',
    price: 'categories.exposant_price',
    icon: Star,
    color: 'from-primary-800 to-primary-700',
    featuresKey: 'categories.exposant_features',
    popular: true,
  },
  {
    id: 'vip_b2b',
    label: 'categories.vip',
    price: 'categories.vip_price',
    icon: Crown,
    color: 'from-primary-900 to-primary-800',
    featuresKey: 'categories.vip_features',
    popular: false,
  },
]

const formSchema = z.object({
  fullName: z.string().min(2, 'errors.name_required'),
  organization: z.string().min(2, 'errors.org_required'),
  email: z.string().email('errors.email_invalid'),
  password: z.string().min(8, 'errors.password_required'),
  phone: z.string().min(8, 'errors.phone_required'),
  domain: z.string().min(1, 'errors.domain_required'),
  country: z.string().min(1, 'errors.country_required'),
  rgpd: z.literal(true, { errorMap: () => ({ message: 'errors.rgpd_required' }) }),
})

type FormData = z.infer<typeof formSchema>

function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj) || path
}

const errorMessagesFR: Record<string, string> = {
  'errors.name_required': 'Nom requis (min 2 caractères)',
  'errors.org_required': 'Organisation requise',
  'errors.email_invalid': 'Email invalide',
  'errors.password_required': 'Mot de passe requis (min 8 caractères)',
  'errors.phone_required': 'Téléphone requis',
  'errors.domain_required': 'Domaine requis',
  'errors.country_required': 'Pays requis',
  'errors.rgpd_required': 'Vous devez accepter la politique de confidentialité',
}

const errorMessagesEN: Record<string, string> = {
  'errors.name_required': 'Name required (min 2 characters)',
  'errors.org_required': 'Organization required',
  'errors.email_invalid': 'Invalid email',
  'errors.password_required': 'Password required (min 8 characters)',
  'errors.phone_required': 'Phone required',
  'errors.domain_required': 'Field required',
  'errors.country_required': 'Country required',
  'errors.rgpd_required': 'You must accept the privacy policy',
}

const getErrorMsg = (key: string, lang: string) => {
  const msgs = lang === 'fr' ? errorMessagesFR : errorMessagesEN
  return msgs[key] || key
}

export default function InscriptionPage() {
  const { lang } = useLang()
  const t = lang === 'fr' ? fr : en
  const [selectedCategory, setSelectedCategory] = useState('visiteur')
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const getLabel = (key: string) => getNestedValue(t.inscription, key)

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', data.email)
        .maybeSingle()

      if (existingProfile) {
        toast.error(lang === 'fr' ? 'Cet email est déjà inscrit. Connectez-vous à votre espace.' : 'This email is already registered. Login to your space.')
        setLoading(false)
        return
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            organization: data.organization,
          }
        }
      })

      if (authError) {
        if (authError.message.includes('already registered') || authError.message.includes('User already registered')) {
          toast.error(lang === 'fr' ? 'Cet email est déjà inscrit. Connectez-vous à votre espace.' : 'This email is already registered. Login to your space.')
        } else {
          toast.error(`${lang === 'fr' ? 'Erreur' : 'Error'} : ${authError.message}`)
        }
        setLoading(false)
        return
      }

      if (!authData.user) {
        toast.error(lang === 'fr' ? 'Erreur lors de la création du compte' : 'Error creating account')
        setLoading(false)
        return
      }

      const badgeNumber = `SAHD-2026-${selectedCategory.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`

      await supabase.from('profiles').insert({
        user_id: authData.user.id,
        full_name: data.fullName,
        organization: data.organization,
        email: data.email,
        phone: data.phone,
        category: selectedCategory,
        domain: data.domain,
        country: data.country,
        badge_number: badgeNumber,
        verified: false,
      })

      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'inscription',
            to: data.email,
            name: data.fullName,
            organization: data.organization,
            category: selectedCategory,
            badgeNumber: badgeNumber,
          }),
        })
      } catch {}

      setUserEmail(data.email)
      setSubmitted(true)
      toast.success(lang === 'fr' ? 'Inscription réussie ! Email de confirmation envoyé.' : 'Registration successful! Confirmation email sent.')

    } catch (err: any) {
      toast.error(`${lang === 'fr' ? 'Erreur' : 'Error'} : ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const getError = (key: string) => getLabel(errors.fullName?.message === key ? key : '')
    || (key.includes('_') ? '' : key)

  if (submitted) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-accent-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-accent-orange" />
          </div>
          <h2 className="text-3xl font-black text-primary-900 mb-3">{getLabel('success_title')}</h2>
          <p className="text-gray-600 mb-4">
            {getLabel('success_message')} <strong>{userEmail}</strong>.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 text-left">
            <p className="text-blue-800 font-bold text-sm mb-1">📧 {getLabel('check_email')}</p>
            <p className="text-blue-600 text-sm">{getLabel('email_sent_from')}</p>
          </div>
          <div className="bg-primary-50 rounded-2xl p-4 mb-6">
            <p className="text-primary-800 font-bold">📅 {getLabel('event_info')}</p>
            <p className="text-primary-600 text-sm">{getLabel('event_location')}</p>
          </div>
          <Link
            href="/dashboard"
            className="block w-full bg-primary-900 text-white py-4 rounded-xl font-bold hover:bg-primary-800 transition-colors"
          >
            {getLabel('access_space')}
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="pt-20">
      <div className="bg-gradient-to-br from-primary-950 to-primary-900 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{getLabel('title')}</h1>
          <p className="text-white/70 text-lg">{getLabel('subtitle')}</p>
          <div className="flex items-center justify-center gap-3 mt-8">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step >= s ? 'bg-accent-orange text-white' : 'bg-white/20 text-white/60'
                }`}>
                  {step > s ? '✓' : s}
                </div>
                <span className={`text-sm ${step >= s ? 'text-white' : 'text-white/40'}`}>
                  {s === 1 ? getLabel('step1') : getLabel('step2')}
                </span>
                {s < 2 && <div className="w-12 h-px bg-white/20" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">

        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-black text-primary-900 text-center mb-8">
              {getLabel('select_category')}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {categories.map(cat => {
                const Icon = cat.icon
                const isSelected = selectedCategory === cat.id
                const features = (getNestedValue(t.inscription, cat.featuresKey) as unknown as string[]) || []
                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`relative cursor-pointer rounded-2xl border-2 overflow-hidden transition-all ${
                      isSelected ? 'border-primary-900 shadow-xl scale-105' : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    {cat.popular && (
                      <div className="absolute top-3 right-3 bg-accent-orange text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                        {getLabel('popular')}
                      </div>
                    )}
                    <div className={`bg-gradient-to-br ${cat.color} p-6 text-white`}>
                      <Icon size={28} className="mb-3" />
                      <h3 className="font-black text-lg">{getLabel(cat.label)}</h3>
                      <p className="text-white font-bold text-xl mt-1">{getLabel(cat.price)}</p>
                    </div>
                    <div className="p-5 bg-white">
                      <ul className="space-y-2">
                        {features.map((f: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <Check size={14} className="text-accent-orange flex-shrink-0 mt-0.5" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {isSelected && (
                      <div className="bg-primary-900 text-white text-center py-2 text-sm font-bold">
                        ✓ {getLabel('selected')}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="text-center">
              <button
                onClick={() => setStep(2)}
                className="bg-primary-900 text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-primary-800 transition-colors"
              >
                {getLabel('continue_with')} "{getLabel(categories.find(c => c.id === selectedCategory)?.label || '')}" →
              </button>
            </div>
            <p className="text-center text-gray-500 text-sm mt-6">
              {getLabel('already_registered')}{' '}
              <Link href="/login" className="text-primary-700 font-bold underline">
                {getLabel('login_link')}
              </Link>
            </p>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto">
            <div className="bg-primary-50 rounded-2xl p-4 mb-8 flex items-center justify-between">
              <div>
                <p className="text-primary-900 font-bold">{getLabel('category_chosen')}</p>
                <p className="text-primary-700">{getLabel(categories.find(c => c.id === selectedCategory)?.label || '')}</p>
              </div>
              <button onClick={() => setStep(1)} className="text-primary-600 text-sm underline">
                {getLabel('modify')}
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{getLabel('full_name')}</label>
                  <input {...register('fullName')} placeholder={getLabel('full_name_placeholder')}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100 transition-all" />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{getError(errors.fullName.message || 'errors.name_required')}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{getLabel('organization')}</label>
                  <input {...register('organization')} placeholder={getLabel('org_placeholder')}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100 transition-all" />
                  {errors.organization && <p className="text-red-500 text-xs mt-1">{getError(errors.organization.message || 'errors.org_required')}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{getLabel('email_label')}</label>
                  <input {...register('email')} type="email" placeholder={getLabel('email_placeholder')}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100 transition-all" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{getError(errors.email.message || 'errors.email_invalid')}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{getLabel('phone_label')}</label>
                  <input {...register('phone')} placeholder={getLabel('phone_placeholder')}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100 transition-all" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{getError(errors.phone.message || 'errors.phone_required')}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{getLabel('password_label')}</label>
                <div className="relative">
                  <input {...register('password')} type={showPassword ? 'text' : 'password'}
                    placeholder={getLabel('password_placeholder')}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100 transition-all" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{getError(errors.password.message || 'errors.password_required')}</p>}
                <p className="text-gray-400 text-xs mt-1">{getLabel('password_hint')}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{getLabel('domain_label')}</label>
                  <select {...register('domain')}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100 transition-all bg-white">
                    <option value="">{lang === 'fr' ? 'Sélectionner...' : 'Select...'}</option>
                    <option>Aide humanitaire</option><option>Santé</option><option>Éducation</option>
                    <option>Nutrition & Sécurité alimentaire</option><option>Protection de l'enfance</option>
                    <option>Genre & Développement</option><option>Eau & Assainissement</option>
                    <option>Gouvernance</option><option>Environnement</option><option>Innovation & Tech</option>
                    <option>Autre</option>
                  </select>
                  {errors.domain && <p className="text-red-500 text-xs mt-1">{getError(errors.domain.message || 'errors.domain_required')}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{getLabel('country_label')}</label>
                  <select {...register('country')}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100 transition-all bg-white">
                    <option value="">{lang === 'fr' ? 'Sélectionner...' : 'Select...'}</option>
                    <option>Mali</option><option>Sénégal</option><option>Côte d'Ivoire</option>
                    <option>Burkina Faso</option><option>Niger</option><option>Guinée</option>
                    <option>Mauritanie</option><option>France</option><option>Autre</option>
                  </select>
                  {errors.country && <p className="text-red-500 text-xs mt-1">{getError(errors.country.message || 'errors.country_required')}</p>}
                </div>
              </div>

              <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                <input type="checkbox" {...register('rgpd')} id="rgpd" className="mt-1 w-4 h-4" />
                <label htmlFor="rgpd" className="text-sm text-gray-600">
                  {getLabel('rgpd_label')}{' '}
                  <Link href="/privacy" className="text-primary-700 underline">{getLabel('rgpd_link')}</Link>
                  {' '}{getLabel('rgpd_suffix')}
                </label>
              </div>
              {errors.rgpd && <p className="text-red-500 text-xs">{getError(errors.rgpd.message || 'errors.rgpd_required')}</p>}

              <button type="submit" disabled={loading}
                className="w-full bg-accent-orange text-white py-4 rounded-xl font-bold text-lg hover:bg-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? getLabel('submit_loading') : getLabel('submit_button')}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  )
}