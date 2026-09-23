import { Link } from 'wouter';
import { useBikeRank } from '../BikeRankContext';
import { formatDuration, formatKm } from '../components/RideRow';

export default function StatsPage() {
  const { session, activities, rankedProfiles, requireAuth } = useBikeRank();

  if (!session) {
    return (
      <main className="min-h-screen pt-36 pb-32 bg-black">
        <div className="container max-w-2xl text-center">
          <h1 className="text-6xl font-bold uppercase leading-none mb-6">Tes <span className="text-primary">stats.</span></h1>
          <p className="text-zinc-400 text-xl mb-10">Connecte-toi pour voir tes statistiques.</p>
          <button onClick={() => requireAuth('login')} className="button-primary px-10 py-5 text-xl">Se connecter</button>
        </div>
      </main>
    );
  }

  const totalKm = activities.reduce((sum, ride) => sum + ride.distance_km, 0);
  const totalSeconds = activities.reduce((sum, ride) => sum + ride.duration_seconds, 0);
  const topSpeed = activities.reduce((best, ride) => Math.max(best, ride.max_speed_kmh), 0);
  const averageSpeed = totalSeconds > 0 ? totalKm / (totalSeconds / 3600) : 0;
  const me = rankedProfiles.find((item) => item.id === session.user.id);

  const byDiscipline = Object.entries(
    activities.reduce<Record<string, number>>((acc, ride) => {
      acc[ride.discipline] = (acc[ride.discipline] ?? 0) + ride.distance_km;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);
  const maxDisciplineKm = Math.max(...byDiscipline.map(([, km]) => km), 0.1);

  const tiles = [
    { label: 'Sorties', value: String(activities.length), unit: '' },
    { label: 'Distance totale', value: formatKm(totalKm), unit: 'km' },
    { label: 'Temps total', value: totalSeconds > 0 ? formatDuration(totalSeconds) : '—', unit: '' },
    { label: 'Vitesse max', value: topSpeed > 0 ? String(Math.round(topSpeed)) : '—', unit: topSpeed > 0 ? 'km/h' : '' },
    { label: 'Vitesse moyenne', value: averageSpeed > 0 ? formatKm(averageSpeed) : '—', unit: averageSpeed > 0 ? 'km/h' : '' },
    { label: 'Rang du mois', value: me ? `#${me.rank}` : '—', unit: '' },
  ];

  return (
    <main className="min-h-screen pt-14 pb-44 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,91,26,.16),transparent_40%)]" />
      <div className="container max-w-2xl relative z-10">
        <div className="eyebrow mb-2">Performances</div>
        <h1 className="text-5xl md:text-6xl font-bold uppercase leading-none mb-8">Tes <span className="text-primary">stats.</span></h1>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {tiles.map((tile) => (
            <div key={tile.label} className="glass-glow rounded-2xl p-5">
              <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">{tile.label}</div>
              <div className="text-3xl font-bold">{tile.value}{tile.unit && <span className="text-primary text-base"> {tile.unit}</span>}</div>
            </div>
          ))}
        </div>

        <section className="glass-glow rounded-[28px] p-6 mb-6">
          <div className="eyebrow mb-4">Kilomètres par discipline</div>
          {byDiscipline.length === 0 ? (
            <p className="text-zinc-400">Tes statistiques apparaîtront après ta première sortie.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {byDiscipline.map(([discipline, km]) => (
                <div key={discipline} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 font-semibold">{discipline}</span>
                  <div className="flex-1 h-2.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(km / maxDisciplineKm) * 100}%` }} />
                  </div>
                  <span className="w-16 text-right text-zinc-400 text-sm">{formatKm(km)} km</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <Link href="/classement" className="button-primary w-full py-5 text-xl flex items-center justify-center">Voir le classement</Link>
      </div>
    </main>
  );
}
