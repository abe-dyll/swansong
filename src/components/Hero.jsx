const AGE_LEGEND = [
  { color: '#A63A2B', label: '80+' },
  { color: '#B9860B', label: '72-79' },
  { color: '#5C7A29', label: '65-71' },
];

export default function Hero({ mode, eyebrow, headline, subhead }) {
  return (
    <header className={`hero hero--${mode}`}>
      <div className="hero__inner">
        <div className="hero__brand">Swan Song</div>
        <div className="hero__eyebrow">{eyebrow}</div>
        <h1 className="hero__headline">{headline}</h1>
        <p className="hero__subhead">{subhead}</p>

        <div className="hero__legend">
          {AGE_LEGEND.map((item) => (
            <div key={item.label} className="hero__legend-item">
              <span className="hero__legend-dot" style={{ background: item.color }} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
