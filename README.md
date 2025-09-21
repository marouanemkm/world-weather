# 🌤️ Weather App — Next.js 15 + Tailwind v4

A small weather application built as part of a **technical test**.
It uses the [Open-Meteo](https://open-meteo.com/) API to display the **current weather**, as well as **hourly forecasts per day** (today + 6 rolling days).

---

## 🚀 Tech Stack

- [Next.js 15 (App Router)](https://nextjs.org/) — modern React framework
- [TailwindCSS v4](https://tailwindcss.com/) — utility-first styling
- [TypeScript](https://www.typescriptlang.org/) — static typing
- [pnpm](https://pnpm.io/) — fast package manager

---

## 📦 Installation & Run

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Production build
pnpm build && pnpm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## ✨ Features

- **Homepage**

  - Displays 10 major world cities (Paris, London, Tokyo, etc.).
  - Each city is shown as a **card** with:

    - current temperature
    - weather condition (label + emoji)
    - city + country name

- **Dynamic city page**

  - A large card showing:

    - hourly forecasts for the selected day
    - segmented into **Morning / Afternoon / Evening**

  - Navigation through **7 rolling days** (today + next 6 days).
  - Hours are **fetched dynamically** whenever the selected day changes.

- **Responsive design** with Tailwind v4, clear rendering in **light/dark mode**.

---

## 📂 File Structure

```
src/
├── app/
│   ├── page.tsx                # Homepage (city list)
│   ├── city/[slug]/page.tsx    # Dynamic city page
│   └── globals.css             # Tailwind v4 config + global styles
│
├── components/
│   ├── CityCard.tsx            # Card component for homepage
│   └── CityHourlyCard.tsx      # Hourly weather component (client)
│
├── lib/
│   ├── constants.ts            # List of 10 cities with lat/lon/tz
│   ├── mappers.ts              # Mapping weathercode → label + emoji
│   └── types.ts                # Shared TypeScript types
│
└── services/
    └── openMeteo.client.ts     # Open-Meteo fetch functions (day + hourly)
```

---

## 🔑 Best Practices Applied

- **Separation of concerns**:

  - `services/` for API calls
  - `components/` for UI components
  - `lib/` for constants, helpers, and types

- **Strict typing** with TypeScript
- **Static pages + server fetch** with revalidation (ISR)
- **Client components** only for interactions (selectors, filters)

---

## 📝 Notes

- Weather data is refreshed every **10 minutes** (`revalidate: 600`).
- Hours are loaded **on demand**, only when the user switches day.
- The app is simple and readable, with clear, typed code following Next.js App Router best practices.

---
