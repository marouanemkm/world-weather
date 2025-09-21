import { mapWeatherCodeToLabelEmoji } from '@/lib/mappers';
import type { CurrentDayWeather } from '@/lib/types';

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

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, {
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
    weatherCode = code as number;
    temperatureC = tmax != null && tmin != null ? Math.round(((tmax + tmin) / 2) * 10) / 10 : tmax ?? tmin ?? 0;
  }

  const { label, emoji } = mapWeatherCodeToLabelEmoji(weatherCode as number);

  return { temperatureC: temperatureC as number, weatherCode: weatherCode as number, label, emoji };
}

export async function fetchHourlyForDate(
  lat: number,
  lon: number,
  tz: string,
  isoDate: string
): Promise<Array<{ timeISO: string; hour: string; temperatureC: number; weatherCode: number }>> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    hourly: 'temperature_2m,weathercode',
    start_date: isoDate,
    end_date: isoDate,
    timezone: tz,
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Open-Meteo hourly error: ${res.status} ${res.statusText}`);

  const json = await res.json();

  const times: unknown = json?.hourly?.time;
  const temps: unknown = json?.hourly?.temperature_2m;
  const codesRaw: unknown = json?.hourly?.weathercode ?? json?.hourly?.weather_code;

  if (!Array.isArray(times) || !Array.isArray(temps) || !Array.isArray(codesRaw)) {
    return [];
  }

  const tArr = times as string[];
  const tempArr = temps as number[];
  const codeArr = codesRaw as number[];

  const out: Array<{ timeISO: string; hour: string; temperatureC: number; weatherCode: number }> = [];
  const len = Math.min(tArr.length, tempArr.length, codeArr.length);

  for (let i = 0; i < len; i++) {
    const iso = tArr[i];
    const temperatureC = tempArr[i];
    const weatherCode = codeArr[i];
    if (typeof iso !== 'string' || typeof temperatureC !== 'number' || typeof weatherCode !== 'number') continue;
    const hour = iso.split('T')[1] ?? '';
    out.push({ timeISO: iso, hour, temperatureC, weatherCode });
  }

  return out.sort((a, b) => (a.timeISO < b.timeISO ? -1 : 1));
}
