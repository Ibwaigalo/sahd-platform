'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  password: z.string().min(8, 'Mot de passe requis (min 8 caractères)'),
  confirm: z.string().min(8, 'Confirmation requise'),
}).refine(data => data.password === data.confirm, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirm'],
})

type FormData = z.infer<typeof formSchema>

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [ready, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Récupérer le token depuis le hash de l'URL
    const hash = window.location.hash
    if (hash) {
      const params = new URLSearchParams(hash.substring(1))
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')

      if (accessToken && refreshToken) {
        supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        }).then(() => {
          setReady(true)
        })
      }
    } else {
      setReady(true)
    }
  }, [])

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      })

      if (error) {
        toast.error(`Erreur : ${error.message}`)
        return
      }

      toast.success('Mot de passe mis à jour !')
      router.push('/login')

    } catch (err: any) {
      toast.error('Erreur inattendue')
    } finally {
      setLoading(false)
    }
  }

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  if (!ready) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-900 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <img src="/logo-sahd-white.png" alt="SAHD 2026" className="h-16 w-auto object-contain mx-auto mb-4" />
          <h1 className="text-2xl font-black text-primary-900">Nouveau mot de passe</h1>
          <p className="text-gray-500 text-sm mt-1">Choisissez un nouveau mot de passe sécurisé</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nouveau mot de passe *</label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 caractères"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100 transition-all"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirmer le mot de passe *</label>
            <div className="relative">
              <input
                {...register('confirm')}
                type={showConfirm ? 'text' : 'password'}
                placeholder="Répétez le mot de passe"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100 transition-all"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm.message}</p>}
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-accent-orange text-white py-4 rounded-xl font-bold text-lg hover:bg-amber-500 transition-colors disabled:opacity-50">
            {loading ? '⏳ Mise à jour...' : 'Mettre à jour le mot de passe'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}