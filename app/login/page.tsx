'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, User, Building2, Star, Crown } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})

const registerSchema = z.object({
  fullName: z.string().min(2, 'Nom requis (min 2 caractères)'),
  organization: z.string().min(2, 'Organisation requise'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Min. 8 caractères'),
  phone: z.string().min(8, 'Téléphone requis'),
  domain: z.string().min(1, 'Domaine requis'),
  country: z.string().min(1, 'Pays requis'),
  rgpd: z.literal(true, { errorMap: () => ({ message: 'Vous devez accepter la politique de confidentialité' }) }),
})

type LoginData = z.infer<typeof loginSchema>
type RegisterData = z.infer<typeof registerSchema>

const categories = [
  { id: 'visiteur', label: 'Visiteur', price: 'Gratuit', icon: User },
  { id: 'participant', label: 'Participant', price: '25 000 FCFA', icon: Building2 },
  { id: 'exposant', label: 'Exposant ONG', price: '150 000 FCFA', icon: Star },
  { id: 'vip_b2b', label: 'VIP B2B', price: '300 000 FCFA', icon: Crown },
]

const s = {
  input: {
    width: '100%', padding: '12px 16px', background: '#f3f4f6',
    border: '2px solid transparent', borderRadius: 10, fontSize: '0.9rem',
    color: '#111', outline: 'none', fontFamily: 'Outfit, sans-serif',
    boxSizing: 'border-box' as const,
  },
  btn: (bg = '#1e3a8a'): React.CSSProperties => ({
    width: '100%', padding: '14px', background: bg, color: '#fff',
    border: 'none', borderRadius: 10, fontSize: '1rem', fontWeight: 700,
    cursor: 'pointer', fontFamily: 'Outfit, sans-serif', marginTop: 8,
  }),
  err: { fontSize: '0.72rem', color: '#ef4444' } as React.CSSProperties,
  eye: {
    position: 'absolute' as const, right: 14, top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af',
  },
  field: { display: 'flex', flexDirection: 'column', gap: 4 } as React.CSSProperties,
}

function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginData) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password })
      if (error) { toast.error('Email ou mot de passe incorrect'); return }
      toast.success('Connexion réussie !')
      router.push('/dashboard')
    } catch { toast.error('Erreur inattendue') }
    finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: 4, display: 'flex', justifyContent: 'center' }}>
        <img src="/logo-sahd-web.png" alt="SAHD" style={{ height: 60, width: 'auto', objectFit: 'contain', display: 'block' }} />
      </div>
      <h2 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#1e3a8a', textAlign: 'center', margin: 0 }}>Connexion</h2>
      <p style={{ fontSize: '0.85rem', color: '#6b7280', textAlign: 'center', margin: 0 }}>Accédez à votre espace personnel</p>

      <div style={s.field}>
        <input {...register('email')} type="email" placeholder="Email" style={s.input} />
        {errors.email && <span style={s.err}>{errors.email.message}</span>}
      </div>

      <div style={s.field}>
        <div style={{ position: 'relative' }}>
          <input {...register('password')} type={showPw ? 'text' : 'password'} placeholder="Mot de passe" style={s.input} />
          <button type="button" onClick={() => setShowPw(!showPw)} style={s.eye}>
            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <span style={s.err}>{errors.password.message}</span>}
      </div>

      <Link href="/forgot-password" style={{ fontSize: '0.82rem', color: '#1e3a8a', textAlign: 'right', textDecoration: 'underline' }}>
        Mot de passe oublié ?
      </Link>

      <button type="submit" disabled={loading} style={{ ...s.btn(), opacity: loading ? 0.5 : 1 }}>
        {loading ? '⏳ Connexion...' : 'Se connecter'}
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#6b7280', marginTop: 4 }}>
        Pas encore de compte ?{' '}
        <button type="button" onClick={onSwitch} style={{ background: 'none', border: 'none', color: '#1e3a8a', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif' }}>
          S'inscrire
        </button>
      </p>
    </form>
  )
}

function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [selectedCat, setSelectedCat] = useState('visiteur')
  const [submitted, setSubmitted] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterData>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (data: RegisterData) => {
    setLoading(true)
    try {
      const { data: existing } = await supabase.from('profiles').select('id').eq('email', data.email).maybeSingle()
      if (existing) { toast.error('Email déjà inscrit. Connectez-vous.'); return }
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email, password: data.password,
        options: { data: { full_name: data.fullName, organization: data.organization } }
      })
      if (authError) { toast.error(authError.message); return }
      if (!authData.user) { toast.error('Erreur création compte'); return }
      const badgeNumber = `SAHD-2026-${selectedCat.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`
      await supabase.from('profiles').insert({
        user_id: authData.user.id, full_name: data.fullName, organization: data.organization,
        email: data.email, phone: data.phone, category: selectedCat,
        domain: data.domain, country: data.country, badge_number: badgeNumber, verified: false,
      })
      try {
        await fetch('/api/send-email', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'inscription', to: data.email, name: data.fullName, organization: data.organization, category: selectedCat, badgeNumber }),
        })
      } catch {}
      setUserEmail(data.email)
      setSubmitted(true)
      toast.success('Inscription réussie !')
    } catch (err: any) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  if (submitted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textAlign: 'center', width: '100%' }}>
        <div style={{ fontSize: '3.5rem' }}>✅</div>
        <h2 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#1e3a8a', margin: 0 }}>Inscription confirmée !</h2>
        <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0 }}>Email envoyé à <strong>{userEmail}</strong></p>
        <Link href="/dashboard" style={{ ...s.btn(), display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: 16 }}>Mon espace →</Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
      <h2 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#1e3a8a', textAlign: 'center', margin: 0 }}>Inscription</h2>
      <p style={{ fontSize: '0.85rem', color: '#6b7280', textAlign: 'center', margin: 0 }}>Créez votre compte SAHD 2026</p>

      {/* Catégories */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {categories.map(cat => {
          const Icon = cat.icon
          const sel = selectedCat === cat.id
          return (
            <button key={cat.id} type="button" onClick={() => setSelectedCat(cat.id)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 6px',
              borderRadius: 10, border: `2px solid ${sel ? '#1e3a8a' : '#e5e7eb'}`,
              background: sel ? '#eff6ff' : '#f9fafb', cursor: 'pointer',
              fontSize: '0.78rem', fontWeight: 600, color: sel ? '#1e3a8a' : '#374151',
              gap: 3, fontFamily: 'Outfit, sans-serif',
            }}>
              <Icon size={16} />
              <span>{cat.label}</span>
              <span style={{ fontSize: '0.7rem', color: '#FEA621', fontWeight: 700 }}>{cat.price}</span>
            </button>
          )
        })}
      </div>

      {/* Nom + Organisation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={s.field}>
          <input {...register('fullName')} placeholder="Nom complet *" style={s.input} />
          {errors.fullName && <span style={s.err}>{errors.fullName.message}</span>}
        </div>
        <div style={s.field}>
          <input {...register('organization')} placeholder="Organisation *" style={s.input} />
          {errors.organization && <span style={s.err}>{errors.organization.message}</span>}
        </div>
      </div>

      {/* Email + Téléphone */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={s.field}>
          <input {...register('email')} type="email" placeholder="Email *" style={s.input} />
          {errors.email && <span style={s.err}>{errors.email.message}</span>}
        </div>
        <div style={s.field}>
          <input {...register('phone')} placeholder="Téléphone *" style={s.input} />
          {errors.phone && <span style={s.err}>{errors.phone.message}</span>}
        </div>
      </div>

      {/* Mot de passe */}
      <div style={s.field}>
        <div style={{ position: 'relative' }}>
          <input {...register('password')} type={showPw ? 'text' : 'password'} placeholder="Mot de passe (min. 8 caractères) *" style={s.input} />
          <button type="button" onClick={() => setShowPw(!showPw)} style={s.eye}>
            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <span style={s.err}>{errors.password.message}</span>}
      </div>

      {/* Domaine + Pays */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={s.field}>
          <select {...register('domain')} style={{ ...s.input, cursor: 'pointer' }}>
            <option value="">Domaine *</option>
            <option>Aide humanitaire</option><option>Santé</option><option>Éducation</option>
            <option>Nutrition & Sécurité alimentaire</option><option>Protection de l'enfance</option>
            <option>Genre & Développement</option><option>Eau & Assainissement</option>
            <option>Gouvernance</option><option>Environnement</option><option>Innovation & Tech</option>
            <option>Autre</option>
          </select>
          {errors.domain && <span style={s.err}>{errors.domain.message}</span>}
        </div>
        <div style={s.field}>
          <select {...register('country')} style={{ ...s.input, cursor: 'pointer' }}>
            <option value="">Pays *</option>
            <option>Mali</option><option>Sénégal</option><option>Côte d'Ivoire</option>
            <option>Burkina Faso</option><option>Niger</option><option>Guinée</option>
            <option>Mauritanie</option><option>France</option><option>Autre</option>
          </select>
          {errors.country && <span style={s.err}>{errors.country.message}</span>}
        </div>
      </div>

      {/* RGPD */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.8rem', color: '#6b7280' }}>
        <input type="checkbox" {...register('rgpd')} id="rgpd" style={{ marginTop: 3, flexShrink: 0, width: 16, height: 16 }} />
        <label htmlFor="rgpd">
          J'accepte la <Link href="/privacy" style={{ color: '#1e3a8a', textDecoration: 'underline' }}>politique de confidentialité</Link> *
        </label>
      </div>
      {errors.rgpd && <span style={s.err}>{errors.rgpd.message}</span>}

      <button type="submit" disabled={loading} style={{ ...s.btn('#FEA621'), opacity: loading ? 0.5 : 1 }}>
        {loading ? '⏳ Création en cours...' : '🎉 Créer mon compte'}
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#6b7280', marginTop: 4 }}>
        Déjà inscrit ?{' '}
        <button type="button" onClick={onSwitch} style={{ background: 'none', border: 'none', color: '#1e3a8a', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif' }}>
          Se connecter
        </button>
      </p>
    </form>
  )
}

export default function LoginPage() {
  const [showRegister, setShowRegister] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!mounted) return null

  const toggleBtnStyle: React.CSSProperties = {
    padding: '11px 32px', background: 'transparent', border: '2px solid #fff',
    borderRadius: 50, color: '#fff', fontSize: '0.95rem', fontWeight: 700,
    cursor: 'pointer', fontFamily: 'Outfit, sans-serif', marginTop: 8,
  }

  // ── VERSION MOBILE ──
  if (isMobile) {
    return (
      <div style={{
        minHeight: '100vh', background: 'linear-gradient(135deg, #0b185f 0%, #1e3a8a 50%, #0b185f 100%)',
        padding: '70px 0 0', fontFamily: 'Outfit, sans-serif',
      }}>
        {/* Header mobile bleu */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #0b185f 100%)',
          padding: '24px 20px', textAlign: 'center', color: '#fff',
        }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: '10px 16px', display: 'inline-block', marginBottom: 14 }}>
            <img src="/logo-sahd-web.png" alt="SAHD" style={{ height: 44, width: 'auto', objectFit: 'contain', display: 'block' }} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: '0 0 6px' }}>
            {showRegister ? 'Créez votre compte' : 'Bienvenue au SAHD 2026 !'}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)', margin: 0 }}>
            {showRegister ? 'Déjà inscrit ?' : 'Pas encore de compte ?'}{' '}
            <button onClick={() => setShowRegister(!showRegister)} style={{
              background: 'none', border: 'none', color: '#FEA621', fontWeight: 700,
              cursor: 'pointer', textDecoration: 'underline', fontSize: '0.8rem', fontFamily: 'Outfit, sans-serif',
            }}>
              {showRegister ? 'Se connecter' : "S'inscrire"}
            </button>
          </p>
        </div>

        {/* Formulaire mobile */}
        <div style={{
          background: '#fff', borderRadius: '20px 20px 0 0',
          padding: '28px 20px 40px', minHeight: 'calc(100vh - 200px)',
        }}>
          {showRegister
            ? <RegisterForm onSwitch={() => setShowRegister(false)} />
            : <LoginForm onSwitch={() => setShowRegister(true)} />
          }
        </div>
      </div>
    )
  }

  // ── VERSION DESKTOP ──
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0b185f 0%, #1e3a8a 50%, #0b185f 100%)',
      padding: '80px 1.5rem 2rem', fontFamily: 'Outfit, sans-serif',
    }}>
      <div style={{
        width: '100%', maxWidth: 1100,
        background: '#fff', borderRadius: 28,
        boxShadow: '0 30px 100px rgba(0,0,0,0.45)',
        overflow: 'hidden', display: 'flex', minHeight: 620,
      }}>

        {/* Panneau bleu gauche */}
        <div style={{
          width: showRegister ? '32%' : '42%',
          background: 'linear-gradient(155deg, #1e3a8a 0%, #0b185f 100%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '3rem 2.5rem', textAlign: 'center', color: '#fff',
          transition: 'width 0.7s ease-in-out', flexShrink: 0,
        }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: '12px 20px', marginBottom: 24 }}>
            <img src="/logo-sahd-web.png" alt="SAHD" style={{ height: 52, width: 'auto', objectFit: 'contain', display: 'block' }} />
          </div>

          {showRegister ? (
            <>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '0 0 12px', lineHeight: 1.2 }}>Déjà inscrit ?</h3>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.78)', margin: '0 0 28px', lineHeight: 1.7 }}>
                Connectez-vous pour accéder à votre espace personnel SAHD 2026
              </p>
              <button onClick={() => setShowRegister(false)} style={toggleBtnStyle}>Se connecter</button>
            </>
          ) : (
            <>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '0 0 12px', lineHeight: 1.2 }}>Bienvenue au SAHD 2026 !</h3>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.78)', margin: '0 0 28px', lineHeight: 1.7 }}>
                Pas encore de compte ?<br />Rejoignez la plateforme nationale de l'action humanitaire au Mali.
              </p>
              <button onClick={() => setShowRegister(true)} style={{ ...toggleBtnStyle, background: '#FEA621', border: 'none' }}>S'inscrire</button>
            </>
          )}

          {/* Infos événement */}
          <div style={{ marginTop: 40, padding: '16px', background: 'rgba(255,255,255,0.08)', borderRadius: 14, width: '100%' }}>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 4px' }}>📅 Dates</p>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', margin: 0 }}>14 – 16 Mai 2026</p>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', margin: '8px 0 4px' }}>📍 Lieu</p>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', margin: 0 }}>Palais des Congrès, Bamako</p>
          </div>
        </div>

        {/* Formulaire droit */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '3rem 4rem', overflowY: 'auto',
        }}>
          {showRegister
            ? <RegisterForm onSwitch={() => setShowRegister(false)} />
            : <LoginForm onSwitch={() => setShowRegister(true)} />
          }
        </div>

      </div>
    </div>
  )
}
