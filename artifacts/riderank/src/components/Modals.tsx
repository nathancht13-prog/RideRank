import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSentiz } from '../SentizContext';
import type { Profile } from '../types';

function friendlyAuthError(message: string) {
  const value = message.toLowerCase();
  if (value.includes('already registered') || value.includes('already been registered')) return 'Cet e-mail est déjà utilisé.';
  if (value.includes('invalid login credentials')) return 'E-mail ou mot de passe incorrect.';
  if (value.includes('password')) return 'Le mot de passe doit contenir entre 6 et 8 caractères.';
  if (value.includes('email')) return 'Vérifie le format de ton adresse e-mail.';
  return 'Une erreur est survenue. Réessaie dans un instant.';
}

export function AuthModal() {
  const { authOpen, setAuthOpen, authMode, setAuthMode, setNotice } = useSentiz();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!authOpen) return null;

  const submitAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get('email') ?? '').trim();
    const password = String(form.get('password') ?? '');
    const pseudoRaw = String(form.get('pseudo') ?? '').trim();
    const pseudo = pseudoRaw.replace(/^@/, '').slice(0, 30);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Saisis une adresse e-mail valide.');
    if (password.length < 6 || password.length > 8) return setError('Le mot de passe doit contenir entre 6 et 8 caractères.');
    if (authMode === 'signup' && (pseudo.length < 2 || pseudo.length > 30)) return setError('Le pseudo doit contenir entre 2 et 30 caractères.');
    
    setBusy(true); setError('');
    const result = authMode === 'signup'
      ? await supabase.auth.signUp({ email, password, options: { data: { pseudo } } })
      : await supabase.auth.signInWithPassword({ email, password });
    
    setBusy(false);
    if (result.error) return setError(friendlyAuthError(result.error.message));
    
    setAuthOpen(false);
    setNotice(authMode === 'signup' && !result.data.session ? 'Compte créé. Consulte ton e-mail pour confirmer.' : 'Bienvenue dans la meute.');
  };

  return (
    <div className="modal-backdrop" onMouseDown={() => setAuthOpen(false)}>
      <section className="app-modal" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setAuthOpen(false)}><X size={20} /></button>
        <div className="eyebrow">Entre dans la course</div>
        <h2>{authMode === 'login' ? 'Connexion' : 'Créer un compte'}</h2>
        
        <div className="auth-tabs">
          <button className={authMode === 'login' ? 'active' : ''} onClick={() => { setAuthMode('login'); setError(''); }}>Connexion</button>
          <button className={authMode === 'signup' ? 'active' : ''} onClick={() => { setAuthMode('signup'); setError(''); }}>Inscription</button>
        </div>
        
        <form className="modal-form" onSubmit={submitAuth}>
          {authMode === 'signup' && (
            <label>Pseudo
              <div className="input-with-prefix">
                <span className="input-prefix">@</span>
                <input name="pseudo" minLength={2} maxLength={30} required placeholder="rider73" />
              </div>
            </label>
          )}
          <label>E-mail
            <input name="email" type="email" required placeholder="toi@exemple.com" />
          </label>
          <label>Mot de passe
            <input name="password" type="password" minLength={6} maxLength={8} required placeholder="••••••••" />
            <small className="field-help">6 à 8 caractères maximum.</small>
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="button-primary w-full" disabled={busy} data-testid="submit-auth">
            {busy ? 'Patiente…' : authMode === 'login' ? 'Se connecter' : 'Créer mon profil'}
          </button>
        </form>
      </section>
    </div>
  );
}

export function ProfileModal() {
  const { profileOpen, setProfileOpen, session, profile, setNotice, refreshData } = useSentiz();
  
  if (!profileOpen) return null;

  const submitProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session) return;
    const form = new FormData(e.currentTarget);
    const pseudo = String(form.get('pseudo') ?? '').trim().replace(/^@/, '').slice(0, 30);
    const ville = String(form.get('ville') ?? '').trim().slice(0, 80) || null;
    const bio = String(form.get('bio') ?? '').trim().slice(0, 500) || null;

    if (pseudo.length < 2) return setNotice('Le pseudo doit contenir au moins 2 caractères.');
    
    const { error } = await supabase.from('profiles').upsert({
      id: session.user.id, pseudo, ville, bio
    });
    
    if (error) setNotice('Erreur lors de la mise à jour (pseudo déjà pris ?).');
    else {
      setNotice('Profil mis à jour.');
      setProfileOpen(false);
      refreshData();
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={() => setProfileOpen(false)}>
      <section className="app-modal" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setProfileOpen(false)}><X size={20} /></button>
        <div className="eyebrow">Identité</div>
        <h2>Ton profil</h2>
        <form className="modal-form" onSubmit={submitProfile}>
          <label>Pseudo
            <div className="input-with-prefix">
              <span className="input-prefix">@</span>
              <input name="pseudo" defaultValue={profile?.pseudo} minLength={2} maxLength={30} required />
            </div>
          </label>
          <label>Ville / Région
            <input name="ville" defaultValue={profile?.ville || ''} maxLength={80} placeholder="Où roules-tu ?" />
          </label>
          <label>Bio
            <textarea name="bio" defaultValue={profile?.bio || ''} maxLength={500} rows={3} placeholder="Ta machine, ton style..." />
          </label>
          <button className="button-primary w-full">Enregistrer</button>
        </form>
      </section>
    </div>
  );
}

export function ActivityModal() {
  const { activityOpen, setActivityOpen, session, refreshData, setNotice } = useSentiz();
  const [busy, setBusy] = useState(false);

  if (!activityOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session) return;
    const form = new FormData(e.currentTarget);
    const distance = Number(form.get('distance'));
    const elevation = Number(form.get('elevation')) || 0;
    const date = form.get('date') as string;

    if (!distance || distance <= 0) return setNotice("Saisis une distance valide.");
    if (!date) return setNotice("La date est requise.");

    setBusy(true);
    const { error } = await supabase.from('ride_activities').insert({
       user_id: session.user.id,
       distance_km: distance,
       elevation_m: elevation,
       activity_date: date
    });
    setBusy(false);

    if (error) {
       setNotice("Impossible d'ajouter la sortie.");
       console.error(error);
    } else {
       setNotice("Sortie ajoutée au classement !");
       setActivityOpen(false);
       refreshData();
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={() => setActivityOpen(false)}>
      <section className="app-modal" role="dialog" aria-modal="true" onMouseDown={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setActivityOpen(false)}><X size={20} /></button>
        <div className="eyebrow">Nouvelle trace</div>
        <h2>Ajouter une sortie</h2>
        <p className="text-sm text-zinc-400 mb-6">Les kilomètres réels font grimper ton rang. Sois honnête avec toi-même.</p>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label>Date de la sortie
            <input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} max={new Date().toISOString().split('T')[0]} />
          </label>
          <div className="grid grid-cols-2 gap-4">
             <label>Distance (km)
               <input name="distance" type="number" step="0.1" min="0.1" max="500" required placeholder="Ex: 24.5" />
             </label>
             <label>Dénivelé D+ (m)
               <input name="elevation" type="number" step="1" min="0" max="10000" placeholder="Ex: 850" />
             </label>
          </div>
          <button className="button-primary w-full mt-2" disabled={busy} data-testid="submit-activity">
             {busy ? 'Enregistrement...' : 'Valider la sortie'}
          </button>
        </form>
      </section>
    </div>
  );
}

export function ReviewModal() {
  const { reviewOpen, setReviewOpen, session, selectedSpot, setNotice, refreshData } = useSentiz();
  
  if (!reviewOpen) return null;

  const submitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session || !selectedSpot) return;
    const form = new FormData(e.currentTarget);
    const rating = Number(form.get('rating'));
    const comment = String(form.get('comment') ?? '').trim().slice(0, 1000);

    if (rating < 1 || rating > 5) return setNotice('Choisis une note entre 1 et 5.');

    const { error } = await supabase.from('spot_reviews').upsert(
      { user_id: session.user.id, spot_id: selectedSpot, rating, comment },
      { onConflict: 'user_id,spot_id' }
    );

    if (error) setNotice('Erreur lors de la publication de l’avis.');
    else {
      setNotice('Avis enregistré.');
      setReviewOpen(false);
      refreshData();
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={() => setReviewOpen(false)}>
      <section className="app-modal" role="dialog" aria-modal="true" onMouseDown={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setReviewOpen(false)}><X size={20} /></button>
        <div className="eyebrow">Avis terrain</div>
        <h2>Note ce spot</h2>
        <form className="modal-form" onSubmit={submitReview}>
          <label>Note
            <select name="rating" defaultValue="5">
              {[5,4,3,2,1].map(v => <option key={v} value={v}>{v} / 5</option>)}
            </select>
          </label>
          <label>Commentaire
            <textarea name="comment" maxLength={1000} rows={4} placeholder="Conditions, difficulté, état de la trace..." />
          </label>
          <button className="button-primary w-full mt-2">Publier l'avis</button>
        </form>
      </section>
    </div>
  );
}

export function Modals() {
  return (
    <>
      <AuthModal />
      <ProfileModal />
      <ActivityModal />
      <ReviewModal />
    </>
  );
}
