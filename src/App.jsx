import { useEffect, useMemo, useState } from 'react';
import './App.css';
import musicAdapter from './adapters/musicAdapter';
import artAdapter from './adapters/artAdapter';
import { maxAge, RADIUS_OPTIONS } from './data/artists';
import { computeAge } from './lib/age';
import { getModeFromUrl, setModeInUrl } from './lib/urlMode';
import { clearCaches, geocodeZip, getCachedShows, primeGenreMax, fetchShows } from './lib/api';
import Hero from './components/Hero';
import ModeToggle from './components/ModeToggle';
import FilterBar from './components/FilterBar';
import ArtistRow from './components/ArtistRow';
import Footer from './components/Footer';

const ADAPTERS = { music: musicAdapter, art: artAdapter };

export default function SwanSong() {
  const [mode, setMode] = useState(() => getModeFromUrl());
  const adapter = ADAPTERS[mode];

  const [categoryFilters, setCategoryFilters] = useState([]);
  const [zipInput, setZipInput] = useState('');
  const [radius, setRadius] = useState(50);
  const [geoInfo, setGeoInfo] = useState(null);
  const [geoError, setGeoError] = useState('');
  const [geoLoading, setGeoLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState({});

  function switchMode(nextMode) {
    setMode(nextMode);
    setModeInUrl(nextMode);
    setCategoryFilters([]);
    setSearch('');
    setExpanded({});
    clearLocation();
  }

  // Prime Music's genre score baselines silently on load, staggered to avoid
  // hammering Last.fm, so scores are stable the first time a user expands
  // an artist. Art mode has no equivalent priming step.
  useEffect(() => {
    if (mode !== 'music') return;
    musicAdapter.roster.forEach((artist, i) => {
      setTimeout(() => primeGenreMax(artist.name, artist.genre), i * 80);
    });
  }, [mode]);

  const locationOpts = geoInfo ? { lat: geoInfo.lat, lng: geoInfo.lng, radius } : null;
  const locationLabel = geoInfo ? `${geoInfo.city}, ${geoInfo.state}` : null;
  const filterActive = categoryFilters.length > 0 || !!geoInfo || !!search;

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

    const scope = categoryFilters.length > 0
      ? adapter.roster.filter((a) => categoryFilters.includes(a.genre))
      : adapter.roster;

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

  function toggleCategory(c) {
    setCategoryFilters((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
    setExpanded({});
  }

  function clearAll() {
    setCategoryFilters([]);
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

  const rosterAge = (entry) => (mode === 'music'
    ? maxAge(entry)
    : computeAge(entry.birthYear, entry.deathYear));

  const rosterCategory = (entry) => (mode === 'music' ? entry.genre : entry.category);

  const allSorted = useMemo(
    () => adapter.roster.slice().sort((a, b) => rosterAge(b) - rosterAge(a)),
    [adapter],
  );

  // When a location filter is active (Music only), hide artists confirmed to
  // have zero shows in range — but keep them visible while loading or not
  // yet fetched. Art mode has no location search, so `geoInfo` stays null
  // there and this branch is a no-op.
  const visibleArtists = allSorted.filter((a) => {
    if (adapter.ageDefaultFloor != null && rosterAge(a) < adapter.ageDefaultFloor) return false;
    if (categoryFilters.length > 0 && !categoryFilters.includes(rosterCategory(a))) return false;
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
        : `${visibleArtists.length} ${mode === 'music' ? 'artist' : 'artist'}${visibleArtists.length !== 1 ? 's' : ''}`
          + (categoryFilters.length > 0 ? ` in ${categoryFilters.join(' & ')}` : '')
          + (locationLabel ? ` with shows near ${locationLabel} within ${radius} mi` : '')
          + ' — click any to expand')
    : (mode === 'music'
        ? 'Click any artist to see their songs and upcoming shows worldwide. Enter a ZIP to find shows near you.'
        : 'Click any artist to see their story, notable works, and where to see them in person.');

  return (
    <div className="app">
      <Hero tagline={adapter.tagline} />
      <div className="mode-toggle-row">
        <ModeToggle mode={mode} onToggle={switchMode} />
      </div>

      <FilterBar
        categories={adapter.categories}
        categoryColors={adapter.categoryColors}
        categoryLabel={adapter.categoryLabel}
        activeCategories={categoryFilters}
        onToggleCategory={toggleCategory}
        showLocationSearch={adapter.showLocationSearch}
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
              {mode === 'music' ? (
                <ArtistRow
                  artist={artist}
                  expanded={!!expanded[artist.name]}
                  onToggle={() => toggleExpand(artist.name)}
                  locationOpts={locationOpts}
                  locationLabel={locationLabel}
                />
              ) : (
                <div className="artist-row">
                  <button className="artist-row__header" onClick={() => toggleExpand(artist.name)}>
                    <div className="artist-row__identity">
                      <div className="artist-row__name">{artist.name}</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <Footer mode={mode} />
    </div>
  );
}
