import { CITIES } from '../lib/constants';
import { fetchTodayWeather } from '../services/openMeteo.client';
import CityCard from '../components/CityCard';

export const dynamic = 'force-static';
export const revalidate = 600;

export default async function HomePage() {
  const results = await Promise.all(
    CITIES.map(async city => {
      try {
        const w = await fetchTodayWeather(city.lat, city.lon, city.tz);
        return { city, w, error: null as string | null };
      } catch (e: any) {
        return { city, w: null, error: e?.message ?? 'Erreur inconnue' };
      }
    })
  );

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-2">Météo — principales villes</h1>
      <p className="text-sm opacity-70 mb-6">
        Température & conditions de la journée. Cliquez sur une ville pour voir le détail.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map(({ city, w, error }) => (
          <div key={city.slug}>
            {w ? (
              <CityCard
                slug={city.slug}
                name={city.name}
                country={city.country}
                temperatureC={w.temperatureC}
                label={w.label}
                emoji={w.emoji}
              />
            ) : (
              <div className="rounded-2xl border border-black/5 dark:border-white/10bg-white/60 dark:bg-white/5 backdrop-blur p-4">
                <div className="text-sm font-semibold">{city.name}</div>
                <div className="text-xs opacity-70">{city.country}</div>
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">Impossible de charger la météo : {error}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
