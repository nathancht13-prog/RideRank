import { useMemo, useState, type FormEvent } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  Bike,
  Check,
  ChevronDown,
  Compass,
  Crosshair,
  Flame,
  Heart,
  MapPin,
  Menu,
  Mountain,
  Search,
  Share2,
  Star,
  Trophy,
  Users,
  X,
  Zap,
} from 'lucide-react';

const PHOTOS = {
  hero: '/images/tim-foster-qrIy8dBzCVU-unsplash_1789402010865.jpg',
  challenge: '/images/tim-foster-k_76BsRGSWM-unsplash_1789402010866.jpg',
  spotBikePark: '/images/jake-schumacher-r92CDGlpMQE-unsplash_1789402010866.jpg',
  spotEnduro: '/images/axel-brunst-yr22qT5pqw4-unsplash_1789402010866.jpg',
  avatarPlaceholder: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%231a1a1a'/%3E%3Cpath d='M35 40 A15 15 0 1 1 65 40 A15 15 0 1 1 35 40 M20 85 Q50 55 80 85' stroke='%23333' stroke-width='6' fill='none' stroke-linecap='round'/%3E%3C/svg%3E",
};

type Spot = {
  id: string;
  name: string;
  location: string;
  type: string;
  rating: string;
  riders: string;
  elevation: string;
  visual: string;
};

const spots: Spot[] = [
  { id: 'les-gets', name: 'Les Gets', location: 'Haute-Savoie · 74', type: 'Bike park', rating: '4.9', riders: '2 184', elevation: '1 172 m', visual: PHOTOS.spotBikePark },
  { id: 'loudenvielle', name: 'Loudenvielle', location: 'Hautes-Pyrénées · 65', type: 'Enduro', rating: '4.8', riders: '1 427', elevation: '1 440 m', visual: PHOTOS.spotEnduro },
  { id: 'morzine', name: 'Morzine', location: 'Haute-Savoie · 74', type: 'Bike park', rating: '4.7', riders: '3 086', elevation: '1 000 m', visual: PHOTOS.spotBikePark },
  { id: 'chatel', name: 'Châtel', location: 'Haute-Savoie · 74', type: 'Bike park', rating: '4.7', riders: '1 914', elevation: '1 680 m', visual: PHOTOS.spotBikePark },
  { id: 'millet', name: 'Le Semnoz', location: 'Haute-Savoie · 74', type: 'DH', rating: '4.6', riders: '936', elevation: '1 490 m', visual: PHOTOS.spotEnduro },
  { id: 'blausasc', name: 'Blausasc', location: 'Alpes-Maritimes · 06', type: 'Enduro', rating: '4.6', riders: '812', elevation: '650 m', visual: PHOTOS.spotEnduro },
];

const riders = [
  { name: 'Léa Morel', handle: '@lea_en_l’air', avatar: PHOTOS.avatarPlaceholder, city: 'Annecy', points: '1 284', rides: '47 sorties' },
  { name: 'Baptiste Rey', handle: '@bapt_trails', avatar: PHOTOS.avatarPlaceholder, city: 'Grenoble', points: '1 116', rides: '39 sorties' },
  { name: 'Nina Caron', handle: '@nina_crashless', avatar: PHOTOS.avatarPlaceholder, city: 'Lyon', points: '982', rides: '34 sorties' },
  { name: 'Théo Garnier', handle: '@theo_dh', avatar: PHOTOS.avatarPlaceholder, city: 'Chambéry', points: '914', rides: '31 sorties' },
];

const mapSpots = [
  { id: 'les-gets', label: 'Les Gets', place: 'Haute-Savoie', pos: 'pin-one' },
  { id: 'morzine', label: 'Morzine', place: 'Haute-Savoie', pos: 'pin-two' },
  { id: 'chatel', label: 'Châtel', place: 'Haute-Savoie', pos: 'pin-three' },
  { id: 'loudenvielle', label: 'Loudenvielle', place: 'Pyrénées', pos: 'pin-four' },
];

function Brand() {
  return (
    <a href="#top" className="brand" data-testid="link-brand">
      <span className="brand-mark">R</span>
      <span>Ride<i>Rank</i></span>
    </a>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState('Tous');
  const [selectedSpot, setSelectedSpot] = useState('les-gets');
  const [mapSpot, setMapSpot] = useState('les-gets');
  const [vote, setVote] = useState<'cap' | 'pas' | null>(null);
  const [capCount, setCapCount] = useState(72);
  const [leaderTab, setLeaderTab] = useState<'classement' | 'près de moi'>('classement');
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const visibleSpots = useMemo(
    () => filter === 'Tous' ? spots : spots.filter((spot) => spot.type === filter),
    [filter],
  );

  const chooseVote = (nextVote: 'cap' | 'pas') => {
    if (vote === nextVote) return;
    setVote(nextVote);
    if (nextVote === 'cap') setCapCount((count) => count + (vote === 'pas' ? 1 : 0));
    if (nextVote === 'pas' && vote === 'cap') setCapCount((count) => count - 1);
  };

  const submitWaitlist = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email.trim()) setJoined(true);
  };

  return (
    <div className="site-shell" id="top">
      <header className="site-header">
        <div className="container nav">
          <Brand />
          <nav className="nav-links" aria-label="Navigation principale">
            <a href="#spots" data-testid="link-nav-spots">Les spots</a>
            <a href="#carte" data-testid="link-nav-map">La carte</a>
            <a href="#defis" data-testid="link-nav-challenges">Les défis</a>
            <a href="#communaute" data-testid="link-nav-community">La communauté</a>
          </nav>
          <div className="nav-actions">
            <a className="nav-cta" href="#attente" data-testid="link-nav-join">Rejoindre</a>
            <button
              className="menu-button"
              type="button"
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              data-testid="button-mobile-menu"
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          <a href="#spots" onClick={() => setMenuOpen(false)} data-testid="link-mobile-spots">Les spots</a>
          <a href="#carte" onClick={() => setMenuOpen(false)} data-testid="link-mobile-map">La carte</a>
          <a href="#defis" onClick={() => setMenuOpen(false)} data-testid="link-mobile-challenges">Les défis</a>
          <a href="#communaute" onClick={() => setMenuOpen(false)} data-testid="link-mobile-community">La communauté</a>
        </div>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="hero-kicker"><span className="kicker-line" /> La communauté VTT qui ne reste pas en bas</div>
              <h1 id="hero-title">Trouve.<span>Roule.</span>Note.</h1>
              <p className="hero-lede">Les meilleurs spots ne se trouvent pas dans un guide. Ils se partagent entre riders. RideRank, c’est la carte vivante des traces qui méritent vraiment une remontée.</p>
              <div className="hero-buttons">
                <a className="button-primary" href="#spots" data-testid="button-hero-spots">Explorer les spots <ArrowRight size={15} /></a>
                <a className="button-ghost" href="#defis" data-testid="button-hero-vote">Voter pour un run</a>
              </div>
              <div className="hero-note"><span className="kicker-line" /><strong>1 842 riders</strong> roulent déjà avec nous</div>
            </div>
            <div className="hero-art" aria-label="Photo d'un rider sur un saut">
              <div className="poster">
                <img src={PHOTOS.hero} alt="Rider en action" />
                <div className="poster-label">RIDE<br />HARD<br /><span>STAY<br />HUMBLE</span></div>
                <div className="poster-meta">FR / 45.923° N · 6.869° E / RUN 042</div>
              </div>
            </div>
          </div>
          <div className="scroll-mark">Faire défiler <ChevronDown size={14} /></div>
        </section>

        <div className="ticker" aria-label="Actualités RideRank">
          <div className="ticker-track">
            <span>Nouveau spot <b>·</b> La Clusaz</span><span>Défi du jour <b>·</b> 72% Cap</span><span>1 842 riders connectés</span><span>Trace fraîche <b>·</b> Les Gets</span>
            <span>Nouveau spot <b>·</b> La Clusaz</span><span>Défi du jour <b>·</b> 72% Cap</span><span>1 842 riders connectés</span><span>Trace fraîche <b>·</b> Les Gets</span>
          </div>
        </div>

        <section className="section dark-panel" id="spots" aria-labelledby="spots-title">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="eyebrow">Le palmarès local</div>
                <h2 className="section-title" id="spots-title">Les spots<br />qui parlent.</h2>
                <p className="section-intro">Pas de classement sponsorisé. Ici, la note monte quand les riders reviennent avec de la boue sur les mollets.</p>
              </div>
              <a className="text-link" href="#carte" data-testid="link-see-map">Voir la carte <ArrowRight size={15} /></a>
            </div>
            <div className="filter-row" role="tablist" aria-label="Filtrer les spots">
              {['Tous', 'Bike park', 'Enduro', 'DH'].map((item) => (
                <button
                  key={item}
                  className={`filter-chip ${filter === item ? 'active' : ''}`}
                  onClick={() => setFilter(item)}
                  role="tab"
                  aria-selected={filter === item}
                  data-testid={`button-filter-${item.toLowerCase().replace(' ', '-')}`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="spot-grid">
              {visibleSpots.map((spot, index) => (
                <button
                  className={`spot-card ${selectedSpot === spot.id ? 'selected' : ''}`}
                  key={spot.id}
                  onClick={() => setSelectedSpot(spot.id)}
                  aria-pressed={selectedSpot === spot.id}
                  data-testid={`card-spot-${spot.id}`}
                >
                  <img src={spot.visual} alt={spot.name} className="spot-visual" />
                  <div className="spot-rating" data-testid={`text-rating-${spot.id}`}>{spot.rating}<small>/ 5</small></div>
                  <div className="spot-content">
                    <div className="spot-tag">#{String(index + 1).padStart(2, '0')} · {spot.type}</div>
                    <h3>{spot.name}</h3>
                    <p className="spot-location"><MapPin size={12} /> {spot.location}</p>
                    <div className="spot-details"><span><Users size={12} /> {spot.riders} riders</span><span><Mountain size={12} /> {spot.elevation}</span></div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="carte" aria-labelledby="map-title">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="eyebrow">La trace est ouverte</div>
                <h2 className="section-title" id="map-title">À deux<br />virages de toi.</h2>
              </div>
              <p className="section-intro">Repère les spots qui chauffent autour de toi. Chaque point est une sortie, une ligne, une histoire à raconter au parking.</p>
            </div>
            <div className="map-wrap">
              <div className="map-box" aria-label="Carte stylisée des spots de montagne">
                <div className="map-stamp"><Crosshair size={12} /> Carte communautaire · mise à jour</div>
                {mapSpots.map((spot) => (
                  <button
                    key={spot.id}
                    className={`map-pin ${spot.pos} ${mapSpot === spot.id ? 'active' : ''}`}
                    onClick={() => setMapSpot(spot.id)}
                    aria-label={`Voir ${spot.label}`}
                    data-testid={`button-map-pin-${spot.id}`}
                  >
                    <span>{spots.findIndex((item) => item.id === spot.id) + 1}</span>
                  </button>
                ))}
                <div className={`map-callout ${mapSpot ? 'visible' : ''}`} data-testid="status-map-selection">
                  <strong>{mapSpots.find((spot) => spot.id === mapSpot)?.label}</strong>
                  <span>{mapSpots.find((spot) => spot.id === mapSpot)?.place} · 12 traces validées</span>
                </div>
              </div>
              <div className="map-list">
                {mapSpots.map((spot, index) => {
                  const data = spots.find((item) => item.id === spot.id);
                  return (
                    <button
                      key={spot.id}
                      className={`map-list-item ${mapSpot === spot.id ? 'active' : ''}`}
                      onClick={() => setMapSpot(spot.id)}
                      data-testid={`button-map-list-${spot.id}`}
                    >
                      <span className="map-index">{String(index + 1).padStart(2, '0')}</span>
                      <span className="map-list-copy"><strong>{spot.label}</strong><span>{data?.type} · {data?.riders} riders</span></span>
                      <ArrowDownRight size={16} />
                    </button>
                  );
                })}
                <a className="button-primary" href="#attente" data-testid="button-map-full">Ouvrir la carte complète <Compass size={15} /></a>
              </div>
            </div>
          </div>
        </section>

        <section className="section dark-panel" id="defis" aria-labelledby="challenge-title">
          <div className="container challenge-layout">
            <div className="challenge-prompt">
              <div className="eyebrow">Le rituel avant la descente</div>
              <h2 id="challenge-title">Alors, <span>Cap</span><br />ou pas Cap ?</h2>
              <p>Un saut, une ligne, une passerelle un peu trop humide. La communauté tranche avant que tu ne lâches les freins. Vote, assume, recommence demain.</p>
              <div className="hero-note"><Zap size={15} color="hsl(var(--primary))" /><strong>2 406 votes</strong> cette semaine</div>
            </div>
            <div className="vote-card" data-testid="card-daily-challenge">
              <div className="vote-rider">
                <img src={PHOTOS.challenge} alt="Défi VTT" />
                <div className="bike-icon" />
              </div>
              <div className="vote-question">La double noire de Châtel<br />sans poser le pied ?</div>
              <div className="vote-meta"><span><Flame size={13} /> Défi du jour</span><span>Ferme dans 04:18:32</span></div>
              <div className="vote-buttons">
                <button className={`vote-button cap ${vote === 'cap' ? 'selected' : ''}`} onClick={() => chooseVote('cap')} data-testid="button-vote-cap">CAP</button>
                <button className={`vote-button pas ${vote === 'pas' ? 'selected' : ''}`} onClick={() => chooseVote('pas')} data-testid="button-vote-pas">PAS CAP</button>
              </div>
              {vote && <p className="vote-thanks" data-testid="status-vote-confirmation">Vote enregistré. On se retrouve en bas.</p>}
              <div className="bar-label"><span>La meute a parlé</span><span data-testid="text-vote-ratio">{capCount}% Cap</span></div>
              <div className="vote-bar" aria-label={`${capCount}% des riders ont voté Cap`}><div className="vote-bar-fill" style={{ width: `${capCount}%` }} /></div>
            </div>
          </div>
        </section>

        <section className="section community" id="communaute" aria-labelledby="community-title">
          <div className="container">
            <div className="community-grid">
              <div>
                <div className="eyebrow">Le classement de la semaine</div>
                <h2 className="section-title" id="community-title">Les riders<br />font le spot.</h2>
                <p className="section-intro">Chaque trace validée, chaque avis utile et chaque vote font grimper ton nom. Pas besoin d’être pro pour marquer des points.</p>
                <a className="button-ghost" style={{ borderColor: 'rgba(0,0,0,.4)', color: '#0a0a0a', display: 'inline-flex', marginTop: 24 }} href="#attente" data-testid="button-community-profile">Créer mon profil <ArrowRight size={15} /></a>
              </div>
              <div>
                <div className="leader-tabs" role="tablist">
                  <button className={`leader-tab ${leaderTab === 'classement' ? 'active' : ''}`} onClick={() => setLeaderTab('classement')} data-testid="button-leaderboard-all">Cette semaine</button>
                  <button className={`leader-tab ${leaderTab === 'près de moi' ? 'active' : ''}`} onClick={() => setLeaderTab('près de moi')} data-testid="button-leaderboard-nearby">Près de moi</button>
                </div>
                <div className="leaderboard" data-testid="list-leaderboard">
                  {riders.map((rider, index) => (
                    <button className="leader-row" key={rider.handle} onClick={() => setSelectedSpot(index === 0 ? 'les-gets' : 'morzine')} data-testid={`button-rider-${index + 1}`}>
                      <span className="leader-rank">{String(index + 1).padStart(2, '0')}</span>
                      <img src={rider.avatar} alt={rider.name} className="avatar" />
                      <span className="leader-info"><strong>{leaderTab === 'près de moi' ? rider.city : rider.name}</strong><span>{rider.handle} · {rider.rides}</span></span>
                      <span className="leader-points">{rider.points}</span>
                      <ArrowRight size={14} />
                    </button>
                  ))}
                </div>
                <div className="profile-card" data-testid="card-featured-rider">
                  <div className="profile-top"><img src={PHOTOS.avatarPlaceholder} alt="Léa Morel" className="profile-avatar" /><div><h3>Léa<br />Morel</h3><p>Rider vérifiée · Annecy</p></div><Heart size={17} style={{ marginLeft: 'auto' }} /></div>
                  <p className="profile-bio">« Une bonne sortie, c’est quand tu ne sais plus si tu as plus ri ou plus mangé de terre. »</p>
                  <div className="profile-stats"><div className="profile-stat"><strong>1 284</strong><span>points</span></div><div className="profile-stat"><strong>47</strong><span>sorties</span></div><div className="profile-stat"><strong>12</strong><span>spots</span></div></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="waitlist" id="attente" aria-labelledby="waitlist-title">
          <div className="container waitlist-grid">
            <div>
              <div className="eyebrow">Ouverture prochaine · France</div>
              <h2 id="waitlist-title">Prêt à<br /><span>rouler</span> avec nous ?</h2>
              <p className="waitlist-copy">L’app RideRank arrive bientôt. Rejoins la liste et reçois ton accès prioritaire, les premiers défis et une place dans le classement fondateur.</p>
            </div>
            <div>
              {joined ? (
                <div className="form-confirmed" data-testid="status-waitlist-confirmed"><Check size={18} /> C’est noté. Rendez-vous au départ, {email}.</div>
              ) : (
                <form className="waitlist-form" onSubmit={submitWaitlist}>
                  <label htmlFor="waitlist-email" className="sr-only">Ton adresse e-mail</label>
                  <input id="waitlist-email" type="email" required placeholder="ton@email.fr" value={email} onChange={(event) => setEmail(event.target.value)} data-testid="input-waitlist-email" />
                  <button type="submit" aria-label="Rejoindre la liste d'attente" data-testid="button-waitlist-submit"><ArrowRight size={19} /></button>
                </form>
              )}
              <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 11, marginTop: 13 }}>Pas de spam. Juste les infos utiles avant ta prochaine sortie.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <Brand />
          <p>Fait pour celles et ceux qui prennent la ligne d’à côté.</p>
          <div className="footer-links"><a href="#top" data-testid="link-footer-top">Retour en haut</a><a href="#attente" data-testid="link-footer-contact">Contact</a><button type="button" aria-label="Partager RideRank" onClick={() => navigator.clipboard?.writeText(window.location.href)} data-testid="button-share"><Share2 size={14} /></button></div>
        </div>
      </footer>
    </div>
  );
}

export default App;