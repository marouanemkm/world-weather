import type { City } from './types';

export const CITIES: City[] = [
  { slug: 'paris', name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522, tz: 'Europe/Paris' },
  { slug: 'london', name: 'London', country: 'United Kingdom', lat: 51.5072, lon: -0.1276, tz: 'Europe/London' },
  { slug: 'new-york', name: 'New York', country: 'USA', lat: 40.7128, lon: -74.006, tz: 'America/New_York' },
  { slug: 'tokyo', name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503, tz: 'Asia/Tokyo' },
  { slug: 'singapore', name: 'Singapore', country: 'Singapore', lat: 1.3521, lon: 103.8198, tz: 'Asia/Singapore' },
  { slug: 'sydney', name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093, tz: 'Australia/Sydney' },
  { slug: 'dubai', name: 'Dubai', country: 'UAE', lat: 25.2048, lon: 55.2708, tz: 'Asia/Dubai' },
  { slug: 'mumbai', name: 'Mumbai', country: 'India', lat: 19.076, lon: 72.8777, tz: 'Asia/Kolkata' },
  { slug: 'toronto', name: 'Toronto', country: 'Canada', lat: 43.6532, lon: -79.3832, tz: 'America/Toronto' },
  { slug: 'mexico-city', name: 'Mexico City', country: 'Mexico', lat: 19.4326, lon: -99.1332, tz: 'America/Mexico_City' },
];
