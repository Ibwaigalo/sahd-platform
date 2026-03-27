'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const formSchema = z.object({
  email: z.string().email('Email invalide'),
})

type FormData = z.infer<typeof formSchema>

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
  redirectTo: 'https://sahd-mali.org/reset-password',
      })

      if (error) {
        toast.error(`Erreur : ${error.message}`)
        setLoading(false)
        return
      }

      setUserEmail(data.email)
      setSent(true)
      toast.success('Email de récupération envoyé !')

    } catch (err: any) {
      toast.error('Erreur inattendue')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-accent-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📧</span>
          </div>
          <h2 className="text-2xl font-black text-primary-900 mb-3">Email envoyé !</h2>
          <p className="text-gray-600 mb-6">
            Un lien de récupération a été envoyé à <strong>{userEmail}</strong>.
            Vérifiez votre boîte mail et vos spams.
          </p>
          <Link href="/login"
            className="block w-full bg-primary-900 text-white py-4 rounded-xl font-bold hover:bg-primary-800 transition-colors">
            Retour à la connexion
          </Link>
        </motion.div>
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
          <h1 className="text-2xl font-black text-primary-900">Mot de passe oublié ?</h1>
          <p className="text-gray-500 text-sm mt-1">Entrez votre email pour recevoir un lien de récupération</p>
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

          <button type="submit" disabled={loading}
            className="w-full bg-primary-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-800 transition-colors disabled:opacity-50">
            {loading ? '⏳ Envoi en cours...' : 'Envoyer le lien de récupération'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          <Link href="/login" className="text-primary-700 font-bold underline">
            Retour à la connexion
          </Link>
        </p>
      </motion.div>
    </div>
  )
}