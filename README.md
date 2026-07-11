# Swan Song

See them while you still can.

Swan Song lists legendary musicians in their 70s, 80s, and beyond, their best-known songs, and their upcoming tour dates. Enter a ZIP code to filter to artists playing near you.

## Tech stack

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- Serverless API routes under `api/` (Vercel Functions)
- Data sources: [Ticketmaster Discovery API](https://developer.ticketmaster.com/) for shows, [Last.fm](https://www.last.fm/api) for top tracks, [Spotify](https://developer.spotify.com/) for artist links, [Zippopotam.us](https://zippopotam.us/) for ZIP geocoding

## Local development

```bash
npm install
cp .env.example .env   # then fill in the values below
npm run dev
```

`npm run dev` serves the frontend only. The `/api/*` routes are Vercel
Functions and won't run under plain Vite — use the [Vercel CLI](https://vercel.com/docs/cli)
(`vercel dev`) if you need to exercise the API locally.

### Environment variables

| Variable | Used for |
| --- | --- |
| `LASTFM_API_KEY` | Fetching each artist's top tracks |
| `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` | Looking up an artist's Spotify profile link |
| `TICKETMASTER_API_KEY` | Looking up upcoming shows |

Set these in a local `.env` file for `vercel dev`, and in your Vercel
project's **Settings → Environment Variables** for deployed environments.
They are read server-side only and are never sent to the browser.

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build locally
- `npm test` — run the unit test suite (Vitest)
- `npm run lint` — run ESLint

## Deployment

This project deploys to [Vercel](https://vercel.com/) — see `vercel.json`. Push to `main` and connect the repo in the Vercel dashboard, or run `vercel` from the CLI.

## Song Score

Each artist's top songs show an estimated 0-100 "Song Score." It's a relative,
normalized ranking within each genre — not a real stream count — since the
song catalog is hardcoded and only the top track's playcount is fetched live.
See the in-app footer for the full explanation.
