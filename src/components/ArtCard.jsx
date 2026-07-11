import { useEffect, useId, useState } from 'react';
import { ageColor } from '../data/artists';
import { computeAge, hasPassed } from '../lib/age';
import { fetchArtInfo } from '../lib/artApi';
import WorkImage from './WorkImage';

export default function ArtCard({ artist, expanded, onToggle }) {
  const panelId = useId();
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const age = computeAge(artist.birthYear, artist.deathYear);
  const ac = ageColor(age);
  const passed = hasPassed(artist.deathYear);

  return (
    <div className="artist-row">
      <button
        className="artist-row__header"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={panelId}
      >
        <div className="artist-row__stripe" style={{ background: ac }} aria-hidden="true" />
        <div className="artist-row__identity">
          <div className="artist-row__name">{artist.name}</div>
          <div className="artist-row__members">
            <span className="artist-row__member">{artist.category}</span>
          </div>
        </div>
        <div className="artist-row__age-circle" style={{ borderColor: ac, background: ac + '18', color: ac }}>
          {passed ? <span className="artist-row__memoriam">RIP</span> : age}
        </div>
        <span className={`artist-row__chevron${expanded ? ' artist-row__chevron--open' : ''}`} aria-hidden="true">
          &#9662;
        </span>
      </button>

      {expanded && (
        <div id={panelId} className="artist-row__panel">
          {loading && (
            <div className="artist-row__status" role="status">
              <span className="spinner" aria-hidden="true" />
              Loading&hellip;
            </div>
          )}

          {!loading && info && (
            <>
              <div className="art-card__bio-row">
                <WorkImage
                  src={info.thumbnail}
                  alt={artist.name}
                  searchQuery={artist.name}
                />
                <div className="art-card__bio-text">
                  {info.bio && <p>{info.bio}</p>}
                  {info.wikipediaUrl && (
                    <a href={info.wikipediaUrl} target="_blank" rel="noopener noreferrer" className="art-card__wiki-link">
                      Read more on Wikipedia
                    </a>
                  )}
                </div>
              </div>

              {info.works.length > 0 && (
                <div className="art-card__section">
                  <div className="artist-row__section-header">Notable Works</div>
                  <div className="art-card__works">
                    {info.works.map((w) => (
                      <div key={w.title} className="art-card__work">
                        <WorkImage src={w.imageUrl} alt={w.title} searchQuery={artist.name + ' ' + w.title} />
                        <div className="art-card__work-title">{w.title}</div>
                        {w.institution && <div className="art-card__work-institution">{w.institution}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {info.collections.length > 0 && (
                <div className="art-card__section">
                  <div className="artist-row__section-header">Where to See Their Work</div>
                  <ul className="art-card__collections">
                    {info.collections.map((c) => (
                      <li key={c.name}>{c.name}</li>
                    ))}
                  </ul>
                  <p className="art-card__collections-note">
                    Based on Wikidata&rsquo;s collection records &mdash; a snapshot of known holdings, not a live exhibition schedule.
                  </p>
                </div>
              )}

              {info.auctionPrice && (
                <div className="art-card__section">
                  <div className="artist-row__section-header">Last Known Sale</div>
                  <p>{info.auctionPrice.currency} {info.auctionPrice.amount.toLocaleString()}{info.auctionPrice.year ? ` (${info.auctionPrice.year})` : ''}</p>
                </div>
              )}
            </>
          )}

          {!loading && !info && (
            <div className="artist-row__status artist-row__status--muted">
              Couldn&rsquo;t load details for {artist.name} right now.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
