'use client'
interface LogoProps {
  variant?: 'white' | 'blue' | 'auto'
  className?: string
  style?: React.CSSProperties
}

export default function Logo({ variant = 'auto', className = '', style }: LogoProps) {
  const src = variant === 'white' 
    ? '/logo-sahd-white.png' 
    : variant === 'blue' 
    ? '/logo-sahd-blue.png' 
    : '/logo-sahd-web.png'

  return (
    <img 
      src={src} 
      alt="SAHD 2026" 
      className={className}
      style={style}
    />
  )
}
