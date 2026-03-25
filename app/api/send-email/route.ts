// app/api/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_gYgM2L89_6zbffACYRxyXqPDzMC8FLkCi')

export async function POST(request: NextRequest) {
  try {
    const { type, to, name, organization, category, badgeNumber } = await request.json()

    if (type === 'inscription') {
      await resend.emails.send({
        from: 'SAHD 2026 <admin@sahd-mali.org>',
        to: [to],
        subject: '✅ Confirmation d\'inscription – SAHD 2026',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px;">
            <div style="background: #0B185F; padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">SAHD 2026</h1>
              <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0;">Salon de l'Action Humanitaire et du Développement</p>
            </div>
            <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px;">
              <h2 style="color: #0B185F;">Bonjour ${name} 👋</h2>
              <p style="color: #374151;">Votre inscription au <strong>SAHD 2026</strong> a bien été enregistrée !</p>
              
              <div style="background: #f0f4ff; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #0B185F; margin: 0 0 12px;">Récapitulatif de votre inscription</h3>
                <p style="margin: 4px 0; color: #374151;"><strong>Nom :</strong> ${name}</p>
                <p style="margin: 4px 0; color: #374151;"><strong>Organisation :</strong> ${organization}</p>
                <p style="margin: 4px 0; color: #374151;"><strong>Catégorie :</strong> ${category}</p>
                <p style="margin: 4px 0; color: #374151;"><strong>N° Badge :</strong> ${badgeNumber}</p>
              </div>

              <div style="background: #FEA621; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
                <p style="color: white; font-weight: bold; margin: 0; font-size: 18px;">📅 14 – 16 Mai 2026</p>
                <p style="color: white; margin: 4px 0;">Palais des Congrès, Bamako, Mali</p>
              </div>

              <p style="color: #374151;">Votre inscription est en cours de validation par notre équipe. Vous recevrez un email de confirmation dès qu'elle sera approuvée.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://sahd-mali.org/dashboard" style="background: #0B185F; color: white; padding: 14px 30px; border-radius: 10px; text-decoration: none; font-weight: bold;">
                  Accéder à mon espace →
                </a>
              </div>

              <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 30px;">
                © 2026 SAHD – Salon de l'Action Humanitaire et du Développement au Mali<br>
                <a href="https://sahd-mali.org" style="color: #FEA621;">sahd-mali.org</a>
              </p>
            </div>
          </div>
        `,
      })
    }

    if (type === 'validation') {
      await resend.emails.send({
        from: 'SAHD 2026 <admin@sahd-mali.org>',
        to: [to],
        subject: '🎉 Votre inscription est validée – SAHD 2026',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px;">
            <div style="background: #0B185F; padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">SAHD 2026</h1>
              <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0;">Salon de l'Action Humanitaire et du Développement</p>
            </div>
            <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <div style="background: #dcfce7; width: 70px; height: 70px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 32px;">✅</div>
              </div>
              <h2 style="color: #0B185F; text-align: center;">Félicitations ${name} !</h2>
              <p style="color: #374151; text-align: center;">Votre inscription au <strong>SAHD 2026</strong> a été <strong style="color: #16a34a;">officiellement validée</strong> !</p>
              
              <div style="background: #f0f4ff; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <p style="margin: 4px 0; color: #374151;"><strong>Nom :</strong> ${name}</p>
                <p style="margin: 4px 0; color: #374151;"><strong>Organisation :</strong> ${organization}</p>
                <p style="margin: 4px 0; color: #374151;"><strong>Catégorie :</strong> ${category}</p>
                <p style="margin: 4px 0; color: #374151;"><strong>N° Badge :</strong> ${badgeNumber}</p>
              </div>

              <div style="background: #FEA621; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
                <p style="color: white; font-weight: bold; margin: 0; font-size: 18px;">📅 14 – 16 Mai 2026</p>
                <p style="color: white; margin: 4px 0;">Palais des Congrès, Bamako, Mali</p>
              </div>

              <p style="color: #374151;">Votre badge officiel est maintenant disponible dans votre espace personnel. Présentez-le à l'entrée de l'événement.</p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://sahd-mali.org/dashboard" style="background: #0B185F; color: white; padding: 14px 30px; border-radius: 10px; text-decoration: none; font-weight: bold;">
                  Télécharger mon badge →
                </a>
              </div>

              <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 30px;">
                © 2026 SAHD – Salon de l'Action Humanitaire et du Développement au Mali<br>
                <a href="https://sahd-mali.org" style="color: #FEA621;">sahd-mali.org</a>
              </p>
            </div>
          </div>
        `,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
  console.error('RESEND ERROR:', error?.message || error)
  return NextResponse.json({ error: error?.message || 'Erreur envoi email' }, { status: 500 })
}
}