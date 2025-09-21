import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'World Weather · Next.js 15',
  description: 'Météo multi-villes — Next.js 15 (App Router) + Tailwind v4',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <header className="sticky top-0 z-30 border-b border-black/5 dark:border-white/10 bg-background/75 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <div className="font-semibold">🌍 World Weather</div>
            <nav className="text-sm opacity-70">Next.js 15 · App Router · Tailwind v4</nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        <footer className="mx-auto max-w-6xl px-4 py-10 text-xs opacity-70">
          Données : Open-Meteo — réactualisation toutes les 10 min (ISR).
        </footer>
      </body>
    </html>
  );
}
