export default function Footer({ mode }) {
  return (
    <footer className="footer">
      <div className="footer__brand">
        {mode === 'music'
          ? 'SWAN SONG · SEE THEM WHILE YOU CAN · POWERED BY TICKETMASTER'
          : 'SWAN SONG · BEFORE THE PAINT DRIES · POWERED BY WIKIPEDIA & WIKIDATA'}
      </div>
      <div className="footer__note">
        {mode === 'music' ? (
          <>
            <span className="footer__note-label">Song Score</span> is an estimated 0-100 ranking, normalized within
            each genre using a power curve. It approximates relative popularity from each artist&rsquo;s top Last.fm
            track &mdash; it is not a measured stream count, and a score of 100 marks the current benchmark song in
            that genre.
          </>
        ) : (
          <>
            <span className="footer__note-label">Notable works and collections</span> are sourced from Wikidata and
            may be incomplete or out of date. &ldquo;Where to see their work&rdquo; reflects known holdings, not a
            live exhibition schedule &mdash; there is no public aggregator for museum shows the way Ticketmaster
            aggregates concerts.
          </>
        )}
      </div>
    </footer>
  );
}
