'use client'
// app/inscription/page.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check, User, Building2, Star, Crown, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const categories = [
  {
    id: 'visiteur',
    label: 'Visiteur Standard',
    price: 'Gratuit',
    icon: User,
    color: 'from-gray-600 to-gray-500',
    features: ['Accès aux panels publics', 'Networking général', 'Galerie et expositions', 'Documentation digitale'],
  },
  {
    id: 'participant',
    label: 'Participant Payant',
    price: '25 000 FCFA',
    icon: Building2,
    color: 'from-blue-700 to-blue-600',
    features: ['Tout du Visiteur +', 'Badge nominatif officiel', 'Accès ateliers spécialisés', 'Repas inclus (3 jours)', 'Certificat de participation'],
  },
  {
    id: 'exposant',
    label: 'Exposant ONG',
    price: '150 000 FCFA',
    icon: Star,
    color: 'from-primary-800 to-primary-700',
    features: ['Stand 3x3m', 'Badge exposant (5)', 'Logo sur supports', 'Profil ONG plateforme', 'Accès B2B networking'],
    popular: true,
  },
  {
    id: 'vip_b2b',
    label: 'VIP B2B',
    price: '300 000 FCFA',
    icon: Crown,
    color: 'from-primary-900 to-primary-800',
    features: ['Tout Exposant +', 'Lounge VIP exclusif', 'RDV B2B pré-planifiés', 'Table ronde bailleurs', 'Couverture médiatique'],
  },
]

const formSchema = z.object({
  fullName: z.string().min(2, 'Nom requis (min 2 caractères)'),
  organization: z.string().min(2, 'Organisation requise'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Mot de passe requis (min 8 caractères)'),
  phone: z.string().min(8, 'Téléphone requis'),
  domain: z.string().min(1, 'Domaine requis'),
  country: z.string().min(1, 'Pays requis'),
  rgpd: z.literal(true, { errorMap: () => ({ message: 'Vous devez accepter la politique de confidentialité' }) }),
})

type FormData = z.infer<typeof formSchema>

export default function InscriptionPage() {
  const [selectedCategory, setSelectedCategory] = useState('visiteur')
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
  setLoading(true)
  try {
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
      toast.error(`Auth erreur : ${authError.message}`)
      setLoading(false)
      return
    }

    if (!authData.user) {
      toast.error('Pas de user retourné')
      setLoading(false)
      return
    }

    toast.success(`User créé : ${authData.user.id}`)

    const badgeNumber = `SAHD-2026-${selectedCategory.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
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
      .select()

    if (profileError) {
      toast.error(`Profile erreur : ${profileError.message} — ${profileError.details}`)
      console.error('PROFILE ERROR:', profileError)
      setLoading(false)
      return
    }

    toast.success(`Profil créé !`)
    setUserEmail(data.email)
    setSubmitted(true)

  } catch (err: any) {
    toast.error(`Erreur : ${err.message}`)
    console.error(err)
  } finally {
    setLoading(false)
  }
}

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
          <h2 className="text-3xl font-black text-primary-900 mb-3">Inscription confirmée !</h2>
          <p className="text-gray-600 mb-4">
            Un email de confirmation a été envoyé à <strong>{userEmail}</strong>.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 text-left">
            <p className="text-blue-800 font-bold text-sm mb-1">📧 Vérifiez votre boîte mail</p>
            <p className="text-blue-600 text-sm">Cliquez sur le lien dans l'email pour activer votre compte.</p>
          </div>
          <div className="bg-primary-50 rounded-2xl p-4 mb-6">
            <p className="text-primary-800 font-bold">📅 14–16 Mai 2026</p>
            <p className="text-primary-600 text-sm">Palais des Congrès, Bamako, Mali</p>
          </div>
          <Link
            href="/dashboard"
            className="block w-full bg-primary-900 text-white py-4 rounded-xl font-bold hover:bg-primary-800 transition-colors"
          >
            Accéder à mon espace →
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="pt-20">
      <div className="bg-gradient-to-br from-primary-950 to-primary-900 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Inscription SAHD 2026</h1>
          <p className="text-white/70 text-lg">Choisissez votre catégorie et créez votre compte</p>
          <div className="flex items-center justify-center gap-3 mt-8">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step >= s ? 'bg-accent-orange text-white' : 'bg-white/20 text-white/60'
                }`}>
                  {step > s ? '✓' : s}
                </div>
                <span className={`text-sm ${step >= s ? 'text-white' : 'text-white/40'}`}>
                  {s === 1 ? 'Catégorie' : 'Informations'}
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
              Sélectionnez votre catégorie
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {categories.map(cat => {
                const Icon = cat.icon
                const isSelected = selectedCategory === cat.id
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
                        Populaire
                      </div>
                    )}
                    <div className={`bg-gradient-to-br ${cat.color} p-6 text-white`}>
                      <Icon size={28} className="mb-3" />
                      <h3 className="font-black text-lg">{cat.label}</h3>
                      <p className="text-white font-bold text-xl mt-1">{cat.price}</p>
                    </div>
                    <div className="p-5 bg-white">
                      <ul className="space-y-2">
                        {cat.features.map(f => (
                          <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                            <Check size={14} className="text-accent-orange flex-shrink-0 mt-0.5" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {isSelected && (
                      <div className="bg-primary-900 text-white text-center py-2 text-sm font-bold">
                        ✓ Sélectionné
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
                Continuer avec "{categories.find(c => c.id === selectedCategory)?.label}" →
              </button>
            </div>
            <p className="text-center text-gray-500 text-sm mt-6">
              Déjà inscrit ?{' '}
              <Link href="/dashboard" className="text-primary-700 font-bold underline">
                Accéder à mon espace
              </Link>
            </p>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto">
            <div className="bg-primary-50 rounded-2xl p-4 mb-8 flex items-center justify-between">
              <div>
                <p className="text-primary-900 font-bold">Catégorie choisie :</p>
                <p className="text-primary-700">{categories.find(c => c.id === selectedCategory)?.label}</p>
              </div>
              <button onClick={() => setStep(1)} className="text-primary-600 text-sm underline">
                Modifier
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nom complet *</label>
                  <input {...register('fullName')} placeholder="Ex: Aminata Konaté"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100 transition-all" />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Organisation *</label>
                  <input {...register('organization')} placeholder="Ex: ONG Espoir Mali"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100 transition-all" />
                  {errors.organization && <p className="text-red-500 text-xs mt-1">{errors.organization.message}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                  <input {...register('email')} type="email" placeholder="votre@email.com"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100 transition-all" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Téléphone *</label>
                  <input {...register('phone')} placeholder="+223 70 00 00 00"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100 transition-all" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mot de passe *</label>
                <div className="relative">
                  <input {...register('password')} type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 caractères"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100 transition-all" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                <p className="text-gray-400 text-xs mt-1">Servira à vous connecter à votre espace personnel</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Domaine d'intervention *</label>
                  <select {...register('domain')}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100 transition-all bg-white">
                    <option value="">Sélectionner...</option>
                    <option>Aide humanitaire</option>
                    <option>Santé</option>
                    <option>Éducation</option>
                    <option>Nutrition & Sécurité alimentaire</option>
                    <option>Protection de l'enfance</option>
                    <option>Genre & Développement</option>
                    <option>Eau & Assainissement</option>
                    <option>Gouvernance</option>
                    <option>Environnement</option>
                    <option>Innovation & Tech</option>
                    <option>Autre</option>
                  </select>
                  {errors.domain && <p className="text-red-500 text-xs mt-1">{errors.domain.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pays *</label>
                  <select {...register('country')}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100 transition-all bg-white">
                    <option value="">Sélectionner...</option>
                    <option>Mali</option>
                    <option>Sénégal</option>
                    <option>Côte d'Ivoire</option>
                    <option>Burkina Faso</option>
                    <option>Niger</option>
                    <option>Guinée</option>
                    <option>Mauritanie</option>
                    <option>France</option>
                    <option>Autre</option>
                  </select>
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
                </div>
              </div>

              <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                <input type="checkbox" {...register('rgpd')} id="rgpd" className="mt-1 w-4 h-4" />
                <label htmlFor="rgpd" className="text-sm text-gray-600">
                  J'accepte la{' '}
                  <Link href="/privacy" className="text-primary-700 underline">politique de confidentialité</Link>
                  {' '}et le traitement de mes données pour l'organisation du SAHD 2026. *
                </label>
              </div>
              {errors.rgpd && <p className="text-red-500 text-xs">{errors.rgpd.message}</p>}

              <button type="submit" disabled={loading}
                className="w-full bg-accent-orange text-white py-4 rounded-xl font-bold text-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? '⏳ Création du compte en cours...' : '🎉 Créer mon compte et m\'inscrire'}
              </button>

            </form>
          </motion.div>
        )}
      </div>
    </div>
  )
}