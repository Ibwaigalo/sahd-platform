'use client'
// app/login/page.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const formSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})

type FormData = z.infer<typeof formSchema>

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Email ou mot de passe incorrect')
        } else {
          toast.error(`Erreur : ${error.message}`)
        }
        return
      }

      toast.success('Connexion réussie !')
      router.push('/dashboard')

    } catch (err) {
      toast.error('Erreur inattendue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/logo-sahd-web.png"
            alt="SAHD 2026"
            className="h-16 w-auto object-contain mx-auto mb-4"
          />
          <h1 className="text-2xl font-black text-primary-900">Connexion</h1>
          <p className="text-gray-500 text-sm mt-1">Accédez à votre espace personnel</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
            <input
              {...register('email')}
              type="email"
              placeholder="votre@email.com"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100 transition-all"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mot de passe *</label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Votre mot de passe"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <p className="text-gray-500 text-sm">
            Pas encore de compte ?{' '}
            <Link href="/inscription" className="text-primary-700 font-bold underline">
              S'inscrire
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}