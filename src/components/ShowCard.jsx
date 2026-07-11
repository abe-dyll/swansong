export default function ShowCard({ show }) {
  const dateStr = show.date
    ? new Date(show.date + 'T12:00:00').toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
      })
    : 'Date TBA';

  let location = [show.city, show.state].filter(Boolean).join(', ');
  if (!show.state && show.country && show.country !== 'United States Of America') {
    location = [show.city, show.country].filter(Boolean).join(', ');
  }

  return (
    <a href={show.url} target="_blank" rel="noopener noreferrer" className="show-card">
      <div className="show-card__row">
        <div className="show-card__details">
          <div className="show-card__name">{show.eventName}</div>
          <div className="show-card__date">{dateStr}</div>
          <div className="show-card__location">{location}</div>
          <div className="show-card__venue">{show.venue}</div>
        </div>
        <div className="show-card__cta">GET TICKETS</div>
      </div>
    </a>
  );
}
