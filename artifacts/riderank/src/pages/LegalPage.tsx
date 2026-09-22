import { useEffect } from 'react';

export default function LegalPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-white pt-32 pb-24 text-zinc-600">
      <div className="container max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-display font-bold uppercase text-black mb-12">Mentions<br/><span className="text-primary">Légales</span></h1>
        
        <div className="space-y-16">
          <section id="mentions">
            <h2 className="text-3xl font-display font-bold uppercase text-black mb-6 tracking-wide border-b border-zinc-200 pb-4">1. Éditeur du site & Hébergement</h2>
            <div className="space-y-4 text-lg">
               <p><strong className="text-zinc-800">Nom :</strong> [Nom de l'éditeur]</p>
               <p><strong className="text-zinc-800">Adresse :</strong> [Adresse complète]</p>
               <p><strong className="text-zinc-800">Email :</strong> [Adresse email de contact]</p>
               <p><strong className="text-zinc-800">SIRET :</strong> [Numéro de SIRET]</p>
               <p><strong className="text-zinc-800">Directeur de la publication :</strong> [Nom du directeur]</p>
               <p className="pt-4"><strong className="text-zinc-800">Hébergement :</strong> Replit / Supabase</p>
            </div>
          </section>
          
          <section id="cgu">
            <h2 className="text-3xl font-display font-bold uppercase text-black mb-6 tracking-wide border-b border-zinc-200 pb-4">2. Conditions d'utilisation</h2>
            <div className="space-y-4 text-lg leading-relaxed">
               <p>Le contenu de ce site (textes, images, graphismes, logo, icônes, sons, logiciels) est la propriété exclusive de l'éditeur, à l'exception des marques, logos ou contenus appartenant à d'autres sociétés partenaires ou auteurs.</p>
               <p>L'utilisation de l'application Bike Rank requiert la création d'un compte gratuit. Les utilisateurs s'engagent à enregistrer des statistiques de ride (kilomètres, dénivelé) correspondant à des activités réelles. Les classements sont calculés automatiquement à partir des données déclarées par les utilisateurs. L'éditeur se réserve le droit de bannir tout compte présentant des données manifestement fausses.</p>
            </div>
          </section>
          
          <section id="confidentialite">
            <h2 className="text-3xl font-display font-bold uppercase text-black mb-6 tracking-wide border-b border-zinc-200 pb-4">3. Confidentialité et Cookies</h2>
            <div className="space-y-4 text-lg leading-relaxed">
               <p>Bike Rank s'engage à ce que la collecte et le traitement de vos données soient conformes au règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés.</p>
               <p>Les données collectées (pseudo, email, statistiques de ride) sont utilisées uniquement dans le cadre du fonctionnement de l'application (classement local, profil public, partage de statistiques). Vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles en nous contactant.</p>
               <p><strong className="text-zinc-800">Cookies :</strong> Le site utilise un nombre très limité de cookies strictement nécessaires au fonctionnement de l'application (maintien de votre session de connexion sécurisée). Ces cookies ne sont pas utilisés à des fins de pistage publicitaire ou de revente de données.</p>
            </div>
          </section>

          <section id="contact">
            <h2 className="text-3xl font-display font-bold uppercase text-black mb-6 tracking-wide border-b border-zinc-200 pb-4">4. Contact</h2>
            <div className="space-y-4 text-lg leading-relaxed">
               <p>Pour toute question relative au site, à son contenu ou à vos données personnelles, vous pouvez nous contacter :</p>
               <p><strong className="text-zinc-800">Email :</strong> [Adresse email de contact]</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
