import { Trophy } from 'lucide-react';
import { useBikeRank } from '../BikeRankContext';

export default function LeaderboardPage() {
  const { session, rankedProfiles, requireAuth } = useBikeRank();
  const month = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(new Date());

  return (
    <main className="min-h-screen pt-28 pb-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,91,26,.16),transparent_40%)]" />
      <div className="container max-w-2xl relative z-10">
        <div className="eyebrow mb-2">Classement · {month}</div>
        <h1 className="text-5xl md:text-6xl font-bold uppercase leading-none mb-8">Chaque kilomètre <span className="text-primary">compte.</span></h1>

        <div className="glass-glow-strong rounded-[28px] p-3 md:p-4">
          {rankedProfiles.map((item) => {
            const isMe = item.id === session?.user.id;
            const name = item.profile?.pseudo ?? 'RIDER';
            return (
              <div
                key={item.id}
                className={`flex items-center gap-4 rounded-2xl px-4 py-3 ${isMe ? 'border border-primary bg-primary/10' : ''}`}
              >
                <span className={`w-9 h-9 rounded-full grid place-items-center font-bold shrink-0 ${item.rank === 1 ? 'bg-primary text-black' : 'bg-white/10'}`}>
                  {item.rank === 1 ? <Trophy size={16} /> : item.rank}
                </span>
                <span className="flex-1 font-bold uppercase truncate">
                  {name}{isMe && <span className="ml-2 text-primary text-xs tracking-widest">TOI</span>}
                </span>
                <span className="font-bold text-xl">
                  {item.distance.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} <span className="text-primary text-sm">km</span>
                </span>
              </div>
            );
          })}
        </div>

        <p className="text-zinc-500 text-sm mt-6 text-center">Le classement se base uniquement sur les kilomètres validés par GPS.</p>
        {!session && (
          <button onClick={() => requireAuth('signup')} className="button-primary w-full py-5 text-xl mt-8">Entrer dans le classement</button>
        )}
      </div>
    </main>
  );
}
