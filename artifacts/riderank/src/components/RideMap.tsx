import { useMemo } from 'react';
import type { GpsPoint } from '../types';

export const SPEED_LEVELS = [
  { label: 'Lent', max: 10, color: '#ffffff' },
  { label: 'Roulant', max: 25, color: '#ffb48a' },
  { label: 'Rapide', max: 40, color: '#ff5b1a' },
  { label: 'Vitesse max', max: Infinity, color: '#ff2a2a' },
];

export function speedColor(speedKmh: number) {
  return (SPEED_LEVELS.find((level) => speedKmh < level.max) ?? SPEED_LEVELS[SPEED_LEVELS.length - 1]).color;
}

export function SpeedLegend({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-x-4 gap-y-1 ${className}`}>
      {SPEED_LEVELS.map((level) => (
        <span key={level.label} className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
          <span className="w-4 h-1 rounded-full" style={{ background: level.color }} />
          {level.label}
        </span>
      ))}
    </div>
  );
}

export function RideMap({ points }: { points: GpsPoint[] }) {
  const trace = useMemo(() => {
    if (points.length < 2) return null;
    const lats = points.map((point) => point.lat);
    const lngs = points.map((point) => point.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const latRange = Math.max(maxLat - minLat, 0.0001);
    const lngRange = Math.max(maxLng - minLng, 0.0001);
    const coords = points.map((point) => ({
      x: 12 + ((point.lng - minLng) / lngRange) * 276,
      y: 108 - ((point.lat - minLat) / latRange) * 96,
      speed: point.speed_kmh,
    }));
    const format = (coord: { x: number; y: number }) => `${coord.x.toFixed(1)} ${coord.y.toFixed(1)}`;

    const segments: { color: string; d: string }[] = [];
    let color = speedColor(coords[1].speed);
    let d = `M ${format(coords[0])}`;
    for (let i = 1; i < coords.length; i++) {
      const next = speedColor(coords[i].speed);
      if (next !== color) {
        segments.push({ color, d });
        d = `M ${format(coords[i - 1])}`;
        color = next;
      }
      d += ` L ${format(coords[i])}`;
    }
    segments.push({ color, d });
    return { segments, start: coords[0] };
  }, [points]);

  return (
    <div className="relative h-56 rounded-[28px] overflow-hidden border border-primary/35 bg-[#090909]">
      <div className="absolute inset-0 opacity-35 bg-[linear-gradient(rgba(255,91,26,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,91,26,.16)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <svg viewBox="0 0 300 120" className="absolute inset-0 w-full h-full" aria-label="Tracé GPS de la sortie">
        {trace?.segments.map((segment, index) => (
          <path key={index} d={segment.d} fill="none" stroke={segment.color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {trace && <circle cx={trace.start.x} cy={trace.start.y} r="5" fill="#fff" />}
      </svg>
      {!trace && (
        <div className="absolute inset-0 flex items-center justify-center text-zinc-500 font-bold uppercase tracking-widest text-sm">
          Le tracé apparaîtra ici
        </div>
      )}
      <SpeedLegend className="absolute bottom-3 left-4 right-4" />
    </div>
  );
}
