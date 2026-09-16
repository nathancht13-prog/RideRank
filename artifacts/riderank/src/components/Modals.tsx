import React, { useState } from 'react';
import { X, MapPin, Timer, Gauge, Trophy, Share2, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useBikeRank } from '../BikeRankContext';

function friendlyAuthError(message: string) {
  const value = message.toLowerCase();
  if (value.includes('already registered') || value.includes('already been registered')) return 'Cet e-mail est déjà utilisé.';
  if (value.includes('invalid login credentials')) return 'E-mail ou mot de passe incorrect.';
  if (value.includes('password')) return 'Le mot de passe doit contenir entre 6 et 8 caractères.';
  if (value.includes('email')) return 'Vérifie le format de ton adresse e-mail.';
  return 'Une erreur est survenue. Réessaie dans un instant.';
}

export function AuthModal() {
  const { authOpen, setAuthOpen, authMode, setAuthMode, setNotice } = useBikeRank();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!authOpen) return null;

  const submitAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get('email') ?? '').trim();
    const password = String(form.get('password') ?? '');
    const pseudoRaw = String(form.get('pseudo') ?? '').trim();
    const pseudo = pseudoRaw.replace(/^@/, '').slice(0, 30);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Saisis une adresse e-mail valide.');
    if (password.length < 6 || password.length > 8) return setError('Le mot de passe doit contenir entre 6 et 8 caractères.');
    if (authMode === 'signup' && (pseudo.length < 2 || pseudo.length > 30)) return setError('Le pseudo doit contenir entre 2 et 30 caractères.');
    
    setBusy(true); setError('');
    const result = authMode === 'signup'
      ? await supabase.auth.signUp({ email, password, options: { data: { pseudo } } })
      : await supabase.auth.signInWithPassword({ email, password });
    
    setBusy(false);
    if (result.error) return setError(friendlyAuthError(result.error.message));
    
    setAuthOpen(false);
    setNotice(authMode === 'signup' && !result.data.session ? 'Compte créé. Consulte ton e-mail pour confirmer.' : 'Bienvenue dans la meute.');
  };

  return (
    <div className="modal-backdrop" onMouseDown={() => setAuthOpen(false)}>
      <section className="app-modal" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setAuthOpen(false)}><X size={24} /></button>
        <div className="eyebrow mb-2">Entre dans la course</div>
        <h2 className="drop-shadow-[0_0_15px_rgba(255,91,26,0.3)]">{authMode === 'login' ? 'Connexion' : 'Créer un compte'}</h2>
        
        <div className="auth-tabs">
          <button className={authMode === 'login' ? 'active' : ''} onClick={() => { setAuthMode('login'); setError(''); }}>Connexion</button>
          <button className={authMode === 'signup' ? 'active' : ''} onClick={() => { setAuthMode('signup'); setError(''); }}>Inscription</button>
        </div>
        
        <form className="modal-form" onSubmit={submitAuth}>
          {authMode === 'signup' && (
            <label>Pseudo
              <div className="input-with-prefix">
                <span className="input-prefix">@</span>
                <input name="pseudo" minLength={2} maxLength={30} required placeholder="rider73" />
              </div>
            </label>
          )}
          <label>E-mail
            <input name="email" type="email" required placeholder="toi@exemple.com" />
          </label>
          <label>Mot de passe
            <input name="password" type="password" minLength={6} maxLength={8} required placeholder="••••••••" />
            <small className="field-help">6 à 8 caractères maximum.</small>
          </label>
          {error && <p className="form-error text-lg">{error}</p>}
          <button className="button-primary w-full py-4 text-xl" disabled={busy} data-testid="submit-auth">
            {busy ? 'Patiente…' : authMode === 'login' ? 'Se connecter' : 'Créer mon profil'}
          </button>
        </form>
      </section>
    </div>
  );
}

export function ProfileModal() {
  const { profileOpen, setProfileOpen, session, profile, setNotice, refreshData } = useBikeRank();
  
  if (!profileOpen) return null;

  const submitProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session) return;
    const form = new FormData(e.currentTarget);
    const pseudo = String(form.get('pseudo') ?? '').trim().replace(/^@/, '').slice(0, 30);
    const ville = String(form.get('ville') ?? '').trim().slice(0, 80) || null;
    const bio = String(form.get('bio') ?? '').trim().slice(0, 500) || null;

    if (pseudo.length < 2) return setNotice('Le pseudo doit contenir au moins 2 caractères.');
    
    const { error } = await supabase.from('profiles').upsert({
      id: session.user.id, pseudo, ville, bio
    });
    
    if (error) setNotice('Erreur lors de la mise à jour (pseudo déjà pris ?).');
    else {
      setNotice('Profil mis à jour.');
      setProfileOpen(false);
      refreshData();
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={() => setProfileOpen(false)}>
      <section className="app-modal" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setProfileOpen(false)}><X size={24} /></button>
        <div className="eyebrow mb-2">Identité</div>
        <h2 className="drop-shadow-[0_0_15px_rgba(255,91,26,0.3)]">Ton profil</h2>
        <form className="modal-form" onSubmit={submitProfile}>
          <label>Pseudo
            <div className="input-with-prefix">
              <span className="input-prefix">@</span>
              <input name="pseudo" defaultValue={profile?.pseudo} minLength={2} maxLength={30} required />
            </div>
          </label>
          <label>Ville / Région
            <input name="ville" defaultValue={profile?.ville || ''} maxLength={80} placeholder="Où roules-tu ?" />
          </label>
          <label>Bio
            <textarea name="bio" defaultValue={profile?.bio || ''} maxLength={500} rows={3} placeholder="Ta machine, ton style..." />
          </label>
          <button className="button-primary w-full py-4 text-xl">Enregistrer</button>
        </form>
      </section>
    </div>
  );
}

export function ActivityModal() {
  const { activityOpen, setActivityOpen, setShareOpen, setLatestActivity, session, refreshData, setNotice } = useBikeRank();
  const [busy, setBusy] = useState(false);

  if (!activityOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session) return;
    const form = new FormData(e.currentTarget);
    const distance = Number(form.get('distance'));
    const elevation = Number(form.get('elevation')) || 0;
    const date = form.get('date') as string;
    const duration_m = Number(form.get('duration_m'));
    const max_speed_kmh = Number(form.get('max_speed'));
    const discipline = form.get('discipline') as string || 'Enduro';

    if (!distance || distance <= 0) return setNotice("Saisis une distance valide.");
    if (!date) return setNotice("La date est requise.");
    if (!duration_m || duration_m <= 0) return setNotice("Saisis une durée valide.");
    if (!max_speed_kmh || max_speed_kmh <= 0) return setNotice("Saisis une vitesse maximale valide.");

    setBusy(true);
    
    const activityData = {
       user_id: session.user.id,
       distance_km: distance,
       elevation_m: elevation,
       activity_date: date,
       duration_seconds: duration_m * 60,
       max_speed_kmh,
       discipline
    };
    
    const { data, error } = await supabase.from('ride_activities').insert(activityData).select().single();
    setBusy(false);

    if (error) {
       setNotice("Impossible d'ajouter la sortie.");
       console.error(error);
    } else {
       setNotice("Sortie ajoutée au classement !");
       setActivityOpen(false);
       refreshData();
       // Open share card with the newly created activity
       if (data) {
           setLatestActivity(data as any);
           setShareOpen(true);
       }
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={() => setActivityOpen(false)}>
      <section className="app-modal" role="dialog" aria-modal="true" onMouseDown={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setActivityOpen(false)}><X size={24} /></button>
        <div className="eyebrow mb-2">Nouvelle trace</div>
        <h2 className="drop-shadow-[0_0_15px_rgba(255,91,26,0.3)]">Ajouter une sortie</h2>
        <p className="text-lg text-zinc-400 font-medium mb-8">Les kilomètres réels font grimper ton rang. Sois honnête avec toi-même.</p>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label>Date de la sortie
            <input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} max={new Date().toISOString().split('T')[0]} />
          </label>
          <div className="grid grid-cols-2 gap-4">
             <label>Distance (km)
               <input name="distance" type="number" step="0.1" min="0.1" max="500" required placeholder="Ex: 24.5" />
             </label>
             <label>Dénivelé D+ (m)
               <input name="elevation" type="number" step="1" min="0" max="10000" placeholder="Ex: 850" />
             </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <label>Durée (min)
                <input name="duration_m" type="number" min="1" max="1000" required placeholder="Ex: 45" />
             </label>
             <label>Vitesse Max (km/h)
                <input name="max_speed" type="number" step="0.1" min="0.1" max="150" required placeholder="Ex: 38" />
             </label>
          </div>
          <label>Discipline
             <select name="discipline" defaultValue="Enduro">
                <option value="Enduro">Enduro</option>
                <option value="DH">DH</option>
                <option value="XC">XC</option>
                 <option value="e-VTT">e-VTT</option>
                 <option value="Bike park">Bike park</option>
             </select>
          </label>
          <button className="button-primary w-full mt-4 py-4 text-xl" disabled={busy} data-testid="submit-activity">
             {busy ? 'Enregistrement...' : 'Valider la sortie'}
          </button>
        </form>
      </section>
    </div>
  );
}

export function ReviewModal() {
  const { reviewOpen, setReviewOpen, session, selectedSpot, setNotice, refreshData } = useBikeRank();
  
  if (!reviewOpen) return null;

  const submitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session || !selectedSpot) return;
    const form = new FormData(e.currentTarget);
    const rating = Number(form.get('rating'));
    const comment = String(form.get('comment') ?? '').trim().slice(0, 1000);

    if (rating < 1 || rating > 5) return setNotice('Choisis une note entre 1 et 5.');

    const { error } = await supabase.from('spot_reviews').upsert(
      { user_id: session.user.id, spot_id: selectedSpot, rating, comment },
      { onConflict: 'user_id,spot_id' }
    );

    if (error) setNotice('Erreur lors de la publication de l’avis.');
    else {
      setNotice('Avis enregistré.');
      setReviewOpen(false);
      refreshData();
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={() => setReviewOpen(false)}>
      <section className="app-modal" role="dialog" aria-modal="true" onMouseDown={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setReviewOpen(false)}><X size={24} /></button>
        <div className="eyebrow mb-2">Avis terrain</div>
        <h2 className="drop-shadow-[0_0_15px_rgba(255,91,26,0.3)]">Note ce spot</h2>
        <form className="modal-form" onSubmit={submitReview}>
          <label>Note
            <select name="rating" defaultValue="5">
              {[5,4,3,2,1].map(v => <option key={v} value={v}>{v} / 5</option>)}
            </select>
          </label>
          <label>Commentaire
            <textarea name="comment" maxLength={1000} rows={4} placeholder="Conditions, difficulté, état de la trace..." />
          </label>
          <button className="button-primary w-full mt-4 py-4 text-xl">Publier l'avis</button>
        </form>
      </section>
    </div>
  );
}

export function ShareCardModal() {
   const { shareOpen, setShareOpen, latestActivity, activities, session } = useBikeRank();
   
   if (!shareOpen) return null;

   const myActivities = activities.filter(a => a.user_id === session?.user?.id).sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
   const activityToShow = latestActivity || myActivities[0];

   if (!activityToShow) {
      return (
         <div className="modal-backdrop" onMouseDown={() => setShareOpen(false)}>
           <section className="app-modal" role="dialog" aria-modal="true" onMouseDown={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShareOpen(false)}><X size={24} /></button>
              <h2>Aucune trace</h2>
              <p>Tu n'as pas encore enregistré de sortie.</p>
           </section>
         </div>
      );
   }

   const formatTime = (sec: number) => {
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = sec % 60;
      if (h > 0) return `${h}h ${m}m`;
      if (m > 0) return `${m}m ${s}s`;
      return `${s}s`;
   };
   
   // Parse format matching the exact mockup
   const timeStr = formatTime(activityToShow.duration_seconds || 0);
   const categoryActivities = activities
      .filter((activity) => activity.discipline === activityToShow.discipline)
      .sort((a, b) => Number(b.max_speed_kmh || 0) - Number(a.max_speed_kmh || 0));
   const rankNumber = Math.max(1, categoryActivities.findIndex((activity) => activity.id === activityToShow.id) + 1);

   const createStatsFile = () => {
      const distance = String(activityToShow.distance_km).replace('.', ',');
      const speed = String(activityToShow.max_speed_kmh || 0).replace('.', ',');
      const discipline = activityToShow.discipline || 'Enduro';
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
        <defs>
          <radialGradient id="glow"><stop stop-color="#ff5b1a" stop-opacity=".18"/><stop offset="1" stop-color="#0c0906" stop-opacity="0"/></radialGradient>
          <filter id="lineGlow"><feGaussianBlur stdDeviation="9" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <rect width="1080" height="1920" fill="#0c0906"/>
        <circle cx="540" cy="940" r="500" fill="url(#glow)"/>
        <g font-family="Barlow Condensed,Arial,sans-serif" text-anchor="middle">
          <text x="540" y="190" font-size="116" font-weight="900" font-style="italic" fill="#fff">Bike <tspan fill="#ff5b1a">Rank</tspan></text>
          <text x="280" y="390" font-size="34" font-weight="800" letter-spacing="8" fill="#ff5b1a">DISTANCE</text>
          <text x="800" y="390" font-size="34" font-weight="800" letter-spacing="8" fill="#ff5b1a">TEMPS TOTAL</text>
          <text x="280" y="520" font-size="120" font-weight="900" fill="#fff">${distance}<tspan font-size="62" fill="#ff5b1a"> km</tspan></text>
          <text x="800" y="520" font-size="112" font-weight="900" fill="#fff">${timeStr}</text>
          <line x1="540" y1="350" x2="540" y2="535" stroke="#ff5b1a" stroke-opacity=".42" stroke-width="3"/>
          <rect x="120" y="650" width="840" height="360" rx="54" fill="#090604" stroke="#ff5b1a" stroke-width="5"/>
          <text x="540" y="750" font-size="34" font-weight="800" letter-spacing="8" fill="#ff5b1a">VITESSE MAXIMALE</text>
          <text x="540" y="920" font-size="170" font-weight="900" fill="#fff">${speed}<tspan font-size="80" fill="#ff5b1a"> km/h</tspan></text>
          <text x="540" y="1210" font-size="145" font-weight="900" font-style="italic" fill="#ff5b1a">${rankNumber}e</text>
          <text x="540" y="1290" font-size="42" font-weight="800" letter-spacing="11" fill="#ff5b1a">PLUS RAPIDE EN ${discipline.toUpperCase()}</text>
        </g>
        <path d="M75 1690 C170 1640 225 1560 320 1585 S455 1450 555 1515 S715 1600 790 1580 S920 1695 1005 1655" fill="none" stroke="#ff5b1a" stroke-width="9" stroke-linecap="round" filter="url(#lineGlow)"/>
        <circle cx="75" cy="1690" r="17" fill="#ffcc00"/><circle cx="1005" cy="1655" r="17" fill="#ffcc00"/>
      </svg>`;
      return new File([new Blob([svg], { type: 'image/svg+xml' })], `bike-rank-${activityToShow.id}.svg`, { type: 'image/svg+xml' });
   };

   const downloadStats = () => {
      const file = createStatsFile();
      const url = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      link.click();
      URL.revokeObjectURL(url);
   };

   const handleShare = async () => {
      const file = createStatsFile();
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
         try {
            await navigator.share({
               title: 'Mes stats Bike Rank',
               text: `J'ai roulé ${activityToShow.distance_km} km en ${activityToShow.discipline || 'Enduro'} ! Voir mon rang sur Bike Rank.`,
               files: [file],
            });
         } catch(e) {}
      } else {
         downloadStats();
      }
   };

   return (
      <div className="modal-backdrop" onMouseDown={() => setShareOpen(false)}>
          <div className="flex flex-col items-center w-[min(380px,calc(100vw-24px))] shrink-0" onMouseDown={e => e.stopPropagation()}>
            <div className="w-full flex justify-between items-center mb-6 text-white px-4">
               <button onClick={() => setShareOpen(false)} className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors">
                  <X size={24} />
               </button>
               <div className="font-bold uppercase tracking-widest text-base">Partage tes stats</div>
               <div className="flex gap-2">
                  <button onClick={downloadStats} aria-label="Télécharger la carte" className="bg-white/10 text-white hover:bg-white/20 p-3 rounded-full transition-colors"><Download size={24} /></button>
                  <button onClick={handleShare} aria-label="Partager la carte" className="bg-primary text-black hover:bg-white p-3 rounded-full transition-colors shadow-[0_0_15px_rgba(255,91,26,0.5)]"><Share2 size={24} fill="currentColor" /></button>
               </div>
            </div>

            {/* Fixed aspect ratio tall story card */}
             <div className="relative w-full aspect-[9/16] bg-[#0c0906] p-8 flex flex-col justify-start items-center text-center overflow-hidden shadow-2xl" style={{ border: '1px solid rgba(255, 150, 0, 0.4)', borderRadius: '32px', boxShadow: '0 0 40px rgba(255, 100, 0, 0.2), inset 0 0 20px rgba(255, 160, 20, 0.1)' }} id="share-card">
               
               {/* Background Glow */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>

               <img src="/brand/bike-rank-logo-transparent.png" alt="Bike Rank" className="h-16 object-contain mt-8 z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />

               <div className="flex justify-between items-center w-full mt-14 z-10">
                  <div className="flex flex-col items-center flex-1">
                     <div className="flex items-center gap-2 text-[#ff5b1a] text-sm font-bold tracking-widest uppercase mb-3">
                        <MapPin size={20} strokeWidth={2.5} className="drop-shadow-[0_0_8px_rgba(255,91,26,0.6)]" /> Distance
                     </div>
                     <div className="text-[56px] leading-none font-bold text-white tracking-tight">
                        {activityToShow.distance_km.toString().replace('.', ',')} <span className="text-3xl text-[#ff5b1a] font-medium ml-1">km</span>
                     </div>
                  </div>
                  <div className="w-[1px] h-20 bg-white/10 mx-2"></div>
                  <div className="flex flex-col items-center flex-1">
                     <div className="flex items-center gap-2 text-[#ff5b1a] text-sm font-bold tracking-widest uppercase mb-3">
                        <Timer size={20} strokeWidth={2.5} /> Temps total
                     </div>
                     <div className="text-[56px] leading-none font-bold text-white tracking-tight">
                        {timeStr}
                     </div>
                  </div>
               </div>

               <div className="w-full border border-[#ff5b1a] rounded-[24px] py-8 px-6 mt-12 relative shadow-[0_0_30px_rgba(255,91,26,0.2)] flex flex-col items-center justify-center bg-[#0a0604]/80 backdrop-blur-md z-10">
                  <div className="text-[#ff5b1a] text-sm font-bold tracking-widest uppercase mb-4">Vitesse maximale</div>
                  <div className="flex items-center justify-center gap-4">
                     <Gauge className="text-[#ff5b1a] w-14 h-14 drop-shadow-[0_0_10px_rgba(255,91,26,0.5)]" strokeWidth={2.5} />
                     <div className="text-[64px] leading-none font-bold text-white tracking-tight drop-shadow-md">
                        {activityToShow.max_speed_kmh || 38} <span className="text-[40px] text-[#ff5b1a] font-medium ml-1">km/h</span>
                     </div>
                  </div>
               </div>

               <div className="flex flex-col items-center mt-12 z-10 w-full">
                  <div className="flex items-center justify-center gap-6 w-full">
                     <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#ff5b1a]/50"></div>
                     <Trophy className="text-[#ff5b1a] w-12 h-12 drop-shadow-[0_0_10px_rgba(255,91,26,0.5)]" strokeWidth={2} />
                     <div className="text-[64px] leading-none font-bold text-[#ff5b1a] drop-shadow-[0_0_15px_rgba(255,91,26,0.4)]">{rankNumber}e</div>
                     <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#ff5b1a]/50"></div>
                  </div>
                  <div className="text-[#ff5b1a] text-lg font-bold tracking-[0.2em] uppercase mt-4 text-center w-full">
                     Plus rapide en {activityToShow.discipline?.toLowerCase() || 'enduro'}
                  </div>
               </div>

               <div className="mt-auto absolute bottom-0 left-0 w-full h-[140px] pointer-events-none z-0">
                  <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full drop-shadow-[0_0_12px_rgba(255,91,26,0.9)] overflow-visible">
                     <path d="M 5 35 Q 15 25 25 18 T 45 6 T 60 18 T 80 30 L 95 35" fill="none" stroke="#ff5b1a" strokeWidth="1.2" strokeLinecap="round" />
                     <circle cx="5" cy="35" r="2" fill="#ffcc00" />
                     <circle cx="95" cy="35" r="2" fill="#ffcc00" />
                  </svg>
               </div>
            </div>
            
             <p className="text-zinc-500 text-base mt-6 text-center">Télécharge la story ou partage-la directement depuis ton téléphone.</p>
         </div>
      </div>
   );
}

export function Modals() {
  return (
    <>
      <AuthModal />
      <ProfileModal />
      <ActivityModal />
      <ReviewModal />
      <ShareCardModal />
    </>
  );
}