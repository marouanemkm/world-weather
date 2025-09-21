import Link from 'next/link';

type Props = {
  slug: string;
  name: string;
  country: string;
  temperatureC: number;
  label: string;
  emoji: string;
};

export default function CityCard({ slug, name, country, temperatureC, label, emoji }: Props) {
  return (
    <Link
      href={`/city/${slug}`}
      aria-label={`Voir la météo détaillée pour ${name}, ${country}`}
      className="
        block rounded-2xl border border-black/5 dark:border-white/10
        bg-white/70 dark:bg-white/5 backdrop-blur
        p-4 shadow-sm hover:shadow-md transition
        focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40
      "
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">{name}</div>
          <div className="text-xs opacity-70">{country}</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold">{Math.round(temperatureC)}°C</div>
          <div className="mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs bg-foreground/10 dark:bg-foreground/15">
            <span>{emoji}</span>
            <span>{label}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
