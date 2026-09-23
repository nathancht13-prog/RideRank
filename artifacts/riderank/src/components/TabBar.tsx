import { Link, useLocation } from 'wouter';
import { BarChart3, House, List, Plus, User } from 'lucide-react';
import { useBikeRank } from '../BikeRankContext';

const APP_PATHS = ['/app', '/sorties', '/stats', '/classement', '/ride'];

export function TabBar() {
  const { session, setProfileOpen } = useBikeRank();
  const [location] = useLocation();

  if (!session || !APP_PATHS.includes(location)) return null;

  const itemClass = (active: boolean) =>
    `flex flex-1 flex-col items-center gap-1 pt-3 pb-2 text-[11px] font-bold uppercase tracking-widest transition-colors ${active ? 'text-primary' : 'text-zinc-500 hover:text-white'}`;

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed bottom-0 inset-x-0 z-[90] border-t border-white/10 bg-black/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto flex max-w-2xl items-end px-2">
        <Link href="/app" className={itemClass(location === '/app')}>
          <House size={22} />
          Accueil
        </Link>
        <Link href="/sorties" className={itemClass(location === '/sorties')}>
          <List size={22} />
          Sorties
        </Link>

        <div className="flex flex-1 justify-center">
          <Link
            href="/ride"
            aria-label="Démarrer une sortie"
            className={`-mt-7 mb-2 grid h-16 w-16 place-items-center rounded-full border-4 border-black bg-primary text-black shadow-[0_0_28px_rgba(255,91,26,0.55)] transition-transform hover:scale-105 ${location === '/ride' ? 'ring-2 ring-white/70' : ''}`}
          >
            <Plus size={32} strokeWidth={3} />
          </Link>
        </div>

        <Link href="/stats" className={itemClass(location === '/stats')}>
          <BarChart3 size={22} />
          Stats
        </Link>
        <button type="button" onClick={() => setProfileOpen(true)} className={itemClass(false)}>
          <User size={22} />
          Profil
        </button>
      </div>
    </nav>
  );
}
