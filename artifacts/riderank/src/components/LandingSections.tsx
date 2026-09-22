import React, { useState } from 'react';
import { ArrowRight, ArrowUp, ChevronDown, MapPin, Mountain, Star, Trophy, Route, Clock, Crown, Navigation2 } from 'lucide-react';
import { useBikeRank } from '../BikeRankContext';
import type { Spot } from '../types';
import { BikeMap } from './BikeMap';

export function Hero() {
  const { requireAuth, rankedProfiles } = useBikeRank();
  const monthlyLeader = rankedProfiles[0];
  const monthLabel = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(new Date());
  
  return (
    <section className="relative flex items-center pt-32 md:pt-40 pb-24 md:pb-32 overflow-hidden bg-zinc-950" id="accueil">
      <div className="absolute inset-0 z-0">
        <img src="/images/pexels-enrico-musitelli-1035698384-34377587_1790084330600.jpg" alt="VTT Background" className="w-full h-full object-cover opacity-40" />
         <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/60 to-zinc-950"></div>
      </div>
      
      <div className="container relative z-10 flex flex-col items-center">
         <div className="w-full flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
           <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold uppercase leading-[0.88] tracking-tight mb-6">
              Ride.<br/>
              <span className="text-primary drop-shadow-[0_0_15px_rgba(255,91,26,0.3)]">Progresse.</span><br/>
              <span className="whitespace-nowrap">Monte en places.</span>
           </h1>
           <p className="text-lg md:text-2xl text-zinc-300 max-w-2xl mb-8 leading-relaxed font-medium">
              Chaque kilomètre te fait progresser. Enregistre tes sorties à vélo, découvre tes stats et grimpe au classement.
           </p>

           {/* Teaser Leaderboard Widget */}
           <div className="glass-glow mb-10 px-6 py-4 flex items-center gap-6 rounded-2xl">
              <div className="flex flex-col items-start text-left">
                 <div className="text-primary text-xs font-bold uppercase tracking-widest mb-1">#1 Ce mois-ci · {monthLabel}</div>
                 <div className="text-white text-2xl font-bold uppercase leading-none">{monthlyLeader?.profile?.pseudo || 'Le Grimpeur'}</div>
                 <div className="text-zinc-400 text-sm font-medium">Le rider à battre</div>
              </div>
              <div className="w-[1px] h-12 bg-white/10 mx-2"></div>
              <div className="text-5xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,91,26,0.3)]">
                  {(monthlyLeader?.distance ?? 56).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} <span className="text-primary text-2xl">km</span>
              </div>
           </div>

           <button onClick={() => requireAuth('signup')} className="button-primary w-full max-w-xl text-base sm:text-xl px-5 sm:px-10 py-5 flex items-center gap-3 group" data-testid="cta-hero">
              Entrer dans le classement <ArrowRight className="group-hover:translate-x-1 transition-transform w-6 h-6" />
           </button>
           <p className="w-full text-center text-sm sm:text-lg text-zinc-500 mt-4 font-medium uppercase tracking-wider flex items-center justify-center gap-2">
             <Star size={16} className="text-primary"/> Connexion ou création de compte rapide
           </p>
        </div>
        
          <div className="relative animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 flex justify-center perspective-1000 z-10 mt-20 md:mt-28 py-8">
            <div className="relative w-[250px] h-[500px] lg:w-[320px] lg:h-[640px] rounded-[46px] lg:rounded-[54px] p-[7px] flex flex-col items-center justify-center bg-gradient-to-br from-zinc-400 via-zinc-950 to-zinc-500 shadow-[0_36px_90px_rgba(0,0,0,0.8),0_0_45px_rgba(255,91,26,0.3)] lg:transform lg:rotate-y-[-15deg] lg:rotate-x-[5deg] hover:rotate-0 transition-transform duration-700">
              <div className="w-full h-full rounded-[40px] lg:rounded-[47px] overflow-hidden relative bg-black border border-white/10 shadow-[inset_0_0_22px_rgba(255,255,255,0.08)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,91,26,0.3),transparent_32%),linear-gradient(160deg,#180803_0%,#000_55%,#120501_100%)]"></div>
                  <div className="absolute inset-x-4 top-3 flex justify-between text-[9px] font-bold text-white/80 z-10"><span>09:41</span><span>5G&nbsp;&nbsp;●</span></div>
                  <div className="absolute top-2 w-24 lg:w-28 h-7 bg-black rounded-full left-1/2 -translate-x-1/2 z-20 border border-white/5"></div>
                  <div className="absolute inset-x-5 top-16">
                     <div className="text-primary text-[10px] font-bold uppercase tracking-[0.25em] mb-2">Bike Rank</div>
                     <div className="text-white text-3xl lg:text-4xl font-bold uppercase">Ma sortie</div>
                     <div className="text-zinc-500 text-xs mt-1">Aujourd'hui · Massif des Alpes</div>
                     <div className="grid grid-cols-3 gap-2 mt-6">
                       {[['24,6','KM'], ['1:42','TEMPS'], ['42','KM/H']].map(([value,label]) => (
                         <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-2 text-center">
                           <div className="text-white text-lg lg:text-xl font-bold">{value}</div>
                           <div className="text-primary text-[8px] font-bold">{label}</div>
                         </div>
                       ))}
                     </div>
                     <div className="mt-4 h-36 lg:h-52 rounded-2xl border border-primary/20 bg-black/70 p-4 relative overflow-hidden">
                       <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,91,26,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,91,26,.25)_1px,transparent_1px)] bg-[size:22px_22px]"></div>
                       <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="relative w-full h-full stroke-primary fill-none drop-shadow-[0_0_6px_rgba(255,91,26,1)]" strokeWidth="2">
                         <path d="M3 40 C18 35 20 10 38 17 S55 45 67 30 S83 12 97 7"/>
                       </svg>
                     </div>
                  </div>
                  <div className="absolute bottom-7 left-4 right-4">
                     <div className="w-full bg-zinc-900/90 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                        <div className="flex justify-around text-[9px] font-bold uppercase text-zinc-500">
                           <span className="text-primary">Sortie</span><span>Stats</span><span>Rang</span>
                       </div>
                    </div>
                 </div>
                  <div className="absolute bottom-2 w-24 h-1 bg-white/70 rounded-full left-1/2 -translate-x-1/2"></div>
              </div>
              
              {/* Floating Glass Card 1 */}
                <div className="absolute top-16 lg:top-20 left-[-42px] lg:left-[-90px] w-48 lg:w-64 p-4 lg:p-6 glass-glow transform -rotate-6 z-30 shadow-[0_20px_50px_rgba(0,0,0,.65),0_0_30px_rgba(255,91,26,.38)]">
                <div className="flex items-center gap-3 text-primary text-sm font-bold uppercase tracking-widest mb-2"><Trophy size={18} /> Vitesse Max</div>
                 <div className="text-5xl lg:text-7xl font-bold text-white drop-shadow-lg leading-none">42 <span className="text-2xl lg:text-3xl text-zinc-400">km/h</span></div>
              </div>

              {/* Floating Glass Card 2 */}
                <div className="absolute bottom-28 lg:bottom-36 right-[-35px] lg:right-[-85px] w-44 lg:w-56 p-4 lg:p-6 glass-glow transform rotate-7 z-30 shadow-[0_20px_50px_rgba(0,0,0,.65),0_0_30px_rgba(255,91,26,.38)]">
                <div className="flex items-center gap-3 text-primary text-sm font-bold uppercase tracking-widest mb-2"><Star size={18} /> Rang Local</div>
                 <div className="text-6xl lg:text-8xl font-bold text-white drop-shadow-lg leading-none">#4</div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}

export function ShareStats() {
   return (
      <section className="py-24 bg-white text-black relative overflow-hidden" id="partage">
         <div className="absolute inset-0">
            <img
              src="/images/share-stats-wheelies.jpg"
              alt=""
              className="w-full h-full object-cover object-center opacity-45 saturate-[.62] contrast-[.88]"
            />
            <div className="absolute inset-0 bg-white/55"></div>
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/25 to-transparent"></div>
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-black/20"></div>
         </div>
         <div className="container relative z-10 flex flex-col items-center">
            <div className="text-center mb-16 max-w-3xl">
               <div className="eyebrow mb-4">Partage tes exploits</div>
               <h2 className="text-6xl md:text-8xl font-bold uppercase leading-none mb-6">Tes stats, <br/><span className="text-primary drop-shadow-[0_0_10px_rgba(255,91,26,0.2)]">Prêtes à partager.</span></h2>
               <p className="text-zinc-600 text-xl font-medium">Après chaque sortie, génère une carte et partage-la en quelques secondes.</p>
            </div>

             <div className="w-full max-w-md">
                <img
                  src="/images/bike-rank-share-card.png"
                  alt="Exemple de carte de statistiques Bike Rank avec distance, temps total, vitesse maximale et classement"
                  className="w-full rounded-[28px] shadow-[0_24px_60px_rgba(255,91,26,0.28)] transition-transform duration-500 hover:-translate-y-2 hover:rotate-1"
                />
            </div>
         </div>
      </section>
   )
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
     <section className="py-24 bg-zinc-950 relative overflow-hidden" id="trouver">
        <div className="absolute inset-0 z-0">
          <img src="/images/pexels-masoodaslami-33723004_1790084330601.jpg" alt="Forest" className="w-full h-full object-cover opacity-20 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-zinc-950/40"></div>
        </div>

        <div className="container relative z-10">
           <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                 <div className="eyebrow mb-4">Prépare ta sortie</div>
                 <h2 className="text-6xl md:text-8xl font-bold uppercase leading-[0.85] tracking-tight mb-8">Pas d'idée ?<br/><span className="text-primary drop-shadow-[0_0_15px_rgba(255,91,26,0.3)]">Bike Rank prépare ta trace.</span></h2>
                 <p className="text-zinc-400 text-xl font-medium mb-12">Indique ton temps disponible ou choisis ta destination. Bike Rank te prépare une sortie adaptée : une boucle qui te ramène au départ ou un itinéraire vers l'endroit choisi.</p>

                 <form onSubmit={handleSearch} className="glass-glow p-6 md:p-8 flex flex-col gap-6 relative z-10">
                     <div className="grid sm:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                           <label className="text-sm font-bold uppercase tracking-widest text-zinc-400">Temps disponible</label>
                           <select value={duration} onChange={e => setDuration(e.target.value)} className="bg-black/60 border border-white/10 text-white p-4 rounded-xl focus:border-primary outline-none transition-all font-bold text-lg appearance-none">
                              <option className="bg-zinc-900">1 h</option>
                              <option className="bg-zinc-900">2 h</option>
                              <option className="bg-zinc-900">Demi-journée</option>
                           </select>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-bold uppercase tracking-widest text-zinc-400">Destination (Optionnel)</label>
                          <input type="text" value={region} onChange={e => setRegion(e.target.value)} placeholder="Ex: Alpes" className="bg-black/60 border border-white/10 text-white p-4 rounded-xl focus:border-primary outline-none transition-all font-bold text-lg placeholder:text-zinc-600" />
                       </div>
                    </div>
                    <button className="button-primary mt-2 flex items-center justify-center gap-2 py-5 text-xl w-full" data-testid="button-find-spot">
                       Générer mon idée <ArrowRight size={24} />
                    </button>
                 </form>
              </div>

               <div className="relative flex justify-center perspective-1000 py-12 mt-8 lg:mt-0">
                 {/* Phone Mockup */}
                  <div className="relative w-[250px] h-[520px] sm:w-[300px] sm:h-[600px] bg-black rounded-[48px] border-4 border-white/15 p-2 shadow-2xl z-10">
                    <div className="w-full h-full rounded-[40px] overflow-hidden bg-zinc-950 flex flex-col relative border border-white/5">
                       <div className="absolute top-0 w-32 h-6 bg-black rounded-b-3xl left-1/2 -translate-x-1/2 z-10"></div>
                       <div className="p-6 pt-12 flex flex-col h-full">
                          <div className="text-primary text-xs font-bold tracking-widest mb-1 flex items-center gap-2"><Route size={14}/> Route Prête</div>
                          <div className="text-white text-2xl font-bold uppercase mb-4 leading-none">Balade vers<br/>Tourmalet</div>
                          <div className="bg-zinc-900 rounded-xl flex-1 relative overflow-hidden mb-6 border border-white/10">
                             <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9zdmc+')]"></div>
                             <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full stroke-primary fill-none" strokeWidth="2">
                                <path d="M 20 80 Q 40 50 60 60 T 80 20" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="20" cy="80" r="3" fill="#ff5b1a"/>
                                <circle cx="80" cy="20" r="3" fill="#ffffff"/>
                             </svg>
                          </div>
                          <button className="w-full py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl text-lg mt-auto">Démarrer la sortie</button>
                       </div>
                    </div>
                 </div>

                 {/* Floating Cards */}
                 <div className="absolute top-24 left-[-20px] sm:left-[-60px] glass-glow p-4 sm:p-5 w-44 sm:w-56 rounded-2xl transform -rotate-6 z-20">
                    <div className="text-primary text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><Clock size={16}/> Temps</div>
                    <div className="text-white text-2xl sm:text-3xl font-bold uppercase">Dis-moi<br/>combien de<br/>temps tu as.</div>
                 </div>

                 <div className="absolute bottom-28 right-[-20px] sm:right-[-50px] glass-glow p-4 sm:p-5 w-44 sm:w-56 rounded-2xl transform rotate-6 z-20">
                    <div className="text-primary text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><Navigation2 size={16}/> Destination</div>
                    <div className="text-white text-2xl sm:text-3xl font-bold uppercase">Tu sais où<br/>aller ?</div>
                 </div>
              </div>
           </div>

           {result && (
              <div className="animate-in fade-in slide-in-from-bottom-8 mt-12">
                 <div className="glass-glow overflow-hidden group">
                    <div className="h-64 relative bg-black overflow-hidden">
                       {result.photo_url && <img src={result.photo_url} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700" alt=""/>}
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                       <div className="absolute top-4 right-4 glass-glow-strong text-white font-bold px-4 py-2 text-2xl flex items-center gap-2">
                          <Star size={20} className="text-primary fill-primary" /> {Number(result.average_rating).toFixed(1)}
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
     </section>
  );
}

export function SpotsSection() {
   const { spots } = useBikeRank();
   const featuredSpots = spots.slice(0, 3);

   return (
      <section className="py-24 bg-white text-black" id="spots">
         <div className="container">
            <div className="max-w-3xl mb-12">
               <div className="eyebrow mb-4">Choisis ton terrain</div>
               <h2 className="text-6xl md:text-8xl font-bold uppercase leading-none mb-6">Les spots<br/><span className="text-primary">qui parlent.</span></h2>
               <p className="text-black/70 text-xl font-medium">Des traces recommandées par les riders, classées selon les avis de la communauté.</p>
            </div>
            {featuredSpots.length > 0 ? (
               <div className="grid md:grid-cols-3 gap-6">
                  {featuredSpots.map((spot) => (
                     <article key={spot.id} className="group bg-black text-white rounded-3xl overflow-hidden border border-primary/35 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
                        <div className="h-56 bg-black relative overflow-hidden">
                           {spot.photo_url && <img src={spot.photo_url} alt="" className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700" />}
                           <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                           <div className="absolute top-4 right-4 glass-glow px-3 py-2 text-sm font-bold flex items-center gap-2">
                              <Star size={16} className="text-primary fill-primary" /> {Number(spot.average_rating).toFixed(1)}
                           </div>
                        </div>
                        <div className="p-6">
                           <div className="text-primary text-xs font-bold uppercase tracking-widest mb-3">{spot.practice_type} · {spot.region}</div>
                           <h3 className="text-3xl font-bold uppercase mb-3">{spot.name}</h3>
                           <p className="text-white/60 font-medium line-clamp-2">{spot.description || 'Une trace sélectionnée par la communauté Bike Rank.'}</p>
                        </div>
                     </article>
                  ))}
               </div>
            ) : (
               <div className="rounded-3xl bg-black text-white p-10 border border-primary/35 text-center">
                  <Mountain className="mx-auto text-primary mb-4" size={36} />
                  <p className="text-xl font-bold uppercase">Les premiers spots arrivent bientôt.</p>
               </div>
            )}
         </div>
      </section>
   );
}

export function MapSection() {
  const { spots } = useBikeRank();
  return (
     <section className="py-24 bg-zinc-950 text-white relative overflow-hidden" id="carte">
        <div className="container relative z-10">
            <div className="mb-12 text-center">
               <div className="eyebrow mb-3">La carte</div>
               <h2 className="text-6xl md:text-8xl font-bold uppercase leading-none">Repère ta<br/><span className="text-primary drop-shadow-[0_0_15px_rgba(255,91,26,0.3)]">prochaine trace.</span></h2>
            </div>
            
             <BikeMap spots={spots} />
        </div>
     </section>
  )
}

export function LeaderboardSection() {
    const { profile, rankedProfiles } = useBikeRank();
    const monthLabel = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(new Date());
    const currentUserRank = profile ? rankedProfiles.find((item) => item.id === profile.id) : null;
    const leader = rankedProfiles[0];
    const distanceToLeader = currentUserRank && leader
      ? Math.max(0, leader.distance - currentUserRank.distance)
      : 0;
   return (
       <section className="py-32 bg-black text-white relative overflow-hidden" id="classement">
          <div className="absolute inset-0">
             <img src="/images/leaderboard-forest-riders.jpg" alt="" className="w-full h-full object-cover opacity-40 saturate-[.72] contrast-[.92]" />
             <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/55 to-black/85"></div>
          </div>
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent opacity-10"></div>
          <div className="container relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
               <div className="eyebrow mb-6 tracking-widest">Classement</div>
               <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold uppercase leading-[0.85] tracking-tight mb-8">Chaque<br/>Kilomètre<br/><span className="text-primary">Compte.</span></h2>
                <p className="text-zinc-300 text-xl font-medium mb-12 max-w-md leading-relaxed">Les kilomètres réellement roulés te font avancer. Suis ta position en France, dans ta région ou entre amis.</p>

               <div className="mt-12 hidden lg:block">
                    <div className="text-white/55 text-sm font-bold uppercase tracking-widest mb-2">{monthLabel}</div>
                  <div className="flex items-end gap-6">
                      <div className="text-8xl font-bold text-primary leading-none">#{currentUserRank?.rank ?? '—'}</div>
                     <div className="pb-2">
                         <div className="text-2xl font-bold uppercase">{profile?.pseudo || 'À TOI DE ROULER'}</div>
                         <div className="text-zinc-500 font-medium">{(currentUserRank?.distance ?? 0).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} km ce mois-ci</div>
                     </div>
                  </div>
                  <div className="text-primary font-bold text-sm mt-4 flex items-center gap-2">
                      <ArrowUp size={16}/> {currentUserRank ? `Plus que ${distanceToLeader.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} km pour atteindre la tête` : 'Enregistre ta première sortie GPS'}
                  </div>
               </div>
            </div>

            <div className="relative z-10 flex justify-center lg:justify-end">
               <div className="glass-glow-strong bg-zinc-950 w-full max-w-md rounded-[32px] p-8 text-white relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                     <div className="flex items-center gap-3">
                        <Crown className="text-primary" size={24}/>
                        <div>
                           <div className="text-white font-bold uppercase tracking-widest text-sm">Classement</div>
                           <div className="text-zinc-500 text-xs font-bold uppercase">Bike Rank · France</div>
                        </div>
                     </div>
                     <div className="bg-primary/20 text-primary text-xs font-bold uppercase px-3 py-1 rounded-full flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div> Actif
                     </div>
                  </div>

                  {/* Toggle */}
                   <div className="bg-black/50 p-1 rounded-xl flex mb-6">
                      <div className="flex-1 py-3 bg-primary text-black text-center font-bold uppercase text-sm rounded-lg">Classement de ce mois</div>
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
                      <span>{monthLabel}</span>
                     <span className="flex items-center gap-1"><MapPin size={12}/> France</span>
                  </div>

                  {/* User Position */}
                  <div className="border border-primary/40 rounded-2xl p-6 mb-6 bg-primary/5 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-10"><Crown size={64}/></div>
                     <div className="text-primary text-xs font-bold uppercase tracking-widest mb-3">Ta position</div>
                     <div className="flex items-center gap-6 mb-3">
                         <div className="text-6xl font-bold text-white leading-none">#{currentUserRank?.rank ?? '—'}</div>
                        <div>
                           <div className="text-xl font-bold uppercase">{profile?.pseudo || 'Toi'}</div>
                           <div className="text-zinc-400 text-sm">France</div>
                        </div>
                     </div>
                      <div className="text-sm font-bold text-zinc-300">{(currentUserRank?.distance ?? 0).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} km ce mois-ci</div>
                     <div className="text-primary text-xs font-bold mt-3 flex items-center gap-2 border-t border-primary/20 pt-3">
                         <ArrowUp size={14}/> {currentUserRank ? `${distanceToLeader.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} km jusqu'au leader` : 'Démarre une sortie pour entrer au classement'}
                     </div>
                  </div>

                  {/* Top Riders List */}
                  <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 flex justify-between">
                     <span>Top Riders</span>
                     <span>Km Validés</span>
                  </div>
                  <div className="space-y-4">
                     {rankedProfiles.slice(0, 4).map((item) => {
                        const rider = {
                          pos: item.rank,
                          name: item.profile?.pseudo || 'RIDER',
                          km: item.distance.toLocaleString('fr-FR', { maximumFractionDigits: 1 }),
                          isUser: item.id === profile?.id,
                        };
                        return (
                        <div key={rider.pos} className={`flex items-center justify-between py-2 border-b border-white/5 last:border-0 ${rider.isUser ? 'bg-white/5 -mx-4 px-4 rounded-lg' : ''}`}>
                           <div className="flex items-center gap-4">
                              <span className={`font-bold w-4 text-center ${rider.isUser ? 'text-primary' : 'text-zinc-500'}`}>{rider.pos}</span>
                              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold">{rider.name.substring(0,2)}</div>
                              <span className={`font-bold uppercase ${rider.isUser ? 'text-white' : 'text-zinc-300'}`}>{rider.name}</span>
                              {rider.isUser && <span className="bg-primary text-black text-[10px] font-bold px-2 py-0.5 rounded ml-2">TOI</span>}
                           </div>
                           <div className="font-bold">{rider.km} <span className="text-zinc-500 text-xs">km</span></div>
                        </div>
                     )})}
                  </div>

                  <div className="text-center text-zinc-600 text-xs font-medium mt-8 border-t border-white/10 pt-4">
                     Le classement se base uniquement sur les kilomètres validés.
                  </div>
               </div>
            </div>
         </div>
      </section>
   )
}

export function Progression() {
   const { requireAuth } = useBikeRank();
   return (
       <section className="py-32 bg-white text-black relative overflow-hidden" id="progression">
         <div className="absolute inset-0 z-0">
            <img src="/images/progression-forest-riders.jpg" alt="Deux vététistes roulant dans une forêt" className="w-full h-full object-cover object-center opacity-45 saturate-[.62] contrast-[.88]" />
            <div className="absolute inset-0 bg-white/55"></div>
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 to-transparent"></div>
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-black/70"></div>
         </div>

         <div className="container relative z-10 flex flex-col items-center text-center">
            <div className="max-w-4xl mx-auto mb-16">
               <h2 className="text-6xl md:text-8xl font-bold uppercase leading-[0.85] tracking-tight mb-8">Ta prochaine sortie<br/>peut tout<br/><span className="text-primary drop-shadow-[0_0_15px_rgba(255,91,26,0.3)]">Changer.</span></h2>
                <p className="text-zinc-800 text-xl font-medium max-w-2xl mx-auto leading-relaxed">Quelques kilomètres peuvent suffire pour gagner des places, battre un objectif ou débloquer une nouvelle étape.</p>
            </div>

             <div className="glass-glow-light w-full max-w-2xl rounded-[32px] p-8 md:p-12 text-left mb-12">
               <div className="flex justify-between items-center mb-10">
                  <span className="text-primary text-xs font-bold uppercase tracking-widest">Exemple de progression</span>
                   <span className="text-zinc-700 text-xs font-bold uppercase tracking-widest border border-black/10 px-3 py-1 rounded-full">Illustration</span>
               </div>

               <div className="flex items-center gap-6 mb-12">
                   <div className="text-6xl md:text-8xl font-bold text-zinc-500">#14</div>
                   <ArrowRight className="text-zinc-600 w-8 h-8" />
                  <div className="text-7xl md:text-9xl font-bold text-primary drop-shadow-[0_0_15px_rgba(255,91,26,0.3)]">#9</div>
                  <div className="ml-auto glass-glow-strong border-primary text-primary px-4 py-2 rounded-xl font-bold uppercase tracking-widest text-sm hidden sm:block">
                     +5 Places
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex justify-between text-sm font-bold uppercase tracking-widest">
                      <span className="text-zinc-700">Objectif suivant</span>
                      <span className="text-black">10 km</span>
                  </div>
                   <div className="w-full h-2 bg-zinc-300 rounded-full overflow-hidden">
                     <div className="h-full bg-primary w-[65%] rounded-full shadow-[0_0_10px_rgba(255,91,26,0.8)]"></div>
                  </div>
                   <div className="text-zinc-700 text-sm font-bold">
                     Plus que 3,5 km pour atteindre le #8
                  </div>
               </div>
            </div>

            <button onClick={() => requireAuth('signup')} className="button-primary text-xl px-12 py-5" data-testid="cta-progression">
               À toi de rouler <ArrowRight className="inline ml-3 w-6 h-6"/>
            </button>
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
       <section className="py-32 bg-black text-white relative" id="faq">
         <div className="container max-w-4xl relative z-10">
            <div className="text-center mb-16">
               <div className="eyebrow mb-4">Questions fréquentes</div>
               <h2 className="text-6xl md:text-8xl font-bold uppercase">Le coin <span className="text-primary drop-shadow-[0_0_15px_rgba(255,91,26,0.3)]">Matos.</span></h2>
            </div>
            
            <div className="grid gap-4">
               {faqs.map((faq, i) => (
                  <details key={i} className="group glass-glow-strong bg-zinc-950 text-white rounded-2xl overflow-hidden">
                     <summary className="flex justify-between items-center font-bold cursor-pointer p-8 list-none transition-colors hover:bg-white/5">
                        <span className="text-xl md:text-2xl">{faq.q}</span>
                        <ChevronDown className="group-open:rotate-180 transition-transform text-primary w-8 h-8 shrink-0 ml-4 drop-shadow-[0_0_10px_rgba(255,91,26,0.3)]" />
                     </summary>
                     <div className="p-8 pt-0 text-zinc-400 font-medium text-lg md:text-xl leading-relaxed">
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
