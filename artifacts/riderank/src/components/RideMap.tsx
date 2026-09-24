import { useEffect, useMemo, useRef, useState } from 'react';
import type { GpsPoint } from '../types';
import { googleMapsAvailable, loadGoogleMaps, onMapsAuthFailure, type MapsApi } from '../lib/googleMaps';

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

type RideMapProps = {
  points: GpsPoint[];
  follow?: boolean;
};

function GoogleRideMap({ points, follow = false, onError }: RideMapProps & { onError: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const linesRef = useRef<any[]>([]);
  const currentLineRef = useRef<{ line: any; color: string } | null>(null);
  const startMarkerRef = useRef<any>(null);
  const headMarkerRef = useRef<any>(null);
  const drawnCountRef = useRef(0);
  const [api, setApi] = useState<MapsApi | null>(null);

  useEffect(() => {
    let cancelled = false;
    const unsubscribe = onMapsAuthFailure(onError);

    loadGoogleMaps()
      .then((maps) => {
        if (cancelled || !containerRef.current) return;
        mapRef.current = new maps.Map(containerRef.current, {
          center: { lat: 46.6, lng: 2.4 },
          zoom: 5,
          mapTypeId: 'terrain',
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: 'cooperative',
        });
        setApi(maps);
      })
      .catch(() => { if (!cancelled) onError(); });

    return () => {
      cancelled = true;
      unsubscribe();
      linesRef.current.forEach((line) => line.setMap(null));
      linesRef.current = [];
      currentLineRef.current = null;
      startMarkerRef.current?.setMap(null);
      headMarkerRef.current?.setMap(null);
      startMarkerRef.current = null;
      headMarkerRef.current = null;
      drawnCountRef.current = 0;
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!api || !map) return;

    if (points.length < drawnCountRef.current) {
      linesRef.current.forEach((line) => line.setMap(null));
      linesRef.current = [];
      currentLineRef.current = null;
      startMarkerRef.current?.setMap(null);
      headMarkerRef.current?.setMap(null);
      startMarkerRef.current = null;
      headMarkerRef.current = null;
      drawnCountRef.current = 0;
    }

    for (let i = drawnCountRef.current; i < points.length; i++) {
      const point = points[i];
      const color = speedColor(point.speed_kmh);
      const current = currentLineRef.current;

      if (i === 0) {
        startMarkerRef.current = new api.Marker({
          map,
          position: { lat: point.lat, lng: point.lng },
          icon: { path: 0, scale: 6, fillColor: '#ffffff', fillOpacity: 1, strokeColor: '#ff5b1a', strokeWeight: 3 },
        });
      }

      if (!current || current.color !== color) {
        const path = i > 0 ? [{ lat: points[i - 1].lat, lng: points[i - 1].lng }] : [];
        path.push({ lat: point.lat, lng: point.lng });
        const line = new api.Polyline({ map, path, strokeColor: color, strokeOpacity: 0.95, strokeWeight: 5 });
        linesRef.current.push(line);
        currentLineRef.current = { line, color };
      } else {
        current.line.getPath().push(new api.LatLng(point.lat, point.lng));
      }
    }
    drawnCountRef.current = points.length;

    if (points.length === 0) return;
    const last = points[points.length - 1];
    const lastPosition = { lat: last.lat, lng: last.lng };

    if (!headMarkerRef.current) {
      headMarkerRef.current = new api.Marker({
        map,
        position: lastPosition,
        icon: { path: 0, scale: 8, fillColor: '#ff5b1a', fillOpacity: 1, strokeColor: '#ffffff', strokeWeight: 3 },
      });
    } else {
      headMarkerRef.current.setPosition(lastPosition);
    }

    if (follow) {
      if (points.length === 1) map.setZoom(17);
      map.panTo(lastPosition);
    } else if (points.length > 1) {
      const bounds = new api.LatLngBounds();
      points.forEach((point) => bounds.extend({ lat: point.lat, lng: point.lng }));
      map.fitBounds(bounds, 40);
    }
  }, [api, points, follow]);

  return (
    <div className="relative h-72 md:h-96 rounded-[28px] overflow-hidden border border-primary/35 bg-[#090909]">
      <div ref={containerRef} className="absolute inset-0" />
      {points.length === 0 && (
        <div className="absolute inset-x-0 top-4 flex justify-center pointer-events-none">
          <span className="rounded-full bg-black/75 px-4 py-2 text-zinc-300 font-bold uppercase tracking-widest text-xs">Le tracé apparaîtra ici</span>
        </div>
      )}
      <SpeedLegend className="absolute bottom-3 left-3 rounded-xl bg-black/75 px-3 py-2" />
    </div>
  );
}

function SvgRideMap({ points }: RideMapProps) {
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

export function RideMap({ points, follow = false }: RideMapProps) {
  const [failed, setFailed] = useState(!googleMapsAvailable);
  if (failed) return <SvgRideMap points={points} />;
  return <GoogleRideMap points={points} follow={follow} onError={() => setFailed(true)} />;
}
