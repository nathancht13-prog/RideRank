import { useEffect } from 'react';

export default function LegalPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 pt-32 pb-24 text-zinc-400">
      <div className="container max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-display font-bold uppercase text-white mb-12">Mentions<br/><span className="text-primary">Légales</span></h1>
        
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-display font-bold uppercase text-white mb-6 tracking-wide border-b border-white/10 pb-4">1. Éditeur du site</h2>
            <div className="space-y-2 text-lg">
               <p><strong className="text-zinc-300">Nom :</strong> [Nom de l'éditeur]</p>
               <p><strong className="text-zinc-300">Adresse :</strong> [Adresse complète]</p>
               <p><strong className="text-zinc-300">Email :</strong> [Adresse email de contact]</p>
               <p><strong className="text-zinc-300">SIRET :</strong> [Numéro de SIRET]</p>
               <p><strong className="text-zinc-300">Directeur de la publication :</strong> [Nom du directeur]</p>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-display font-bold uppercase text-white mb-6 tracking-wide border-b border-white/10 pb-4">2. Hébergement</h2>
            <div className="space-y-2 text-lg">
               <p>Ce site est hébergé par :</p>
               <p><strong className="text-zinc-300">Nom de l'hébergeur :</strong> Vercel / Replit / Supabase</p>
               <p><strong className="text-zinc-300">Adresse :</strong> [Adresse de l'hébergeur]</p>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-display font-bold uppercase text-white mb-6 tracking-wide border-b border-white/10 pb-4">3. Propriété intellectuelle</h2>
            <div className="space-y-4 text-lg leading-relaxed">
               <p>Le contenu de ce site (textes, images, graphismes, logo, icônes, sons, logiciels) est la propriété exclusive de l'éditeur, à l'exception des marques, logos ou contenus appartenant à d'autres sociétés partenaires ou auteurs.</p>
               <p>Toute reproduction, distribution, modification, adaptation, retransmission ou publication, même partielle, de ces différents éléments est strictement interdite sans l'accord exprès par écrit de l'éditeur.</p>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-display font-bold uppercase text-white mb-6 tracking-wide border-b border-white/10 pb-4">4. Données personnelles</h2>
            <div className="space-y-4 text-lg leading-relaxed">
               <p>Sentiz s'engage à ce que la collecte et le traitement de vos données soient conformes au règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés.</p>
               <p>Les données collectées (pseudo, email, statistiques de ride) sont utilisées uniquement dans le cadre du fonctionnement de l'application (classement local, profil public). Vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles en nous contactant.</p>
            </div>
          </section>

          <section id="contact">
            <h2 className="text-2xl font-display font-bold uppercase text-white mb-6 tracking-wide border-b border-white/10 pb-4">5. Contact</h2>
            <div className="space-y-4 text-lg leading-relaxed">
               <p>Pour toute question relative au site, à son contenu ou à vos données personnelles, vous pouvez contacter l'éditeur à l'adresse suivante :</p>
               <p><strong className="text-zinc-300">Email :</strong> [Adresse email de contact]</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
