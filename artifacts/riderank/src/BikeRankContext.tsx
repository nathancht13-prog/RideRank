import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';
import type { Spot, Profile, Review, RideActivity, RankedProfile } from './types';

interface BikeRankState {
  session: Session | null;
  profile: Profile | null;
  spots: Spot[];
  rankedProfiles: RankedProfile[];
  activities: RideActivity[];
  profiles: Profile[];
  reviews: Review[];
  
  authOpen: boolean; setAuthOpen: (v: boolean) => void;
  authMode: 'login' | 'signup'; setAuthMode: (v: 'login' | 'signup') => void;
  profileOpen: boolean; setProfileOpen: (v: boolean) => void;
  reviewOpen: boolean; setReviewOpen: (v: boolean) => void;
  activityOpen: boolean; setActivityOpen: (v: boolean) => void;
  shareOpen: boolean; setShareOpen: (v: boolean) => void;
  latestActivity: RideActivity | null; setLatestActivity: (v: RideActivity | null) => void;
  selectedSpot: string | null; setSelectedSpot: (v: string | null) => void;
  notice: string; setNotice: (v: string) => void;
  
  requireAuth: (mode?: 'login' | 'signup') => boolean;
  refreshData: () => Promise<void>;
}

const BikeRankContext = createContext<BikeRankState | null>(null);

export function BikeRankProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [activities, setActivities] = useState<RideActivity[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rankedProfiles, setRankedProfiles] = useState<RankedProfile[]>([]);
  
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [profileOpen, setProfileOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [latestActivity, setLatestActivity] = useState<RideActivity | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  const loadPublicData = async () => {
    const [spotsRes, profilesRes, reviewsRes, leaderboardRes] = await Promise.all([
      supabase.from('spots').select('*').order('average_rating', { ascending: false }),
      supabase.from('profiles').select('*'),
      supabase.from('spot_reviews').select('user_id,spot_id,rating,comment'),
      supabase.rpc('monthly_ride_leaderboard')
    ]);

    setSpots((spotsRes.data ?? []) as Spot[]);
    const nextProfiles = (profilesRes.data ?? []) as Profile[];
    setProfiles(nextProfiles);
    setReviews((reviewsRes.data ?? []) as Review[]);

    const realRanks = ((leaderboardRes.data ?? []) as Array<{
      id: string; pseudo: string; avatar_url: string | null; ville: string | null;
      distance: number; rank: number;
    }>).map((item) => ({
      id: item.id,
      distance: Number(item.distance),
      rank: Number(item.rank),
      profile: nextProfiles.find((profileItem) => profileItem.id === item.id) ?? {
        id: item.id,
        pseudo: item.pseudo,
        avatar_url: item.avatar_url,
        ville: item.ville,
        bio: null,
        created_at: '',
      },
    }));

    const demoRiders: RankedProfile[] = [
      { id: 'demo-enduromax', distance: 68.7, rank: 0, isDemo: true, profile: { id: 'demo-enduromax', pseudo: 'ENDUROMAX', avatar_url: null, ville: 'France', bio: null, created_at: '' } },
      { id: 'demo-trailking', distance: 64.2, rank: 0, isDemo: true, profile: { id: 'demo-trailking', pseudo: 'TRAILKING', avatar_url: null, ville: 'France', bio: null, created_at: '' } },
      { id: 'demo-le-grimpeur', distance: 56, rank: 0, isDemo: true, profile: { id: 'demo-le-grimpeur', pseudo: 'LE GRIMPEUR', avatar_url: null, ville: 'France', bio: null, created_at: '' } },
    ];
    const mergedRanks = [...realRanks, ...demoRiders]
      .sort((a, b) => b.distance - a.distance)
      .map((item, index) => ({ ...item, rank: index + 1 }));
    setRankedProfiles(mergedRanks);

    if (session?.user) {
      const activitiesRes = await supabase
        .from('ride_activities')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      if (!activitiesRes.error) setActivities((activitiesRes.data ?? []) as RideActivity[]);
    } else {
      setActivities([]);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => { loadPublicData(); }, [session?.user?.id]);

  useEffect(() => {
    if (session?.user && profiles.length > 0) {
       const userProfile = profiles.find((item) => item.id === session.user.id);
       setProfile(userProfile ?? null);
    } else {
       setProfile(null);
    }
  }, [session, profiles]);

  const requireAuth = (mode: 'login' | 'signup' = 'login') => {
    if (session) return true;
    setAuthMode(mode);
    setAuthOpen(true);
    return false;
  };

  const value = {
    session, profile, spots, rankedProfiles, activities, profiles, reviews,
    authOpen, setAuthOpen, authMode, setAuthMode,
    profileOpen, setProfileOpen, reviewOpen, setReviewOpen,
    activityOpen, setActivityOpen, shareOpen, setShareOpen,
    latestActivity, setLatestActivity,
    selectedSpot, setSelectedSpot,
    notice, setNotice, requireAuth, refreshData: loadPublicData
  };

  return <BikeRankContext.Provider value={value}>{children}</BikeRankContext.Provider>;
}

export function useBikeRank() {
  const ctx = useContext(BikeRankContext);
  if (!ctx) throw new Error('useBikeRank must be used within BikeRankProvider');
  return ctx;
}