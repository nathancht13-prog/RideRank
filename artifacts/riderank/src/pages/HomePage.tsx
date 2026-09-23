import { Link } from 'wouter';
import { Play, Trophy, ArrowUp } from 'lucide-react';
import { useBikeRank } from '../BikeRankContext';
import { RideRow, formatKm } from '../components/RideRow';
import { SPEED_LEVELS, SpeedLegend } from '../components/RideMap';
import { WEEK_LETTERS, weekSummary } from '../lib/weekStats';

const monthLabel = () => new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(new Date());

function SignedOut() {
  const { requireAuth } = useBikeRank();
  return (
    <main className="min-h-screen pt-36 pb-32 bg-black">
      <div className="container max-w-2xl text-center">
        <Trophy className="w-16 h-16 text-primary mx-auto mb-8" />
        <h1 className="text-6xl md:text-7xl font-bold uppercase leading-none mb-6">Ton espace<br /><span className="text-primary">rider.</span></h1>
        <p className="text-zinc-400 text-xl mb-10">Connecte-toi pour voir ton rang, tes sorties et démarrer une nouvelle trace.</p>
        <button onClick={() => requireAuth('login')} className="button-primary px-10 py-5 text-xl">Se connecter</button>
      </div>
    </main>
  );
}

function UnlockPreview({ rank, topSpeed }: { rank?: number; topSpeed: number }) {
  return (
    <section className="mb-6">
      <div className="text-zinc-500 text-sm font-bold uppercase tracking-[0.2em] mb-4">Ce que tu débloqueras</div>
      <div className="glass-glow rounded-[28px] p-5">
        <h2 className="text-xl font-bold mb-4">Couleurs par vitesse</h2>
        <div className="rounded-2xl border border-white/10 bg-black/50 p-4 mb-3">
          <svg viewBox="0 0 300 90" className="w-full h-24" aria-hidden="true">
            <path d="M15 72 C35 72 48 56 72 53" fill="none" stroke={SPEED_LEVELS[0].color} strokeWidth="5" strokeLinecap="round" />
            <path d="M72 53 C96 49 112 41 136 39" fill="none" stroke={SPEED_LEVELS[1].color} strokeWidth="5" strokeLinecap="round" />
            <path d="M136 39 C166 36 186 30 212 33" fill="none" stroke={SPEED_LEVELS[2].color} strokeWidth="5" strokeLinecap="round" />
            <path d="M212 33 C240 35 256 52 286 45" fill="none" stroke={SPEED_LEVELS[3].color} strokeWidth="5" strokeLinecap="round" />
            <circle cx="15" cy="72" r="5" fill="#fff" />
          </svg>
        </div>
        <SpeedLegend className="mb-5" />
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Vitesse max</div>
            <div className="text-3xl font-bold text-zinc-600">{topSpeed > 0 ? Math.round(topSpeed) : '—'}<span className="text-sm"> km/h</span></div>
            <div className="text-zinc-500 text-xs mt-2">Ton record, sortie après sortie</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Rang du mois</div>
            <div className="text-3xl font-bold text-zinc-600">{rank ? `#${rank}` : '#—'}</div>
            <div className="text-zinc-500 text-xs mt-2">Classé dès ta première trace</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const { session, profile, rankedProfiles, activities } = useBikeRank();
  if (!session) return <SignedOut />;

  const userId = session.user.id;
  const pseudo = profile?.pseudo ?? (session.user.user_metadata?.pseudo as string | undefined) ?? 'rider';
  const me = rankedProfiles.find((item) => item.id === userId);
  const above = me ? rankedProfiles.find((item) => item.rank === me.rank - 1) : undefined;
  const gap = me && above ? Math.max(above.distance - me.distance, 0) : 0;
  const week = weekSummary(activities);
  const hasRides = activities.length > 0;
  const topSpeed = activities.reduce((best, ride) => Math.max(best, ride.max_speed_kmh), 0);

  return (
    <main className="min-h-screen pt-28 pb-44 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,91,26,.18),transparent_40%)]" />
      <div className="container max-w-2xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold uppercase leading-none mb-4">
            {hasRides
              ? <>Salut, <span className="text-primary break-all">@{pseudo}</span></>
              : <>Prêt à <span className="text-primary">rider ?</span></>}
          </h1>
          <p className="text-zinc-400 text-lg max-w-md mx-auto">
            {hasRides
              ? (me ? `Ton rang ce mois-ci : #${me.rank} · ${formatKm(me.distance)} km` : 'Enregistre une sortie GPS pour entrer au classement.')
              : 'Lance ta première sortie pour débloquer les couleurs de vitesse, ton record et ton rang.'}
          </p>
        </div>

        <Link href="/ride" className="button-primary w-full py-5 text-xl flex items-center justify-center gap-3 mb-8" data-testid="home-start-ride">
          <span className="w-8 h-8 rounded-full border-2 border-black grid place-items-center"><Play size={14} fill="currentColor" /></span>
          {hasRides ? 'Démarrer une sortie' : 'Démarrer la première sortie'}
        </Link>

        <div className="grid grid-cols-7 gap-2">
          {week.days.map((day, index) => (
            <div key={index} className={`rounded-2xl border bg-white/[0.03] p-2 flex flex-col items-center gap-2 ${day.isToday ? 'border-primary/60' : 'border-white/10'}`}>
              <span className={`w-9 h-9 rounded-full grid place-items-center text-sm font-bold ${day.count ? 'bg-primary text-black' : 'border border-dashed border-white/25 text-zinc-500'}`}>
                {WEEK_LETTERS[index]}
              </span>
              <span className={`text-[11px] font-bold ${day.count ? 'text-white' : 'text-zinc-600'}`}>{day.count ? formatKm(day.km) : '—'}</span>
            </div>
          ))}
        </div>
        <Link href="/ride" className="block text-center text-zinc-500 font-medium mt-4 mb-10">Roule pour remplir ta semaine →</Link>

        {!hasRides && <UnlockPreview rank={me?.rank} topSpeed={topSpeed} />}

        {hasRides && (
          <section className="glass-glow-strong rounded-[28px] p-6 mb-6">
            <div className="eyebrow mb-4">Classement · {monthLabel()}</div>
            {me ? (
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="text-7xl font-bold text-primary leading-none">#{me.rank}</div>
                  <div className="text-zinc-400 mt-2">{formatKm(me.distance)} km ce mois-ci</div>
                </div>
                {above && (
                  <div className="flex items-center gap-2 text-right text-sm font-semibold text-zinc-300 max-w-[55%]">
                    <ArrowUp className="text-primary shrink-0" size={18} />
                    Plus que {formatKm(gap)} km pour passer #{above.rank}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-zinc-400">Pas encore classé ce mois-ci : seules les sorties GPS comptent.</p>
            )}
            <Link href="/classement" className="inline-block mt-5 text-primary font-bold uppercase tracking-widest text-sm">Voir le classement complet →</Link>
          </section>
        )}

        <section className="glass-glow rounded-[28px] p-6 mb-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold">Cette semaine</h2>
            <span className="text-zinc-400 text-sm text-right">
              {week.totalRides === 0 ? "Aucune sortie pour l'instant" : `${formatKm(week.totalKm)} km · ${week.totalRides} sortie${week.totalRides > 1 ? 's' : ''}`}
            </span>
          </div>
          <div className="flex gap-3 h-24">
            {week.days.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col justify-end">
                <div
                  className={`w-full rounded-full ${day.km > 0 ? 'bg-primary shadow-[0_0_12px_rgba(255,91,26,.5)]' : 'bg-white/10'}`}
                  style={{ height: day.km > 0 ? `${Math.max((day.km / week.maxKm) * 100, 12)}%` : '3px' }}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-3 text-center text-xs text-zinc-500 font-bold">
            {WEEK_LETTERS.map((letter, index) => <span key={index} className="flex-1">{letter}</span>)}
          </div>
        </section>

        {hasRides && (
          <section className="glass-glow rounded-[28px] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="eyebrow">Dernières sorties</div>
              <Link href="/sorties" className="text-primary font-bold uppercase tracking-widest text-xs">Tout voir →</Link>
            </div>
            <div className="flex flex-col gap-3">
              {activities.slice(0, 3).map((ride) => <RideRow key={ride.id} ride={ride} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
