# Visual Redesign — Design Spec

## Why

The current UI (Righteous display font, flat yellow gradient background, saturated 5-hue genre pills, a hand-drawn guitar+dove icon, a repeating-conic-gradient "sunburst") reads as amateur rather than a credible product. This redesign replaces those elements with a considered visual system across both Music and Art modes, informed by a real generated background illustration and a SeatGeek/ticket-marketplace-inspired card language.

## Scope

Applies to the shared shell (`Hero`, `FilterBar`, `ArtistRow`/`ArtCard`, `Footer`) so both Music and Art modes inherit it consistently. Does not touch the Song Score removal (already shipped) or the CI/API-key work (already shipped).

## Hero section

**Content hierarchy** (replaces the current single title+tagline):
1. Brand wordmark: "SWAN SONG" — small, bold, letter-spaced caps.
2. Eyebrow line: small, uppercase, muted — mode-specific context.
3. Headline: large, bold slab serif, sentence case — the emotional hook.
4. Subhead: regular weight, smaller, muted — the functional explanation.

Final copy:

| | Music | Art |
|---|---|---|
| Wordmark | SWAN SONG | SWAN SONG |
| Eyebrow | For the acts who never stopped | For the hands that never stopped |
| Headline | The legends are still touring. | The masters are still creating. |
| Subhead | Track tour dates from the legends who make up your favorite playlists before their final curtain call. | Find where to see the gallery and museum works of the artists who shaped a movement, while they're still creating. |

No em dashes anywhere in copy.

**Typography:**
- Headline: Zilla Slab, weight 700.
- Wordmark, eyebrow, subhead, and all body/UI text: Nunito (weights 400/700/800/900 as needed).
- Drop Righteous and Kalam entirely.

**Background art (Music mode):**
- Source asset: `Images/hero-background.png` (repo-root scratch location) — must be moved into `src/assets/` (or `public/`, if it should bypass Vite's asset pipeline) as part of implementation; it does not live in the app's source tree yet.
- A minimalist vinyl record rendered as a setting sun over a converging road, cream/rust/gold/near-black palette, used as the hero's `background-image`, `background-size: cover`.
- This is banner-only (does not extend behind the rest of the page — see "Rejected: full-page immersive" below).
- **Desktop**: `background-position` tuned to keep both the open text area and the vinyl-sun centerpiece visible (wide aspect ratio accommodates both).
- **Mobile (primary platform)**: neither crop of the current landscape image fully works — keeping the sun crops awkwardly over the text, keeping the text area crops out the sun almost entirely. **Default for v1: prioritize text legibility** (crop toward the open area, sun partially visible at the edge). A properly composed tall portrait continuation of the same artwork (order via the two saved prompts style — same palette/technique, road continuing downward, sun receding higher in frame) is the correct permanent fix and should be tracked as a fast-follow, not solved by further cropping.
- **Art mode**: no illustrated background for now — flat two-stop gradient in the same cream/tan family (`#f2e8ce` → `#e8dcc0`). A dedicated Art-mode illustration (painter's-studio scene, prompt already drafted in this conversation) is an open option for later, not required for this pass.

**Rejected: full-page immersive background.** Explored and liked visually, but two problems: (1) it doesn't resolve the mobile crop problem above — if anything it makes it worse since the image has to work behind scrolling content, not just a banner; (2) `background-attachment: fixed` (the standard way to keep a background steady while content scrolls over it) is unreliable on mobile Safari, the primary platform. Deferred until/unless a purpose-built tall scrolling image exists.

## Color system

Two independent color signals, kept separate (not merged into one):
1. **Genre/category color** (Rock, Country, Jazz... / Painting, Sculpture...) — each keeps its own hue, pulled into a shared muted "ink family" so 5 (Music) or 10 (Art) hues don't clash:
   - Rock `#A6432B`, Country `#A67C1E`, Jazz `#1F4A42`, Soul/R&B `#6B3459`, Pop `#5C6B2E` (Art's 10 categories follow the same muting treatment against `ART_CATEGORY_COLORS`).
2. **Age urgency color** (the existing 3-tier system) — unchanged: 80+ `#A63A2B`, 72–79 `#B9860B`, 65–71 `#5C7A29`.

These appear on different shaped elements (pill vs. circular badge) so occasional hue overlap between the two systems doesn't read as confusing — this already happens in the current app and hasn't been a reported problem.

## Card / list layout (SeatGeek-informed)

Per artist/artwork row:
- **Photo avatar** (left, circular): real image when available. Fallback when no image is returned: the artist's first initial, centered, on a solid-color circle using that row's age-tier color — no broken `<img>` icons.
  - Music: extend the existing Spotify search already performed in `api/artist-info.js` (`getSpotifyArtistUrl`) to also return an image from the search result's `images` array. No new API call — same request already made for the Spotify profile link.
  - Art: reuse the Wikipedia summary thumbnail already fetched in `api/art-info.js` (`fetchWikipediaSummary` → `thumbnail`) — already wired for the bio panel, now also used as the avatar.
- **Name + subtext** (center, flexible width): artist/artist name bold, subtext below in smaller muted text: `{genre/category} · {N} upcoming shows` (Music) or `{category}` (Art, which has no show count).
- **AGE badge** (right, fixed): small rounded-rect badge, "AGE" label above the number, background color = the existing age-tier color, white text.
- Card surface: near-white (`#fffdf7`), soft wide shadow (no border), ~14px radius.

**Filter bar:**
- Search input restyled as a pill-shaped, icon-prefixed search bar (matches ticket-marketplace convention) rather than the current plain bordered input.
- Genre/category pills: filled with their muted color (not outline), plus a dark "All" pill for clearing filters.
- ZIP/radius location search (Music only) keeps its existing function, restyled to match the new input/pill treatment.

## Page background & surfaces (non-hero)

- Replace the flat yellow gradient (`--bg-start/mid/end`) with a quiet warm parchment tone (`#f6f2e6`), optionally with the existing subtle grain texture — no more visible gradient banding.
- Cards/pills/chips as described above throughout, whether under the Music or Art hero.

## Responsive layout

- Current `.artist-grid { columns: 2 310px }` (CSS multi-column) collapsing to `columns: 1` under 640px already delivers "multi-up on desktop, single column on mobile" — kept as-is.
- Known nuance: CSS columns fill top-to-bottom within each column (masonry order), not strict left-to-right row order. Not changing this unless it becomes a problem — flagged here so it's a known tradeoff, not a surprise.

## Out of scope / explicitly deferred

- A purpose-built tall mobile-native hero image (see Hero section above).
- A dedicated Art-mode illustrated background.
- Any change to the Song Score removal, CI workflow, or API-key/env-var work already shipped in prior commits.

## Testing / verification

- `npm run lint`, `npm run build`, `npm test` must stay green (existing suite; no new test coverage exists for pure visual/CSS changes, consistent with the current project).
- Manual check in a real mobile viewport width (not just browser devtools resize) given mobile is the primary platform, per this conversation's explicit callout.
- Manual check that Spotify-image and Wikipedia-thumbnail fallbacks (missing image case) render sensibly, not broken `<img>` icons.
