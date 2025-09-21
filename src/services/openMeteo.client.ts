import 'server-only';
import { mapWeatherCodeToLabelEmoji } from '../lib/mappers';
import type { CurrentDayWeather } from '../lib/types';

type OpenMeteoResponse = {
  current_weather?: { temperature: number; weathercode: number; time: string };
  daily?: {
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    time: string[];
  };
};

export async function fetchTodayWeather(lat: number, lon: number, tz: string): Promise<CurrentDayWeather> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current_weather: 'true',
    daily: 'weathercode,temperature_2m_max,temperature_2m_min',
    timezone: tz,
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
    next: { revalidate: 600 },
  });
  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status} ${res.statusText}`);

  const data = (await res.json()) as OpenMeteoResponse;

  let temperatureC = data.current_weather?.temperature ?? null;
  let weatherCode = data.current_weather?.weathercode ?? null;

  if (temperatureC == null || weatherCode == null) {
    const code = data.daily?.weathercode?.[0];
    const tmax = data.daily?.temperature_2m_max?.[0];
    const tmin = data.daily?.temperature_2m_min?.[0];
    if (code == null || (tmax == null && tmin == null)) {
      throw new Error('Données météo indisponibles');
    }
    weatherCode = code;
    temperatureC = tmax != null && tmin != null ? Math.round(((tmax + tmin) / 2) * 10) / 10 : tmax ?? tmin ?? 0;
  }

  const { label, emoji } = mapWeatherCodeToLabelEmoji(weatherCode);

  return { temperatureC, weatherCode, label, emoji };
}
