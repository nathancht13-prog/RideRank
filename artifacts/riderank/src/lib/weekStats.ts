import type { RideActivity } from '../types';

export const WEEK_LETTERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export function dateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function weekSummary(activities: RideActivity[], now = new Date()) {
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const todayKey = dateKey(now);

  const days = WEEK_LETTERS.map((letter, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const key = dateKey(date);
    const rides = activities.filter((ride) => ride.activity_date === key);
    return {
      letter,
      km: rides.reduce((sum, ride) => sum + ride.distance_km, 0),
      count: rides.length,
      isToday: key === todayKey,
    };
  });

  return {
    days,
    totalKm: days.reduce((sum, day) => sum + day.km, 0),
    totalRides: days.reduce((sum, day) => sum + day.count, 0),
    maxKm: Math.max(...days.map((day) => day.km), 0.1),
  };
}
