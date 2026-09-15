import React, { useState } from 'react';
import { ArrowRight, ArrowUp, ChevronDown, MapPin, Mountain, Star, Trophy } from 'lucide-react';
import { useSentiz } from '../SentizContext';
import type { Spot } from '../types';

export function Hero() {
  const { requireAuth, rankedProfiles, activities } = useSentiz();
  const leader = rankedProfiles[0];
  const leaderElevation = leader
    ? activities
        .filter((activity) => activity.user_id === leader.id)
        .reduce((total, activity) => total + Number(activity.elevation_m || 0), 0)
    : 4280;
  const monthLabel = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(new Date());
  
  return (
    <section className="relative min-h-[95vh] flex items-center pt-24 pb-12 overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 z-0">
        <img src="/images/tim-foster-qrIy8dBzCVU-unsplash_1789402010865.jpg" alt="VTT Background" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-transparent"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTgwIDE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjkiIG51bU9jdGF2ZXM9IjQiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbikiIG9wYWNpdHk9Ii41Ii8+PC9zdmc+')] opacity-20 mix-blend-overlay"></div>
      </div>
      
      <div className="container relative z-10 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col items-start animate-in fade-in slide-in-from-bottom-8 duration-700">
           <div className="flex items-center gap-3 text-primary font-display font-bold tracking-widest uppercase mb-6">
              <span className="w-8 h-0.5 bg-primary"></span>
              La meute t'attend
           </div>
           <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold uppercase leading-[0.85] tracking-tight mb-8">
              Chaque<br/><span className="text-primary">Trace</span><br/>Compte.
           </h1>
           <p className="text-lg md:text-xl text-zinc-400 max-w-lg mb-10 leading-relaxed">
              Sentiz, c'est le classement local des riders qui ne restent pas en bas. Tes kilomètres forgent ton rang.
           </p>
           <button onClick={() => requireAuth('signup')} className="button-primary text-lg px-8 py-4 flex items-center gap-3 group" data-testid="cta-hero">
              Entrer dans le classement <ArrowRight className="group-hover:translate-x-1 transition-transform" />
           </button>
           <p className="text-sm text-zinc-500 mt-4 font-medium">Connexion ou création de compte rapide.</p>
        </div>
        
        <div className="lg:col-span-5 relative animate-in fade-in slide-in-from-right-8 duration-700 delay-200 hidden md:block">
           <div className="card-brutal p-8 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
               <div className="inline-block bg-primary text-black font-display font-bold px-3 py-1 text-sm tracking-wider uppercase mb-8">#1 · {monthLabel}</div>
              <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-primary flex items-center justify-center text-3xl font-display font-bold text-primary">{leader?.profile?.pseudo?.charAt(0).toUpperCase() || 'L'}</div>
                 <div>
                     <h3 className="text-3xl font-display font-bold uppercase m-0 text-white">{leader?.profile?.pseudo || 'Léa Morel'}</h3>
                     <p className="text-zinc-400 text-sm mt-1 uppercase tracking-wide">{leader ? 'Leader Sentiz' : 'Donnée de démonstration'}</p>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                 <div>
                    <p className="text-zinc-500 text-xs uppercase tracking-wider font-bold mb-1">Distance</p>
                     <p className="text-4xl font-display font-bold text-white">{leader?.distance ?? 184} <span className="text-xl text-zinc-500">km</span></p>
                 </div>
                 <div>
                    <p className="text-zinc-500 text-xs uppercase tracking-wider font-bold mb-1">Dénivelé</p>
                     <p className="text-4xl font-display font-bold text-primary">{leaderElevation.toLocaleString('fr-FR')} <span className="text-xl text-primary/50">m</span></p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}

export function SpotFinder() {
  const { spots } = useSentiz();
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
              <h2 className="text-5xl md:text-7xl font-display uppercase leading-none mb-6">Sentiz te<br/><span className="text-accent">trouve ton spot.</span></h2>
               <p className="text-zinc-400 text-lg">Indique ton niveau, le temps dont tu disposes et ta zone de ride. Sentiz sélectionne une trace adaptée parmi les spots de la communauté.</p>
           </div>
           
           <div className="grid lg:grid-cols-2 gap-12 items-start">
              <form onSubmit={handleSearch} className="card-brutal p-6 md:p-8 flex flex-col gap-6 rounded-xl">
                  <div className="grid sm:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Ton niveau</label>
                       <select value={level} onChange={e => setLevel(e.target.value)} className="bg-zinc-900 border border-white/10 text-white p-4 rounded-md focus:border-primary outline-none transition-colors">
                          <option>Débutant</option>
                          <option>Intermédiaire</option>
                          <option>Expert</option>
                       </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Temps disponible</label>
                        <select value={duration} onChange={e => setDuration(e.target.value)} className="bg-zinc-900 border border-white/10 text-white p-4 rounded-md focus:border-primary outline-none transition-colors">
                           <option>1 h</option>
                           <option>2 h</option>
                           <option>Une demi-journée</option>
                        </select>
                     </div>
                     <div className="flex flex-col gap-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Région (Optionnel)</label>
                       <input type="text" value={region} onChange={e => setRegion(e.target.value)} placeholder="Ex: Alpes du Nord" className="bg-zinc-900 border border-white/10 text-white p-4 rounded-md focus:border-primary outline-none transition-colors" />
                    </div>
                 </div>
                 <button className="button-primary mt-2 flex items-center justify-center gap-2 py-4" data-testid="button-find-spot">
                    Trouver mon spot <ArrowRight size={18} />
                 </button>
              </form>
              
              {result && (
                 <div className="animate-in fade-in slide-in-from-bottom-8">
                    <div className="card-brutal rounded-xl overflow-hidden group">
                       <div className="h-48 relative bg-zinc-900 overflow-hidden">
                          {result.photo_url && <img src={result.photo_url} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500" alt=""/>}
                          <div className="absolute top-4 right-4 bg-primary text-black font-bold font-display px-3 py-1 text-2xl flex items-center gap-1 shadow-lg">
                             <Star size={18} className="fill-black" /> {Number(result.average_rating).toFixed(1)}
                          </div>
                       </div>
                       <div className="p-6">
                          <div className="text-primary text-xs font-bold uppercase tracking-widest mb-2 flex gap-3">
                             <span>{result.practice_type}</span>
                             <span className="text-zinc-500">·</span>
                             <span className="text-zinc-400 flex items-center gap-1"><MapPin size={12}/> {result.region}</span>
                          </div>
                          <h3 className="text-3xl font-display font-bold uppercase mb-3 text-white leading-none">{result.name}</h3>
                          <p className="text-zinc-400 text-sm mb-6 line-clamp-3">{result.description || 'Une excellente option pour rouler aujourd\'hui.'}</p>
                          <a href="#spots" className="text-white hover:text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-colors">
                             Explorer tous les spots <ArrowRight size={14}/>
                          </a>
                       </div>
                    </div>
                 </div>
              )}
           </div>
        </div>
     </section>
  );
}

export function SpotsSection() {
  const { spots, setReviewOpen, setSelectedSpot, requireAuth } = useSentiz();
  const [filter, setFilter] = useState('Tous');
  const visibleSpots = filter === 'Tous' ? spots : spots.filter(s => s.practice_type === filter);
  
  return (
     <section className="section dark-panel border-t border-white/5" id="spots">
        <div className="container">
           <div className="section-head flex-col md:flex-row md:items-end gap-6 mb-12">
              <div className="max-w-xl">
                 <div className="eyebrow">Le palmarès local</div>
                 <h2 className="section-title text-accent">Les spots<br />qui parlent.</h2>
                 <p className="text-zinc-400 text-lg">Notes et avis viennent directement des riders Sentiz. Découvre où la communauté pose ses crampons.</p>
              </div>
           </div>
           
           <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
              {['Tous', 'Bike park', 'Enduro', 'DH'].map(item => (
                 <button key={item} className={`filter-chip ${filter === item ? 'active' : ''}`} onClick={() => setFilter(item)}>{item}</button>
              ))}
           </div>
           
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleSpots.map((spot, index) => (
                 <article className="spot-card rounded-xl group" key={spot.id}>
                    <img src={spot.photo_url || ''} alt="" className="spot-visual" />
                    <div className="spot-rating flex flex-col items-center">
                       {Number(spot.average_rating).toFixed(1)}
                       <small className="opacity-70">/ 5</small>
                    </div>
                    <div className="spot-content">
                       <div className="spot-tag">#{String(index + 1).padStart(2, '0')} · {spot.practice_type}</div>
                       <h3 className="group-hover:text-primary transition-colors">{spot.name}</h3>
                       <p className="spot-location flex items-center gap-1 mt-2 text-zinc-300"><MapPin size={12} /> {spot.region}</p>
                       <div className="spot-details flex items-center gap-4 mt-3">
                          <span className="flex items-center gap-1.5"><Mountain size={14} className="text-primary"/> {spot.elevation_m} m</span>
                       </div>
                       <button className="inline-action mt-5 group/btn" onClick={() => { setSelectedSpot(spot.id); if (requireAuth()) setReviewOpen(true); }}>
                          <Star size={13} className="group-hover/btn:fill-white" /> Noter ce spot
                       </button>
                    </div>
                 </article>
              ))}
              {visibleSpots.length === 0 && <div className="text-zinc-500 py-12 col-span-full text-center">Aucun spot trouvé pour cette catégorie.</div>}
           </div>
        </div>
     </section>
  )
}

export function MapSection() {
  return (
     <section className="py-20 bg-zinc-950 border-t border-white/5" id="carte">
        <div className="container">
            <div className="mb-10">
               <div className="eyebrow mb-3">La carte</div>
               <h2 className="text-5xl md:text-7xl font-display font-bold uppercase leading-none">Repère ta<br/><span className="text-primary">prochaine trace.</span></h2>
            </div>
           <div className="map-wrap">
              <div className="map-box rounded-xl">
                 <div className="map-pin pin-one"><MapPin /></div>
                 <div className="map-pin pin-two"><MapPin /></div>
                 <div className="map-pin pin-three"><MapPin /></div>
                 <div className="map-pin pin-four"><MapPin /></div>
                 <div className="map-stamp">Cartographie Sentiz</div>
              </div>
           </div>
        </div>
     </section>
  )
}

export function AboutSection() {
   return (
      <section className="py-20 bg-zinc-900 border-t border-white/5" id="apropos">
         <div className="container grid md:grid-cols-[0.7fr_1.3fr] gap-8 md:gap-16 items-start">
            <div className="eyebrow">Sentiz en quelques mots</div>
            <div>
               <h2 className="text-4xl md:text-6xl font-display font-bold uppercase leading-none mb-6">Des spots à découvrir.<br/><span className="text-primary">Un rang à défendre.</span></h2>
               <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">Sentiz réunit les riders autour de données simples : des spots notés sur le terrain, des sorties enregistrées et un classement mensuel qui donne une bonne raison de reprendre le vélo.</p>
            </div>
         </div>
      </section>
   );
}

export function RankingSection() {
  const { rankedProfiles, requireAuth, session } = useSentiz();
  const myRank = session ? rankedProfiles.find(p => p.id === session.user.id) : null;
  const targetRank = myRank && myRank.rank > 1 ? rankedProfiles[myRank.rank - 2] : null;
  
  return (
    <section className="py-24 bg-primary text-black relative overflow-hidden" id="classement">
       <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
       <div className="container relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
             <div className="max-w-xl">
                <div className="eyebrow text-black/70 mb-4 tracking-widest">Classement</div>
                <h2 className="text-6xl md:text-8xl font-display font-bold uppercase leading-[0.85] tracking-tight">Le Tableau<br/>Des <span className="text-white">Chefs.</span></h2>
             </div>
             <div className="max-w-sm text-black/80 font-medium text-lg leading-snug">
                Les sorties réelles font grimper au classement. Rentre tes kilomètres et arrache la première place.
             </div>
          </div>

          {session && myRank ? (
             <div className="bg-black text-white p-6 md:p-8 rounded-2xl mb-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl border border-black/20">
                <div className="flex items-center gap-6">
                   <div className="w-20 h-20 bg-primary text-black font-display text-4xl font-bold flex items-center justify-center rounded-full shadow-[0_0_30px_rgba(255,91,26,0.3)]">#{myRank.rank}</div>
                   <div>
                      <h4 className="font-display text-3xl font-bold uppercase m-0 leading-none">Ta position</h4>
                      <p className="text-zinc-400 mt-2 font-medium">{myRank.distance} km avalés ce mois-ci</p>
                   </div>
                </div>
                {targetRank ? (
                   <div className="md:text-right border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8 w-full md:w-auto">
                      <p className="text-primary font-bold text-lg mb-1">Objectif : +{Math.ceil(targetRank.distance - myRank.distance)} km</p>
                       <p className="text-sm text-zinc-400">pour passer devant {targetRank.profile?.pseudo || 'le prochain rider'}</p>
                   </div>
                ) : (
                   <div className="md:text-right border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8 w-full md:w-auto">
                      <p className="text-primary font-bold text-lg mb-1">Leader incontesté</p>
                      <p className="text-sm text-zinc-400">Garde le rythme pour rester au top.</p>
                   </div>
                )}
             </div>
          ) : (
             <div className="bg-black text-white p-10 rounded-2xl mb-12 text-center border border-black/20 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
                <h4 className="font-display text-4xl font-bold uppercase mb-4">Rejoins la meute</h4>
                <p className="text-zinc-400 mb-8 max-w-md mx-auto text-lg">Crée un compte pour enregistrer tes sorties et apparaître dans le classement officiel de la région.</p>
                <button onClick={() => requireAuth('signup')} className="bg-primary text-black font-bold uppercase tracking-wider px-8 py-4 hover:bg-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,91,26,0.4)]">Créer mon profil</button>
             </div>
          )}

          <div className="bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl text-white">
             <div className="grid grid-cols-12 gap-4 p-4 md:p-6 text-xs font-bold uppercase tracking-widest text-zinc-500 border-b border-white/5 bg-zinc-900/50">
                <div className="col-span-2 md:col-span-1">Rang</div>
                <div className="col-span-7 md:col-span-8">Rider</div>
                <div className="col-span-3 text-right">Distance</div>
             </div>
             <div className="divide-y divide-white/5">
                {rankedProfiles.slice(0, 10).map((rp, i) => (
                   <div key={rp.id} className="grid grid-cols-12 gap-4 items-center p-4 md:p-6 hover:bg-white/5 transition-colors group">
                      <div className="col-span-2 md:col-span-1 font-display text-2xl md:text-3xl text-zinc-600 font-bold group-hover:text-primary transition-colors">{(i+1).toString().padStart(2, '0')}</div>
                      <div className="col-span-7 md:col-span-8 flex items-center gap-4">
                         <img src={rp.profile?.avatar_url || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%231a1a1a'/%3E%3Ctext x='50' y='65' font-family='sans-serif' font-size='40' font-weight='bold' text-anchor='middle' fill='%23ff5b1a'%3E${rp.profile?.pseudo?.charAt(0).toUpperCase() || 'R'}%3C/text%3E%3C/svg%3E`} className="w-12 h-12 rounded-full object-cover bg-zinc-800 border border-white/10" alt=""/>
                         <div className="min-w-0">
                            <div className="font-bold text-lg truncate group-hover:text-white text-zinc-200">{rp.profile?.pseudo || 'Rider anonyme'}</div>
                            <div className="text-xs text-zinc-500 truncate">{rp.profile?.ville || 'Spot inconnu'}</div>
                         </div>
                      </div>
                      <div className="col-span-3 text-right font-display text-2xl md:text-3xl font-bold text-white group-hover:text-primary transition-colors">
                         {rp.distance} <span className="text-sm text-zinc-500 font-sans tracking-widest uppercase">km</span>
                      </div>
                   </div>
                ))}
             </div>
             {rankedProfiles.length === 0 && (
                <div className="p-16 text-center text-zinc-500 text-lg flex flex-col items-center gap-4 bg-zinc-900/30">
                   <Trophy size={32} className="opacity-20" />
                   Aucune trace enregistrée ce mois-ci.<br/>Sois le premier à ouvrir la piste.
                </div>
             )}
          </div>
       </div>
    </section>
  );
}

export function Progression() {
   const { setActivityOpen, requireAuth } = useSentiz();
   return (
      <section className="py-24 bg-zinc-950 text-white relative border-t border-white/5 overflow-hidden">
         <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
         <div className="container grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
               <div className="eyebrow mb-6 tracking-widest text-primary">Le Momentum</div>
               <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold uppercase leading-[0.85] tracking-tight mb-8">Une sortie<br/>Peut tout<br/><span className="text-zinc-600">Changer.</span></h2>
               <p className="text-zinc-400 text-lg mb-10 max-w-md leading-relaxed">Quelques kilomètres arrachés en fin de journée suffisent souvent à gagner des places précieuses en fin de mois. Ne lâche rien.</p>
               <button onClick={() => { if(requireAuth()) setActivityOpen(true); }} className="button-primary text-lg px-8 py-4 shadow-[0_0_20px_rgba(255,91,26,0.2)] hover:shadow-[0_0_30px_rgba(255,91,26,0.4)]">
                  En selle <ArrowRight className="inline ml-2"/>
               </button>
            </div>
            <div className="relative z-10 perspective-1000">
               <div className="card-brutal rounded-2xl p-10 flex flex-col items-center justify-center text-center transform md:rotate-y-[-10deg] md:rotate-x-[5deg] hover:rotate-0 transition-transform duration-500 shadow-2xl border-zinc-800 bg-zinc-900/90 backdrop-blur-xl">
                  <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-8 border-b border-white/10 pb-4 w-full">Exemple de progression</div>
                  <div className="flex items-center justify-center gap-6 md:gap-10 mb-8">
                     <div className="flex flex-col items-center">
                        <span className="text-sm text-zinc-500 uppercase tracking-widest font-bold mb-2">Hier</span>
                        <div className="text-5xl md:text-6xl font-display font-bold text-zinc-600 line-through decoration-primary/40 decoration-4">#12</div>
                     </div>
                     <ArrowRight className="text-primary w-8 h-8 md:w-10 md:h-10 mt-6" />
                     <div className="flex flex-col items-center">
                        <span className="text-sm text-primary uppercase tracking-widest font-bold mb-2">Aujourd'hui</span>
                        <div className="text-7xl md:text-8xl font-display font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">#8</div>
                     </div>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 px-5 py-2.5 rounded-full font-bold uppercase tracking-widest text-sm mb-6 shadow-[0_0_15px_rgba(255,91,26,0.2)] animate-pulse">
                     <ArrowUp size={18} strokeWidth={3} /> +4 places
                  </div>
                  <p className="text-zinc-400 font-medium">Sortie de 24 km enregistrée ce matin.</p>
               </div>
            </div>
         </div>
      </section>
   )
}

export function FAQSection() {
   const faqs = [
      { q: "Sentiz est-il gratuit ?", a: "Oui, la création de compte, l'accès au classement et aux spots sont totalement gratuits. Le VTT appartient à tout le monde." },
      { q: "Comment fonctionne la suggestion de spots ?", a: "Notre outil croise ton niveau et ta région pour te sortir la meilleure option du jour, en se basant sur les avis de la meute." },
       { q: "Mes statistiques sont-elles publiques ?", a: "Ton pseudo, ton rang et ton kilométrage mensuel apparaissent dans le classement. Les données de sortie utilisées pour ces totaux restent limitées à la distance, au dénivelé et à la date." },
      { q: "Comment sont validés les kilomètres ?", a: "Pour l'instant, c'est basé sur la confiance. Ajoute tes sorties manuellement après ton run. Les tricheurs se mentent à eux-mêmes." },
      { q: "Sentiz fonctionne-t-il avec tout type de VTT ?", a: "Enduro, DH, XC, e-VTT... Toutes les montures sont acceptées tant que l'esprit freeride est là." },
       { q: "Dois-je garder l'application ouverte en roulant ?", a: "Non. Enregistre simplement ta sortie une fois rentré : Sentiz n'a pas besoin de rester ouvert sur le sentier." }
   ];

   return (
      <section className="py-24 bg-zinc-950 border-t border-white/5" id="faq">
         <div className="container max-w-4xl">
            <div className="text-center mb-16">
               <div className="eyebrow mb-4">Questions fréquentes</div>
               <h2 className="text-5xl font-display font-bold uppercase">Le coin <span className="text-primary">Matos.</span></h2>
            </div>
            
            <div className="grid gap-4">
               {faqs.map((faq, i) => (
                  <details key={i} className="group bg-zinc-900 border border-white/5 rounded-xl overflow-hidden">
                     <summary className="flex justify-between items-center font-bold cursor-pointer p-6 list-none hover:bg-white/5 transition-colors">
                        <span className="text-lg">{faq.q}</span>
                        <ChevronDown className="group-open:rotate-180 transition-transform text-primary" />
                     </summary>
                     <div className="p-6 pt-0 text-zinc-400 leading-relaxed border-t border-white/5 bg-black/20">
                        {faq.a}
                     </div>
                  </details>
               ))}
            </div>
            
            <div className="mt-16 text-center text-zinc-500 italic text-sm flex items-center justify-center gap-2">
               <Mountain size={14} className="text-primary" /> 
               Sentiz encourage une pratique du VTT respectueuse des sentiers et des autres usagers.
            </div>
         </div>
      </section>
   )
}
