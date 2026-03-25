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
import { useLang } from '@/lib/lang-context'
import fr from '@/messages/fr.json'
import en from '@/messages/en.json'

function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj) || path
}

const errorMessagesFR: Record<string, string> = {
  'errors.name_required': 'Nom requis (min 2 caractères)',
  'errors.org_required': 'Organisation requise',
  'errors.email_invalid': 'Email invalide',
  'errors.password_required': 'Mot de passe requis',
  'errors.phone_required': 'Téléphone requis',
  'errors.domain_required': 'Domaine requis',
  'errors.country_required': 'Pays requis',
  'errors.rgpd_required': 'Vous devez accepter la politique de confidentialité',
}

const errorMessagesEN: Record<string, string> = {
  'errors.name_required': 'Name required (min 2 characters)',
  'errors.org_required': 'Organization required',
  'errors.email_invalid': 'Invalid email',
  'errors.password_required': 'Password required',
  'errors.phone_required': 'Phone required',
  'errors.domain_required': 'Field required',
  'errors.country_required': 'Country required',
  'errors.rgpd_required': 'You must accept the privacy policy',
}

const getErrorMsg = (key: string, lang: string) => {
  const msgs = lang === 'fr' ? errorMessagesFR : errorMessagesEN
  return msgs[key] || key
}

const loginSchema = z.object({
  email: z.string().email('errors.email_invalid'),
  password: z.string().min(1, 'errors.password_required'),
})

const registerSchema = z.object({
  fullName: z.string().min(2, 'errors.name_required'),
  organization: z.string().min(2, 'errors.org_required'),
  email: z.string().email('errors.email_invalid'),
  password: z.string().min(8, 'errors.password_required'),
  phone: z.string().min(8, 'errors.phone_required'),
  domain: z.string().min(1, 'errors.domain_required'),
  country: z.string().min(1, 'errors.country_required'),
  rgpd: z.literal(true, { errorMap: () => ({ message: 'errors.rgpd_required' }) }),
})

type LoginData = z.infer<typeof loginSchema>
type RegisterData = z.infer<typeof registerSchema>

const categories = [
  { id: 'visiteur', labelKey: 'categories.visiteur', priceKey: 'categories.visiteur_price', icon: User },
  { id: 'participant', labelKey: 'categories.participant', priceKey: 'categories.participant_price', icon: Building2 },
  { id: 'exposant', labelKey: 'categories.exposant', priceKey: 'categories.exposant_price', icon: Star },
  { id: 'vip_b2b', labelKey: 'categories.vip', priceKey: 'categories.vip_price', icon: Crown },
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

function LoginForm({ onSwitch, t, getLabel, lang }: { onSwitch: () => void, t: any, getLabel: (k: string) => string, lang: string }) {
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginData) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password })
      if (error) { toast.error(getLabel('error_invalid')); return }
      toast.success(getLabel('submit_loading').replace('...', ''))
      router.push('/dashboard')
    } catch { toast.error(getLabel('error_generic')) }
    finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: 4, display: 'flex', justifyContent: 'center' }}>
        <img src="/logo-sahd-web.png" alt="SAHD" style={{ height: 60, width: 'auto', objectFit: 'contain', display: 'block' }} />
      </div>
      <h2 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#1e3a8a', textAlign: 'center', margin: 0 }}>{getLabel('title')}</h2>
      <p style={{ fontSize: '0.85rem', color: '#6b7280', textAlign: 'center', margin: 0 }}>{getLabel('subtitle')}</p>

      <div style={s.field}>
        <input {...register('email')} type="email" placeholder={getLabel('email_placeholder')} style={s.input} />
        {errors.email && <span style={s.err}>{getErrorMsg(errors.email.message, lang)}</span>}
      </div>

      <div style={s.field}>
        <div style={{ position: 'relative' }}>
          <input {...register('password')} type={showPw ? 'text' : 'password'} placeholder={getLabel('password_label')} style={s.input} />
          <button type="button" onClick={() => setShowPw(!showPw)} style={s.eye}>
            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <span style={s.err}>{getErrorMsg(errors.password.message, lang)}</span>}
      </div>

      <Link href="/forgot-password" style={{ fontSize: '0.82rem', color: '#1e3a8a', textAlign: 'right', textDecoration: 'underline' }}>
        {getLabel('forgot_password')}
      </Link>

      <button type="submit" disabled={loading} style={{ ...s.btn(), opacity: loading ? 0.5 : 1 }}>
        {loading ? getLabel('submit_loading') : getLabel('submit')}
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#6b7280', marginTop: 4 }}>
        {getLabel('no_account')}{' '}
        <button type="button" onClick={onSwitch} style={{ background: 'none', border: 'none', color: '#1e3a8a', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif' }}>
          {getLabel('register_link')}
        </button>
      </p>
    </form>
  )
}

function RegisterForm({ onSwitch, t, getLabel, lang }: { onSwitch: () => void, t: any, getLabel: (k: string) => string, lang: string }) {
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
      if (existing) { toast.error(getLabel('error_email_exists')); return }
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email, password: data.password,
        options: { data: { full_name: data.fullName, organization: data.organization } }
      })
      if (authError) { toast.error(authError.message); return }
      if (!authData.user) { toast.error(getLabel('error_generic')); return }
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
      toast.success(getLabel('success_title'))
    } catch (err: any) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  if (submitted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textAlign: 'center', width: '100%' }}>
        <div style={{ fontSize: '3.5rem' }}>✅</div>
        <h2 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#1e3a8a', margin: 0 }}>{getLabel('success_title')}</h2>
        <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0 }}>{getLabel('success_message')} <strong>{userEmail}</strong></p>
        <Link href="/dashboard" style={{ ...s.btn(), display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: 16 }}>{getLabel('access_space')}</Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
      <h2 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#1e3a8a', textAlign: 'center', margin: 0 }}>{getLabel('register_title')}</h2>
      <p style={{ fontSize: '0.85rem', color: '#6b7280', textAlign: 'center', margin: 0 }}>{getLabel('register_subtitle')}</p>

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
              <span>{getLabel(cat.labelKey)}</span>
              <span style={{ fontSize: '0.7rem', color: '#FEA621', fontWeight: 700 }}>{getLabel(cat.priceKey)}</span>
            </button>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={s.field}>
          <input {...register('fullName')} placeholder={getLabel('full_name_placeholder')} style={s.input} />
          {errors.fullName && <span style={s.err}>{getErrorMsg(errors.fullName.message, lang)}</span>}
        </div>
        <div style={s.field}>
          <input {...register('organization')} placeholder={getLabel('org_placeholder')} style={s.input} />
          {errors.organization && <span style={s.err}>{getErrorMsg(errors.organization.message, lang)}</span>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={s.field}>
          <input {...register('email')} type="email" placeholder={getLabel('email_placeholder')} style={s.input} />
          {errors.email && <span style={s.err}>{getErrorMsg(errors.email.message, lang)}</span>}
        </div>
        <div style={s.field}>
          <input {...register('phone')} placeholder={getLabel('phone_placeholder')} style={s.input} />
          {errors.phone && <span style={s.err}>{getErrorMsg(errors.phone.message, lang)}</span>}
        </div>
      </div>

      <div style={s.field}>
        <div style={{ position: 'relative' }}>
          <input {...register('password')} type={showPw ? 'text' : 'password'} placeholder={getLabel('password_register_placeholder')} style={s.input} />
          <button type="button" onClick={() => setShowPw(!showPw)} style={s.eye}>
            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <span style={s.err}>{getErrorMsg(errors.password.message, lang)}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={s.field}>
          <select {...register('domain')} style={{ ...s.input, cursor: 'pointer' }}>
            <option value="">{getLabel('domain_select')}</option>
            <option>Aide humanitaire</option><option>Santé</option><option>Éducation</option>
            <option>Nutrition & Sécurité alimentaire</option><option>Protection de l'enfance</option>
            <option>Genre & Développement</option><option>Eau & Assainissement</option>
            <option>Gouvernance</option><option>Environnement</option><option>Innovation & Tech</option>
            <option>Autre</option>
          </select>
          {errors.domain && <span style={s.err}>{getErrorMsg(errors.domain.message, lang)}</span>}
        </div>
        <div style={s.field}>
          <select {...register('country')} style={{ ...s.input, cursor: 'pointer' }}>
            <option value="">{getLabel('country_select')}</option>
            <option>Mali</option><option>Sénégal</option><option>Côte d'Ivoire</option>
            <option>Burkina Faso</option><option>Niger</option><option>Guinée</option>
            <option>Mauritanie</option><option>France</option><option>Autre</option>
          </select>
          {errors.country && <span style={s.err}>{getErrorMsg(errors.country.message, lang)}</span>}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.8rem', color: '#6b7280' }}>
        <input type="checkbox" {...register('rgpd')} id="rgpd" style={{ marginTop: 3, flexShrink: 0, width: 16, height: 16 }} />
        <label htmlFor="rgpd">
          {getLabel('rgpd_label')} <Link href="/privacy" style={{ color: '#1e3a8a', textDecoration: 'underline' }}>{getLabel('rgpd_link')}</Link> *
        </label>
      </div>
      {errors.rgpd && <span style={s.err}>{getErrorMsg(errors.rgpd.message, lang)}</span>}

      <button type="submit" disabled={loading} style={{ ...s.btn('#FEA621'), opacity: loading ? 0.5 : 1 }}>
        {loading ? getLabel('register_loading') : getLabel('register_button')}
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#6b7280', marginTop: 4 }}>
        {getLabel('already_registered_title')}{' '}
        <button type="button" onClick={onSwitch} style={{ background: 'none', border: 'none', color: '#1e3a8a', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif' }}>
          {getLabel('login_action')}
        </button>
      </p>
    </form>
  )
}

export default function LoginPage() {
  const { lang } = useLang()
  const t = lang === 'fr' ? fr : en
  const getLabel = (key: string) => getNestedValue(t.login, key) || getNestedValue(t.inscription, key) || key
  
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

  const props = { t, getLabel, lang }

  if (isMobile) {
    return (
      <div style={{
        minHeight: '100vh', background: 'linear-gradient(135deg, #0b185f 0%, #1e3a8a 50%, #0b185f 100%)',
        padding: '70px 0 0', fontFamily: 'Outfit, sans-serif',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #0b185f 100%)',
          padding: '24px 20px', textAlign: 'center', color: '#fff',
        }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: '10px 16px', display: 'inline-block', marginBottom: 14 }}>
            <img src="/logo-sahd-web.png" alt="SAHD" style={{ height: 44, width: 'auto', objectFit: 'contain', display: 'block' }} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: '0 0 6px' }}>
            {showRegister ? getLabel('register_title') : getLabel('welcome_title')}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)', margin: 0 }}>
            {showRegister ? getLabel('already_registered_title') : getLabel('welcome_desc')}{' '}
            <button onClick={() => setShowRegister(!showRegister)} style={{
              background: 'none', border: 'none', color: '#FEA621', fontWeight: 700,
              cursor: 'pointer', textDecoration: 'underline', fontSize: '0.8rem', fontFamily: 'Outfit, sans-serif',
            }}>
              {showRegister ? getLabel('login_action') : getLabel('register_action')}
            </button>
          </p>
        </div>

        <div style={{
          background: '#fff', borderRadius: '20px 20px 0 0',
          padding: '28px 20px 40px', minHeight: 'calc(100vh - 200px)',
        }}>
          {showRegister
            ? <RegisterForm {...props} onSwitch={() => setShowRegister(false)} />
            : <LoginForm {...props} onSwitch={() => setShowRegister(true)} />
          }
        </div>
      </div>
    )
  }

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
              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '0 0 12px', lineHeight: 1.2 }}>{getLabel('already_registered_title')}</h3>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.78)', margin: '0 0 28px', lineHeight: 1.7 }}>
                {getLabel('already_registered_desc')}
              </p>
              <button onClick={() => setShowRegister(false)} style={toggleBtnStyle}>{getLabel('login_action')}</button>
            </>
          ) : (
            <>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '0 0 12px', lineHeight: 1.2 }}>{getLabel('welcome_title')}</h3>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.78)', margin: '0 0 28px', lineHeight: 1.7 }}>
                {getLabel('welcome_action')}
              </p>
              <button onClick={() => setShowRegister(true)} style={{ ...toggleBtnStyle, background: '#FEA621', border: 'none' }}>{getLabel('register_action')}</button>
            </>
          )}

          <div style={{ marginTop: 40, padding: '16px', background: 'rgba(255,255,255,0.08)', borderRadius: 14, width: '100%' }}>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 4px' }}>{getLabel('dates_label')}</p>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', margin: 0 }}>{getLabel('dates_value')}</p>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', margin: '8px 0 4px' }}>{getLabel('location_label')}</p>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', margin: 0 }}>{getLabel('location_value')}</p>
          </div>
        </div>

        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '3rem 4rem', overflowY: 'auto',
        }}>
          {showRegister
            ? <RegisterForm {...props} onSwitch={() => setShowRegister(false)} />
            : <LoginForm {...props} onSwitch={() => setShowRegister(true)} />
          }
        </div>

      </div>
    </div>
  )
}
