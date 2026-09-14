import { useEffect, useMemo, useState, type FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  ArrowRight, Check, ChevronDown, Flame, LogOut, MapPin, Menu,
  Mountain, Pencil, Share2, Star, Trophy, Users, X, Zap,
} from 'lucide-react';
import { supabase } from './lib/supabase';

type Spot = {
  id: string; name: string; region: string; practice_type: string;
  description: string; average_rating: number; photo_url: string | null;
  elevation_m: number | null;
};
type Challenge = {
  id: string; title: string; description: string; spot_id: string | null;
  photo_url: string | null; closes_at: string;
};
type Profile = {
  id: string; pseudo: string; avatar_url: string | null; ville: string | null;
  bio: string | null; created_at: string;
};
type Vote = { user_id: string; challenge_id: string; is_cap: boolean };
type Review = { user_id: string; spot_id: string; rating: number; comment: string };

const avatarFallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%231a1a1a'/%3E%3Ccircle cx='50' cy='38' r='16' fill='%23ff5b1a'/%3E%3Cpath d='M18 92Q50 56 82 92' fill='%23ff5b1a'/%3E%3C/svg%3E";
const heroPhoto = '/images/tim-foster-qrIy8dBzCVU-unsplash_1789402010865.jpg';
const challengePhoto = '/images/tim-foster-k_76BsRGSWM-unsplash_1789402010866.jpg';

function friendlyAuthError(message: string) {
  const value = message.toLowerCase();
  if (value.includes('already registered') || value.includes('already been registered')) return 'Cet e-mail est déjà utilisé.';
  if (value.includes('invalid login credentials')) return 'E-mail ou mot de passe incorrect.';
  if (value.includes('password')) return 'Le mot de passe doit contenir au moins 8 caractères.';
  if (value.includes('email')) return 'Vérifie le format de ton adresse e-mail.';
  return 'Une erreur est survenue. Réessaie dans un instant.';
}

function Brand() {
  return <a href="#top" className="brand"><span className="brand-mark">S</span><span>Senti<i>z</i></span></a>;
}

export default function SentizApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authError, setAuthError] = useState('');
  const [authBusy, setAuthBusy] = useState(false);
  const [filter, setFilter] = useState('Tous');
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notice, setNotice] = useState('');

  const loadPublicData = async () => {
    const [spotsResult, challengesResult, votesResult, profilesResult, reviewsResult] = await Promise.all([
      supabase.from('spots').select('*').order('average_rating', { ascending: false }),
      supabase.from('challenges').select('*').order('closes_at', { ascending: true }),
      supabase.from('challenge_votes').select('user_id,challenge_id,is_cap'),
      supabase.from('profiles').select('*'),
      supabase.from('spot_reviews').select('user_id,spot_id,rating,comment'),
    ]);
    const error = spotsResult.error || challengesResult.error || votesResult.error || profilesResult.error || reviewsResult.error;
    if (error) setNotice('Impossible de charger les données pour le moment.');
    setSpots((spotsResult.data ?? []) as Spot[]);
    setChallenges((challengesResult.data ?? []) as Challenge[]);
    setVotes((votesResult.data ?? []) as Vote[]);
    setReviews((reviewsResult.data ?? []) as Review[]);
    const profiles = (profilesResult.data ?? []) as Profile[];
    setProfiles(profiles);
    if (session?.user) setProfile(profiles.find((item) => item.id === session.user.id) ?? null);
    return profiles;
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) setProfile(null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    loadPublicData().finally(() => setLoading(false));
  }, [session?.user.id]);

  const visibleSpots = useMemo(
    () => filter === 'Tous' ? spots : spots.filter((spot) => spot.practice_type === filter),
    [filter, spots],
  );
  const challenge = challenges[0];
  const challengeVotes = challenge ? votes.filter((item) => item.challenge_id === challenge.id) : [];
  const capVotes = challengeVotes.filter((item) => item.is_cap).length;
  const capRatio = challengeVotes.length ? Math.round((capVotes / challengeVotes.length) * 100) : 0;
  const myVote = session && challenge ? challengeVotes.find((item) => item.user_id === session.user.id) : undefined;
  const rankedProfiles = useMemo(() => {
    const ids = new Set([...votes.map((v) => v.user_id), ...reviews.map((r) => r.user_id)]);
    return Array.from(ids).map((id) => ({
      id,
      points: votes.filter((v) => v.user_id === id).length * 10 + reviews.filter((r) => r.user_id === id).length * 25,
    })).sort((a, b) => b.points - a.points);
  }, [votes, reviews]);

  const requireAuth = (mode: 'login' | 'signup' = 'login') => {
    if (session) return true;
    setAuthMode(mode); setAuthOpen(true); return false;
  };

  const submitAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '').trim();
    const password = String(form.get('password') ?? '');
    const pseudo = String(form.get('pseudo') ?? '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setAuthError('Saisis une adresse e-mail valide.');
    if (password.length < 8) return setAuthError('Le mot de passe doit contenir au moins 8 caractères.');
    if (authMode === 'signup' && (pseudo.length < 2 || pseudo.length > 30)) return setAuthError('Le pseudo doit contenir entre 2 et 30 caractères.');
    setAuthBusy(true); setAuthError('');
    const result = authMode === 'signup'
      ? await supabase.auth.signUp({ email, password, options: { data: { pseudo } } })
      : await supabase.auth.signInWithPassword({ email, password });
    setAuthBusy(false);
    if (result.error) return setAuthError(friendlyAuthError(result.error.message));
    setAuthOpen(false);
    setNotice(authMode === 'signup' && !result.data.session ? 'Compte créé. Consulte ton e-mail pour confirmer ton inscription.' : 'Bienvenue sur Sentiz.');
  };

  const castVote = async (isCap: boolean) => {
    if (!requireAuth() || !challenge || myVote) return;
    const optimistic: Vote = { user_id: session!.user.id, challenge_id: challenge.id, is_cap: isCap };
    setVotes((current) => [...current, optimistic]);
    const { error } = await supabase.from('challenge_votes').insert(optimistic);
    if (error) {
      setVotes((current) => current.filter((item) => item !== optimistic));
      setNotice('Le vote n’a pas pu être enregistré.');
    } else setNotice('Vote enregistré. On se retrouve en bas.');
  };

  const submitProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session) return;
    const form = new FormData(event.currentTarget);
    const values = {
      id: session.user.id,
      pseudo: String(form.get('pseudo') ?? '').trim().slice(0, 30),
      ville: String(form.get('ville') ?? '').trim().slice(0, 80) || null,
      bio: String(form.get('bio') ?? '').trim().slice(0, 500) || null,
    };
    if (values.pseudo.length < 2) return setNotice('Le pseudo doit contenir au moins 2 caractères.');
    const { data, error } = await supabase.from('profiles').upsert(values).select().single();
    if (error) setNotice('Ce pseudo est peut-être déjà utilisé.');
    else { setProfile(data as Profile); setProfileOpen(false); setNotice('Profil mis à jour.'); }
  };

  const submitReview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session || !selectedSpot) return;
    const form = new FormData(event.currentTarget);
    const rating = Number(form.get('rating'));
    const comment = String(form.get('comment') ?? '').trim().slice(0, 1000);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return setNotice('Choisis une note entre 1 et 5.');
    const { error } = await supabase.from('spot_reviews').upsert(
      { user_id: session.user.id, spot_id: selectedSpot, rating, comment },
      { onConflict: 'user_id,spot_id' },
    );
    if (error) setNotice('Ton avis n’a pas pu être enregistré.');
    else { setReviewOpen(false); setNotice('Ton avis est enregistré.'); await loadPublicData(); }
  };

  const profilesById = new Map(profiles.map((item) => [item.id, item]));
  const leaderboard = rankedProfiles.map((rank) => ({ ...rank, profile: profilesById.get(rank.id) })).filter((item) => item.profile);

  return (
    <div className="site-shell" id="top">
      <header className="site-header">
        <div className="container nav">
          <Brand />
          <nav className="nav-links"><a href="#spots">Les spots</a><a href="#defis">Les défis</a><a href="#communaute">La communauté</a></nav>
          <div className="nav-actions">
            {session ? (
              <div className="account-wrap">
                <button className="account-button" onClick={() => setAccountOpen((open) => !open)}>
                  <img src={profile?.avatar_url || avatarFallback} alt="" /> <span>{profile?.pseudo || 'Mon profil'}</span><ChevronDown size={14} />
                </button>
                {accountOpen && <div className="account-menu"><button onClick={() => { setProfileOpen(true); setAccountOpen(false); }}><Pencil size={14} /> Mon profil</button><button onClick={() => supabase.auth.signOut()}><LogOut size={14} /> Se déconnecter</button></div>}
              </div>
            ) : <button className="nav-cta" onClick={() => { setAuthMode('signup'); setAuthOpen(true); }}>Rejoindre</button>}
            <button className="menu-button" aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy"><div className="hero-kicker"><span className="kicker-line" /> La communauté VTT qui ne reste pas en bas</div><h1>Trouve.<span>Roule.</span>Note.</h1><p className="hero-lede">Sentiz, c’est la carte vivante des traces qui méritent vraiment une remontée.</p><div className="hero-buttons"><a className="button-primary" href="#spots">Explorer les spots <ArrowRight size={15} /></a><a className="button-ghost" href="#defis">Voter pour un run</a></div></div>
            <div className="hero-art"><div className="poster"><img src={heroPhoto} alt="Rider en action" /><div className="poster-label">RIDE<br />HARD<br /><span>STAY<br />HUMBLE</span></div></div></div>
          </div>
        </section>
        <div className="ticker"><div className="ticker-track"><span>Données live <b>·</b> Supabase</span><span>Défi du jour <b>·</b> {capRatio}% Cap</span><span>{spots.length} spots ouverts</span><span>{votes.length} votes enregistrés</span><span>Données live <b>·</b> Supabase</span><span>Défi du jour <b>·</b> {capRatio}% Cap</span><span>{spots.length} spots ouverts</span><span>{votes.length} votes enregistrés</span></div></div>

        <section className="section dark-panel" id="spots">
          <div className="container"><div className="section-head"><div><div className="eyebrow">Le palmarès local</div><h2 className="section-title">Les spots<br />qui parlent.</h2><p className="section-intro">Notes et avis viennent désormais directement des riders Sentiz.</p></div></div>
            <div className="filter-row">{['Tous', 'Bike park', 'Enduro', 'DH'].map((item) => <button key={item} className={`filter-chip ${filter === item ? 'active' : ''}`} onClick={() => setFilter(item)}>{item}</button>)}</div>
            {loading ? <p>Chargement des spots…</p> : <div className="spot-grid">{visibleSpots.map((spot, index) => <article className="spot-card" key={spot.id}>
              <img src={spot.photo_url || avatarFallback} alt={`Spot ${spot.name}`} className="spot-visual" />
              <div className="spot-rating">{Number(spot.average_rating).toFixed(1)}<small>/ 5</small></div>
              <div className="spot-content"><div className="spot-tag">#{String(index + 1).padStart(2, '0')} · {spot.practice_type}</div><h3>{spot.name}</h3><p className="spot-location"><MapPin size={12} /> {spot.region}</p><div className="spot-details"><span><Users size={12} /> {reviews.filter((r) => r.spot_id === spot.id).length} avis</span><span><Mountain size={12} /> {spot.elevation_m} m</span></div><button className="inline-action" onClick={() => { setSelectedSpot(spot.id); if (requireAuth()) setReviewOpen(true); }}><Star size={13} /> Noter ce spot</button></div>
            </article>)}</div>}
          </div>
        </section>

        <section className="section dark-panel" id="defis">
          <div className="container challenge-layout"><div className="challenge-prompt"><div className="eyebrow">Le rituel avant la descente</div><h2>Alors, <span>Cap</span><br />ou pas Cap ?</h2><p>La communauté tranche avant que tu ne lâches les freins.</p><div className="hero-note"><Zap size={15} /><strong>{challengeVotes.length} votes</strong> enregistrés</div></div>
            <div className="vote-card"><div className="vote-rider"><img src={challenge?.photo_url || challengePhoto} alt="Défi VTT" /></div><div className="vote-question">{challenge?.title || 'Chargement du défi…'}</div><div className="vote-meta"><span><Flame size={13} /> Défi du jour</span><span>{challenge ? new Date(challenge.closes_at).toLocaleDateString('fr-FR') : ''}</span></div><div className="vote-buttons"><button disabled={!!myVote} className={`vote-button cap ${myVote?.is_cap ? 'selected' : ''}`} onClick={() => castVote(true)}>CAP</button><button disabled={!!myVote} className={`vote-button pas ${myVote && !myVote.is_cap ? 'selected' : ''}`} onClick={() => castVote(false)}>PAS CAP</button></div>{myVote && <p className="vote-thanks">Ton vote est enregistré.</p>}<div className="bar-label"><span>La meute a parlé</span><span>{capRatio}% Cap</span></div><div className="vote-bar"><div className="vote-bar-fill" style={{ width: `${capRatio}%` }} /></div></div>
          </div>
        </section>

        <section className="section community" id="communaute"><div className="container community-grid"><div><div className="eyebrow">Le classement</div><h2 className="section-title">Les riders<br />font le spot.</h2><p className="section-intro">Un avis vaut 25 points. Un vote vaut 10 points.</p><button className="button-ghost community-cta" onClick={() => session ? setProfileOpen(true) : requireAuth('signup')}>Créer mon profil <ArrowRight size={15} /></button></div><div className="leaderboard">{leaderboard.length ? leaderboard.map((item, index) => <div className="leader-row" key={item.id}><span className="leader-rank">{String(index + 1).padStart(2, '0')}</span><img className="avatar" src={item.profile!.avatar_url || avatarFallback} alt="" /><span className="leader-info"><strong>{item.profile!.pseudo}</strong><span>{item.profile!.ville || 'Rider Sentiz'}</span></span><span className="leader-points">{item.points}</span><Trophy size={15} /></div>) : <div className="empty-leader"><Trophy /> Le premier classement se construit avec vos votes et vos avis.</div>}</div></div></section>
      </main>

      <footer className="footer"><div className="container footer-inner"><Brand /><p>Fait pour celles et ceux qui prennent la ligne d’à côté.</p><button className="share-button" onClick={() => navigator.clipboard?.writeText(location.href)}><Share2 size={14} /> Partager</button></div></footer>

      {notice && <button className="toast-notice" onClick={() => setNotice('')}><Check size={15} /> {notice}</button>}
      {authOpen && <div className="modal-backdrop" onMouseDown={() => setAuthOpen(false)}><section className="app-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" aria-label="Fermer" onClick={() => setAuthOpen(false)}><X /></button><div className="eyebrow">Entre dans la meute</div><h2 id="auth-title">{authMode === 'login' ? 'Connexion' : 'Créer un compte'}</h2><div className="auth-tabs"><button className={authMode === 'login' ? 'active' : ''} onClick={() => { setAuthMode('login'); setAuthError(''); }}>Connexion</button><button className={authMode === 'signup' ? 'active' : ''} onClick={() => { setAuthMode('signup'); setAuthError(''); }}>Inscription</button></div><form className="modal-form" onSubmit={submitAuth}>{authMode === 'signup' && <label>Pseudo<input name="pseudo" minLength={2} maxLength={30} required autoComplete="nickname" /></label>}<label>E-mail<input name="email" type="email" required autoComplete="email" /></label><label>Mot de passe<input name="password" type="password" minLength={8} required autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} /></label>{authError && <p className="form-error">{authError}</p>}<button className="button-primary" disabled={authBusy}>{authBusy ? 'Patiente…' : authMode === 'login' ? 'Se connecter' : 'Créer mon profil'}</button></form></section></div>}
      {profileOpen && <div className="modal-backdrop" onMouseDown={() => setProfileOpen(false)}><section className="app-modal" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setProfileOpen(false)}><X /></button><div className="eyebrow">Mon profil rider</div><h2>Ta trace</h2><form className="modal-form" onSubmit={submitProfile}><label>Pseudo<input name="pseudo" defaultValue={profile?.pseudo} minLength={2} maxLength={30} required /></label><label>Ville<input name="ville" defaultValue={profile?.ville || ''} maxLength={80} /></label><label>Bio<textarea name="bio" defaultValue={profile?.bio || ''} maxLength={500} rows={4} /></label><button className="button-primary">Enregistrer</button></form></section></div>}
      {reviewOpen && <div className="modal-backdrop" onMouseDown={() => setReviewOpen(false)}><section className="app-modal" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setReviewOpen(false)}><X /></button><div className="eyebrow">Avis terrain</div><h2>Note ce spot</h2><form className="modal-form" onSubmit={submitReview}><label>Note<select name="rating" defaultValue="5">{[5,4,3,2,1].map((value) => <option key={value} value={value}>{value} / 5</option>)}</select></label><label>Commentaire<textarea name="comment" maxLength={1000} rows={4} placeholder="Décris la trace, le terrain, les conditions…" /></label><button className="button-primary">Publier l’avis</button></form></section></div>}
    </div>
  );
}