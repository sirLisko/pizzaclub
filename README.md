# pizzaclub

Journal of my pizza adventures — every pizza, pizzeria, rating and photo, on a map and in stats.

[https://pizzaclub.sirlisko.com](https://pizzaclub.sirlisko.com)

## Stack

- [Astro](https://astro.build/) — static site, build-time data fetching, `astro:assets` image optimization
- [Sanity](https://www.sanity.io/) — content (structured entries + image uploads), edited via Studio
- [Netlify](https://www.netlify.com/) — hosting, rebuilds automatically when a new entry is published in Sanity
- [MapLibre GL](https://maplibre.org/) — the `/map` page

## Adding a new pizza

```bash
cd sanity && npm install
npm run studio
```

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

- `npm run build` — production build to `dist/` (runs a content-completeness check first, see `validate-content.mjs`)
- `npm run format` — prettier, including `.astro` files
- `npm run studio` / `studio:build` / `studio:deploy` — run, build, or deploy the Sanity Studio (proxies to `sanity/`; `npm install` there first)

## Project layout

- `src/` — the Astro site (pages, components, `lib/sanity.ts` for the Sanity client + GROQ queries)
- `sanity/` — the Studio (schema in `sanity/schemaTypes/`): a `pizzaEntry` (one per pizza eaten) references a `pizzeria` (one per place, shared across repeat visits)

## Powered by

- Flour
- Water
- Salt
- Yeast
- Tomato
- Mozzarella
- Basil
