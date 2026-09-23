import { Link, useLocation } from 'wouter';
import { Home, Navigation, Trophy, User } from 'lucide-react';
import { useBikeRank } from '../BikeRankContext';

const APP_PATHS = ['/app', '/ride', '/classement'];

export function TabBar() {
  const { session, setProfileOpen } = useBikeRank();
  const [location] = useLocation();

  if (!session || !APP_PATHS.includes(location)) return null;

  const tabs = [
    { href: '/app', label: 'Accueil', icon: Home },
    { href: '/ride', label: 'Sortie', icon: Navigation },
    { href: '/classement', label: 'Classement', icon: Trophy },
  ];

  const itemClass = (active: boolean) =>
    `flex flex-1 flex-col items-center gap-1 py-3 text-[11px] font-bold uppercase tracking-widest transition-colors ${active ? 'text-primary' : 'text-zinc-500 hover:text-white'}`;

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed bottom-0 inset-x-0 z-[90] flex border-t border-white/10 bg-black/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
    >
      {tabs.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} className={itemClass(location === href)}>
          <Icon size={22} />
          {label}
        </Link>
      ))}
      <button type="button" onClick={() => setProfileOpen(true)} className={itemClass(false)}>
        <User size={22} />
        Profil
      </button>
    </nav>
  );
}
