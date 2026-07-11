export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__brand">SWAN SONG &middot; SEE THEM WHILE YOU CAN &middot; POWERED BY TICKETMASTER</div>
      <div className="footer__note">
        <span className="footer__note-label">Song Score</span> is an estimated 0-100 ranking, normalized within
        each genre using a power curve. It approximates relative popularity from each artist&rsquo;s top Last.fm
        track &mdash; it is not a measured stream count, and a score of 100 marks the current benchmark song in
        that genre.
      </div>
    </footer>
  );
}
