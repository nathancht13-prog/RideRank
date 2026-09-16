import React, { useState } from 'react';
import { ArrowRight, ArrowUp, ChevronDown, MapPin, Mountain, Star, Trophy } from 'lucide-react';
import { useBikeRank } from '../BikeRankContext';
import type { Spot } from '../types';
import { BikeMap } from './BikeMap';

export function Hero() {
  const { requireAuth } = useBikeRank();
  
  return (
    <section className="relative min-h-[95vh] flex items-center pt-24 pb-12 overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 z-0">
        <img src="/images/tim-foster-qrIy8dBzCVU-unsplash_1789402010865.jpg" alt="VTT Background" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-transparent"></div>
      </div>
      
      <div className="container relative z-10 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col items-start animate-in fade-in slide-in-from-bottom-8 duration-700">
           <div className="flex items-center gap-3 text-primary font-bold tracking-widest uppercase mb-6">
              <span className="w-8 h-0.5 bg-primary"></span>
              La meute t'attend
           </div>
           <h1 className="text-7xl md:text-9xl lg:text-[10rem] font-bold uppercase leading-[0.85] tracking-tight mb-8">
              Ride.<br/>
              <span className="text-primary">Progresse.</span><br/>
              Monte en places.
           </h1>
           <p className="text-xl md:text-2xl text-zinc-400 max-w-lg mb-10 leading-relaxed font-medium">
              Bike Rank, c'est le classement local des riders qui ne restent pas en bas. Tes kilomètres forgent ton rang.
           </p>
           <button onClick={() => requireAuth('signup')} className="button-primary text-xl px-10 py-5 flex items-center gap-3 group" data-testid="cta-hero">
              Entrer dans le classement <ArrowRight className="group-hover:translate-x-1 transition-transform w-6 h-6" />
           </button>
           <p className="text-lg text-zinc-500 mt-4 font-medium uppercase tracking-wider">Connexion ou création de compte rapide.</p>
        </div>
        
        <div className="lg:col-span-5 relative animate-in fade-in slide-in-from-right-8 duration-700 delay-200 hidden lg:flex justify-center perspective-1000">
           <div className="relative w-[300px] h-[600px] bg-black rounded-[48px] border-[10px] border-zinc-900 shadow-2xl overflow-hidden flex flex-col items-center justify-center transform rotate-y-[-15deg] rotate-x-[5deg] hover:rotate-0 transition-transform duration-700">
              <img src="/images/tim-foster-qrIy8dBzCVU-unsplash_1789402010865.jpg" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50"></div>
              
              <div className="absolute top-0 w-32 h-6 bg-zinc-900 rounded-b-3xl"></div>
              
              {/* Floating Glass Card 1 */}
               <div className="absolute top-24 left-4 w-56 p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-primary/40 shadow-[0_0_30px_rgba(255,91,26,0.3)]">
                <div className="text-sm text-primary font-bold uppercase tracking-widest mb-1 drop-shadow-md">Vitesse Max</div>
                <div className="text-6xl font-bold text-white drop-shadow-lg">42 <span className="text-2xl text-zinc-300">km/h</span></div>
              </div>

              {/* Floating Glass Card 2 */}
               <div className="absolute bottom-36 right-4 w-48 p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-accent/40 shadow-[0_0_30px_rgba(255,204,0,0.3)]">
                <div className="text-sm text-accent font-bold uppercase tracking-widest mb-1 drop-shadow-md">Rang Local</div>
                <div className="text-7xl font-bold text-white drop-shadow-lg">#4</div>
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
              <h2 className="text-6xl md:text-8xl font-bold uppercase leading-none mb-6">Bike Rank te<br/><span className="text-accent">trouve ton spot.</span></h2>
               <p className="text-zinc-400 text-xl font-medium">Indique ton niveau, le temps dont tu disposes et ta zone de ride. Bike Rank sélectionne une trace adaptée parmi les spots de la communauté.</p>
           </div>
           
           <div className="grid lg:grid-cols-2 gap-12 items-start">
              <form onSubmit={handleSearch} className="card-brutal p-6 md:p-8 flex flex-col gap-6 rounded-xl">
                  <div className="grid sm:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-2">
                       <label className="text-sm font-bold uppercase tracking-widest text-zinc-500">Ton niveau</label>
                       <select value={level} onChange={e => setLevel(e.target.value)} className="bg-zinc-900 border border-white/10 text-white p-4 rounded-md focus:border-primary outline-none transition-colors font-bold text-lg">
                          <option>Débutant</option>
                          <option>Intermédiaire</option>
                          <option>Expert</option>
                       </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold uppercase tracking-widest text-zinc-500">Temps disponible</label>
                        <select value={duration} onChange={e => setDuration(e.target.value)} className="bg-zinc-900 border border-white/10 text-white p-4 rounded-md focus:border-primary outline-none transition-colors font-bold text-lg">
                           <option>1 h</option>
                           <option>2 h</option>
                           <option>Une demi-journée</option>
                        </select>
                     </div>
                     <div className="flex flex-col gap-2">
                       <label className="text-sm font-bold uppercase tracking-widest text-zinc-500">Région (Optionnel)</label>
                       <input type="text" value={region} onChange={e => setRegion(e.target.value)} placeholder="Ex: Alpes du Nord" className="bg-zinc-900 border border-white/10 text-white p-4 rounded-md focus:border-primary outline-none transition-colors font-bold text-lg" />
                    </div>
                 </div>
                 <button className="button-primary mt-2 flex items-center justify-center gap-2 py-5 text-xl" data-testid="button-find-spot">
                    Trouver mon spot <ArrowRight size={24} />
                 </button>
              </form>
              
              {result && (
                 <div className="animate-in fade-in slide-in-from-bottom-8">
                    <div className="card-brutal rounded-xl overflow-hidden group">
                       <div className="h-56 relative bg-zinc-900 overflow-hidden">
                          {result.photo_url && <img src={result.photo_url} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500" alt=""/>}
                          <div className="absolute top-4 right-4 bg-primary text-black font-bold px-3 py-1 text-3xl flex items-center gap-1 shadow-lg">
                             <Star size={24} className="fill-black" /> {Number(result.average_rating).toFixed(1)}
                          </div>
                       </div>
                       <div className="p-8">
                          <div className="text-primary text-sm font-bold uppercase tracking-widest mb-3 flex gap-3">
                             <span>{result.practice_type}</span>
                             <span className="text-zinc-500">·</span>
                             <span className="text-zinc-400 flex items-center gap-1"><MapPin size={16}/> {result.region}</span>
                          </div>
                          <h3 className="text-5xl font-bold uppercase mb-4 text-white leading-none">{result.name}</h3>
                          <p className="text-zinc-400 text-lg mb-8 line-clamp-3 font-medium">{result.description || 'Une excellente option pour rouler aujourd\'hui.'}</p>
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
     <section className="py-24 bg-zinc-950 border-t border-white/5" id="carte">
        <div className="container">
            <div className="mb-12">
               <div className="eyebrow mb-3">La carte</div>
               <h2 className="text-6xl md:text-8xl font-bold uppercase leading-none">Repère ta<br/><span className="text-primary">prochaine trace.</span></h2>
            </div>
            
             <BikeMap spots={spots} />
        </div>
     </section>
  )
}

export function AboutSection() {
   return (
      <section className="py-24 bg-zinc-900 border-t border-white/5" id="apropos">
         <div className="container grid md:grid-cols-[0.7fr_1.3fr] gap-8 md:gap-16 items-start">
            <div className="eyebrow">Bike Rank en quelques mots</div>
            <div>
               <h2 className="text-5xl md:text-7xl font-bold uppercase leading-none mb-8">Des spots à découvrir.<br/><span className="text-primary">Un rang à défendre.</span></h2>
               <p className="text-zinc-400 text-xl font-medium leading-relaxed max-w-2xl">Bike Rank réunit les riders autour de données simples : des spots notés sur le terrain, des sorties enregistrées et un classement mensuel qui donne une bonne raison de reprendre le vélo.</p>
            </div>
         </div>
      </section>
   );
}

export function RankingSection() {
  const { rankedProfiles, requireAuth, session } = useBikeRank();
  const myRank = session ? rankedProfiles.find(p => p.id === session.user.id) : null;
  const targetRank = myRank && myRank.rank > 1 ? rankedProfiles[myRank.rank - 2] : null;
  
  return (
    <section className="py-32 bg-primary text-black relative overflow-hidden" id="classement">
       <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
       <div className="container relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
             <div className="max-w-xl">
                <div className="eyebrow text-black/70 mb-4 tracking-widest">Classement</div>
                <h2 className="text-7xl md:text-9xl font-bold uppercase leading-[0.85] tracking-tight">Le Tableau<br/>Des <span className="text-white">Chefs.</span></h2>
             </div>
             <div className="max-w-md text-black/80 font-bold text-xl leading-snug">
                Les sorties réelles font grimper au classement. Rentre tes kilomètres et arrache la première place.
             </div>
          </div>

          {session && myRank ? (
             <div className="bg-black text-white p-8 md:p-10 rounded-2xl mb-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl border border-black/20">
                <div className="flex items-center gap-8">
                   <div className="w-24 h-24 bg-primary text-black text-5xl font-bold flex items-center justify-center rounded-full shadow-[0_0_30px_rgba(255,91,26,0.3)]">#{myRank.rank}</div>
                   <div>
                      <h4 className="text-4xl font-bold uppercase m-0 leading-none">Ta position</h4>
                      <p className="text-zinc-400 mt-2 font-bold text-xl">{myRank.distance} km avalés ce mois-ci</p>
                   </div>
                </div>
                {targetRank ? (
                   <div className="md:text-right border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8 w-full md:w-auto">
                      <p className="text-primary font-bold text-2xl mb-1">Objectif : +{Math.ceil(targetRank.distance - myRank.distance)} km</p>
                       <p className="text-lg text-zinc-400 font-medium">pour passer devant {targetRank.profile?.pseudo || 'le prochain rider'}</p>
                   </div>
                ) : (
                   <div className="md:text-right border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8 w-full md:w-auto">
                      <p className="text-primary font-bold text-2xl mb-1">Leader incontesté</p>
                      <p className="text-lg text-zinc-400 font-medium">Garde le rythme pour rester au top.</p>
                   </div>
                )}
             </div>
          ) : (
             <div className="bg-black text-white p-12 rounded-2xl mb-16 text-center border border-black/20 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
                <h4 className="text-5xl font-bold uppercase mb-6">Rejoins la meute</h4>
                <p className="text-zinc-400 mb-10 max-w-lg mx-auto text-xl font-medium">Crée un compte pour enregistrer tes sorties et apparaître dans le classement officiel de la région.</p>
                <button onClick={() => requireAuth('signup')} className="bg-primary text-black font-bold uppercase tracking-wider px-10 py-5 text-xl hover:bg-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,91,26,0.4)]">Créer mon profil</button>
             </div>
          )}

          <div className="bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl text-white">
             <div className="grid grid-cols-12 gap-4 p-6 text-sm font-bold uppercase tracking-widest text-zinc-500 border-b border-white/5 bg-zinc-900/50">
                <div className="col-span-2 md:col-span-1">Rang</div>
                <div className="col-span-7 md:col-span-8">Rider</div>
                <div className="col-span-3 text-right">Distance</div>
             </div>
             <div className="divide-y divide-white/5">
                {rankedProfiles.slice(0, 10).map((rp, i) => (
                   <div key={rp.id} className="grid grid-cols-12 gap-4 items-center p-6 hover:bg-white/5 transition-colors group">
                      <div className="col-span-2 md:col-span-1 text-4xl text-zinc-600 font-bold group-hover:text-primary transition-colors">{(i+1).toString().padStart(2, '0')}</div>
                      <div className="col-span-7 md:col-span-8 flex items-center gap-6">
                         <img src={rp.profile?.avatar_url || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%231a1a1a'/%3E%3Ctext x='50' y='65' font-family='sans-serif' font-size='40' font-weight='bold' text-anchor='middle' fill='%23ff5b1a'%3E${rp.profile?.pseudo?.charAt(0).toUpperCase() || 'R'}%3C/text%3E%3C/svg%3E`} className="w-16 h-16 rounded-full object-cover bg-zinc-800 border border-white/10" alt=""/>
                         <div className="min-w-0">
                            <div className="font-bold text-2xl truncate group-hover:text-white text-zinc-200">{rp.profile?.pseudo || 'Rider anonyme'}</div>
                            <div className="text-sm font-bold text-zinc-500 truncate uppercase tracking-wider mt-1">{rp.profile?.ville || 'Spot inconnu'}</div>
                         </div>
                      </div>
                      <div className="col-span-3 text-right text-4xl font-bold text-white group-hover:text-primary transition-colors">
                         {rp.distance} <span className="text-xl text-zinc-500 tracking-widest uppercase">km</span>
                      </div>
                   </div>
                ))}
             </div>
             {rankedProfiles.length === 0 && (
                <div className="p-20 text-center text-zinc-500 text-xl font-medium flex flex-col items-center gap-4 bg-zinc-900/30">
                   <Trophy size={48} className="opacity-20" />
                   Aucune trace enregistrée ce mois-ci.<br/>Sois le premier à ouvrir la piste.
                </div>
             )}
          </div>
       </div>
    </section>
  );
}

export function Progression() {
   const { setActivityOpen, requireAuth } = useBikeRank();
   return (
      <section className="py-32 bg-zinc-950 text-white relative border-t border-white/5 overflow-hidden">
         <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
         <div className="container grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
               <div className="eyebrow mb-6 tracking-widest text-primary">Le Momentum</div>
               <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold uppercase leading-[0.85] tracking-tight mb-8">Une sortie<br/>Peut tout<br/><span className="text-zinc-600">Changer.</span></h2>
               <p className="text-zinc-400 text-xl font-medium mb-12 max-w-md leading-relaxed">Quelques kilomètres arrachés en fin de journée suffisent souvent à gagner des places précieuses en fin de mois. Ne lâche rien.</p>
               <button onClick={() => { if(requireAuth()) setActivityOpen(true); }} className="button-primary text-xl px-10 py-5 shadow-[0_0_20px_rgba(255,91,26,0.2)] hover:shadow-[0_0_30px_rgba(255,91,26,0.4)]">
                  En selle <ArrowRight className="inline ml-3 w-6 h-6"/>
               </button>
            </div>
            <div className="relative z-10 perspective-1000">
               <div className="card-brutal rounded-3xl p-12 flex flex-col items-center justify-center text-center transform md:rotate-y-[-10deg] md:rotate-x-[5deg] hover:rotate-0 transition-transform duration-500 shadow-2xl border-zinc-800 bg-zinc-900/90 backdrop-blur-xl">
                  <div className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-10 border-b border-white/10 pb-4 w-full">Exemple de progression</div>
                  <div className="flex items-center justify-center gap-8 md:gap-12 mb-10">
                     <div className="flex flex-col items-center">
                        <span className="text-sm text-zinc-500 uppercase tracking-widest font-bold mb-3">Hier</span>
                        <div className="text-6xl md:text-7xl font-bold text-zinc-600 line-through decoration-primary/40 decoration-4">#12</div>
                     </div>
                     <ArrowRight className="text-primary w-10 h-10 mt-8" />
                     <div className="flex flex-col items-center">
                        <span className="text-sm text-primary uppercase tracking-widest font-bold mb-3">Aujourd'hui</span>
                        <div className="text-8xl md:text-9xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">#8</div>
                     </div>
                  </div>
                  <div className="inline-flex items-center gap-3 bg-primary/20 text-primary border border-primary/30 px-6 py-3 rounded-full font-bold uppercase tracking-widest text-lg mb-8 shadow-[0_0_15px_rgba(255,91,26,0.2)] animate-pulse">
                     <ArrowUp size={24} strokeWidth={3} /> +4 places
                  </div>
                  <p className="text-zinc-400 font-bold text-xl">Sortie de 24 km enregistrée ce matin.</p>
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
      <section className="py-32 bg-zinc-950 border-t border-white/5" id="faq">
         <div className="container max-w-4xl">
            <div className="text-center mb-16">
               <div className="eyebrow mb-4">Questions fréquentes</div>
               <h2 className="text-6xl md:text-8xl font-bold uppercase">Le coin <span className="text-primary">Matos.</span></h2>
            </div>
            
            <div className="grid gap-4">
               {faqs.map((faq, i) => (
                  <details key={i} className="group bg-zinc-900 border border-white/5 rounded-xl overflow-hidden">
                     <summary className="flex justify-between items-center font-bold cursor-pointer p-8 list-none hover:bg-white/5 transition-colors">
                        <span className="text-2xl">{faq.q}</span>
                        <ChevronDown className="group-open:rotate-180 transition-transform text-primary w-8 h-8" />
                     </summary>
                     <div className="p-8 pt-0 text-zinc-400 font-medium text-xl leading-relaxed border-t border-white/5 bg-black/20">
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