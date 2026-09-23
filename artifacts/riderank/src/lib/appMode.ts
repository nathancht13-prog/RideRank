import { useLocation } from 'wouter';
import { useBikeRank } from '../BikeRankContext';

export const APP_PATHS = ['/app', '/sorties', '/stats', '/classement', '/profil', '/ride', '/legal'];

export function useAppMode() {
  const { session } = useBikeRank();
  const [location] = useLocation();
  return Boolean(session) && APP_PATHS.includes(location);
}
