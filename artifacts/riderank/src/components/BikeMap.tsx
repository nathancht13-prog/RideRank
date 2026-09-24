import { useEffect, useRef, useState } from 'react';
import { LocateFixed, MapPin, Minus, Plus } from 'lucide-react';
import type { Spot } from '../types';
import { googleMapsAvailable, loadGoogleMaps, onMapsAuthFailure, type MapsApi } from '../lib/googleMaps';

type BikeMapProps = {
  spots: Spot[];
};

const PIN_ICON = {
  url: `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="34" height="44" viewBox="0 0 34 44"><path d="M17 1C8.7 1 2 7.7 2 16c0 11 15 27 15 27s15-16 15-27C32 7.7 25.3 1 17 1z" fill="#ff5b1a" stroke="#ffffff" stroke-width="2"/><circle cx="17" cy="16" r="6" fill="#ffffff"/></svg>',
  )}`,
};

function buildInfoContent(spot: Spot) {
  const root = document.createElement('div');
  root.style.cssText = 'font-family: system-ui, sans-serif; color: #111; min-width: 170px; padding: 2px 4px;';

  const title = document.createElement('div');
  title.textContent = spot.name;
  title.style.cssText = 'font-weight: 800; font-size: 16px;';

  const meta = document.createElement('div');
  meta.textContent = `${spot.region} · ${spot.practice_type}`;
  meta.style.cssText = 'font-size: 13px; color: #555; margin-top: 2px;';

  const rating = document.createElement('div');
  rating.textContent = `★ ${Number(spot.average_rating).toFixed(1)} / 5`;
  rating.style.cssText = 'font-size: 14px; font-weight: 700; color: #ff5b1a; margin-top: 6px;';

  root.append(title, meta, rating);
  return root;
}

function GoogleSpotsMap({ spots, onError }: BikeMapProps & { onError: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const infoRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [api, setApi] = useState<MapsApi | null>(null);

  useEffect(() => {
    let cancelled = false;
    const unsubscribe = onMapsAuthFailure(onError);

    loadGoogleMaps()
      .then((maps) => {
        if (cancelled || !containerRef.current) return;
        mapRef.current = new maps.Map(containerRef.current, {
          center: { lat: 46.2, lng: 6.5 },
          zoom: 6,
          mapTypeId: 'terrain',
          mapTypeControl: true,
          mapTypeControlOptions: { mapTypeIds: ['roadmap', 'terrain', 'hybrid'] },
          streetViewControl: false,
          fullscreenControl: true,
          gestureHandling: 'cooperative',
        });
        infoRef.current = new maps.InfoWindow();
        setApi(maps);
      })
      .catch(() => { if (!cancelled) onError(); });

    return () => {
      cancelled = true;
      unsubscribe();
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      mapRef.current = null;
      infoRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!api || !map) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const located = spots.filter((spot) => spot.latitude != null && spot.longitude != null);
    if (located.length === 0) return;

    const bounds = new api.LatLngBounds();
    located.forEach((spot) => {
      const position = { lat: Number(spot.latitude), lng: Number(spot.longitude) };
      const marker = new api.Marker({ map, position, title: spot.name, icon: PIN_ICON });
      marker.addListener('click', () => {
        infoRef.current?.setContent(buildInfoContent(spot));
        infoRef.current?.open({ map, anchor: marker });
      });
      markersRef.current.push(marker);
      bounds.extend(position);
    });

    if (located.length === 1) {
      map.setCenter({ lat: Number(located[0].latitude), lng: Number(located[0].longitude) });
      map.setZoom(11);
    } else {
      map.fitBounds(bounds, 60);
    }
  }, [api, spots]);

  return (
    <div className="bike-map" aria-label="Carte des spots Bike Rank">
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
}

const pinPositions = [
  { top: '29%', left: '24%' },
  { top: '49%', left: '67%' },
  { top: '70%', left: '50%' },
  { top: '23%', left: '76%' },
  { top: '62%', left: '31%' },
  { top: '38%', left: '47%' },
];

function FallbackMap({ spots }: BikeMapProps) {
  return (
    <div className="bike-map" aria-label="Aperçu cartographique des spots Bike Rank">
      <svg className="bike-map-terrain" viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden="true">
        <path className="terrain-zone" d="M40 85 C150 10 290 25 350 125 C410 225 310 275 210 235 C110 195 20 205 40 85Z" />
        <path className="terrain-zone" d="M720 285 C840 220 1080 245 1160 360 C1200 445 1080 545 920 505 C780 470 640 365 720 285Z" />
        <path className="minor-road" d="M-40 115 C170 185 315 70 505 120 S845 235 1240 85" />
        <path className="minor-road" d="M-60 345 C245 205 410 430 650 350 S950 220 1260 335" />
        <path className="minor-road" d="M-40 540 C250 455 480 610 730 500 S1005 480 1240 555" />
        <path className="main-road" d="M210 -30 C235 145 255 360 280 630" />
        <path className="main-road" d="M610 -30 C575 170 545 385 575 630" />
        <path className="main-road" d="M945 -30 C910 180 965 400 930 630" />
        <path className="river" d="M-20 455 C160 405 305 470 430 430 S710 370 850 415 S1050 480 1220 430" />
      </svg>

      <div className="bike-map-tabs" aria-hidden="true"><span>Plan</span><span>Relief</span></div>
      <div className="bike-map-controls" aria-hidden="true"><button><Plus /></button><button><Minus /></button><button><LocateFixed /></button></div>

      {spots.slice(0, pinPositions.length).map((spot, index) => (
        <button
          className="bike-map-pin"
          key={spot.id}
          style={pinPositions[index]}
          title={`${spot.name} — ${spot.region}`}
          aria-label={`${spot.name}, ${spot.region}`}
        >
          <MapPin fill="currentColor" />
          <span>{spot.name}</span>
        </button>
      ))}
      <div className="bike-map-attribution">Aperçu cartographique</div>
    </div>
  );
}

export function BikeMap({ spots }: BikeMapProps) {
  const [failed, setFailed] = useState(!googleMapsAvailable);
  if (failed) return <FallbackMap spots={spots} />;
  return <GoogleSpotsMap spots={spots} onError={() => setFailed(true)} />;
}
