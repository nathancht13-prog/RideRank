import { LocateFixed, MapPin, Minus, Plus } from 'lucide-react';
import type { Spot } from '../types';

type BikeMapProps = {
  spots: Spot[];
};

const pinPositions = [
  { top: '29%', left: '24%' },
  { top: '49%', left: '67%' },
  { top: '70%', left: '50%' },
  { top: '23%', left: '76%' },
  { top: '62%', left: '31%' },
  { top: '38%', left: '47%' },
];

export function BikeMap({ spots }: BikeMapProps) {
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
      <div className="bike-map-attribution">Aperçu cartographique · Intégration Google Maps à venir</div>
    </div>
  );
}