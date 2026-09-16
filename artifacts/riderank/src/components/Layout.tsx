import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ChevronDown, LogOut, Menu, Pencil, Share2, X, Plus, Trophy } from 'lucide-react';
import { useBikeRank } from '../BikeRankContext';

const avatarFallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%231a1a1a'/%3E%3Ccircle cx='50' cy='38' r='16' fill='%23ff5b1a'/%3E%3Cpath d='M18 92Q50 56 82 92' fill='%23ff5b1a'/%3E%3C/svg%3E";

const LogoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-8 h-8 mr-2 drop-shadow-md">
    <rect width="100" height="100" fill="#0a0a0a" rx="20" />
    <path d="M30 70 L45 35 L60 55 L75 40" stroke="#ff5b1a" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="75" cy="40" r="8" fill="#ffcc00" />
  </svg>
);

export function Header() {
  const { session, profile, requireAuth, setProfileOpen, setActivityOpen, setShareOpen } = useBikeRank();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [location] = useLocation();
  const isHome = location === '/';

  const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
    if (isHome) return <a href={href} onClick={() => setMenuOpen(false)}>{children}</a>;
    return <a href={`/${href}`} onClick={() => setMenuOpen(false)}>{children}</a>;
  };

  const handleLogout = async () => {
    const { supabase } = await import('../lib/supabase');
    await supabase.auth.signOut();
    setAccountOpen(false);
  };

  return (
    <header className="site-header">
      <div className="container nav">
        <Link href="/" className="brand flex items-center hover:opacity-80 transition-opacity">
          <LogoIcon />
          <span className="text-3xl font-black italic tracking-tight"><span className="text-white">Bike</span> <span className="text-primary">Rank</span></span>
        </Link>
        <nav className="nav-links">
          <NavLink href="#trouver">Trouver un spot</NavLink>
          <NavLink href="#carte">Carte</NavLink>
          <NavLink href="#classement">Classement</NavLink>
        </nav>
        <div className="nav-actions flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setActivityOpen(true)} 
                className="hidden md:flex items-center gap-2 font-bold uppercase tracking-wider text-primary border border-primary/30 px-4 py-2 hover:bg-primary/10 transition-colors text-sm rounded-md"
                data-testid="button-add-activity"
              >
                <Plus size={16} strokeWidth={3} /> Sortie
              </button>
              <div className="account-wrap">
                <button className="account-button" onClick={() => setAccountOpen(o => !o)} data-testid="button-account">
                  <img src={profile?.avatar_url || avatarFallback} alt="Avatar" /> 
                  <span className="hidden sm:inline font-bold text-sm uppercase tracking-wide">{profile?.pseudo || 'Mon profil'}</span>
                  <ChevronDown size={16} />
                </button>
                {accountOpen && (
                  <div className="account-menu">
                    <button onClick={() => { setActivityOpen(true); setAccountOpen(false); }} className="md:hidden">
                      <Plus size={16} /> Ajouter une sortie
                    </button>
                    <button onClick={() => { setShareOpen(true); setAccountOpen(false); }} className="text-accent hover:text-accent">
                      <Trophy size={16} /> Partager mes stats
                    </button>
                    <button onClick={() => { setProfileOpen(true); setAccountOpen(false); }}>
                      <Pencil size={16} /> Mon profil
                    </button>
                    <button onClick={handleLogout} className="text-zinc-400 hover:text-white">
                      <LogOut size={16} /> Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button className="nav-cta px-6 py-2 text-sm" onClick={() => requireAuth('signup')} data-testid="button-join">
              Rejoindre
            </button>
          )}
          <button className="menu-button md:hidden text-white" aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="mobile-menu open border-b border-white/10" aria-label="Navigation mobile">
          <NavLink href="#trouver">Trouver un spot</NavLink>
          <NavLink href="#carte">Carte</NavLink>
          <NavLink href="#classement">Classement</NavLink>
          <NavLink href="#faq">FAQ</NavLink>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  const [location] = useLocation();
  const isHome = location === '/';

  const FooterLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
    if (href.startsWith('#') && !isHome) {
      return <a href={`/${href}`}>{children}</a>;
    }
    if (href.startsWith('/')) {
       return <Link href={href}>{children}</Link>;
    }
    return <a href={href}>{children}</a>;
  };

  return (
    <footer className="py-16 bg-black text-zinc-500 border-t border-white/5">
      <div className="container grid md:grid-cols-4 gap-12 mb-16">
        <div className="md:col-span-1">
          <Link href="/" className="brand flex items-center mb-6 hover:opacity-80 transition-opacity">
            <LogoIcon />
            <span className="text-3xl font-black italic tracking-tight"><span className="text-white">Bike</span> <span className="text-primary">Rank</span></span>
          </Link>
          <p className="text-lg font-medium leading-relaxed">Le classement VTT local. Rentre tes sorties, grimpe dans le tableau, et trouve les meilleures traces de ta région.</p>
        </div>
        <div>
          <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-sm">Navigation</h4>
          <ul className="space-y-3 text-lg font-medium">
            <li><FooterLink href="#trouver">Trouver un spot</FooterLink></li>
            <li><FooterLink href="#carte">Carte</FooterLink></li>
            <li><FooterLink href="#classement">Classement</FooterLink></li>
            <li><FooterLink href="#faq">Questions fréquentes</FooterLink></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-sm">Légal</h4>
          <ul className="space-y-3 text-lg font-medium">
            <li><FooterLink href="/legal">Mentions légales</FooterLink></li>
            <li><FooterLink href="/legal">Confidentialité</FooterLink></li>
            <li><FooterLink href="/legal">Conditions d'utilisation</FooterLink></li>
            <li><FooterLink href="/legal#contact">Contact</FooterLink></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-sm">Suivez-nous</h4>
          <ul className="space-y-3 text-lg font-medium">
            <li><a href="#" className="hover:text-primary transition-colors">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="container pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm font-bold uppercase tracking-wider">
        <p>© {new Date().getFullYear()} Bike Rank. Tous droits réservés.</p>
        <button className="share-button hover:text-white transition-colors flex items-center gap-2" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
          <Share2 size={16} /> Partager Bike Rank
        </button>
      </div>
    </footer>
  );
}

export function Toast() {
  const { notice, setNotice } = useBikeRank();
  if (!notice) return null;
  return (
    <button className="toast-notice animate-in slide-in-from-bottom-5" onClick={() => setNotice('')} data-testid="toast-notice">
      <div className="w-8 h-8 bg-primary text-black rounded-full flex items-center justify-center font-bold text-lg">✓</div>
      {notice}
    </button>
  );
}