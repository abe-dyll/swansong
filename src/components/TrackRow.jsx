export default function TrackRow({ name, score, genre }) {
  return (
    <div className="track-row">
      <div className="track-row__name">{name}</div>
      {score != null && (
        <div className="track-row__score">
          <div className="track-row__score-value">{score}</div>
          <div className="track-row__score-label">est. in {genre}</div>
        </div>
      )}
    </div>
  );
}
