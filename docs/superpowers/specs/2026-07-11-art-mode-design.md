# Swan Song — Art Mode extension

Status: approved by user, ready for implementation planning
Date: 2026-07-11

## Premise

Swan Song's core idea — "see them while you still can" — currently applies
only to musicians. This extension generalizes it to legendary visual artists
(painters, sculptors, photographers, etc. — Yayoi Kusama is the inspiration)
without building a separate site. One shared shell, two (eventually more)
content domains plugged in through a common adapter interface.

## Architecture: shared shell + content adapters

The shell (`Hero`, mode toggle, `FilterBar`, card grid, `Footer`) stays
domain-agnostic. Each mode (Music, Art) implements a **content adapter**:
the same shape of data and the same set of async operations, so the shell
never branches on which mode it's rendering.

```
adapter = {
  id: 'music' | 'art',
  label: string,               // shown on the toggle
  categories: string[],        // fills the genre/movement filter row
  categoryColors: Record<string, string>,
  roster: Entry[],             // hand-curated
  ageDefaultFloor: number,      // 65 for music, 70 for art — default visible cutoff
  renderCard(entry, expanded, ...): ReactNode,  // or a component reference
  // async enrichment + "find near me" / "where to see" operations, see below
}
```

- **Music adapter** — thin wrapper around the current Ticketmaster + Spotify
  + Last.fm logic (`src/lib/api.js`, `api/shows.js`, `api/artist-info.js`).
  No behavior change from what exists today.
- **Art adapter** — wraps Wikipedia + Wikidata, with a Google Images search
  link as the universal fallback (see Images below).

A paintbrush icon in the header toggles modes. Adding a third domain later
(film directors, architects, ...) means writing one more adapter against
the same shell — no shell changes required.

### Mode state: URL query param

Mode is reflected in `?mode=art` / `?mode=music` (default) via the History
API (`URLSearchParams` + `history.replaceState`, no router dependency).
Refresh, back/forward, and shared links all preserve mode. No `mode` param
defaults to Music.

## Age handling (both modes) — fixes a real staleness bug

Today's roster hardcodes `age: 81`-style integers that silently go stale
every year. Replace with:

```js
{ name, birthYear, deathYear /* optional */ , ... }
```

and a pure function:

```js
function computeAge(birthYear, deathYear, atDate = new Date()) {
  const endYear = deathYear ?? atDate.getFullYear();
  return endYear - birthYear;
}
```

Ages are computed at render time, not stored. This applies to the existing
Music roster too (real bug fix, in scope for this work) — including each
member of a multi-member act (e.g. the Rolling Stones' three listed
members each get their own `birthYear`, replacing today's per-member
`age: 81`-style ints) — and lets the Art roster be curated once at "60+"
while the UI's default visible floor is 70+
— people age into visibility automatically as calendar years pass, zero
manual maintenance. `deathYear`, when present, freezes the age at time of
death rather than continuing to increment — relevant for artists (more
likely than musicians in the current roster to have passed).

## Art genre/movement taxonomy

Modeled loosely on how MoMA/Met/Tate group work (the user's synthesis, not
an art-historian's — flagged as worth a sanity pass once real artists are
slotted in, and treated as a living list rather than a hard boundary):

- Painting – Contemporary
- Painting – Abstract / Abstract Expressionism
- Impressionism / Post-Impressionism
- Modernism / Cubism
- Pop Art
- Surrealism
- Sculpture
- Photography
- Installation / Mixed Media
- Street Art

Each category gets its own accent color in `categoryColors`, following the
same one-hue-per-genre pattern as Music's `GENRE_COLORS` — needs 10 distinct
values instead of 5, drawn from the existing Woodstock earth-tone palette
family (extended, not replaced) so both modes read as one visual system.

## Per-artist enrichment (fetched live, never hardcoded)

Only `name`, `birthYear` (+ optional `deathYear`), `category`, and a
**Wikidata QID** are hand-curated in the roster (mirrors how Music curates
`name`/`genre`/`tmName` today). Everything else is fetched at runtime:

- **Wikipedia REST API** (`/page/summary/{title}`) → bio blurb + lead image
  + link to the full article.
- **Wikidata** (`wbgetentities` / SPARQL via the QID) → notable works (title
  + holding institution/collection), and an auction price **only** when
  Wikidata actually has one (property like "highest price" / auction
  record) — no placeholder or blank row when it's absent. Art-market data
  is genuinely sparse behind free APIs (comprehensive coverage is a paid
  Artnet/Artprice-style product) — this is a deliberate scope boundary, not
  a bug to fix later.
- **"Where to see their work"** — sourced from Wikidata's
  collection/institution statements on the artist and/or their notable
  works. There is no live aggregator for museum exhibitions the way
  Ticketmaster aggregates concerts, so this is inherently a point-in-time
  snapshot of "known to hold works by," not a live "on view now" feed —
  worth a small in-UI caveat similar to the Song Score disclaimer.

New serverless functions mirror the existing `api/artist-info.js` pattern:
`api/art-info.js` (Wikipedia summary + Wikidata works/collections/price),
proxied server-side the same way Last.fm/Spotify calls are today (keeps any
future API keys — none needed for Wikipedia/Wikidata today — off the
client, and gives one place to add caching/rate-limit handling later).

## Images — one consistent rule everywhere

Every artist portrait and every individual work always shows:

1. A real thumbnail **whenever** a free-licensed one exists via
   Wikidata/Commons.
2. A "view image" link that **always** works: the Commons/Wikipedia image
   URL when available, otherwise a Google Images search link for
   `"{artist name} {work title}"`.

Same fallback behavior in every case, so nothing ever looks broken or
inconsistent when a specific piece lacks a free image — it just quietly
becomes a search link instead of a thumbnail. No art files are ever stored
in this repo or deployed with the app; everything is hotlinked or
outbound-linked.

## Roster curation

Same pattern as Music: hand-curated list of `{ name, birthYear, deathYear?,
category, wikidataId }`. Per the user's direction, the Art roster is not
capped at a fixed count (e.g. 30–40) — it's compiled by actual popularity
and age criteria (curate everyone reasonably notable and 60+, same "curate
wider than the default visible floor" logic as the age-handling section
above), with Kusama as the explicit north star for the kind of figure this
mode is built around. Compiling this roster with **real, verified Wikidata
QIDs** is implementation work, not spec work — wrong QIDs silently break
the adapter for that artist, so QIDs get verified against Wikidata during
implementation rather than guessed here.

## Explicit non-goals (for this pass)

- No score/ranking concept for Art mode (mirrors Music's "Song Score," but
  there's no free data source to approximate it from, and the team's
  reaction to Music's existing approximation was "estimated, not real" —
  no interest in adding a second speculative metric).
- No live "on view now" museum exhibition feed — Wikidata collection data
  is a snapshot, not a schedule.
- No third domain (film, architecture, ...) in this pass — the adapter
  interface is designed to make that a future one-adapter addition, not
  something built now.

## Open risks / follow-ups

- Taxonomy is a first pass; expect to reshuffle 1–2 categories once real
  artists are slotted in and some turn out to span categories (e.g. an
  artist who is both Pop Art and Sculpture).
- Wikidata/Wikipedia have public rate limits; the Music adapter already has
  a "prime in the background, staggered" pattern (`primeGenreMax`) worth
  reusing for Art's enrichment calls rather than firing all roster lookups
  at once.
- `categoryColors` needs 10 visually distinct-but-cohesive hues; this is a
  design detail to nail down during implementation, not a blocker to
  starting it.
