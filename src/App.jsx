import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { ARTISTS, RADIUS_OPTIONS, maxAge } from './data/artists';
import { clearCaches, geocodeZip, getCachedShows, primeGenreMax, fetchShows } from './lib/api';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import ArtistRow from './components/ArtistRow';
import Footer from './components/Footer';

export default function SwanSong() {
  const [genreFilters, setGenreFilters] = useState([]);
  const [zipInput, setZipInput] = useState('');
  const [radius, setRadius] = useState(50);
  const [geoInfo, setGeoInfo] = useState(null);
  const [geoError, setGeoError] = useState('');
  const [geoLoading, setGeoLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState({});

  // Prime genre score baselines silently on load, staggered to avoid
  // hammering Last.fm, so scores are stable the first time a user expands
  // an artist.
  useEffect(() => {
    ARTISTS.forEach((artist, i) => {
      setTimeout(() => primeGenreMax(artist.name, artist.genre), i * 80);
    });
  }, []);

  const locationOpts = geoInfo ? { lat: geoInfo.lat, lng: geoInfo.lng, radius } : null;
  const locationLabel = geoInfo ? `${geoInfo.city}, ${geoInfo.state}` : null;
  const filterActive = genreFilters.length > 0 || !!geoInfo || !!search;

  async function handleZipSubmit() {
    if (!zipInput || zipInput.length < 5) return;
    setGeoLoading(true);
    setGeoError('');
    const info = await geocodeZip(zipInput);
    if (!info) {
      setGeoLoading(false);
      setGeoError('ZIP code not found. Try another.');
      return;
    }

    clearCaches();
    const opts = { lat: info.lat, lng: info.lng, radius };

    setGeoInfo(info);
    setExpanded({});

    const scope = genreFilters.length > 0
      ? ARTISTS.filter((a) => genreFilters.includes(a.genre))
      : ARTISTS;

    // Fire all fetches and re-render after each resolves so artists with no
    // shows progressively disappear rather than all appearing then vanishing.
    await Promise.all(scope.map(async (artist) => {
      await fetchShows(artist.tmName, artist.name, artist.tmId || null, opts);
      setGeoInfo((prev) => (prev ? { ...prev, _tick: Math.random() } : prev));
    }));

    setGeoLoading(false);
  }

  function clearLocation() {
    setGeoInfo(null);
    setZipInput('');
    setGeoError('');
    setExpanded({});
    clearCaches();
  }

  function toggleGenre(g) {
    setGenreFilters((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
    setExpanded({});
  }

  function clearAll() {
    setGenreFilters([]);
    setSearch('');
    clearLocation();
  }

  function toggleExpand(name) {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  function handleRadiusChange(next) {
    setRadius(next);
    clearCaches();
    setExpanded({});
  }

  const allSorted = useMemo(
    () => ARTISTS.slice().sort((a, b) => maxAge(b) - maxAge(a)),
    [],
  );

  // When a location filter is active, hide artists confirmed to have zero
  // shows in range — but keep them visible while loading or not yet fetched.
  const visibleArtists = allSorted.filter((a) => {
    if (genreFilters.length > 0 && !genreFilters.includes(a.genre)) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (geoInfo) {
      const cached = getCachedShows(a.tmName, a.tmId || null, locationOpts);
      if (cached !== undefined && Array.isArray(cached) && cached.length === 0) return false;
    }
    return true;
  });

  const statusMessage = filterActive
    ? (geoLoading
        ? `Searching for shows near ${locationLabel}…`
        : `${visibleArtists.length} artist${visibleArtists.length !== 1 ? 's' : ''}`
          + (genreFilters.length > 0 ? ` in ${genreFilters.join(' & ')}` : '')
          + (locationLabel ? ` with shows near ${locationLabel} within ${radius} mi` : '')
          + ' — click any to expand')
    : 'Click any artist to see their songs and upcoming shows worldwide. Enter a ZIP to find shows near you.';

  return (
    <div className="app">
      <Hero />

      <FilterBar
        genreFilters={genreFilters}
        onToggleGenre={toggleGenre}
        zipInput={zipInput}
        onZipChange={setZipInput}
        onZipSubmit={handleZipSubmit}
        geoLoading={geoLoading}
        radius={radius}
        onRadiusChange={handleRadiusChange}
        radiusOptions={RADIUS_OPTIONS}
        geoInfo={geoInfo}
        geoError={geoError}
        onClearLocation={clearLocation}
        search={search}
        onSearchChange={setSearch}
        filterActive={filterActive}
        onClearAll={clearAll}
      />

      <main className="content">
        <p className="content__status">{statusMessage}</p>
        <div className="artist-grid">
          {visibleArtists.map((artist, i) => (
            <div key={artist.name} className="artist-grid__item fade" style={{ animationDelay: `${Math.min(i * 0.02, 0.4)}s` }}>
              <ArtistRow
                artist={artist}
                expanded={!!expanded[artist.name]}
                onToggle={() => toggleExpand(artist.name)}
                locationOpts={locationOpts}
                locationLabel={locationLabel}
              />
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
