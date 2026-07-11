export default function ModeToggle({ mode, onToggle }) {
  const nextMode = mode === 'music' ? 'art' : 'music';
  return (
    <button
      type="button"
      className="mode-toggle"
      onClick={() => onToggle(nextMode)}
      aria-label={`Switch to ${nextMode === 'art' ? 'Art' : 'Music'} mode`}
      title={`Switch to ${nextMode === 'art' ? 'Art' : 'Music'} mode`}
    >
      {mode === 'music' ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M18 3c-2 0-6 1.5-9 4.5C6 10.5 4 15 4 15s1-1 2-1c1.5 0 2.5 1.5 2.5 3S7.5 20 6 20c-1.5 0-2.5-1-2.5-1S4 21 6 21c2.5 0 4-2 4-4 0-1-.3-1.8-.7-2.5C11 13 15 10 18 7c1-1 2-3 2-4 0 0-1 0-2 0z" fill="currentColor" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="1.6" fill="none" />
          <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.6" fill="none" />
          <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="1.6" fill="none" />
        </svg>
      )}
      <span>{mode === 'music' ? 'Art Mode' : 'Music Mode'}</span>
    </button>
  );
}
