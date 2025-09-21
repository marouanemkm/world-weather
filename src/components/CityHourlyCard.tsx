'use client';

import { useEffect, useMemo, useState } from 'react';
import { mapWeatherCodeToLabelEmoji } from '@/lib/mappers';
import { fetchHourlyForDate } from '@/services/openMeteo.client';

type Props = {
  cityName: string;
  lat: number;
  lon: number;
  tz: string;
  dates: string[];
  initialDate: string;
};

type HourPoint = {
  timeISO: string;
  hour: string;
  temperatureC: number;
  weatherCode: number;
};

type SegmentKey = 'morning' | 'afternoon' | 'evening';

function segmentOf(hourStr: string): SegmentKey | 'other' {
  const [h] = hourStr.split(':');
  const n = Number(h);
  if (Number.isNaN(n)) return 'other';
  if (n >= 5 && n < 12) return 'morning';
  if (n >= 12 && n < 18) return 'afternoon';
  if (n >= 18 && n < 24) return 'evening';
  return 'other';
}

export default function CityHourlyCard({ cityName, lat, lon, tz, dates, initialDate }: Props) {
  const [selected, setSelected] = useState(initialDate);
  const [segment, setSegment] = useState<SegmentKey>('morning');
  const [loading, setLoading] = useState(false);
  const [hours, setHours] = useState<HourPoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  const title = useMemo(() => {
    const d = new Date(`${selected}T00:00:00`);
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: '2-digit' });
  }, [selected]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const pts = await fetchHourlyForDate(lat, lon, tz, selected);
        if (!cancelled) setHours(pts);
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Erreur');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [selected, lat, lon, tz]);

  const filtered = useMemo(() => {
    return hours.filter(h => segmentOf(h.hour) === segment);
  }, [hours, segment]);

  return (
    <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur">
      <div className="px-5 py-4 border-b border-black/5 dark:border-white/10">
        <div className="text-sm opacity-70">Météo horaire · {cityName}</div>
        <div className="text-xl font-semibold mt-1 capitalize">{title}</div>
      </div>

      <div className="px-5 pt-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSegment('morning')}
            className={[
              'rounded-full px-3 py-1.5 text-sm border transition',
              segment === 'morning' ? 'border-foreground/30 bg-foreground/10' : 'border-foreground/15 hover:bg-foreground/5',
            ].join(' ')}
            aria-pressed={segment === 'morning'}
          >
            Matin (05:00–11:59)
          </button>
          <button
            onClick={() => setSegment('afternoon')}
            className={[
              'rounded-full px-3 py-1.5 text-sm border transition',
              segment === 'afternoon' ? 'border-foreground/30 bg-foreground/10' : 'border-foreground/15 hover:bg-foreground/5',
            ].join(' ')}
            aria-pressed={segment === 'afternoon'}
          >
            Après-midi (12:00–17:59)
          </button>
          <button
            onClick={() => setSegment('evening')}
            className={[
              'rounded-full px-3 py-1.5 text-sm border transition',
              segment === 'evening' ? 'border-foreground/30 bg-foreground/10' : 'border-foreground/15 hover:bg-foreground/5',
            ].join(' ')}
            aria-pressed={segment === 'evening'}
          >
            Soirée (18:00–23:59)
          </button>
        </div>
      </div>

      <div className="px-5 py-4 min-h-48">
        {loading && (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-9 rounded bg-foreground/10 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="text-sm text-red-600 dark:text-red-400">Impossible de charger les heures : {error}</div>
        )}

        {!loading && !error && filtered.length === 0 && <div className="text-sm opacity-70">Aucune donnée pour ce créneau.</div>}

        {!loading && !error && filtered.length > 0 && (
          <ul className="divide-y divide-black/5 dark:divide-white/10">
            {filtered.map(h => {
              const { label, emoji } = mapWeatherCodeToLabelEmoji(h.weatherCode);
              return (
                <li key={h.timeISO} className="flex items-center justify-between gap-4 py-2" title={`${h.timeISO} · ${label}`}>
                  <div className="w-16 text-sm tabular-nums opacity-80">{h.hour}</div>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="text-lg font-semibold">{Math.round(h.temperatureC)}°C</div>
                    <div className="text-sm opacity-85">
                      {emoji} {label}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="px-5 py-3 border-t border-black/5 dark:border-white/10">
        <div className="flex flex-wrap gap-2">
          {dates.map(d => {
            const label = new Date(`${d}T00:00:00`).toLocaleDateString('fr-FR', {
              weekday: 'short',
              day: '2-digit',
              month: '2-digit',
            });
            const active = selected === d;
            return (
              <button
                key={d}
                onClick={() => setSelected(d)}
                className={[
                  'rounded-full px-3 py-1.5 text-sm border transition',
                  active ? 'border-foreground/30 bg-foreground/10' : 'border-foreground/15 hover:bg-foreground/5',
                ].join(' ')}
                aria-pressed={active}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
