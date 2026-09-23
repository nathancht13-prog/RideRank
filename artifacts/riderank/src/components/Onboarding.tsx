import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import {
  X, ChevronLeft, Zap, Trophy, BarChart3, HelpCircle, Camera, Eye, EyeOff,
  Check, Bike, Mountain, Battery, Landmark, Infinity as InfinityIcon,
  Palette, ShieldCheck,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useBikeRank } from '../BikeRankContext';
import { SpeedDial } from './SpeedDial';

function friendlyAuthError(message: string) {
  const value = message.toLowerCase();
  if (value.includes('already registered') || value.includes('already been registered')) return 'Cet e-mail est déjà utilisé.';
  if (value.includes('password')) return 'Le mot de passe doit contenir entre 6 et 8 caractères.';
  if (value.includes('email')) return 'Vérifie le format de ton adresse e-mail.';
  return 'Une erreur est survenue. Réessaie dans un instant.';
}

const GOALS = [
  { id: 'record', icon: Zap, title: 'Battez mon record', desc: 'Dépasse tes propres perfs' },
  { id: 'classement', icon: Trophy, title: 'Grimpez au classement', desc: 'Affrontez la communauté' },
  { id: 'historique', icon: BarChart3, title: 'Enregistrez chaque sortie', desc: 'Constituez un historique complet' },
  { id: 'curiosite', icon: HelpCircle, title: 'Simple curiosité', desc: 'Découvrez ce que fait Bike Rank' },
];

const DISCIPLINES = [
  { id: 'Enduro', icon: Mountain, popularity: 950 },
  { id: 'Trail', icon: Bike, popularity: 780 },
  { id: 'Bike park', icon: Landmark, popularity: 640 },
  { id: 'DH', icon: Zap, popularity: 410 },
  { id: 'XC', icon: BarChart3, popularity: 360 },
  { id: 'e-VTT', icon: Battery, popularity: 290 },
];

const LEADERBOARD_PREVIEW = [
  { pseudo: '@rootz_rider', value: 61 },
  { pseudo: '@sendit_theo', value: 58 },
  { pseudo: '@trailking', value: 54 },
];

const CONFIG_STEPS = [
  'Profil créé',
  'Ajout de votre pratique',
  'Connexion au classement',
  'Réglage selon votre objectif',
  'Calibrage GPS',
];

const PLANS = [
  { id: 'yearly', label: 'Pro · annuel', price: '59,99 €', sub: 'facturé annuellement · -75%', strike: '239,99 €' },
  { id: 'weekly', label: 'Pro · hebdo', price: '3,99 €', sub: 'sans engagement' },
];

const PRO_FEATURES = [
  { icon: BarChart3, title: 'Analyses avancées', desc: "Profil D+, vitesse virage par virage, forces G" },
  { icon: InfinityIcon, title: 'Historique illimité', desc: 'Gratuit garde 30 jours · Pro garde tout, pour toujours' },
  { icon: Palette, title: 'Thèmes de carte', desc: 'Topo, satellite, contraste nuit et plus' },
  { icon: ShieldCheck, title: 'Sans pub, prioritaire', desc: 'Synchro plus rapide, zéro bannière' },
];

type Step =
  | 'splash' | 'feature' | 'goal' | 'discipline' | 'social'
  | 'profile' | 'leaderboard' | 'loading' | 'credentials' | 'paywall';

const CONTENT_STEPS: Step[] = ['feature', 'goal', 'discipline', 'social', 'profile', 'leaderboard'];

export function Onboarding() {
  const { setAuthOpen, setAuthMode, setNotice } = useBikeRank();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<Step>('splash');
  const [goal, setGoal] = useState<string | null>(null);
  const [discipline, setDiscipline] = useState<string | null>(null);
  const [pseudo, setPseudo] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [configIndex, setConfigIndex] = useState(0);

  const stepIndex = CONTENT_STEPS.indexOf(step);

  const goBack = () => {
    if (stepIndex > 0) setStep(CONTENT_STEPS[stepIndex - 1]);
    else if (step === 'feature') setStep('splash');
  };

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, []);

  useEffect(() => {
    if (step !== 'loading') return;
    setConfigIndex(0);
    const timers = CONFIG_STEPS.map((_, i) =>
      setTimeout(() => setConfigIndex(i + 1), 480 * (i + 1))
    );
    const done = setTimeout(() => setStep('credentials'), 480 * CONFIG_STEPS.length + 500);
    return () => { timers.forEach(clearTimeout); clearTimeout(done); };
  }, [step]);

  const submitCredentials = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get('email') ?? '').trim();
    const password = String(form.get('password') ?? '');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Saisis une adresse e-mail valide.');
    if (password.length < 6 || password.length > 8) return setError('Le mot de passe doit contenir entre 6 et 8 caractères.');

    setBusy(true); setError('');
    const result = await supabase.auth.signUp({
      email, password,
      options: { data: { pseudo: pseudo || null, goal, discipline } },
    });
    setBusy(false);

    if (result.error) return setError(friendlyAuthError(result.error.message));
    setStep('paywall');
  };

  const finish = (msg: string) => {
    setAuthOpen(false);
    setNotice(msg);
    setLocation('/app');
  };

  const switchToLogin = () => {
    setAuthMode('login');
  };

  // ---- Splash ----
  if (step === 'splash') {
    return (
      <div className="onboarding-page">
        <section className="app-modal onboarding-modal" role="dialog" aria-modal="true">
          <button className="modal-close" onClick={() => setAuthOpen(false)}><X size={24} /></button>
          <div className="flex flex-col items-center justify-center text-center py-10">
            <SpeedDial value={65} />
            <img src="/brand/bike-rank-logo-transparent.png" alt="Bike Rank" className="h-12 object-contain mt-10 mb-3 drop-shadow-md" />
            <div className="text-zinc-400 text-sm font-bold tracking-[0.3em] uppercase mb-12">
              Ride · Progresse · Monte en places
            </div>
            <button className="button-primary w-full py-4 text-xl" onClick={() => setStep('feature')} data-testid="onboarding-start">
              Commencer
            </button>
            <p className="text-zinc-500 text-sm mt-6">
              En continuant, vous acceptez nos <a href="/legal" className="text-primary underline">Conditions d'utilisation</a>
            </p>
          </div>
        </section>
      </div>
    );
  }

  // ---- Loading ----
  if (step === 'loading') {
    return (
      <div className="onboarding-page">
        <section className="app-modal onboarding-modal" role="dialog" aria-modal="true">
          <div className="flex flex-col items-center justify-center text-center py-16">
            <div className="relative w-28 h-28 mb-10">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="44" fill="none" stroke="#ff5b1a" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={276}
                  strokeDashoffset={276 - (276 * configIndex) / CONFIG_STEPS.length}
                  style={{ transition: 'stroke-dashoffset .4s ease' }}
                />
              </svg>
              <Zap className="absolute inset-0 m-auto text-primary" size={34} />
            </div>
            <h2 className="!mb-2 !text-3xl">Configuration de votre Bike Rank</h2>
            <p className="text-zinc-400 mb-8">Un instant, @{pseudo || 'rider'}…</p>
            <div className="flex flex-col gap-4 items-start w-full max-w-xs mx-auto">
              {CONFIG_STEPS.map((label, i) => (
                <div key={label} className="flex items-center gap-3">
                  <span
                    className="w-7 h-7 rounded-full grid place-items-center shrink-0 border transition-colors"
                    style={{
                      borderColor: i < configIndex ? '#ff5b1a' : 'rgba(255,255,255,0.15)',
                      background: i < configIndex ? '#ff5b1a' : i === configIndex ? 'rgba(255,91,26,0.15)' : 'transparent',
                    }}
                  >
                    {i < configIndex && <Check size={16} color="#000" strokeWidth={3} />}
                    {i === configIndex && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                  </span>
                  <span className={i <= configIndex ? 'text-white font-semibold' : 'text-zinc-500'}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ---- Credentials ----
  if (step === 'credentials') {
    return (
      <div className="onboarding-page">
        <section className="app-modal onboarding-modal" role="dialog" aria-modal="true">
          <button className="modal-close" onClick={() => setAuthOpen(false)}><X size={24} /></button>
          <div className="eyebrow mb-2">Dernière étape</div>
          <h2 className="drop-shadow-[0_0_15px_rgba(255,91,26,0.3)]">Créer ton compte</h2>
          <form className="modal-form" onSubmit={submitCredentials}>
            <label>E-mail
              <input name="email" type="email" required placeholder="toi@exemple.com" />
            </label>
            <label>Mot de passe
              <div className="input-with-suffix">
                <input name="password" type={showPassword ? 'text' : 'password'} minLength={6} maxLength={8} required placeholder="••••••••" />
                <button type="button" className="input-suffix-btn" onClick={() => setShowPassword((v) => !v)} aria-label="Afficher le mot de passe">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <small className="field-help">6 à 8 caractères maximum.</small>
            </label>
            {error && <p className="form-error text-lg">{error}</p>}
            <button className="button-primary w-full py-4 text-xl" disabled={busy} data-testid="submit-onboarding">
              {busy ? 'Patiente…' : 'Créer mon profil'}
            </button>
          </form>
          <p className="text-zinc-500 text-sm mt-6 text-center">
            Déjà un compte ?{' '}
            <button className="text-primary underline font-semibold" onClick={switchToLogin}>Se connecter</button>
          </p>
        </section>
      </div>
    );
  }

  // ---- Paywall ----
  if (step === 'paywall') {
    return (
      <div className="onboarding-page">
        <section className="app-modal onboarding-modal" role="dialog" aria-modal="true">
          <button className="modal-close" onClick={() => finish('Bienvenue dans la meute.')}><X size={24} /></button>
          <div className="eyebrow mb-2">Tu es prêt, @{pseudo || 'rider'}</div>
          <h2 className="!text-4xl">Débloque tout ce que Bike Rank peut faire</h2>

          <div className="flex items-center gap-4 mt-6 p-4 rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="w-12 h-12 rounded-full border border-primary/50 grid place-items-center shrink-0">
              <Bike className="text-primary" size={22} />
            </div>
            <div>
              <div className="font-bold">{discipline || 'Enduro'} · France</div>
              <div className="text-zinc-400 text-sm">Classé parmi <span className="text-primary font-semibold">76 055</span> riders {discipline || 'Enduro'}</div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-6">
            {PLANS.map((plan) => (
              <div key={plan.id} className={`flex items-center justify-between p-5 rounded-2xl border ${plan.id === 'yearly' ? 'border-primary shadow-[0_0_25px_rgba(255,91,26,0.25)] bg-primary/10' : 'border-white/15'}`}>
                <div>
                  <div className="font-bold text-lg">{plan.label}</div>
                  <div className="text-zinc-400 text-sm">{plan.sub}</div>
                </div>
                <div className="text-right">
                  {plan.strike && <div className="text-zinc-500 line-through text-sm">{plan.strike}</div>}
                  <div className="text-2xl font-bold text-white">{plan.price}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 mt-8">
            {PRO_FEATURES.map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/15 grid place-items-center shrink-0">
                  <f.icon className="text-primary" size={20} />
                </div>
                <div>
                  <div className="font-bold">{f.title}</div>
                  <div className="text-zinc-400 text-sm">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <button className="button-primary w-full py-4 text-xl mt-8" onClick={() => finish('Essai Pro activé. Bienvenue dans la meute.')} data-testid="cta-paywall">
            Démarrer l'essai de 30 jours
          </button>
          <button className="text-zinc-500 text-sm mt-4 mx-auto block underline" onClick={() => finish('Bienvenue dans la meute.')}>
            Continuer sans Pro
          </button>
          <div className="flex justify-center gap-6 text-zinc-600 text-xs mt-6">
            <a href="/legal" className="hover:text-zinc-400">Confidentialité</a>
            <a href="/legal" className="hover:text-zinc-400">Conditions</a>
          </div>
        </section>
      </div>
    );
  }

  // ---- Content steps (feature / goal / discipline / social / profile / leaderboard) ----
  return (
    <div className="onboarding-page">
      <section className="app-modal onboarding-modal" role="dialog" aria-modal="true">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={goBack} className="text-zinc-400 hover:text-white shrink-0" aria-label="Retour"><ChevronLeft size={26} /></button>
          <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${((stepIndex + 1) / CONTENT_STEPS.length) * 100}%` }} />
          </div>
          <span className="text-zinc-500 text-sm font-bold shrink-0">{stepIndex + 1}/{CONTENT_STEPS.length}</span>
        </div>

        {step === 'feature' && (
          <div>
            <div className="eyebrow mb-2">02 · Suivi</div>
            <h2>Chaque sortie, archivée</h2>
            <p className="text-zinc-400 text-lg mb-8">Distance, D+, vitesse max, dénivelé. Ta vie sur les traces, capturée.</p>
            <div className="rounded-3xl border border-primary/40 bg-black/60 p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Sam · 16:20</div>
                  <div className="text-xl font-bold">Les Gets → Morzine</div>
                </div>
                <span className="bg-primary/15 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">Nouveau record</span>
              </div>
              <svg viewBox="0 0 300 90" className="w-full h-20 mb-6">
                <path d="M10,75 Q60,20 120,35 T220,25 T290,60" fill="none" stroke="#ff5b1a" strokeWidth="3" strokeLinecap="round" />
                <circle cx="120" cy="35" r="5" fill="#fff" />
              </svg>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Distance</div>
                  <div className="text-3xl font-bold">12<span className="text-primary text-lg"> km</span></div>
                </div>
                <div>
                  <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">D+</div>
                  <div className="text-3xl font-bold">850<span className="text-primary text-lg"> m</span></div>
                </div>
                <div>
                  <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Vit. max</div>
                  <div className="text-3xl font-bold">47<span className="text-primary text-lg"> km/h</span></div>
                </div>
              </div>
            </div>
            <button className="button-primary w-full py-4 text-xl mt-8" onClick={() => setStep('goal')}>Suivant</button>
          </div>
        )}

        {step === 'goal' && (
          <div>
            <h2>Quel est votre objectif ?</h2>
            <p className="text-zinc-400 text-lg mb-8">On adaptera Bike Rank en conséquence. Modifiable plus tard.</p>
            <div className="flex flex-col gap-3">
              {GOALS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className="flex items-center gap-4 p-5 rounded-2xl border text-left transition-colors"
                  style={{ borderColor: goal === g.id ? '#ff5b1a' : 'rgba(255,255,255,0.12)', background: goal === g.id ? 'rgba(255,91,26,0.1)' : 'transparent' }}
                >
                  <div className="w-11 h-11 rounded-xl bg-white/5 grid place-items-center shrink-0"><g.icon size={20} /></div>
                  <div className="flex-1">
                    <div className="font-bold">{g.title}</div>
                    <div className="text-zinc-500 text-sm">{g.desc}</div>
                  </div>
                  <span className="w-6 h-6 rounded-full border-2 shrink-0" style={{ borderColor: goal === g.id ? '#ff5b1a' : 'rgba(255,255,255,0.2)', background: goal === g.id ? '#ff5b1a' : 'transparent' }} />
                </button>
              ))}
            </div>
            <button className="button-primary w-full py-4 text-xl mt-8 disabled:opacity-40" disabled={!goal} onClick={() => setStep('discipline')}>Continuer</button>
          </div>
        )}

        {step === 'discipline' && (
          <div>
            <h2>Choisissez votre pratique</h2>
            <p className="text-zinc-400 text-lg mb-8">Ton style de ride principal. Modifiable plus tard.</p>
            <div className="grid grid-cols-3 gap-3">
              {DISCIPLINES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDiscipline(d.id)}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl border transition-colors"
                  style={{ borderColor: discipline === d.id ? '#ff5b1a' : 'rgba(255,255,255,0.12)', background: discipline === d.id ? 'rgba(255,91,26,0.1)' : 'transparent' }}
                >
                  <d.icon size={24} className={discipline === d.id ? 'text-primary' : 'text-zinc-400'} />
                  <span className="text-sm font-bold text-center">{d.id}</span>
                </button>
              ))}
            </div>
            <button className="button-primary w-full py-4 text-xl mt-8 disabled:opacity-40" disabled={!discipline} onClick={() => setStep('social')}>Continuer</button>
          </div>
        )}

        {step === 'social' && (
          <div>
            <span className="inline-block bg-primary/15 text-primary text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              N°1 le plus populaire sur Bike Rank
            </span>
            <div className="text-center mb-2">
              <div className="text-6xl font-bold text-primary">{DISCIPLINES.find((d) => d.id === discipline)?.popularity ?? 950}</div>
              <div className="text-lg font-bold mt-2">Riders {discipline || 'Enduro'} sur Bike Rank</div>
              <p className="text-zinc-500 mt-1">Vous rejoignez l'une des pratiques les plus actives de la plateforme.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 mt-6 flex flex-col gap-4">
              {DISCIPLINES.slice(0, 4).sort((a, b) => b.popularity - a.popularity).map((d) => (
                <div key={d.id} className="flex items-center gap-3">
                  <span className={`w-24 shrink-0 text-sm font-semibold ${d.id === discipline ? 'text-primary' : 'text-zinc-300'}`}>{d.id}{d.id === discipline && ' ★'}</span>
                  <div className="flex-1 h-2.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(d.popularity / 950) * 100}%`, background: d.id === discipline ? '#ff5b1a' : 'rgba(255,255,255,0.25)' }} />
                  </div>
                  <span className="text-zinc-500 text-sm w-10 text-right">{d.popularity}</span>
                </div>
              ))}
            </div>
            <button className="button-primary w-full py-4 text-xl mt-8" onClick={() => setStep('profile')}>Continuer</button>
          </div>
        )}

        {step === 'profile' && (
          <div>
            <h2>Votre profil</h2>
            <p className="text-zinc-400 text-lg mb-8">Comment vous apparaîtrez dans les classements.</p>
            <div className="flex flex-col items-center mb-8">
              <div className="w-32 h-32 rounded-full border-2 border-dashed border-white/20 grid place-items-center relative bg-primary/5">
                <Bike className="text-zinc-600" size={36} />
                <span className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-primary grid place-items-center shadow-[0_0_15px_rgba(255,91,26,0.6)]">
                  <Camera size={18} color="#000" />
                </span>
              </div>
              <p className="text-zinc-500 text-sm mt-3">Touchez pour ajouter votre VTT</p>
            </div>
            <label>Nom d'utilisateur
              <div className="input-with-prefix">
                <span className="input-prefix">@</span>
                <input value={pseudo} onChange={(e) => setPseudo(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} minLength={2} maxLength={18} placeholder="trail_runner" />
              </div>
            </label>
            <p className="text-zinc-500 text-sm mt-2">3 à 18 caractères, en minuscules</p>
            <button className="button-primary w-full py-4 text-xl mt-8 disabled:opacity-40" disabled={pseudo.length < 2} onClick={() => setStep('leaderboard')}>Continuer</button>
          </div>
        )}

        {step === 'leaderboard' && (
          <div>
            <div className="eyebrow mb-2">01 · Compétition</div>
            <h2>Défiez le classement</h2>
            <p className="text-zinc-400 text-lg mb-8">Voyez où vous vous situez parmi les riders de votre région, de votre pays et du monde.</p>
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5">
              <div className="flex items-center gap-2 mb-5">
                <Zap className="text-primary" size={18} />
                <span className="font-bold flex-1">Vitesse max · Enduro</span>
                <span className="text-zinc-500 text-sm">Cette semaine</span>
              </div>
              <div className="flex flex-col gap-3">
                {LEADERBOARD_PREVIEW.map((r, i) => (
                  <div key={r.pseudo} className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-white/10 grid place-items-center text-sm font-bold">{i + 1}</span>
                    <span className="flex-1 font-semibold">{r.pseudo}</span>
                    <span className="font-bold">{r.value} <span className="text-zinc-500 text-sm">km/h</span></span>
                  </div>
                ))}
                <div className="flex items-center gap-3 p-3 -mx-3 rounded-xl border border-primary bg-primary/10">
                  <span className="w-7 h-7 rounded-full bg-primary text-black grid place-items-center text-sm font-bold">4</span>
                  <span className="flex-1 font-semibold text-primary">@{pseudo || 'toi'}</span>
                  <span className="font-bold text-primary">49 <span className="text-primary/70 text-sm">km/h</span></span>
                </div>
              </div>
            </div>
            <button className="button-primary w-full py-4 text-xl mt-8" onClick={() => setStep('loading')} data-testid="onboarding-finish-content">Suivant</button>
          </div>
        )}
      </section>
    </div>
  );
}

