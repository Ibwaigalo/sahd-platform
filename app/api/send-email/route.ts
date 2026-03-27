import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { jsPDF } from 'jspdf'
import QRCode from 'qrcode'
import fs from 'fs'
import path from 'path'

const resend = new Resend(process.env.RESEND_API_KEY || 're_gYgM2L89_6zbffACYRxyXqPDzMC8FLkCi')

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    visiteur: 'VISITEUR',
    participant: 'PARTICIPANT',
    exposant: 'EXPOSANT',
    vip_b2b: 'VIP B2B',
    admin: 'ADMINISTRATEUR'
  }
  return labels[category] || category.toUpperCase()
}

async function generateBadgePDF(badgeNumber: string, name: string, organization: string, category: string): Promise<string> {
  const qrUrl = `https://sahd-mali.org/verify/${badgeNumber}`
  const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
    width: 100,
    margin: 1,
    color: { dark: '#0B185F', light: '#ffffff' }
  })

  const logoPath = path.join(process.cwd(), 'public', 'logo-sahd-web.png')
  let logoDataUrl = ''
  if (fs.existsSync(logoPath)) {
    const logoBuffer = fs.readFileSync(logoPath)
    const logoBase64 = logoBuffer.toString('base64')
    logoDataUrl = `data:image/png;base64,${logoBase64}`
  }

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [120, 180]
  })

  doc.setFillColor(11, 24, 95)
  doc.rect(0, 0, 180, 120, 'F')

  doc.setFillColor(254, 166, 33)
  doc.rect(0, 105, 180, 15, 'F')

  if (logoDataUrl) {
    doc.addImage(logoDataUrl, 'PNG', 10, 3, 25, 18)
  }

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('SAHD 2026', 90, 18, { align: 'center' })

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text("Salon de l'Action Humanitaire et du Développement", 90, 25, { align: 'center' })

  doc.setFillColor(255, 255, 255)
  doc.roundedRect(15, 32, 65, 65, 3, 3, 'F')

  doc.setTextColor(11, 24, 95)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('BADGE', 47.5, 42, { align: 'center' })
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(getCategoryLabel(category), 47.5, 48, { align: 'center' })

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Nom', 47.5, 58, { align: 'center' })
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  const nameParts = name.split(' ')
  if (nameParts.length > 1) {
    doc.text(nameParts.slice(0, 2).join(' '), 47.5, 64, { align: 'center' })
    if (nameParts.length > 2) {
      doc.text(nameParts.slice(2).join(' '), 47.5, 69, { align: 'center' })
    }
  } else {
    doc.text(name, 47.5, 64, { align: 'center' })
  }

  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('Organisation', 47.5, 76, { align: 'center' })
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  const orgLines = doc.splitTextToSize(organization, 60)
  doc.text(orgLines.slice(0, 2), 47.5, 81, { align: 'center' })

  doc.addImage(qrCodeDataUrl, 'PNG', 90, 32, 40, 40)

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(6)
  doc.text('Scannez pour vérifier', 110, 75, { align: 'center' })
  doc.setFontSize(5)
  doc.text(qrUrl, 110, 79, { align: 'center' })

  doc.setTextColor(11, 24, 95)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(`N° ${badgeNumber}`, 110, 88, { align: 'center' })

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(getCategoryLabel(category), 110, 93, { align: 'center' })

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('14 - 16 Mai 2026', 90, 110, { align: 'center' })
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.text('Palais des Congrès, Bamako, Mali', 90, 115, { align: 'center' })

  return doc.output('datauristring')
}

export async function POST(request: NextRequest) {
  try {
    const { type, to, name, organization, category, badgeNumber } = await request.json()

    const badgePdfDataUri = await generateBadgePDF(badgeNumber, name, organization, category)
    const attachmentBase64 = badgePdfDataUri.split(',')[1]

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

              <p style="color: #374151;">Votre inscription est en cours de validation par notre équipe. Vous recevrez un email de confirmation définitif avec votre badge officiel dès qu'elle sera approuvée.</p>
              
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

      await resend.emails.send({
        from: 'SAHD 2026 <admin@sahd-mali.org>',
        to: ['admin@sahd-mali.org'],
        subject: `🔔 Nouvelle inscription - ${name} (${organization})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px;">
            <div style="background: #0B185F; padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">SAHD 2026 - Admin</h1>
            </div>
            <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px;">
              <h2 style="color: #0B185F;">🔔 Nouvelle inscription</h2>
              
              <div style="background: #f0f4ff; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <p style="margin: 4px 0; color: #374151;"><strong>Nom :</strong> ${name}</p>
                <p style="margin: 4px 0; color: #374151;"><strong>Email :</strong> ${to}</p>
                <p style="margin: 4px 0; color: #374151;"><strong>Organisation :</strong> ${organization}</p>
                <p style="margin: 4px 0; color: #374151;"><strong>Catégorie :</strong> ${category}</p>
                <p style="margin: 4px 0; color: #374151;"><strong>N° Badge :</strong> ${badgeNumber}</p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://sahd-mali.org/admin" style="background: #0B185F; color: white; padding: 14px 30px; border-radius: 10px; text-decoration: none; font-weight: bold;">
                  Voir les inscriptions →
                </a>
              </div>
            </div>
          </div>
        `,
      })
    }

    if (type === 'validation') {
      await resend.emails.send({
        from: 'SAHD 2026 <admin@sahd-mali.org>',
        to: [to],
        subject: `✅ Votre badge SAHD 2026 - ${name}`,
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
                <h3 style="color: #0B185F; margin: 0 0 12px;">Votre badge</h3>
                <p style="margin: 4px 0; color: #374151;"><strong>Nom :</strong> ${name}</p>
                <p style="margin: 4px 0; color: #374151;"><strong>Organisation :</strong> ${organization}</p>
                <p style="margin: 4px 0; color: #374151;"><strong>Catégorie :</strong> ${category}</p>
                <p style="margin: 4px 0; color: #374151;"><strong>N° Badge :</strong> ${badgeNumber}</p>
              </div>

              <div style="background: #FEA621; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
                <p style="color: white; font-weight: bold; margin: 0; font-size: 18px;">📅 14 – 16 Mai 2026</p>
                <p style="color: white; margin: 4px 0;">Palais des Congrès, Bamako, Mali</p>
              </div>

              <p style="color: #374151; font-weight: bold; text-align: center;">🎫 Votre badge officiel est joint à cet email au format PDF !</p>
              <p style="color: #374151;">Présentez-le à l'entrée de l'événement. Vous pouvez également scanner le QR code pour vérifier votre badge en ligne.</p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://sahd-mali.org/verify/${badgeNumber}" style="background: #0B185F; color: white; padding: 14px 30px; border-radius: 10px; text-decoration: none; font-weight: bold;">
                  Vérifier mon badge →
                </a>
              </div>

              <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 30px;">
                © 2026 SAHD – Salon de l'Action Humanitaire et du Développement au Mali<br>
                <a href="https://sahd-mali.org" style="color: #FEA621;">sahd-mali.org</a>
              </p>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: `Badge-SAHD-${badgeNumber}.pdf`,
            content: attachmentBase64,
          },
        ],
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('RESEND ERROR:', error?.message || error)
    return NextResponse.json({ error: error?.message || 'Erreur envoi email' }, { status: 500 })
  }
}
