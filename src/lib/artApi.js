let artInfoCache = {};

export function clearArtCache() {
  artInfoCache = {};
}

export async function fetchArtInfo(wikidataId, artistName) {
  if (artInfoCache[wikidataId] !== undefined) return artInfoCache[wikidataId];
  try {
    const url = '/api/art-info?wikidataId=' + encodeURIComponent(wikidataId)
      + '&artistName=' + encodeURIComponent(artistName);
    const res = await fetch(url);
    if (!res.ok) throw new Error('Request failed with status ' + res.status);
    const data = await res.json();
    artInfoCache[wikidataId] = data;
    return data;
  } catch (err) {
    console.error('Failed to fetch art info for', artistName, err);
    artInfoCache[wikidataId] = null;
    return null;
  }
}

// Not required for Art mode's UI to function — kept as a hook so App.jsx
// can pre-warm the cache for currently-visible cards without changing the
// calling convention between modes.
export async function primeArtInfo(wikidataId, artistName) {
  await fetchArtInfo(wikidataId, artistName);
}
