import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Award, FileText, LogOut, Menu, Pencil, Plus, Share2, Trophy, X } from 'lucide-react';
import { useBikeRank } from '../BikeRankContext';
import { supabase } from '../lib/supabase';
import { formatKm } from '../components/RideRow';

const LEVELS = [
  { name: 'Rookie', minKm: 0 },
  { name: 'Rider', minKm: 50 },
  { name: 'Confirmé', minKm: 200 },
  { name: 'Expert', minKm: 500 },
  { name: 'Légende', minKm: 1000 },
];

function levelFor(km: number) {
  let index = 0;
  LEVELS.forEach((level, i) => { if (km >= level.minKm) index = i; });
  const current = LEVELS[index];
  const next = LEVELS[index + 1];
  const progress = next ? (km - current.minKm) / (next.minKm - current.minKm) : 1;
  return { index, current, next, progress };
}

export default function ProfilePage() {
  const {
    session, profile, activities, rankedProfiles,
    requireAuth, setProfileOpen, setActivityOpen, setShareOpen,
  } = useBikeRank();
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  if (!session) {
    return (
      <main className="min-h-screen pt-36 pb-32 bg-black">
        <div className="container max-w-2xl text-center">
          <h1 className="text-6xl font-bold uppercase leading-none mb-6">Ton <span className="text-primary">profil.</span></h1>
          <p className="text-zinc-400 text-xl mb-10">Connecte-toi pour voir ton profil et tes stats.</p>
          <button onClick={() => requireAuth('login')} className="button-primary px-10 py-5 text-xl">Se connecter</button>
        </div>
      </main>
    );
  }

  const pseudo = profile?.pseudo ?? (session.user.user_metadata?.pseudo as string | undefined) ?? 'rider';
  const totalKm = activities.reduce((sum, ride) => sum + ride.distance_km, 0);
  const totalSeconds = activities.reduce((sum, ride) => sum + ride.duration_seconds, 0);
  const topSpeed = activities.reduce((best, ride) => Math.max(best, ride.max_speed_kmh), 0);
  const averageSpeed = totalSeconds > 0 ? totalKm / (totalSeconds / 3600) : 0;
  const level = levelFor(totalKm);
  const me = rankedProfiles.find((item) => item.id === session.user.id);
  const month = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(new Date());

  const disciplineCounts = activities.reduce<Record<string, number>>((acc, ride) => {
    acc[ride.discipline] = (acc[ride.discipline] ?? 0) + 1;
    return acc;
  }, {});
  const favoriteDiscipline = Object.entries(disciplineCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const discipline = (session.user.user_metadata?.discipline as string | undefined) ?? favoriteDiscipline ?? 'VTT';
  const subtitle = [discipline, profile?.ville].filter(Boolean).join(' · ');

  const tiles = [
    { label: 'Total roulé', value: formatKm(totalKm), unit: 'km' },
    { label: 'Sorties', value: String(activities.length), unit: '' },
    { label: 'Vitesse max', value: topSpeed > 0 ? String(Math.round(topSpeed)) : '—', unit: topSpeed > 0 ? 'km/h' : '' },
    { label: 'Vitesse moyenne', value: averageSpeed > 0 ? formatKm(averageSpeed) : '—', unit: averageSpeed > 0 ? 'km/h' : '' },
  ];

  const logout = async () => {
    setMenuOpen(false);
    await supabase.auth.signOut();
    setLocation('/');
  };

  const menuItem = 'menu-link w-full text-left flex items-center gap-3';

  return (
    <main className="min-h-screen pt-14 pb-44 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,91,26,.18),transparent_45%)]" />
      <div className="container max-w-2xl relative z-10">
        <div className="flex justify-end relative mb-2" ref={menuRef}>
          <button
            className="w-12 h-12 rounded-full glass-glow flex items-center justify-center text-white hover:text-primary transition-colors"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Menu du compte"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          {menuOpen && (
            <div className="absolute top-full right-0 mt-3 w-[280px] glass-glow rounded-2xl p-3 flex flex-col shadow-2xl z-20">
              <button className={menuItem} onClick={() => { setProfileOpen(true); setMenuOpen(false); }}><Pencil size={20} /> Modifier mon profil</button>
              <button className={menuItem} onClick={() => { setActivityOpen(true); setMenuOpen(false); }}><Plus size={20} /> Ajouter une sortie manuelle</button>
              <button className={`${menuItem} text-primary`} onClick={() => { setShareOpen(true); setMenuOpen(false); }}><Trophy size={20} /> Mes stats à partager</button>
              <Link href="/legal" className={menuItem} onClick={() => setMenuOpen(false)}><FileText size={20} /> Mentions légales</Link>
              <button className={`${menuItem} text-zinc-500 hover:text-white`} onClick={logout}><LogOut size={20} /> Déconnexion</button>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-32 h-32 rounded-full border-2 border-primary/60 shadow-[0_0_30px_rgba(255,91,26,0.35)] overflow-hidden bg-zinc-900 grid place-items-center mb-5">
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              : <span className="text-6xl font-bold text-primary uppercase">{pseudo.charAt(0)}</span>}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-none break-all">@{pseudo}</h1>
          <div className="text-zinc-500 font-bold uppercase tracking-widest text-sm mt-3">{subtitle}</div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/60 px-4 py-2 text-primary font-bold uppercase tracking-widest text-sm">
            <Award size={16} /> {level.current.name} · Niv. {level.index + 1}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button onClick={() => setProfileOpen(true)} className="glass-glow rounded-2xl py-4 flex items-center justify-center gap-2 font-bold uppercase tracking-widest">
            <Pencil size={18} /> Modifier
          </button>
          <button onClick={() => setShareOpen(true)} className="button-primary rounded-2xl py-4 gap-2 text-base">
            <Share2 size={18} /> Partager
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {tiles.map((tile) => (
            <div key={tile.label} className="glass-glow rounded-2xl p-5 text-center">
              <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">{tile.label}</div>
              <div className="text-4xl font-bold">{tile.value}{tile.unit && <span className="text-primary text-base"> {tile.unit}</span>}</div>
            </div>
          ))}
        </div>

        <section className="glass-glow rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between gap-4 mb-4 font-bold uppercase tracking-widest text-sm">
            <span>Niveau {level.index + 1}</span>
            <span className="text-primary text-right">
              {level.next ? `${formatKm(Math.max(level.next.minKm - totalKm, 0))} km avant niv. ${level.index + 2}` : 'Niveau max atteint'}
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-primary shadow-[0_0_12px_rgba(255,91,26,.6)]" style={{ width: `${Math.max(level.progress * 100, 2)}%` }} />
          </div>
        </section>

        <Link href="/classement" className="glass-glow rounded-2xl p-5 flex items-center gap-4">
          <span className="w-14 h-14 rounded-full border border-primary/60 grid place-items-center shrink-0 text-primary"><Trophy size={24} /></span>
          <div className="flex-1 min-w-0">
            <div className="font-bold uppercase tracking-widest text-sm">Classement de {month}</div>
            <div className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-1">
              <span className="text-white text-2xl mr-2">{me ? `#${me.rank}` : '#—'}</span>{profile?.ville ?? 'France'}
            </div>
          </div>
          <div className="text-right font-bold text-xl shrink-0">{me ? formatKm(me.distance) : '0'} <span className="text-primary text-sm">km</span></div>
        </Link>
      </div>
    </main>
  );
}
