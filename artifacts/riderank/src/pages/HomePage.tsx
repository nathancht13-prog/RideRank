import { Link } from 'wouter';
import { Play, Trophy, ArrowUp, Gauge, Timer } from 'lucide-react';
import { useBikeRank } from '../BikeRankContext';

const monthLabel = () => new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(new Date());

function formatKm(value: number) {
  return value.toLocaleString('fr-FR', { maximumFractionDigits: 1 });
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? `${hours} h ${minutes.toString().padStart(2, '0')}` : `${minutes} min`;
}

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

export default function HomePage() {
  const { session, profile, rankedProfiles, activities } = useBikeRank();
  if (!session) return <SignedOut />;

  const userId = session.user.id;
  const pseudo = profile?.pseudo ?? (session.user.user_metadata?.pseudo as string | undefined) ?? 'rider';
  const me = rankedProfiles.find((item) => item.id === userId);
  const above = me ? rankedProfiles.find((item) => item.rank === me.rank - 1) : undefined;
  const gap = me && above ? Math.max(above.distance - me.distance, 0) : 0;
  const recentRides = activities.slice(0, 3);

  return (
    <main className="min-h-screen pt-28 pb-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,91,26,.16),transparent_40%)]" />
      <div className="container max-w-2xl relative z-10">
        <div className="eyebrow mb-2">Bienvenue dans la meute</div>
        <h1 className="text-5xl md:text-6xl font-bold uppercase leading-none mb-8">
          Salut, <span className="text-primary break-all">@{pseudo}</span>
        </h1>

        <Link href="/ride" className="button-primary w-full py-6 text-2xl flex items-center justify-center gap-3 mb-8" data-testid="home-start-ride">
          <Play fill="currentColor" /> Démarrer une sortie
        </Link>

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
            <div>
              <div className="text-2xl font-bold mb-2">Pas encore classé ce mois-ci</div>
              <p className="text-zinc-400">Enregistre une sortie GPS pour entrer dans le classement.</p>
            </div>
          )}
          <Link href="/classement" className="inline-block mt-5 text-primary font-bold uppercase tracking-widest text-sm">Voir le classement complet →</Link>
        </section>

        <section className="glass-glow rounded-[28px] p-6">
          <div className="eyebrow mb-4">Dernières sorties</div>
          {recentRides.length === 0 ? (
            <p className="text-zinc-400">Aucune sortie pour l'instant. Ta première trace t'attend.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentRides.map((ride) => (
                <div key={ride.id} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/40 p-4">
                  <div>
                    <div className="font-bold">{ride.discipline}</div>
                    <div className="text-zinc-500 text-xs uppercase tracking-widest">
                      {new Date(ride.activity_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      {' · '}{ride.source === 'gps' ? 'GPS' : 'Manuelle'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{formatKm(ride.distance_km)} <span className="text-primary text-sm">km</span></div>
                    <div className="text-zinc-500 text-xs flex items-center justify-end gap-3">
                      <span className="flex items-center gap-1"><Timer size={12} />{formatDuration(ride.duration_seconds)}</span>
                      <span className="flex items-center gap-1"><Gauge size={12} />{Math.round(ride.max_speed_kmh)} km/h</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
