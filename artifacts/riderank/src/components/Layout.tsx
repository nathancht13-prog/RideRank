import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { ChevronDown, LogOut, Menu, Pencil, Share2, X, Plus, Trophy, Check, Navigation } from 'lucide-react';
import { useBikeRank } from '../BikeRankContext';

const avatarFallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%231a1a1a'/%3E%3Ccircle cx='50' cy='38' r='16' fill='%23ff5b1a'/%3E%3Cpath d='M18 92Q50 56 82 92' fill='%23ff5b1a'/%3E%3C/svg%3E";

export function Header() {
  const { session, profile, requireAuth, setProfileOpen, setActivityOpen, setShareOpen } = useBikeRank();
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const isHome = location === '/';
  const menuRef = useRef<HTMLDivElement>(null);

  const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
    const handleClick = () => setMenuOpen(false);
    if (href.startsWith('#')) {
       if (isHome) return <a href={href} onClick={handleClick} className="menu-link">{children}</a>;
       return <a href={`/${href}`} onClick={handleClick} className="menu-link">{children}</a>;
    }
    return <Link href={href} onClick={handleClick} className="menu-link">{children}</Link>;
  };

  const handleLogout = async () => {
    const { supabase } = await import('../lib/supabase');
    await supabase.auth.signOut();
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="site-header">
      <div className="container nav">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img src="/brand/bike-rank-logo-transparent.png" alt="Bike Rank" className="h-8 md:h-10 object-contain drop-shadow-md" />
        </Link>

        <div className="flex items-center relative" ref={menuRef}>
          <button
            className="w-12 h-12 rounded-full glass-glow flex items-center justify-center text-white hover:text-primary transition-colors hover:scale-105 active:scale-95"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {menuOpen && (
            <div className="absolute top-full right-0 mt-4 w-[280px] glass-glow rounded-2xl p-3 flex flex-col shadow-2xl">
              <div className="px-4 py-3 text-xs font-bold text-primary uppercase tracking-widest border-b border-white/10 mb-1">Navigation</div>
              <NavLink href="#accueil">Accueil</NavLink>
               <NavLink href="#partage">Tes stats prêtes à partager</NavLink>
              <NavLink href="#classement">Classement</NavLink>
               <NavLink href="#progression">Progression</NavLink>
              <NavLink href="#faq">FAQ</NavLink>

              <div className="px-4 py-3 text-xs font-bold text-primary uppercase tracking-widest border-b border-white/10 mt-2 mb-1">Compte</div>
              {session ? (
                <>
                  <div className="px-4 py-2 flex items-center gap-3 text-white mb-2">
                    <img src={profile?.avatar_url || avatarFallback} className="w-10 h-10 rounded-full border border-primary/50 object-cover" alt="" />
                    <span className="font-bold truncate text-lg">{profile?.pseudo || 'Mon profil'}</span>
                  </div>
                   <Link href="/ride" onClick={() => setMenuOpen(false)} className="menu-link text-left flex items-center gap-3 text-primary"><Navigation size={20} /> Démarrer une sortie</Link>
                   <button onClick={() => { setActivityOpen(true); setMenuOpen(false); }} className="menu-link text-left flex items-center gap-3"><Plus size={20} /> Ajouter une sortie manuelle</button>
                  <button onClick={() => { setShareOpen(true); setMenuOpen(false); }} className="menu-link text-left flex items-center gap-3 text-accent"><Trophy size={20} /> Mes stats</button>
                  <button onClick={() => { setProfileOpen(true); setMenuOpen(false); }} className="menu-link text-left flex items-center gap-3"><Pencil size={20} /> Profil</button>
                  <button onClick={handleLogout} className="menu-link text-left flex items-center gap-3 text-zinc-500 hover:text-white"><LogOut size={20} /> Déconnexion</button>
                </>
              ) : (
                <div className="p-2">
                   <button onClick={() => { requireAuth('signup'); setMenuOpen(false); }} className="button-primary py-4 w-full text-base">S'inscrire / Se connecter</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
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
    <footer className="py-16 bg-black text-zinc-500 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="container grid md:grid-cols-3 gap-12 mb-16 relative z-10">
        <div>
          <Link href="/" className="flex items-center mb-6 hover:opacity-80 transition-opacity">
            <img src="/brand/bike-rank-logo-transparent.png" alt="Bike Rank" className="h-10 object-contain drop-shadow-md" />
          </Link>
          <p className="text-lg font-medium leading-relaxed">Le classement VTT local. Rentre tes sorties, grimpe dans le tableau, et trouve les meilleures traces de ta région.</p>
        </div>
        <div>
          <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-sm">Navigation</h4>
          <ul className="space-y-3 text-lg font-medium">
            <li><FooterLink href="#accueil">Accueil</FooterLink></li>
             <li><FooterLink href="#partage">Tes stats</FooterLink></li>
            <li><FooterLink href="#classement">Classement</FooterLink></li>
             <li><FooterLink href="#progression">Progression</FooterLink></li>
            <li><FooterLink href="#faq">Questions fréquentes</FooterLink></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-sm">Légal</h4>
          <ul className="space-y-3 text-lg font-medium">
            <li><FooterLink href="/legal#mentions">Mentions légales</FooterLink></li>
            <li><FooterLink href="/legal#confidentialite">Confidentialité & Cookies</FooterLink></li>
            <li><FooterLink href="/legal#cgu">Conditions d'utilisation</FooterLink></li>
            <li><FooterLink href="/legal#contact">Contact</FooterLink></li>
          </ul>
        </div>
      </div>
      <div className="container pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm font-bold uppercase tracking-wider relative z-10">
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
      <div className="w-8 h-8 bg-primary text-black rounded-full flex items-center justify-center font-bold text-lg"><Check size={18} strokeWidth={3} /></div>
      {notice}
    </button>
  );
}
