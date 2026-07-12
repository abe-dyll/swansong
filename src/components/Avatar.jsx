export default function Avatar({ src, name, color }) {
  if (src) {
    return <img className="avatar" src={src} alt="" aria-hidden="true" />;
  }
  const initial = (name || '').trim().charAt(0).toUpperCase() || '?';
  return (
    <div className="avatar avatar--fallback" style={{ background: color }} aria-hidden="true">
      {initial}
    </div>
  );
}
