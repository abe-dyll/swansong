import { createGenreMaxStore } from './scoring';

export const genreMaxStore = createGenreMaxStore();

let fetchCache = {};
let spotifyCache = {};

export function clearCaches() {
  fetchCache = {};
  spotifyCache = {};
}

function buildShowsUrl(tmName, displayName, tmId, opts) {
  let params = 'artist=' + encodeURIComponent(tmName) + '&artistDisplay=' + encodeURIComponent(displayName);
  if (tmId) params += '&tmId=' + encodeURIComponent(tmId);
  if (opts && opts.lat && opts.lng) {
    params += '&lat=' + opts.lat + '&lng=' + opts.lng + '&radius=' + (opts.radius || 50);
  }
  return '/api/shows?' + params;
}

export function showsCacheKey(tmName, tmId, opts) {
  return tmName + '__' + (tmId || '') + '__' + (opts ? (opts.lat + ',' + opts.lng + ',' + opts.radius) : 'world');
}

export function getCachedShows(tmName, tmId, opts) {
  return fetchCache[showsCacheKey(tmName, tmId, opts)];
}

export async function fetchShows(tmName, displayName, tmId, opts) {
  const key = showsCacheKey(tmName, tmId, opts);
  if (fetchCache[key] !== undefined) return fetchCache[key];
  try {
    const res = await fetch(buildShowsUrl(tmName, displayName, tmId, opts));
    if (!res.ok) throw new Error('Request failed with status ' + res.status);
    const data = await res.json();
    const shows = Array.isArray(data) ? data : [];
    fetchCache[key] = shows;
    return shows;
  } catch (err) {
    console.error('Failed to fetch shows for', displayName, err);
    fetchCache[key] = [];
    return [];
  }
}

export async function fetchSpotifyInfo(artistName, genre) {
  if (spotifyCache[artistName] !== undefined) return spotifyCache[artistName];
  try {
    const res = await fetch('/api/artist-info?artist=' + encodeURIComponent(artistName));
    if (!res.ok) throw new Error('Request failed with status ' + res.status);
    const data = await res.json();
    if (data && data.tracks && genre) {
      data.tracks.forEach((t) => {
        if (t.playcount) genreMaxStore.update(genre, t.playcount);
      });
    }
    spotifyCache[artistName] = data;
    return data;
  } catch (err) {
    console.error('Failed to fetch artist info for', artistName, err);
    spotifyCache[artistName] = null;
    return null;
  }
}

// Fires silently in the background on page load so genre scores are stable
// by the time a user expands the first artist.
export async function primeGenreMax(artistName, genre) {
  try {
    const res = await fetch('/api/artist-info?artist=' + encodeURIComponent(artistName));
    if (!res.ok) return;
    const data = await res.json();
    if (data && data.tracks && data.tracks.length > 0) {
      data.tracks.forEach((t) => {
        if (t.playcount) genreMaxStore.update(genre, t.playcount);
      });
      spotifyCache[artistName] = data;
    }
  } catch (err) {
    console.error('Failed to prime genre score for', artistName, err);
  }
}

export async function geocodeZip(zip) {
  try {
    const res = await fetch('https://api.zippopotam.us/us/' + zip);
    if (!res.ok) return null;
    const data = await res.json();
    const place = data && data.places && data.places[0];
    if (!place) return null;
    return {
      lat: parseFloat(place['latitude']),
      lng: parseFloat(place['longitude']),
      city: place['place name'],
      state: place['state abbreviation'],
    };
  } catch (err) {
    console.error('Failed to geocode ZIP', zip, err);
    return null;
  }
}
