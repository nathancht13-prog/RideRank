import React, { useState } from 'react';
import { ArrowRight, ArrowUp, ChevronDown, MapPin, Mountain, Star, Trophy } from 'lucide-react';
import { useBikeRank } from '../BikeRankContext';
import type { Spot } from '../types';
import { BikeMap } from './BikeMap';

export function Hero() {
  const { requireAuth } = useBikeRank();
  
  return (
    <section className="relative flex items-center pt-32 md:pt-40 pb-24 md:pb-32 overflow-hidden bg-zinc-950" id="accueil">
      <div className="absolute inset-0 z-0">
        <img src="/images/tim-foster-qrIy8dBzCVU-unsplash_1789402010865.jpg" alt="VTT Background" className="w-full h-full object-cover opacity-30" />
         <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/90 via-zinc-950/75 to-zinc-950/95"></div>
      </div>
      
      <div className="container relative z-10 flex flex-col items-center">
         <div className="w-full flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
           <div className="flex items-center justify-center gap-3 text-primary font-bold tracking-widest uppercase mb-6">
              <span className="w-8 h-0.5 bg-primary"></span>
              La meute t'attend
              <span className="w-8 h-0.5 bg-primary"></span>
           </div>
           <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold uppercase leading-[0.88] tracking-tight mb-8">
              Ride.<br/>
              <span className="text-primary drop-shadow-[0_0_15px_rgba(255,91,26,0.3)]">Progresse.</span><br/>
              <span className="whitespace-nowrap">Monte en places.</span>
           </h1>
           <p className="text-lg md:text-2xl text-zinc-400 max-w-2xl mb-10 leading-relaxed font-medium">
              Bike Rank, c'est le classement local des riders qui ne restent pas en bas. Tes kilomètres forgent ton rang.
           </p>
           <button onClick={() => requireAuth('signup')} className="button-primary w-full max-w-xl text-base sm:text-xl px-5 sm:px-10 py-5 flex items-center gap-3 group" data-testid="cta-hero">
              Entrer dans le classement <ArrowRight className="group-hover:translate-x-1 transition-transform w-6 h-6" />
           </button>
           <p className="w-full text-center text-sm sm:text-lg text-zinc-500 mt-4 font-medium uppercase tracking-wider">Connexion ou création de compte rapide</p>
        </div>
        
          <div className="relative animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 flex justify-center perspective-1000 z-10 mt-20 md:mt-28 py-8">
            <div className="relative w-[250px] h-[500px] lg:w-[320px] lg:h-[640px] glass-glow-strong rounded-[42px] lg:rounded-[48px] p-2 flex flex-col items-center justify-center lg:transform lg:rotate-y-[-15deg] lg:rotate-x-[5deg] hover:rotate-0 transition-transform duration-700">
              <div className="w-full h-full rounded-[40px] overflow-hidden relative bg-black">
                 <img src="/images/tim-foster-qrIy8dBzCVU-unsplash_1789402010865.jpg" className="absolute inset-0 w-full h-full object-cover opacity-50" alt="" />
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black"></div>
                 <div className="absolute top-0 w-32 h-6 bg-black rounded-b-3xl left-1/2 -translate-x-1/2 z-10"></div>
              </div>
              
              {/* Floating Glass Card 1 */}
               <div className="absolute top-16 lg:top-20 left-[-28px] lg:left-[-40px] w-48 lg:w-64 p-4 lg:p-6 glass-glow">
                <div className="flex items-center gap-3 text-primary text-sm font-bold uppercase tracking-widest mb-2"><Trophy size={18} /> Vitesse Max</div>
                 <div className="text-5xl lg:text-7xl font-bold text-white drop-shadow-lg leading-none">42 <span className="text-2xl lg:text-3xl text-zinc-400">km/h</span></div>
              </div>

              {/* Floating Glass Card 2 */}
               <div className="absolute bottom-24 lg:bottom-32 right-[-24px] lg:right-[-30px] w-44 lg:w-56 p-4 lg:p-6 glass-glow">
                <div className="flex items-center gap-3 text-accent text-sm font-bold uppercase tracking-widest mb-2"><Star size={18} /> Rang Local</div>
                 <div className="text-6xl lg:text-8xl font-bold text-white drop-shadow-lg leading-none">#4</div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}

export function SpotFinder() {
  const { spots } = useBikeRank();
  const [level, setLevel] = useState('Intermédiaire');
  const [duration, setDuration] = useState('2 h');
  const [region, setRegion] = useState('');
  const [result, setResult] = useState<Spot | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (spots.length === 0) return;
     const regionMatches = spots.filter((spot) =>
       !region || spot.region.toLowerCase().includes(region.toLowerCase()),
     );
     const levelMatches = regionMatches.filter((spot) => {
       if (level === 'Débutant') return spot.practice_type === 'Bike park' || Number(spot.elevation_m || 0) <= 700;
       if (level === 'Expert') return spot.practice_type === 'DH' || spot.practice_type === 'Enduro';
       return spot.practice_type !== 'DH' || Number(spot.elevation_m || 0) <= 1400;
     });
     const maxElevation = duration === '1 h' ? 600 : duration === '2 h' ? 1200 : Infinity;
     const durationMatches = levelMatches.filter((spot) => Number(spot.elevation_m || 0) <= maxElevation);
     setResult(durationMatches[0] || levelMatches[0] || regionMatches[0] || null);
  };

  return (
     <section className="py-24 bg-zinc-950 relative border-t border-white/5" id="trouver">
        <div className="container">
           <div className="max-w-2xl mb-12">
              <div className="eyebrow mb-4">Pas d'idée ?</div>
              <h2 className="text-6xl md:text-8xl font-bold uppercase leading-none mb-6">Bike Rank te<br/><span className="text-accent drop-shadow-[0_0_15px_rgba(255,204,0,0.3)]">trouve ton spot.</span></h2>
               <p className="text-zinc-400 text-xl font-medium">Indique ton niveau, le temps dont tu disposes et ta zone de ride. Bike Rank sélectionne une trace adaptée parmi les spots de la communauté.</p>
           </div>
           
           <div className="grid lg:grid-cols-2 gap-12 items-start">
              <form onSubmit={handleSearch} className="glass-glow p-6 md:p-8 flex flex-col gap-6 relative z-10">
                  <div className="grid sm:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-2">
                       <label className="text-sm font-bold uppercase tracking-widest text-zinc-400">Ton niveau</label>
                       <select value={level} onChange={e => setLevel(e.target.value)} className="bg-black/40 border border-white/10 text-white p-4 rounded-xl focus:border-primary focus:shadow-[0_0_15px_rgba(255,91,26,0.3)] outline-none transition-all font-bold text-lg backdrop-blur-sm appearance-none">
                          <option className="bg-zinc-900">Débutant</option>
                          <option className="bg-zinc-900">Intermédiaire</option>
                          <option className="bg-zinc-900">Expert</option>
                       </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold uppercase tracking-widest text-zinc-400">Temps disponible</label>
                        <select value={duration} onChange={e => setDuration(e.target.value)} className="bg-black/40 border border-white/10 text-white p-4 rounded-xl focus:border-primary focus:shadow-[0_0_15px_rgba(255,91,26,0.3)] outline-none transition-all font-bold text-lg backdrop-blur-sm appearance-none">
                           <option className="bg-zinc-900">1 h</option>
                           <option className="bg-zinc-900">2 h</option>
                           <option className="bg-zinc-900">Une demi-journée</option>
                        </select>
                     </div>
                     <div className="flex flex-col gap-2">
                       <label className="text-sm font-bold uppercase tracking-widest text-zinc-400">Région (Optionnel)</label>
                       <input type="text" value={region} onChange={e => setRegion(e.target.value)} placeholder="Ex: Alpes" className="bg-black/40 border border-white/10 text-white p-4 rounded-xl focus:border-primary focus:shadow-[0_0_15px_rgba(255,91,26,0.3)] outline-none transition-all font-bold text-lg backdrop-blur-sm placeholder:text-zinc-600" />
                    </div>
                 </div>
                 <button className="button-primary mt-2 flex items-center justify-center gap-2 py-5 text-xl" data-testid="button-find-spot">
                    Trouver mon spot <ArrowRight size={24} />
                 </button>
              </form>
              
              {result && (
                 <div className="animate-in fade-in slide-in-from-bottom-8">
                    <div className="glass-glow overflow-hidden group">
                       <div className="h-64 relative bg-black overflow-hidden">
                          {result.photo_url && <img src={result.photo_url} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700" alt=""/>}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                          <div className="absolute top-4 right-4 glass-glow-strong text-white font-bold px-4 py-2 text-2xl flex items-center gap-2">
                             <Star size={20} className="text-accent fill-accent" /> {Number(result.average_rating).toFixed(1)}
                          </div>
                       </div>
                       <div className="p-8 relative">
                          <div className="text-primary text-sm font-bold uppercase tracking-widest mb-3 flex gap-3">
                             <span>{result.practice_type}</span>
                             <span className="text-zinc-500">·</span>
                             <span className="text-zinc-400 flex items-center gap-1"><MapPin size={16}/> {result.region}</span>
                          </div>
                          <h3 className="text-5xl font-bold uppercase mb-4 text-white leading-none">{result.name}</h3>
                          <p className="text-zinc-400 text-lg mb-0 line-clamp-3 font-medium">{result.description || 'Une excellente option pour rouler aujourd\'hui.'}</p>
                       </div>
                    </div>
                 </div>
              )}
           </div>
        </div>
     </section>
  );
}

export function MapSection() {
  const { spots } = useBikeRank();
  return (
     <section className="py-24 bg-zinc-950 border-t border-white/5 relative overflow-hidden" id="carte">
        <div className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="container relative z-10">
            <div className="mb-12">
               <div className="eyebrow mb-3">La carte</div>
               <h2 className="text-6xl md:text-8xl font-bold uppercase leading-none">Repère ta<br/><span className="text-primary drop-shadow-[0_0_15px_rgba(255,91,26,0.3)]">prochaine trace.</span></h2>
            </div>
            
             <BikeMap spots={spots} />
        </div>
     </section>
  )
}

export function Progression() {
   const { setActivityOpen, requireAuth } = useBikeRank();
   return (
       <section className="py-32 bg-zinc-950 text-white relative border-t border-white/5 overflow-hidden" id="classement">
         <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none"></div>
         <div className="container grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
               <div className="eyebrow mb-6 tracking-widest text-primary">Le Momentum</div>
               <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold uppercase leading-[0.85] tracking-tight mb-8">Une sortie<br/>Peut tout<br/><span className="text-zinc-600">Changer.</span></h2>
               <p className="text-zinc-400 text-xl font-medium mb-12 max-w-md leading-relaxed">Quelques kilomètres arrachés en fin de journée suffisent souvent à gagner des places précieuses en fin de mois. Ne lâche rien.</p>
               <button onClick={() => { if(requireAuth()) setActivityOpen(true); }} className="button-primary text-xl px-10 py-5">
                  En selle <ArrowRight className="inline ml-3 w-6 h-6"/>
               </button>
            </div>
            <div className="relative z-10 perspective-1000">
               <div className="glass-glow p-12 flex flex-col items-center justify-center text-center transform md:rotate-y-[-10deg] md:rotate-x-[5deg] hover:rotate-0 transition-transform duration-500 relative overflow-hidden">
                  <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-primary/20 blur-[50px] rounded-full"></div>
                  <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-accent/20 blur-[50px] rounded-full"></div>

                  <div className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-10 border-b border-white/10 pb-4 w-full relative z-10">Exemple de progression</div>
                  <div className="flex items-center justify-center gap-8 md:gap-12 mb-10 relative z-10">
                     <div className="flex flex-col items-center">
                        <span className="text-sm text-zinc-500 uppercase tracking-widest font-bold mb-3">Hier</span>
                        <div className="text-6xl md:text-7xl font-bold text-zinc-600 line-through decoration-primary/40 decoration-4">#12</div>
                     </div>
                     <ArrowRight className="text-primary w-10 h-10 mt-8 drop-shadow-[0_0_10px_rgba(255,91,26,0.5)]" />
                     <div className="flex flex-col items-center">
                        <span className="text-sm text-primary uppercase tracking-widest font-bold mb-3">Aujourd'hui</span>
                        <div className="text-8xl md:text-9xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">#8</div>
                     </div>
                  </div>
                  <div className="inline-flex items-center gap-3 glass-glow-strong text-primary px-6 py-3 font-bold uppercase tracking-widest text-lg mb-8 animate-pulse relative z-10">
                     <ArrowUp size={24} strokeWidth={3} /> +4 places
                  </div>
                  <p className="text-zinc-400 font-bold text-xl relative z-10">Sortie de 24 km enregistrée ce matin.</p>
               </div>
            </div>
         </div>
      </section>
   )
}

export function FAQSection() {
   const faqs = [
      { q: "Bike Rank est-il gratuit ?", a: "Oui, la création de compte, l'accès au classement et aux spots sont totalement gratuits. Le VTT appartient à tout le monde." },
      { q: "Comment fonctionne la suggestion de spots ?", a: "Notre outil croise ton niveau et ta région pour te sortir la meilleure option du jour, en se basant sur les avis de la meute." },
       { q: "Mes statistiques sont-elles publiques ?", a: "Ton pseudo, ton rang et ton kilométrage mensuel apparaissent dans le classement. Les données de sortie utilisées pour ces totaux restent limitées à la distance, au dénivelé et à la date." },
      { q: "Comment sont validés les kilomètres ?", a: "Pour l'instant, c'est basé sur la confiance. Ajoute tes sorties manuellement après ton run. Les tricheurs se mentent à eux-mêmes." },
      { q: "Bike Rank fonctionne-t-il avec tout type de VTT ?", a: "Enduro, DH, XC, e-VTT... Toutes les montures sont acceptées tant que l'esprit freeride est là." },
       { q: "Dois-je garder l'application ouverte en roulant ?", a: "Non. Enregistre simplement ta sortie une fois rentré : Bike Rank n'a pas besoin de rester ouvert sur le sentier." }
   ];

   return (
      <section className="py-32 bg-zinc-950 border-t border-white/5 relative" id="faq">
         <div className="container max-w-4xl relative z-10">
            <div className="text-center mb-16">
               <div className="eyebrow mb-4">Questions fréquentes</div>
               <h2 className="text-6xl md:text-8xl font-bold uppercase">Le coin <span className="text-primary drop-shadow-[0_0_15px_rgba(255,91,26,0.3)]">Matos.</span></h2>
            </div>
            
            <div className="grid gap-4">
               {faqs.map((faq, i) => (
                  <details key={i} className="group glass-glow">
                     <summary className="flex justify-between items-center font-bold cursor-pointer p-8 list-none transition-colors">
                        <span className="text-2xl text-white">{faq.q}</span>
                        <ChevronDown className="group-open:rotate-180 transition-transform text-primary w-8 h-8 shrink-0 ml-4 drop-shadow-[0_0_10px_rgba(255,91,26,0.3)]" />
                     </summary>
                     <div className="p-8 pt-0 text-zinc-400 font-medium text-xl leading-relaxed">
                        {faq.a}
                     </div>
                  </details>
               ))}
            </div>
            
            <div className="mt-20 text-center text-zinc-500 font-medium text-lg flex items-center justify-center gap-3">
               <Mountain size={20} className="text-primary" /> 
               Bike Rank encourage une pratique du VTT respectueuse des sentiers et des autres usagers.
            </div>
         </div>
      </section>
   )
}