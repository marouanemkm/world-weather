import { notFound } from 'next/navigation';
import { CITIES } from '@/lib/constants';
import { fetchTodayWeather } from '@/services/openMeteo.client';
import CityHourlyCard from '@/components/CityHourlyCard';

export const revalidate = 600;

export async function generateStaticParams() {
  return CITIES.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const city = CITIES.find(c => c.slug === params.slug);
  if (!city) return { title: 'Ville inconnue — Météo' };
  return {
    title: `${city.name} (${city.country}) · Météo horaire`,
    description: `Prévisions horaires par jour pour ${city.name}.`,
  };
}

function cityLocalISODateToday(tz: string): string {
  const parts = new Intl.DateTimeFormat('fr-FR', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const y = parts.find(p => p.type === 'year')?.value ?? '1970';
  const m = parts.find(p => p.type === 'month')?.value ?? '01';
  const d = parts.find(p => p.type === 'day')?.value ?? '01';
  return `${y}-${m}-${d}`;
}

function addDaysISO(isoDate: string, days: number): string {
  const dt = new Date(`${isoDate}T00:00:00Z`);
  dt.setUTCDate(dt.getUTCDate() + days);
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const d = String(dt.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default async function CityPage({ params }: { params: { slug: string } }) {
  const city = CITIES.find(c => c.slug === params.slug);
  if (!city) notFound();

  const current = await fetchTodayWeather(city.lat, city.lon, city.tz);

  const today = cityLocalISODateToday(city.tz);
  const dates = Array.from({ length: 7 }, (_, i) => addDaysISO(today, i));

  return (
    <section className="mx-auto max-w-3xl">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold">
          {city.name} <span className="text-base opacity-60">({city.country})</span>
        </h1>
        <p className="text-sm opacity-70 mt-1">Jours affichés : aujourd’hui puis les 6 jours suivants (7 jours glissants).</p>
        <p className="text-sm opacity-70">
          Actuellement : <span className="font-medium">{Math.round(current.temperatureC)}°C</span> {current.emoji} {current.label}
        </p>
      </header>

      <CityHourlyCard cityName={city.name} lat={city.lat} lon={city.lon} tz={city.tz} dates={dates} initialDate={dates[0]} />
    </section>
  );
}
