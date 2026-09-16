import React, { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from 'react';
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
    const [spotsRes, profilesRes, reviewsRes, activitiesRes] = await Promise.all([
      supabase.from('spots').select('*').order('average_rating', { ascending: false }),
      supabase.from('profiles').select('*'),
      supabase.from('spot_reviews').select('user_id,spot_id,rating,comment'),
      supabase.from('ride_activities').select('*')
    ]);

    setSpots((spotsRes.data ?? []) as Spot[]);
    setProfiles((profilesRes.data ?? []) as Profile[]);
    setReviews((reviewsRes.data ?? []) as Review[]);
    if (!activitiesRes.error) {
       setActivities((activitiesRes.data ?? []) as RideActivity[]);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => { loadPublicData(); }, []);

  useEffect(() => {
    if (session?.user && profiles.length > 0) {
       const userProfile = profiles.find((item) => item.id === session.user.id);
       setProfile(userProfile ?? null);
    } else {
       setProfile(null);
    }
  }, [session, profiles]);

  const rankedProfiles = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthActivities = activities.filter(a => {
      if (!a.activity_date) return false;
      const d = new Date(a.activity_date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const userDistances = new Map<string, number>();
    monthActivities.forEach(a => {
      userDistances.set(a.user_id, (userDistances.get(a.user_id) || 0) + (Number(a.distance_km) || 0));
    });

    return Array.from(userDistances.entries())
      .map(([id, distance]) => ({
        id,
        distance: Math.round(distance * 10) / 10,
        profile: profiles.find(p => p.id === id)
      }))
      .sort((a, b) => b.distance - a.distance)
      .map((item, index) => ({ ...item, rank: index + 1 }));
  }, [activities, profiles]);

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