const AGE_LEGEND = [
  { color: '#A63A2B', label: '80+' },
  { color: '#B9860B', label: '72-79' },
  { color: '#5C7A29', label: '65-71' },
];

export default function Hero() {
  return (
    <header className="hero">
      <div className="hero__sunburst" aria-hidden="true" />
      <div className="hero__mark" aria-hidden="true">
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          {/* guitar neck */}
          <rect x="22" y="6" width="4" height="34" rx="2" fill="#7A3B69" transform="rotate(18 24 23)" />
          {[0, 1, 2, 3].map((i) => (
            <line
              key={i}
              x1={16 + i * 3}
              y1="10"
              x2={20 + i * 3}
              y2="38"
              stroke="#C9971C"
              strokeWidth="0.6"
              opacity="0.6"
            />
          ))}
          {/* dove */}
          <path
            d="M30 24c4-3 9-2 11 1-1 3-5 4-8 3 2 2 2 5 0 7-1-3-3-5-6-5-4 0-7 2-9 5 0-4 2-7 5-9-3 0-6-2-7-5 3-1 7-1 9 1 1-2 3-3 5 2z"
            fill="#5C7A29"
          />
          <circle cx="34.5" cy="23" r="1.1" fill="#3B2410" />
        </svg>
      </div>

      <h1 className="hero__title">Swan Song</h1>
      <p className="hero__tagline">See them while you still can.</p>

      <div className="hero__legend">
        {AGE_LEGEND.map((item) => (
          <div key={item.label} className="hero__legend-item">
            <span className="hero__legend-dot" style={{ background: item.color }} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </header>
  );
}
