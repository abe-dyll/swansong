import { GENRES, GENRE_COLORS } from '../data/artists';

export default function FilterBar({
  genreFilters, onToggleGenre,
  zipInput, onZipChange, onZipSubmit, geoLoading,
  radius, onRadiusChange, radiusOptions,
  geoInfo, geoError, onClearLocation,
  search, onSearchChange,
  filterActive, onClearAll,
}) {
  return (
    <div className="filter-bar">
      <div className="filter-bar__inner">
        <div className="filter-bar__row" role="group" aria-label="Filter by genre">
          <span className="filter-bar__label">Genre</span>
          {GENRES.map((g) => {
            const active = genreFilters.includes(g);
            return (
              <button
                key={g}
                type="button"
                className={`genre-pill${active ? ' genre-pill--active' : ''}`}
                style={active ? { background: GENRE_COLORS[g], borderColor: GENRE_COLORS[g] } : { '--pill-color': GENRE_COLORS[g] }}
                onClick={() => onToggleGenre(g)}
                aria-pressed={active}
              >
                {g}
              </button>
            );
          })}
        </div>

        <div className="filter-bar__row">
          <span className="filter-bar__label">Near</span>
          <label className="sr-only" htmlFor="zip-input">ZIP code</label>
          <input
            id="zip-input"
            className="filter-bar__input filter-bar__input--zip"
            placeholder="ZIP code"
            value={zipInput}
            maxLength={5}
            inputMode="numeric"
            onChange={(e) => onZipChange(e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => { if (e.key === 'Enter') onZipSubmit(); }}
          />
          <label className="sr-only" htmlFor="radius-select">Search radius in miles</label>
          <select
            id="radius-select"
            className="filter-bar__select"
            value={radius}
            onChange={(e) => onRadiusChange(parseInt(e.target.value, 10))}
          >
            {radiusOptions.map((r) => (
              <option key={r} value={r}>{r} mi</option>
            ))}
          </select>
          <button
            type="button"
            className="filter-bar__submit"
            onClick={onZipSubmit}
            disabled={geoLoading || zipInput.length < 5}
          >
            {geoLoading ? 'Searching…' : 'Search'}
          </button>
          {geoInfo && (
            <div className="filter-bar__chip">
              <span>{geoInfo.city}, {geoInfo.state} / {radius} mi</span>
              <button type="button" onClick={onClearLocation} aria-label="Clear location filter">&times;</button>
            </div>
          )}
          {geoError && <span className="filter-bar__error" role="alert">{geoError}</span>}
          <label className="sr-only" htmlFor="artist-search">Search artist by name</label>
          <input
            id="artist-search"
            className="filter-bar__input filter-bar__input--search"
            placeholder="Search artist…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {filterActive && (
            <button type="button" className="filter-bar__clear" onClick={onClearAll}>Clear all</button>
          )}
        </div>
      </div>
    </div>
  );
}
