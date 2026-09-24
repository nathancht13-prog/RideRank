import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, MapPin, Navigation, Pause, Play, Share2, Square, Timer } from 'lucide-react';
import { Link } from 'wouter';
import { useBikeRank } from '../BikeRankContext';
import { SpeedDial } from '../components/SpeedDial';
import { RideMap } from '../components/RideMap';
import { dateKey } from '../lib/weekStats';
import { supabase } from '../lib/supabase';
import type { GpsPoint, RideActivity } from '../types';

type TrackerStatus = 'idle' | 'tracking' | 'paused' | 'summary' | 'saving' | 'saved';

const toRadians = (value: number) => value * Math.PI / 180;

function distanceBetween(a: GpsPoint, b: GpsPoint) {
  const earthRadiusKm = 6371;
  const latDelta = toRadians(b.lat - a.lat);
  const lngDelta = toRadians(b.lng - a.lng);
  const value =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * Math.sin(lngDelta / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return hours > 0
    ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    : `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function RideTrackerPage() {
  const {
    session, requireAuth, refreshData, setLatestActivity, setShareOpen, setNotice,
  } = useBikeRank();
  const [status, setStatus] = useState<TrackerStatus>('idle');
  const [points, setPoints] = useState<GpsPoint[]>([]);
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [discipline, setDiscipline] = useState<RideActivity['discipline']>('Enduro');
  const [gpsMessage, setGpsMessage] = useState('Prêt à chercher le signal GPS.');
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const startedAtRef = useRef<Date | null>(null);
  const endedAtRef = useRef<Date | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const activeSecondsRef = useRef(0);
  const activeSegmentStartedRef = useRef<number | null>(null);

  const averageSpeed = duration > 0 ? distance / (duration / 3600) : 0;

  const stopWatch = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  const beginWatch = () => {
    if (!navigator.geolocation) {
      setGpsMessage("La géolocalisation n'est pas disponible sur ce navigateur.");
      return false;
    }
    setGpsMessage('Recherche du signal GPS…');
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const nextPoint: GpsPoint = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: position.timestamp,
          accuracy: Math.round(position.coords.accuracy),
          speed_kmh: Number.isFinite(position.coords.speed) ? Math.max(0, (position.coords.speed ?? 0) * 3.6) : 0,
        };
        if (nextPoint.accuracy > 65) {
          setGpsMessage(`Signal imprécis (${nextPoint.accuracy} m). Reste quelques instants à ciel ouvert.`);
          return;
        }
        setPoints((currentPoints) => {
          const previous = currentPoints[currentPoints.length - 1];
          let measuredSpeed = nextPoint.speed_kmh;
          if (previous) {
            const segmentDistance = distanceBetween(previous, nextPoint);
            const elapsedHours = Math.max(nextPoint.timestamp - previous.timestamp, 1) / 3_600_000;
            const segmentSpeed = segmentDistance / elapsedHours;
            if (segmentSpeed > 120) return currentPoints;
            measuredSpeed = nextPoint.speed_kmh > 0 ? nextPoint.speed_kmh : segmentSpeed;
            if (segmentDistance >= 0.003) setDistance((value) => value + segmentDistance);
          }
          measuredSpeed = Number.isFinite(measuredSpeed) && measuredSpeed <= 120 ? measuredSpeed : 0;
          setCurrentSpeed(measuredSpeed);
          setMaxSpeed((value) => Math.max(value, measuredSpeed));
          return [...currentPoints, { ...nextPoint, speed_kmh: measuredSpeed }];
        });
        setGpsMessage(`GPS actif · précision ${nextPoint.accuracy} m`);
      },
      (error) => {
        const messages: Record<number, string> = {
          1: "Autorise l'accès à ta position pour enregistrer la sortie.",
          2: 'Signal GPS indisponible. Essaie de te placer à ciel ouvert.',
          3: 'Le GPS met trop de temps à répondre. Réessaie.',
        };
        if (activeSegmentStartedRef.current !== null) {
          activeSecondsRef.current += Math.floor((Date.now() - activeSegmentStartedRef.current) / 1000);
          activeSegmentStartedRef.current = null;
          setDuration(activeSecondsRef.current);
        }
        setGpsMessage(messages[error.code] || 'Impossible de poursuivre le suivi GPS.');
        setStatus(error.code === error.PERMISSION_DENIED ? 'idle' : 'paused');
        stopWatch();
      },
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 15000 },
    );
    return true;
  };

  const startRide = () => {
    if (!session) {
      requireAuth('login');
      return;
    }
    setPoints([]);
    setDuration(0);
    setDistance(0);
    setCurrentSpeed(0);
    setMaxSpeed(0);
    activeSecondsRef.current = 0;
    activeSegmentStartedRef.current = Date.now();
    startedAtRef.current = new Date();
    endedAtRef.current = null;
    if (beginWatch()) setStatus('tracking');
  };

  const pauseRide = () => {
    if (activeSegmentStartedRef.current !== null) {
      activeSecondsRef.current += Math.floor((Date.now() - activeSegmentStartedRef.current) / 1000);
      activeSegmentStartedRef.current = null;
      setDuration(activeSecondsRef.current);
    }
    stopWatch();
    setCurrentSpeed(0);
    setStatus('paused');
    setGpsMessage('Sortie en pause.');
  };

  const resumeRide = () => {
    activeSegmentStartedRef.current = Date.now();
    if (beginWatch()) setStatus('tracking');
  };

  const finishRide = () => {
    if (activeSegmentStartedRef.current !== null) {
      activeSecondsRef.current += Math.floor((Date.now() - activeSegmentStartedRef.current) / 1000);
      activeSegmentStartedRef.current = null;
      setDuration(activeSecondsRef.current);
    }
    stopWatch();
    endedAtRef.current = new Date();
    setCurrentSpeed(0);
    setStatus('summary');
  };

  const saveRide = async () => {
    if (!session || !startedAtRef.current) return;
    if (distance < 0.01 || duration < 5) {
      setNotice("La sortie est trop courte pour être enregistrée.");
      return;
    }
    setStatus('saving');
    const payload = {
      user_id: session.user.id,
      activity_date: dateKey(startedAtRef.current),
      distance_km: Number(distance.toFixed(3)),
      elevation_m: 0,
      duration_seconds: duration,
      average_speed_kmh: Number(averageSpeed.toFixed(1)),
      max_speed_kmh: Number(maxSpeed.toFixed(1)),
      discipline,
      source: 'gps',
      started_at: startedAtRef.current.toISOString(),
      ended_at: (endedAtRef.current ?? new Date()).toISOString(),
      track_points: points.map((point) => ({
        lat: Number(point.lat.toFixed(6)),
        lng: Number(point.lng.toFixed(6)),
        timestamp: point.timestamp,
        speed_kmh: Number(point.speed_kmh.toFixed(1)),
        accuracy: point.accuracy,
      })),
    };
    const { data, error } = await supabase.from('ride_activities').insert(payload).select().single();
    if (error) {
      console.error(error);
      setNotice("Impossible d'enregistrer la sortie GPS.");
      setStatus('summary');
      return;
    }
    setLatestActivity(data as RideActivity);
    await refreshData();
    setNotice('Sortie GPS enregistrée et ajoutée au classement !');
    setStatus('saved');
    setShareOpen(true);
  };

  useEffect(() => {
    if (status !== 'tracking') return;
    const timer = window.setInterval(() => {
      const currentSegment = activeSegmentStartedRef.current === null
        ? 0
        : Math.floor((Date.now() - activeSegmentStartedRef.current) / 1000);
      setDuration(activeSecondsRef.current + currentSegment);
    }, 250);
    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => {
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      if (status !== 'tracking' && status !== 'paused') return;
      event.preventDefault();
    };
    window.addEventListener('beforeunload', warnBeforeLeaving);
    return () => {
      stopWatch();
      window.removeEventListener('beforeunload', warnBeforeLeaving);
    };
  }, [status]);

  useEffect(() => {
    if (status !== 'tracking' || !('wakeLock' in navigator)) {
      setWakeLockActive(false);
      return;
    }
    let sentinel: WakeLockSentinel | null = null;
    let cancelled = false;

    const acquire = async () => {
      if (sentinel && !sentinel.released) return;
      try {
        const lock = await navigator.wakeLock.request('screen');
        if (cancelled) {
          lock.release().catch(() => {});
          return;
        }
        sentinel = lock;
        setWakeLockActive(true);
        lock.addEventListener('release', () => setWakeLockActive(false));
      } catch {
        setWakeLockActive(false);
      }
    };
    const reacquireWhenVisible = () => {
      if (document.visibilityState === 'visible') acquire();
    };

    acquire();
    document.addEventListener('visibilitychange', reacquireWhenVisible);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', reacquireWhenVisible);
      sentinel?.release().catch(() => {});
      setWakeLockActive(false);
    };
  }, [status]);

  if (!session) {
    return (
      <main className="min-h-screen pt-36 pb-24 bg-black">
        <div className="container max-w-2xl text-center">
          <Navigation className="w-16 h-16 text-primary mx-auto mb-8" />
          <h1 className="text-6xl md:text-8xl font-bold uppercase leading-none mb-6">Démarrer<br/><span className="text-primary">une sortie.</span></h1>
          <p className="text-zinc-400 text-xl mb-10">Connecte-toi pour enregistrer ton parcours GPS et grimper dans le classement.</p>
          <button onClick={() => requireAuth('login')} className="button-primary px-10 py-5 text-xl">S'inscrire / Se connecter</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-14 pb-44 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,91,26,.16),transparent_34%)]" />
      <div className="container max-w-4xl relative z-10">
        <Link href="/app" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white font-bold uppercase tracking-widest mb-10">
          <ArrowLeft size={18} /> Retour
        </Link>
        <div className="text-center mb-10">
          <div className="eyebrow mb-3">GPS Bike Rank</div>
          <h1 className="text-5xl md:text-7xl font-bold uppercase leading-none">Démarrer <span className="text-primary">une sortie.</span></h1>
        </div>

        <div className="rounded-2xl border border-primary/35 bg-primary/10 text-white p-4 mb-6 flex items-start gap-3">
          <Navigation className="text-primary shrink-0 mt-0.5" size={20} />
          <p className="font-medium">Garde l’appli ouverte pendant ta sortie : l’écran reste allumé automatiquement quand ton navigateur le permet. Le navigateur ne peut pas suivre ta position en arrière-plan.</p>
        </div>

        <section className="glass-glow-strong rounded-[32px] p-5 md:p-10">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary">
              <span className={`w-2.5 h-2.5 rounded-full ${status === 'tracking' ? 'bg-primary animate-pulse' : 'bg-zinc-600'}`} />
              {status === 'tracking' ? 'Enregistrement' : status === 'paused' ? 'En pause' : status === 'summary' || status === 'saving' || status === 'saved' ? 'Sortie terminée' : 'Prêt'}
            </div>
            <div className="text-zinc-500 text-xs font-bold">{gpsMessage}</div>
          </div>

          <div className="flex flex-col items-center mb-8">
            <SpeedDial value={currentSpeed} max={60} className="w-64 h-64 md:w-72 md:h-72" />
            {wakeLockActive && (
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mt-2">Écran maintenu allumé</div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { label: 'Distance', value: distance.toFixed(2), unit: 'km', icon: MapPin },
              { label: 'Durée', value: formatDuration(duration), unit: '', icon: Timer },
              { label: 'Moyenne', value: averageSpeed.toFixed(1), unit: 'km/h', icon: Navigation },
            ].map(({ label, value, unit, icon: Icon }) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-black/50 p-3 md:p-4">
                <div className="flex items-center gap-1.5 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 md:mb-3"><Icon size={14} /> {label}</div>
                <div className="text-2xl md:text-4xl font-bold">{value} <span className="text-xs md:text-sm text-zinc-500">{unit}</span></div>
              </div>
            ))}
          </div>

          <RideMap points={points} follow={status === 'tracking'} />

          {(status === 'summary' || status === 'saving' || status === 'saved') && (
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Vitesse maximale</div>
                <div className="text-4xl font-bold">{maxSpeed.toFixed(1)} <span className="text-primary text-lg">km/h</span></div>
              </div>
              <label className="rounded-2xl bg-white/5 border border-white/10 p-5 font-bold uppercase tracking-widest text-xs text-zinc-500">
                Discipline
                <select value={discipline} onChange={(event) => setDiscipline(event.target.value as RideActivity['discipline'])} className="mt-2 w-full bg-black text-white rounded-xl border border-white/15 p-3 text-base normal-case tracking-normal">
                  <option>Enduro</option><option>DH</option><option>XC</option><option>e-VTT</option><option>Bike park</option>
                </select>
              </label>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            {status === 'idle' && (
              <button onClick={startRide} className="button-primary flex-1 py-5 text-xl"><Play className="mr-2" fill="currentColor" /> Démarrer</button>
            )}
            {status === 'tracking' && (
              <>
                <button onClick={pauseRide} className="flex-1 py-5 rounded-xl border border-white/15 bg-white/10 font-bold uppercase flex items-center justify-center"><Pause className="mr-2" /> Pause</button>
                <button onClick={finishRide} className="flex-1 py-5 rounded-xl bg-white text-black font-bold uppercase flex items-center justify-center"><Square className="mr-2" fill="currentColor" /> Terminer</button>
              </>
            )}
            {status === 'paused' && (
              <>
                <button onClick={resumeRide} className="button-primary flex-1 py-5 text-xl"><Play className="mr-2" fill="currentColor" /> Reprendre</button>
                <button onClick={finishRide} className="flex-1 py-5 rounded-xl bg-white text-black font-bold uppercase flex items-center justify-center"><Square className="mr-2" fill="currentColor" /> Terminer</button>
              </>
            )}
            {(status === 'summary' || status === 'saving') && (
              <button onClick={saveRide} disabled={status === 'saving'} className="button-primary flex-1 py-5 text-xl">
                <Share2 className="mr-2" /> {status === 'saving' ? 'Enregistrement…' : 'Enregistrer et générer ma carte'}
              </button>
            )}
            {status === 'saved' && (
              <button onClick={startRide} className="button-primary flex-1 py-5 text-xl">
                <Play className="mr-2" fill="currentColor" /> Démarrer une nouvelle sortie
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}