import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ChevronDown, LogOut, Menu, Pencil, Share2, X, Plus } from 'lucide-react';
import { useSentiz } from '../SentizContext';

const avatarFallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%231a1a1a'/%3E%3Ccircle cx='50' cy='38' r='16' fill='%23ff5b1a'/%3E%3Cpath d='M18 92Q50 56 82 92' fill='%23ff5b1a'/%3E%3C/svg%3E";

export function Header() {
  const { session, profile, requireAuth, setProfileOpen, setActivityOpen } = useSentiz();
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
        <Link href="/" className="brand">
          <span className="brand-mark">S</span><span>Senti<i>z</i></span>
        </Link>
        <nav className="nav-links">
          <NavLink href="#trouver">Trouver un spot</NavLink>
          <NavLink href="#spots">Les spots</NavLink>
          <NavLink href="#classement">Classement</NavLink>
        </nav>
        <div className="nav-actions">
          {session ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActivityOpen(true)} 
                className="hidden md:flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary border border-primary/30 px-3 py-1.5 hover:bg-primary/10 transition-colors"
                data-testid="button-add-activity"
              >
                <Plus size={14} /> Sortie
              </button>
              <div className="account-wrap">
                <button className="account-button" onClick={() => setAccountOpen(o => !o)} data-testid="button-account">
                  <img src={profile?.avatar_url || avatarFallback} alt="Avatar" /> 
                  <span className="hidden sm:inline">{profile?.pseudo || 'Mon profil'}</span>
                  <ChevronDown size={14} />
                </button>
                {accountOpen && (
                  <div className="account-menu">
                    <button onClick={() => { setActivityOpen(true); setAccountOpen(false); }} className="md:hidden">
                      <Plus size={14} /> Ajouter une sortie
                    </button>
                    <button onClick={() => { setProfileOpen(true); setAccountOpen(false); }}>
                      <Pencil size={14} /> Mon profil
                    </button>
                    <button onClick={handleLogout}>
                      <LogOut size={14} /> Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button className="nav-cta" onClick={() => requireAuth('signup')} data-testid="button-join">
              Rejoindre
            </button>
          )}
          <button className="menu-button md:hidden" aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="mobile-menu open border-b border-white/10" aria-label="Navigation mobile">
          <NavLink href="#trouver">Trouver un spot</NavLink>
          <NavLink href="#spots">Les spots</NavLink>
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
    <footer className="py-12 bg-black text-zinc-500 border-t border-white/5">
      <div className="container grid md:grid-cols-4 gap-8 mb-12">
        <div className="md:col-span-1">
          <Link href="/" className="brand text-white mb-4 block">
            <span className="brand-mark">S</span><span>Senti<i>z</i></span>
          </Link>
          <p className="text-sm">Le classement VTT local. Rentre tes sorties, grimpe dans le tableau, et trouve les meilleures traces de ta région.</p>
        </div>
        <div>
          <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-xs">Navigation</h4>
          <ul className="space-y-2 text-sm">
            <li><FooterLink href="#trouver">Trouver un spot</FooterLink></li>
            <li><FooterLink href="#spots">Les spots</FooterLink></li>
            <li><FooterLink href="#classement">Classement</FooterLink></li>
            <li><FooterLink href="#faq">Questions fréquentes</FooterLink></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-xs">Légal</h4>
          <ul className="space-y-2 text-sm">
            <li><FooterLink href="/legal">Mentions légales</FooterLink></li>
            <li><FooterLink href="/legal">Confidentialité</FooterLink></li>
            <li><FooterLink href="/legal">Conditions d'utilisation</FooterLink></li>
            <li><FooterLink href="/legal#contact">Contact</FooterLink></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-xs">Suivez-nous</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-primary transition-colors">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="container pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
        <p>© {new Date().getFullYear()} Sentiz. Tous droits réservés.</p>
        <button className="share-button hover:text-white transition-colors" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
          <Share2 size={14} /> Partager Sentiz
        </button>
      </div>
    </footer>
  );
}

export function Toast() {
  const { notice, setNotice } = useSentiz();
  if (!notice) return null;
  return (
    <button className="toast-notice animate-in slide-in-from-bottom-5" onClick={() => setNotice('')} data-testid="toast-notice">
      <div className="w-6 h-6 bg-primary text-black rounded-full flex items-center justify-center font-bold">✓</div>
      {notice}
    </button>
  );
}
