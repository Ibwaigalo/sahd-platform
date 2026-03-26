// supabase/functions/send-badge-email/index.ts
// Deno Edge Function to send badge PDF email
// Deploy with: supabase functions deploy send-badge-email

import { Resend } from 'https://esm.sh/resend@3.5.0'
import { jsPDF } from 'https://esm.sh/jspdf@2.5.2'
import QRCode from 'https://esm.sh/qrcode@1.5.4'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function generateBadgePDF(badgeNumber: string, name: string, organization: string, category: string): Promise<string> {
  const qrUrl = `https://sahd-mali.org/verify/${badgeNumber}`
  const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
    width: 100,
    margin: 1,
    color: { dark: '#0B185F', light: '#ffffff' }
  })

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [120, 180]
  })

  doc.setFillColor(11, 24, 95)
  doc.rect(0, 0, 180, 120, 'F')

  doc.setFillColor(254, 166, 33)
  doc.rect(0, 105, 180, 15, 'F')

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
  doc.text('Participant', 47.5, 48, { align: 'center' })

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Nom', 47.5, 58, { align: 'center' })
  doc.setFontSize(8)
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
  doc.text(qrUrl, 110, 79, { align: 'center' })

  doc.setTextColor(11, 24, 95)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(`N° ${badgeNumber}`, 110, 88, { align: 'center' })

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(category, 110, 93, { align: 'center' })

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('14 - 16 Mai 2026', 90, 110, { align: 'center' })
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.text('Palais des Congrès, Bamako, Mali', 90, 115, { align: 'center' })

  return doc.output('datauristring')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, to, name, organization, category, badgeNumber } = await req.json()

    if (type !== 'validation' || !to || !badgeNumber) {
      return new Response(
        JSON.stringify({ error: 'Invalid request' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const badgePdfDataUri = await generateBadgePDF(badgeNumber, name, organization, category)
    const attachmentBase64 = badgePdfDataUri.split(',')[1]

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
            <p style="color: #374151;">Présentez-le à l'entrée de l'événement.</p>

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

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error sending badge email:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to send badge email' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
