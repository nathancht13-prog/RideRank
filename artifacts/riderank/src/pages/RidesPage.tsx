import { Link } from 'wouter';
import { Play } from 'lucide-react';
import { useBikeRank } from '../BikeRankContext';
import { RideRow } from '../components/RideRow';

export default function RidesPage() {
  const { session, activities, requireAuth } = useBikeRank();

  if (!session) {
    return (
      <main className="min-h-screen pt-36 pb-32 bg-black">
        <div className="container max-w-2xl text-center">
          <h1 className="text-6xl font-bold uppercase leading-none mb-6">Tes <span className="text-primary">sorties.</span></h1>
          <p className="text-zinc-400 text-xl mb-10">Connecte-toi pour retrouver l'historique de tes traces.</p>
          <button onClick={() => requireAuth('login')} className="button-primary px-10 py-5 text-xl">Se connecter</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-14 pb-44 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,91,26,.16),transparent_40%)]" />
      <div className="container max-w-2xl relative z-10">
        <div className="eyebrow mb-2">Historique</div>
        <h1 className="text-5xl md:text-6xl font-bold uppercase leading-none mb-8">Tes <span className="text-primary">sorties.</span></h1>

        {activities.length === 0 ? (
          <div className="glass-glow rounded-[28px] p-8 text-center">
            <p className="text-zinc-400 text-lg mb-6">Aucune sortie pour l'instant. Ta première trace t'attend.</p>
            <Link href="/ride" className="button-primary inline-flex items-center justify-center gap-3 px-8 py-4 text-lg">
              <Play size={18} fill="currentColor" /> Démarrer une sortie
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {activities.map((ride) => <RideRow key={ride.id} ride={ride} />)}
          </div>
        )}
      </div>
    </main>
  );
}
