declare global {
  interface Window {
    google?: any;
    gm_authFailure?: () => void;
    __bikeRankMapsLoaded?: () => void;
  }
}

export type MapsApi = {
  Map: any;
  Marker: any;
  InfoWindow: any;
  Polyline: any;
  LatLng: any;
  LatLngBounds: any;
};

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

export const googleMapsAvailable = Boolean(apiKey);

const authFailureListeners = new Set<() => void>();

if (typeof window !== 'undefined') {
  window.gm_authFailure = () => authFailureListeners.forEach((listener) => listener());
}

export function onMapsAuthFailure(listener: () => void) {
  authFailureListeners.add(listener);
  return () => { authFailureListeners.delete(listener); };
}

let apiPromise: Promise<MapsApi> | null = null;

async function importApi(): Promise<MapsApi> {
  const maps = window.google.maps;
  const [{ Map, InfoWindow, Polyline }, { Marker }, { LatLng, LatLngBounds }] = await Promise.all([
    maps.importLibrary('maps'),
    maps.importLibrary('marker'),
    maps.importLibrary('core'),
  ]);
  return { Map, Marker, InfoWindow, Polyline, LatLng, LatLngBounds };
}

export function loadGoogleMaps(): Promise<MapsApi> {
  if (!apiKey) return Promise.reject(new Error('VITE_GOOGLE_MAPS_API_KEY manquante'));
  if (apiPromise) return apiPromise;

  apiPromise = new Promise<MapsApi>((resolve, reject) => {
    const fail = (error: Error) => { apiPromise = null; reject(error); };

    if (window.google?.maps?.importLibrary) {
      importApi().then(resolve, fail);
      return;
    }

    window.__bikeRankMapsLoaded = () => { importApi().then(resolve, fail); };
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly&loading=async&callback=__bikeRankMapsLoaded`;
    script.async = true;
    script.onerror = () => fail(new Error('Chargement de Google Maps impossible'));
    document.head.appendChild(script);
  });

  return apiPromise;
}
