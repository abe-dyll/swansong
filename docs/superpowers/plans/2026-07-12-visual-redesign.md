# Visual Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current amateur-looking visual system (blocky display font, flat yellow gradient, saturated rainbow genre pills, hand-drawn icon) with the vintage-poster-inspired hero (real generated background art, new copy hierarchy), a SeatGeek-informed card layout (photo avatars, AGE badges, pill search bar), and a muted, cohesive color system, across both Music and Art modes.

**Architecture:** Additive/mostly-in-place changes to the existing shared shell (`Hero`, `FilterBar`, `ArtistRow`, `ArtCard`, `App.css`, adapters) plus one new shared presentational component (`Avatar`). No new pages, no new routing, no new state management library — same React + plain CSS approach the codebase already uses.

**Tech Stack:** React 18, Vite, plain CSS (no CSS-in-JS/modules), Vitest + Testing Library (already installed, currently unused for components — this plan is the first to add a component test).

## Global Constraints

- No em dashes in any user-facing copy (spec requirement, already satisfied by the copy below — do not introduce new copy with em dashes).
- Genre/category pills always show their filled muted color (never outline-only); age-tier badge coloring (`ageColor()` in `src/data/artists.js`) is unchanged — these are the two color systems and they stay independent (see spec's "Color system" section).
- Mobile is the primary platform — the hero background's mobile crop must prioritize text legibility per the spec's explicit default (`background-position: 15% center` under 640px).
- `npm run lint`, `npm run build`, and `npm test` must all stay green after every task.
- Source of truth for all requirements: `docs/superpowers/specs/2026-07-12-visual-redesign-design.md`.

---

### Task 1: Asset, typography, and palette foundation

**Files:**
- Create: `src/assets/hero-background.png` (moved from `Images/hero-background.png`)
- Modify: `src/App.css:1` (font import), `src/App.css:3-18` (`:root` vars), `src/App.css:60-65` (`.app`)
- Modify: `src/data/artists.js` (GENRE_COLORS block, near end of file)
- Modify: `src/data/artArtists.js` (ART_CATEGORY_COLORS block, near end of file)

**Interfaces:**
- Produces: `--bg` CSS var (flat parchment tone, replaces `--bg-start/mid/end` gradient trio), muted `GENRE_COLORS` and `ART_CATEGORY_COLORS` hex values, `Zilla Slab` + `Nunito` as the only two font families loaded, `src/assets/hero-background.png` as the on-disk asset path later tasks reference via `url('./assets/hero-background.png')` from `src/App.css`.

- [ ] **Step 1: Move the background image into the source tree**

```bash
mkdir -p src/assets
git mv Images/hero-background.png src/assets/hero-background.png
rmdir Images 2>/dev/null || true
```

Expected: `src/assets/hero-background.png` exists; `Images/` is gone or empty.

- [ ] **Step 2: Swap the font import**

In `src/App.css`, replace line 1:

```css
@import url('https://fonts.googleapis.com/css2?family=Righteous&family=Kalam:wght@400;700&family=Nunito:ital,wght@0,400;0,600;0,700;1,400&display=swap');
```

with:

```css
@import url('https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@700&family=Nunito:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400&display=swap');
```

- [ ] **Step 3: Replace the background gradient vars with a flat parchment tone**

In `src/App.css`, in the `:root` block, replace:

```css
  --bg-start: #fdf6e3;
  --bg-mid: #f5e3b3;
  --bg-end: #ead9a0;
```

with:

```css
  --bg: #f6f2e6;
```

Then update `.app` (currently):

```css
.app {
  min-height: 100vh;
  font-family: 'Nunito', Georgia, serif;
  background: linear-gradient(160deg, var(--bg-start) 0%, var(--bg-mid) 40%, var(--bg-end) 100%);
  color: var(--ink);
}
```

to:

```css
.app {
  min-height: 100vh;
  font-family: 'Nunito', Georgia, serif;
  background: var(--bg);
  color: var(--ink);
}
```

- [ ] **Step 4: Mute the Music genre colors**

In `src/data/artists.js`, replace the `GENRE_COLORS` block:

```js
export const GENRE_COLORS = {
  'Rock': '#B33F1E',
  'Country': '#B9860B',
  'Jazz': '#235148',
  'Soul/R&B': '#7A3B69',
  'Pop': '#5C7A29',
};
```

with:

```js
export const GENRE_COLORS = {
  'Rock': '#A6432B',
  'Country': '#A67C1E',
  'Jazz': '#1F4A42',
  'Soul/R&B': '#6B3459',
  'Pop': '#5C6B2E',
};
```

- [ ] **Step 5: Mute the Art category colors**

In `src/data/artArtists.js`, replace the `ART_CATEGORY_COLORS` block:

```js
export const ART_CATEGORY_COLORS = {
  'Painting – Contemporary': '#B33F1E',
  'Painting – Abstract / Abstract Expressionism': '#8A5A2B',
  'Impressionism / Post-Impressionism': '#4C6B8A',
  'Modernism / Cubism': '#6B4A9E',
  'Pop Art': '#C9971C',
  'Surrealism': '#7A3B69',
  'Sculpture': '#5C7A29',
  'Photography': '#235148',
  'Installation / Mixed Media': '#9E6B3F',
  'Street Art': '#A63A2B',
};
```

with:

```js
export const ART_CATEGORY_COLORS = {
  'Painting – Contemporary': '#A6432B',
  'Painting – Abstract / Abstract Expressionism': '#7A5230',
  'Impressionism / Post-Impressionism': '#3F5A74',
  'Modernism / Cubism': '#5C4184',
  'Pop Art': '#B08619',
  'Surrealism': '#6B3459',
  'Sculpture': '#5C6B2E',
  'Photography': '#1F4A42',
  'Installation / Mixed Media': '#8A6035',
  'Street Art': '#96362A',
};
```

- [ ] **Step 6: Verify build and lint still pass**

Run: `npm run lint && npm run build`
Expected: both exit 0. The app will look visually broken at this point (Hero/FilterBar/cards still reference old classes) — that's expected and fixed in later tasks. This step only confirms the JS/CSS is syntactically valid.

- [ ] **Step 7: Commit**

```bash
git add src/assets/hero-background.png src/App.css src/data/artists.js src/data/artArtists.js
git commit -m "Move hero background asset in-tree, swap fonts, mute genre/category palette"
```

---

### Task 2: Shared Avatar component

**Files:**
- Create: `src/components/Avatar.jsx`
- Create: `src/components/Avatar.test.jsx`
- Modify: `src/App.css` (add `.avatar` / `.avatar--fallback` rules — append near the end of the file)

**Interfaces:**
- Produces: `Avatar` component — `<Avatar src={string|null|undefined} name={string} color={string} />`. Renders a real `<img>` when `src` is truthy; otherwise a solid-color circle showing the first character of `name` uppercased (or `?` if `name` is empty/missing). Consumed by Tasks 6 and 7.

- [ ] **Step 1: Write the failing test**

Create `src/components/Avatar.test.jsx`:

```jsx
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import Avatar from './Avatar';

describe('Avatar', () => {
  it('renders an image when src is provided', () => {
    const { container } = render(<Avatar src="https://example.com/pic.jpg" name="Bob Dylan" color="#A63A2B" />);
    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img.getAttribute('src')).toBe('https://example.com/pic.jpg');
  });

  it('renders a colored initial when src is missing', () => {
    const { container } = render(<Avatar src={null} name="Bob Dylan" color="#A63A2B" />);
    const fallback = container.querySelector('.avatar--fallback');
    expect(fallback).not.toBeNull();
    expect(fallback.textContent).toBe('B');
    expect(fallback.style.background).toBe('rgb(166, 58, 43)');
  });

  it('falls back to "?" when name is missing', () => {
    const { container } = render(<Avatar src={null} name="" color="#A63A2B" />);
    expect(container.querySelector('.avatar--fallback').textContent).toBe('?');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Avatar.test.jsx`
Expected: FAIL — `Avatar.jsx` does not exist yet.

- [ ] **Step 3: Write the implementation**

Create `src/components/Avatar.jsx`:

```jsx
export default function Avatar({ src, name, color }) {
  if (src) {
    return <img className="avatar" src={src} alt="" aria-hidden="true" />;
  }
  const initial = (name || '').trim().charAt(0).toUpperCase() || '?';
  return (
    <div className="avatar avatar--fallback" style={{ background: color }} aria-hidden="true">
      {initial}
    </div>
  );
}
```

- [ ] **Step 4: Add the CSS**

Append to `src/App.css`:

```css
/* ---------- Avatar ---------- */

.avatar {
  width: 44px; height: 44px;
  border-radius: 50%;
  flex-shrink: 0;
  object-fit: cover;
}

.avatar--fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-family: 'Nunito', sans-serif;
  font-weight: 800;
  font-size: 16px;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/Avatar.test.jsx`
Expected: PASS, 3 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/Avatar.jsx src/components/Avatar.test.jsx src/App.css
git commit -m "Add shared Avatar component with photo/initials fallback"
```

---

### Task 3: Spotify artist image in the API

**Files:**
- Modify: `api/artist-info.js:1-36` (`getSpotifyArtistUrl` → `getSpotifyArtistInfo`), `api/artist-info.js:71` (call site + response shape)

**Interfaces:**
- Consumes: nothing new (same Spotify search response already being fetched).
- Produces: `/api/artist-info` response gains a new top-level field `spotifyImageUrl: string|null`, alongside the existing `tracks` and `spotifyUrl`. Consumed by Task 6.

- [ ] **Step 1: Rename and extend the Spotify lookup function**

In `api/artist-info.js`, replace the whole `getSpotifyArtistUrl` function:

```js
async function getSpotifyArtistUrl(artistName, clientId, clientSecret) {
  try {
    var credentials = Buffer.from(clientId + ":" + clientSecret).toString("base64");
    var tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Authorization": "Basic " + credentials, "Content-Type": "application/x-www-form-urlencoded" },
      body: "grant_type=client_credentials"
    });
    if (!tokenRes.ok) return null;
    var tokenData = await tokenRes.json();
    var token = tokenData.access_token;
    if (!token) return null;

    var searchRes = await fetch("https://api.spotify.com/v1/search?q=" + encodeURIComponent(artistName) + "&type=artist&limit=5", {
      headers: { "Authorization": "Bearer " + token }
    });
    if (!searchRes.ok) return null;
    var searchData = await searchRes.json();
    var artists = (searchData && searchData.artists && searchData.artists.items) || [];

    // Pick highest follower count exact match
    var normTarget = artistName.toLowerCase().replace(/^the /, '').trim();
    var exactMatches = artists.filter(function(a) {
      return a.name.toLowerCase().replace(/^the /, '').trim() === normTarget;
    });
    var pool = exactMatches.length > 0 ? exactMatches : artists;
    pool.sort(function(a, b) {
      return (b.followers && b.followers.total || 0) - (a.followers && a.followers.total || 0);
    });

    return pool.length > 0 ? (pool[0].external_urls && pool[0].external_urls.spotify) : null;
  } catch (e) {
    console.error("Spotify lookup failed:", e);
    return null;
  }
}
```

with (identical search logic, extended return shape):

```js
async function getSpotifyArtistInfo(artistName, clientId, clientSecret) {
  try {
    var credentials = Buffer.from(clientId + ":" + clientSecret).toString("base64");
    var tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Authorization": "Basic " + credentials, "Content-Type": "application/x-www-form-urlencoded" },
      body: "grant_type=client_credentials"
    });
    if (!tokenRes.ok) return { url: null, imageUrl: null };
    var tokenData = await tokenRes.json();
    var token = tokenData.access_token;
    if (!token) return { url: null, imageUrl: null };

    var searchRes = await fetch("https://api.spotify.com/v1/search?q=" + encodeURIComponent(artistName) + "&type=artist&limit=5", {
      headers: { "Authorization": "Bearer " + token }
    });
    if (!searchRes.ok) return { url: null, imageUrl: null };
    var searchData = await searchRes.json();
    var artists = (searchData && searchData.artists && searchData.artists.items) || [];

    // Pick highest follower count exact match
    var normTarget = artistName.toLowerCase().replace(/^the /, '').trim();
    var exactMatches = artists.filter(function(a) {
      return a.name.toLowerCase().replace(/^the /, '').trim() === normTarget;
    });
    var pool = exactMatches.length > 0 ? exactMatches : artists;
    pool.sort(function(a, b) {
      return (b.followers && b.followers.total || 0) - (a.followers && a.followers.total || 0);
    });

    if (pool.length === 0) return { url: null, imageUrl: null };
    var best = pool[0];
    var images = best.images || [];
    // Smallest available image is plenty for a 44px avatar circle — saves bandwidth.
    var image = images.length > 0 ? images[images.length - 1] : null;
    return {
      url: (best.external_urls && best.external_urls.spotify) || null,
      imageUrl: image ? image.url : null,
    };
  } catch (e) {
    console.error("Spotify lookup failed:", e);
    return { url: null, imageUrl: null };
  }
}
```

- [ ] **Step 2: Update the call site and response shape**

In the `handler` function, replace:

```js
    var spotifyUrl = await getSpotifyArtistUrl(artistName, spotifyClientId, spotifyClientSecret);

    return res.status(200).json({
      tracks: tracks,
      spotifyUrl: spotifyUrl
    });
```

with:

```js
    var spotifyInfo = await getSpotifyArtistInfo(artistName, spotifyClientId, spotifyClientSecret);

    return res.status(200).json({
      tracks: tracks,
      spotifyUrl: spotifyInfo.url,
      spotifyImageUrl: spotifyInfo.imageUrl
    });
```

Note: `src/lib/api.js`'s `fetchSpotifyInfo` already returns the entire parsed JSON response unmodified — no client-side change is needed for the new field to reach the caller.

- [ ] **Step 3: Verify build and lint**

Run: `npm run lint && npm run build`
Expected: both exit 0. (No automated test for this file — the codebase has no existing pattern for mocking Vercel function req/res, and this plan doesn't introduce one; verification here is lint/build plus the manual check in Task 8.)

- [ ] **Step 4: Commit**

```bash
git add api/artist-info.js
git commit -m "Return a Spotify artist image alongside the existing profile link"
```

---

### Task 4: Hero content model and rewrite

**Files:**
- Modify: `src/adapters/musicAdapter.js` (replace `tagline` with `eyebrow`/`headline`/`subhead`)
- Modify: `src/adapters/artAdapter.js` (same)
- Modify: `src/components/Hero.jsx` (full rewrite)
- Modify: `src/App.jsx:151` (Hero usage)
- Modify: `src/App.css` (`.hero` block and children — replace entirely)

**Interfaces:**
- Consumes: `src/assets/hero-background.png` (from Task 1).
- Produces: `Hero` now takes `{ mode, eyebrow, headline, subhead }` instead of `{ tagline }`. `adapter.tagline` no longer exists on either adapter — replaced by `adapter.eyebrow` / `adapter.headline` / `adapter.subhead`.

- [ ] **Step 1: Update the Music adapter's copy fields**

In `src/adapters/musicAdapter.js`, replace:

```js
export default {
  id: 'music',
  label: 'Music',
  tagline: 'See them while you still can.',
  categories: GENRES,
```

with:

```js
export default {
  id: 'music',
  label: 'Music',
  eyebrow: 'For the acts who never stopped',
  headline: 'The legends are still touring.',
  subhead: 'Track tour dates from the legends who make up your favorite playlists before their final curtain call.',
  categories: GENRES,
```

- [ ] **Step 2: Update the Art adapter's copy fields**

In `src/adapters/artAdapter.js`, replace:

```js
export default {
  id: 'art',
  label: 'Art',
  tagline: 'Before the paint dries.',
  categories: ART_CATEGORIES,
```

with:

```js
export default {
  id: 'art',
  label: 'Art',
  eyebrow: 'For the hands that never stopped',
  headline: 'The masters are still creating.',
  subhead: 'Find where to see the gallery and museum works of the artists who shaped a movement, while they\'re still creating.',
  categories: ART_CATEGORIES,
```

- [ ] **Step 3: Rewrite Hero.jsx**

Replace the entire contents of `src/components/Hero.jsx` with:

```jsx
const AGE_LEGEND = [
  { color: '#A63A2B', label: '80+' },
  { color: '#B9860B', label: '72-79' },
  { color: '#5C7A29', label: '65-71' },
];

export default function Hero({ mode, eyebrow, headline, subhead }) {
  return (
    <header className={`hero hero--${mode}`}>
      <div className="hero__inner">
        <div className="hero__brand">Swan Song</div>
        <div className="hero__eyebrow">{eyebrow}</div>
        <h1 className="hero__headline">{headline}</h1>
        <p className="hero__subhead">{subhead}</p>

        <div className="hero__legend">
          {AGE_LEGEND.map((item) => (
            <div key={item.label} className="hero__legend-item">
              <span className="hero__legend-dot" style={{ background: item.color }} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Update the Hero call site in App.jsx**

In `src/App.jsx`, replace:

```jsx
      <Hero tagline={adapter.tagline} />
```

with:

```jsx
      <Hero mode={mode} eyebrow={adapter.eyebrow} headline={adapter.headline} subhead={adapter.subhead} />
```

- [ ] **Step 5: Replace the Hero CSS block**

In `src/App.css`, replace the entire `/* ---------- Hero ---------- */` section (from `.hero {` through the end of `.hero__legend-dot { ... }`) with:

```css
/* ---------- Hero ---------- */

.hero {
  position: relative;
  padding: 34px 26px 30px;
  background-size: cover;
  background-position: center;
}

.hero--music {
  background-image: url('./assets/hero-background.png');
  background-position: 60% center;
}

@media (max-width: 640px) {
  .hero--music {
    /* Mobile is the primary platform; the artwork doesn't crop cleanly at
       phone widths, so prioritize keeping the text legible over keeping
       the full illustration visible. See the design spec's Hero section. */
    background-position: 15% center;
  }
}

.hero--art {
  background: linear-gradient(160deg, #f2e8ce 0%, #e8dcc0 100%);
}

.hero__inner { max-width: 480px; }

.hero__brand {
  font-family: 'Nunito', sans-serif;
  font-weight: 900;
  font-size: 14px;
  letter-spacing: 0.08em;
  color: var(--ink);
}

.hero__eyebrow {
  font-family: 'Nunito', sans-serif;
  font-weight: 800;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-soft);
  margin-top: 14px;
}

.hero__headline {
  font-family: 'Zilla Slab', serif;
  font-weight: 700;
  font-size: clamp(28px, 6vw, 40px);
  color: var(--ink);
  line-height: 1.05;
  margin-top: 6px;
}

.hero__subhead {
  font-family: 'Nunito', sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: var(--ink-soft);
  line-height: 1.5;
  margin-top: 10px;
  max-width: 380px;
}

.hero__legend {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 18px;
}

.hero__legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--ink-faint);
  font-weight: 600;
}

.hero__legend-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
}
```

- [ ] **Step 6: Verify build and lint, then check the browser**

Run: `npm run lint && npm run build && npm run dev`
Expected: both commands exit 0. Open the dev server URL, confirm the Music-mode hero shows the background image with the new copy hierarchy, and toggling to Art mode shows the flat gradient with Art copy.

- [ ] **Step 7: Commit**

```bash
git add src/adapters/musicAdapter.js src/adapters/artAdapter.js src/components/Hero.jsx src/App.jsx src/App.css
git commit -m "Rewrite Hero with new copy hierarchy and generated background art"
```

---

### Task 5: FilterBar redesign — pill search bar and filled chips

**Files:**
- Modify: `src/components/FilterBar.jsx` (category row + search input)
- Modify: `src/App.jsx` (new `clearCategories` handler + prop wiring)
- Modify: `src/App.css` (`.genre-pill` rules, new `.filter-bar__search-wrap` rules)

**Interfaces:**
- Consumes: `categoryColors` (from Task 1's muted palettes, unchanged shape).
- Produces: `FilterBar` gains a new required prop `onClearCategories: () => void`.

- [ ] **Step 1: Add the `clearCategories` handler in App.jsx**

In `src/App.jsx`, add this function near `toggleCategory`:

```jsx
  function clearCategories() {
    setCategoryFilters([]);
    setExpanded({});
  }
```

- [ ] **Step 2: Pass the new prop to FilterBar**

In `src/App.jsx`, in the `<FilterBar ... />` usage, add:

```jsx
        onClearCategories={clearCategories}
```

(anywhere among the existing props, e.g. right after `onToggleCategory={toggleCategory}`).

- [ ] **Step 3: Update FilterBar.jsx's category row**

Replace:

```jsx
        <div className="filter-bar__row" role="group" aria-label={`Filter by ${categoryLabel.toLowerCase()}`}>
          <span className="filter-bar__label">{categoryLabel}</span>
          {categories.map((c) => {
            const active = activeCategories.includes(c);
            return (
              <button
                key={c}
                type="button"
                className={`genre-pill${active ? ' genre-pill--active' : ''}`}
                style={active ? { background: categoryColors[c], borderColor: categoryColors[c] } : { '--pill-color': categoryColors[c] }}
                onClick={() => onToggleCategory(c)}
                aria-pressed={active}
              >
                {c}
              </button>
            );
          })}
        </div>
```

with:

```jsx
        <div className="filter-bar__row" role="group" aria-label={`Filter by ${categoryLabel.toLowerCase()}`}>
          <span className="filter-bar__label">{categoryLabel}</span>
          <button
            type="button"
            className={`genre-pill genre-pill--all${activeCategories.length === 0 ? ' genre-pill--active' : ''}`}
            onClick={onClearCategories}
            aria-pressed={activeCategories.length === 0}
          >
            All
          </button>
          {categories.map((c) => {
            const active = activeCategories.includes(c);
            return (
              <button
                key={c}
                type="button"
                className={`genre-pill${active ? ' genre-pill--active' : ''}`}
                style={{ background: categoryColors[c] }}
                onClick={() => onToggleCategory(c)}
                aria-pressed={active}
              >
                {c}
              </button>
            );
          })}
        </div>
```

- [ ] **Step 4: Add the `onClearCategories` prop to FilterBar's function signature**

At the top of `src/components/FilterBar.jsx`, add `onClearCategories` to the destructured props list (anywhere alongside `onToggleCategory`):

```jsx
export default function FilterBar({
  categories, categoryColors, categoryLabel,
  activeCategories, onToggleCategory, onClearCategories,
  showLocationSearch,
```

- [ ] **Step 5: Wrap the search input with an icon**

Replace:

```jsx
          <label className="sr-only" htmlFor="artist-search">Search by name</label>
          <input
            id="artist-search"
            className="filter-bar__input filter-bar__input--search"
            placeholder="Search by name…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
```

with:

```jsx
          <label className="sr-only" htmlFor="artist-search">Search by name</label>
          <div className="filter-bar__search-wrap">
            <svg className="filter-bar__search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="artist-search"
              className="filter-bar__input filter-bar__input--search"
              placeholder="Search by name…"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
```

- [ ] **Step 6: Replace the genre-pill CSS and add search-wrap CSS**

In `src/App.css`, replace:

```css
.genre-pill {
  --pill-color: var(--accent-gold);
  padding: 8px 18px;
  min-height: 36px;
  border-radius: 30px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  border: 1.5px solid rgba(139, 105, 20, 0.22);
  background: transparent;
  color: var(--ink-faint);
  transition: all 0.15s;
  font-family: inherit;
}

.genre-pill:hover { border-color: var(--pill-color); color: var(--pill-color); }

.genre-pill--active {
  color: #fff;
}
```

with:

```css
.genre-pill {
  padding: 7px 16px;
  min-height: 32px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  border: none;
  color: #fff;
  opacity: 0.55;
  transition: opacity 0.15s, box-shadow 0.15s;
  font-family: inherit;
}

.genre-pill:hover { opacity: 0.8; }

.genre-pill--active {
  opacity: 1;
  box-shadow: 0 0 0 2px rgba(44, 24, 16, 0.35);
}

.genre-pill--all {
  background: var(--ink);
}
```

Then add, right after `.filter-bar__input::placeholder { color: #c4a882; }`:

```css
.filter-bar__search-wrap {
  flex: 1 1 140px;
  min-width: 120px;
  position: relative;
  display: flex;
  align-items: center;
}

.filter-bar__search-icon {
  position: absolute;
  left: 12px;
  color: #c4a882;
  pointer-events: none;
}

.filter-bar__search-wrap .filter-bar__input--search {
  width: 100%;
  padding-left: 32px;
  border-radius: 24px;
}
```

- [ ] **Step 7: Verify in the browser**

Run: `npm run dev`
Expected: an "All" dark pill appears before the genre/category pills; all pills are filled with color at all times (not outline); the active pill(s) show a subtle dark ring and full opacity while inactive ones are faded; the search input has a magnifying-glass icon and pill shape.

- [ ] **Step 8: Verify build and lint**

Run: `npm run lint && npm run build`
Expected: both exit 0.

- [ ] **Step 9: Commit**

```bash
git add src/App.jsx src/components/FilterBar.jsx src/App.css
git commit -m "Redesign FilterBar: pill search bar, filled genre/category chips, All pill"
```

---

### Task 6: ArtistRow redesign — avatar, subtext, AGE badge

**Files:**
- Modify: `src/components/ArtistRow.jsx` (full header rewrite + effect changes)
- Modify: `src/App.css` (`.artist-row__stripe` removal, new `.artist-row__sub`, `.artist-row__age-badge*` rules)

**Interfaces:**
- Consumes: `Avatar` (Task 2), `spotifyInfo.spotifyImageUrl` (Task 3).
- Produces: no change to `ArtistRow`'s own props — same `{ artist, expanded, onToggle, locationOpts, locationLabel }` signature.

- [ ] **Step 1: Fetch Spotify info and shows eagerly (not gated on `expanded`)**

In `src/components/ArtistRow.jsx`, replace both `useEffect` calls:

```jsx
  useEffect(() => {
    if (!expanded) return;
    if (currentKey === loadKey && entry !== null) return;
    setLoadKey(currentKey);
    setEntry({ loading: true, shows: null });
    fetchShows(artist.tmName, artist.name, artist.tmId || null, locationOpts || null).then((shows) => {
      setEntry({ loading: false, shows });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded, currentKey]);

  useEffect(() => {
    if (!expanded) return;
    if (spotifyInfo !== null || spotifyLoading) return;
    setSpotifyLoading(true);
    fetchSpotifyInfo(artist.name).then((info) => {
      setSpotifyInfo(info);
      setSpotifyLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);
```

with (same fetch/cache logic, no longer gated on `expanded` — the avatar and show-count subtext need this data before the row is ever clicked open):

```jsx
  useEffect(() => {
    if (currentKey === loadKey && entry !== null) return;
    setLoadKey(currentKey);
    setEntry({ loading: true, shows: null });
    fetchShows(artist.tmName, artist.name, artist.tmId || null, locationOpts || null).then((shows) => {
      setEntry({ loading: false, shows });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentKey]);

  useEffect(() => {
    if (spotifyInfo !== null || spotifyLoading) return;
    setSpotifyLoading(true);
    fetchSpotifyInfo(artist.name).then((info) => {
      setSpotifyInfo(info);
      setSpotifyLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
```

- [ ] **Step 2: Import Avatar**

At the top of `src/components/ArtistRow.jsx`, add:

```jsx
import Avatar from './Avatar';
```

- [ ] **Step 3: Rewrite the header**

Replace the `<button className="artist-row__header" ...>...</button>` block (everything from `<button` to its closing `</button>`) with:

```jsx
      <button
        className="artist-row__header"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={panelId}
      >
        <Avatar src={spotifyInfo && spotifyInfo.spotifyImageUrl} name={artist.name} color={ac} />
        <div className="artist-row__identity">
          <div className="artist-row__name">{artist.name}</div>
          <div className="artist-row__sub">
            {artist.genre}{hasShows ? ` · ${shows.length} upcoming show${shows.length !== 1 ? 's' : ''}` : ''}
          </div>
          {!isSolo && (
            <div className="artist-row__members">
              {artist.members.map((m) => (
                <span key={m.name} className="artist-row__member">
                  {m.name} <span style={{ color: ageColor(computeAge(m.birthYear, m.deathYear)) }}>{computeAge(m.birthYear, m.deathYear)}</span>
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="artist-row__age-badge" style={{ background: ac }}>
          <span className="artist-row__age-badge-label">AGE</span>
          <span className="artist-row__age-badge-num">{artistHasPassed(artist) ? 'RIP' : age}</span>
        </div>
        <span className={`artist-row__chevron${expanded ? ' artist-row__chevron--open' : ''}`} aria-hidden="true">
          &#9662;
        </span>
      </button>
```

Note: this removes the decorative `.artist-row__stripe` bar (its only purpose was showing the age color, which the new AGE badge already does more clearly) and the old `isSolo`-gated age-circle-vs-show-badge split (both solo artists and bands now always show the AGE badge; the show count moves into the subtext line for everyone). The per-member band roster (`.artist-row__members`) is unchanged and still only shown for bands.

- [ ] **Step 4: Replace the CSS**

In `src/App.css`, delete the `.artist-row__stripe` rule:

```css
.artist-row__stripe { width: 4px; align-self: stretch; border-radius: 4px; flex-shrink: 0; }
```

Then replace this whole block (the show-count badge, the age circle, and the "RIP" memoriam label — all three are superseded by the new AGE badge, and the age circle's `font-family: 'Righteous'` references a font Task 1 already dropped):

```css
.artist-row__badge {
  flex-shrink: 0;
  background: var(--accent-rust);
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  padding: 3px 10px;
  margin-right: 6px;
  white-space: nowrap;
}

.artist-row__age-circle {
  flex-shrink: 0;
  width: 46px; height: 46px;
  border-radius: 50%;
  border: 2px solid;
  display: flex; align-items: center; justify-content: center;
  font-size: 17px; font-weight: 700;
  font-family: 'Righteous', Georgia, serif;
}

.artist-row__memoriam {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
}
```

with:

```css
.artist-row__sub {
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  color: var(--ink-faint);
  margin-top: 2px;
}

.artist-row__age-badge {
  flex-shrink: 0;
  padding: 5px 10px;
  border-radius: 8px;
  text-align: center;
  color: #fff;
}

.artist-row__age-badge-label {
  display: block;
  font-family: 'Nunito', sans-serif;
  font-size: 8px;
  font-weight: 900;
  letter-spacing: 0.05em;
}

.artist-row__age-badge-num {
  display: block;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.2;
}
```

- [ ] **Step 5: Verify in the browser**

Run: `npm run dev`
Expected: Music mode's artist list shows a circular avatar (photo once Spotify resolves, colored initial before/if it fails) on the left of every row, a genre + show-count subtext line, and a rounded-rect "AGE" badge on the right — visible even before expanding a row.

- [ ] **Step 6: Verify lint, build, and existing tests**

Run: `npm run lint && npm run build && npm test`
Expected: all exit 0 / pass (age.test.js, urlMode.test.js, Avatar.test.jsx unaffected by this change).

- [ ] **Step 7: Commit**

```bash
git add src/components/ArtistRow.jsx src/App.css
git commit -m "Redesign ArtistRow: eager avatar/show fetch, AGE badge, genre+shows subtext"
```

---

### Task 7: ArtCard redesign — avatar, subtext, AGE badge

**Files:**
- Modify: `src/components/ArtCard.jsx` (header rewrite + effect change)

**Interfaces:**
- Consumes: `Avatar` (Task 2), `info.thumbnail` (already returned by `fetchArtInfo`, from `api/art-info.js`'s existing Wikipedia-summary thumbnail — no API change needed).
- Produces: no change to `ArtCard`'s own props — same `{ artist, expanded, onToggle }` signature.

- [ ] **Step 1: Fetch art info eagerly (not gated on `expanded`)**

In `src/components/ArtCard.jsx`, replace:

```jsx
  useEffect(() => {
    if (!expanded) return;
    if (info !== null || loading) return;
    setLoading(true);
    fetchArtInfo(artist.wikidataId, artist.name).then((data) => {
      setInfo(data);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);
```

with:

```jsx
  useEffect(() => {
    if (info !== null || loading) return;
    setLoading(true);
    fetchArtInfo(artist.wikidataId, artist.name).then((data) => {
      setInfo(data);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
```

- [ ] **Step 2: Import Avatar**

At the top of `src/components/ArtCard.jsx`, add:

```jsx
import Avatar from './Avatar';
```

- [ ] **Step 3: Rewrite the header**

Replace the `<button className="artist-row__header" ...>...</button>` block with:

```jsx
      <button
        className="artist-row__header"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={panelId}
      >
        <Avatar src={info && info.thumbnail} name={artist.name} color={ac} />
        <div className="artist-row__identity">
          <div className="artist-row__name">{artist.name}</div>
          <div className="artist-row__sub">{artist.category}</div>
        </div>
        <div className="artist-row__age-badge" style={{ background: ac }}>
          <span className="artist-row__age-badge-label">AGE</span>
          <span className="artist-row__age-badge-num">{passed ? 'RIP' : age}</span>
        </div>
        <span className={`artist-row__chevron${expanded ? ' artist-row__chevron--open' : ''}`} aria-hidden="true">&#9662;</span>
      </button>
```

This drops the old `.artist-row__stripe` bar and reuses the same `.artist-row__sub` / `.artist-row__age-badge*` CSS added in Task 6 — no new CSS needed for this file.

- [ ] **Step 4: Verify in the browser**

Run: `npm run dev`, switch to Art mode.
Expected: every visible artist row shows an avatar (Wikipedia portrait thumbnail once resolved, colored initial before/if it fails), the category as subtext, and the same AGE badge style as Music mode.

- [ ] **Step 5: Verify lint, build, and existing tests**

Run: `npm run lint && npm run build && npm test`
Expected: all exit 0 / pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/ArtCard.jsx
git commit -m "Redesign ArtCard: eager avatar fetch, AGE badge, category subtext"
```

---

### Task 8: Final integration pass

**Files:** none (verification only)

**Interfaces:** none — this task only exercises the app end-to-end.

- [ ] **Step 1: Full check suite**

Run: `npm run lint && npm run build && npm test`
Expected: all exit 0 / pass.

- [ ] **Step 2: Manual desktop check**

Run: `npm run dev`, open in a desktop-width browser window.
Verify: Music-mode hero shows the background art with both the open text area and the vinyl-sun visible; Art-mode hero shows the flat gradient; both show the new wordmark/eyebrow/headline/subhead hierarchy and the age-tier legend; filter bar shows the dark "All" pill plus filled colored genre/category pills; artist/artwork cards show avatar, name, genre/category subtext, and the AGE badge; the artist grid is multi-column.

- [ ] **Step 3: Manual mobile-width check**

Using the browser's device toolbar (or an actual phone), set the viewport to ~375px wide.
Verify: the Music-mode hero background crops toward the open text area (per the `background-position: 15% center` override under 640px) and the headline/subhead stay fully legible; the artist grid collapses to a single column; cards, pills, and the search bar remain usable and don't overflow horizontally.

- [ ] **Step 4: Avatar fallback check**

In the browser, find at least one artist whose Spotify/Wikipedia lookup is likely to fail or return no image (e.g., temporarily disconnect network after initial load, or pick an obscure roster entry) and confirm the colored-initial fallback renders instead of a broken image icon.

- [ ] **Step 5: Note any follow-ups, do not silently fix**

If any of the above manual checks reveal a real problem, stop and report it rather than improvising a fix outside this plan's scope — in particular, do not attempt to build the tall mobile-native hero image or a full-page immersive background in this task; both are explicitly deferred per the spec.
