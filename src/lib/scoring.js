// "Song Score" is an estimated 0-100 ranking, not a real stream count.
// We don't have per-song playcounts for the hardcoded catalog below, so each
// artist's top 3 songs are ranked against each other using fixed relative
// weights, then scaled against the loudest known playcount in their genre
// (fetched from Last.fm) and compressed with a power curve so quieter genres
// don't all bottom out near zero.
export const RELATIVE_TRACK_WEIGHTS = [1.0, 0.72, 0.52];
const CURVE_EXPONENT = 0.65;
const ASSUMED_TOP_SONG_SHARE = 0.8;

export function scoreFromRatio(raw) {
  if (raw == null || Number.isNaN(raw)) return null;
  return Math.round(Math.pow(Math.max(raw, 0), CURVE_EXPONENT) * 100);
}

export function estimateTrackScore(genreMax, rankIndex) {
  if (!genreMax) return null;
  const weight = RELATIVE_TRACK_WEIGHTS[rankIndex] ?? RELATIVE_TRACK_WEIGHTS[RELATIVE_TRACK_WEIGHTS.length - 1];
  const approxTop = genreMax * ASSUMED_TOP_SONG_SHARE;
  const raw = (approxTop * weight) / genreMax;
  return scoreFromRatio(raw);
}

export function createGenreMaxStore() {
  const max = {};
  return {
    update(genre, playcount) {
      if (!genre || !playcount) return;
      if (!max[genre] || playcount > max[genre]) {
        max[genre] = playcount;
      }
    },
    get(genre) {
      return max[genre];
    },
  };
}
