export type Spot = {
  id: string; name: string; region: string; practice_type: string;
  description: string; average_rating: number; photo_url: string | null;
  elevation_m: number | null;
};
export type Profile = {
  id: string; pseudo: string; avatar_url: string | null; ville: string | null;
  bio: string | null; created_at: string;
};
export type Review = { 
  user_id: string; spot_id: string; rating: number; comment: string 
};
export type RideActivity = {
  id: string; user_id: string; distance_km: number; elevation_m: number;
  activity_date: string; created_at: string;
};
export type RankedProfile = {
  id: string;
  distance: number;
  rank: number;
  profile?: Profile;
};
