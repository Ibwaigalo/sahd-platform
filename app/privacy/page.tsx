// app/privacy/page.tsx
export default function PrivacyPage() {
  return (
    <div className="pt-20">
      <div className="bg-primary-950 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-black text-white">Politique de Confidentialité</h1>
          <p className="text-white/60 mt-2">Dernière mise à jour : Mars 2026</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-16 prose prose-lg">
        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-black text-primary-900">1. Collecte des données</h2>
            <p>Dans le cadre de l'organisation du Salon de l'Action Humanitaire et du Développement (SAHD) 2026, nous collectons les données personnelles suivantes : nom et prénom, adresse email, numéro de téléphone, organisation, domaine d'intervention.</p>
          </section>
          <section>
            <h2 className="text-2xl font-black text-primary-900">2. Utilisation des données</h2>
            <p>Vos données sont utilisées exclusivement pour : la gestion de votre inscription au SAHD, l'envoi de communications relatives à l'événement, la génération de votre badge d'accès, et la facilitation du networking B2B si applicable.</p>
          </section>
          <section>
            <h2 className="text-2xl font-black text-primary-900">3. Base légale (RGPD)</h2>
            <p>Le traitement de vos données repose sur votre consentement explicite donné lors de l'inscription. Vous pouvez retirer ce consentement à tout moment.</p>
          </section>
          <section>
            <h2 className="text-2xl font-black text-primary-900">4. Conservation</h2>
            <p>Vos données sont conservées pendant 24 mois après l'événement, puis supprimées automatiquement.</p>
          </section>
          <section>
            <h2 className="text-2xl font-black text-primary-900">5. Vos droits</h2>
            <p>Conformément au RGPD, vous disposez des droits d'accès, rectification, effacement, portabilité et opposition. Pour exercer ces droits, contactez : <a href="mailto:privacy@sahd-mali.org" className="text-primary-700">privacy@sahd-mali.org</a></p>
          </section>
          <section>
            <h2 className="text-2xl font-black text-primary-900">6. Cookies</h2>
            <p>Nous utilisons des cookies techniques (nécessaires au fonctionnement) et des cookies analytiques (avec votre consentement). Vous pouvez gérer vos préférences via la bannière de consentement.</p>
          </section>
          <section>
            <h2 className="text-2xl font-black text-primary-900">7. Contact DPO</h2>
            <p>Pour toute question relative à vos données : <a href="mailto:privacy@sahd-mali.org" className="text-primary-700">privacy@sahd-mali.org</a></p>
          </section>
        </div>
      </div>
    </div>
  )
}
