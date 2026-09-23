import { Gauge, Timer } from 'lucide-react';
import type { RideActivity } from '../types';

export function formatKm(value: number) {
  return value.toLocaleString('fr-FR', { maximumFractionDigits: 1 });
}

export function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? `${hours} h ${minutes.toString().padStart(2, '0')}` : `${minutes} min`;
}

export function RideRow({ ride }: { ride: RideActivity }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/40 p-4">
      <div>
        <div className="font-bold">{ride.discipline}</div>
        <div className="text-zinc-500 text-xs uppercase tracking-widest">
          {new Date(ride.activity_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
          {' · '}{ride.source === 'gps' ? 'GPS' : 'Manuelle'}
        </div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold">{formatKm(ride.distance_km)} <span className="text-primary text-sm">km</span></div>
        <div className="text-zinc-500 text-xs flex items-center justify-end gap-3">
          <span className="flex items-center gap-1"><Timer size={12} />{formatDuration(ride.duration_seconds)}</span>
          <span className="flex items-center gap-1"><Gauge size={12} />{Math.round(ride.max_speed_kmh)} km/h</span>
        </div>
      </div>
    </div>
  );
}
