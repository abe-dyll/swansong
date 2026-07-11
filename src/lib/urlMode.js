const DEFAULT_MODE = 'music';
const VALID_MODES = ['music', 'art'];

export function getModeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode');
  return VALID_MODES.includes(mode) ? mode : DEFAULT_MODE;
}

export function setModeInUrl(mode) {
  const params = new URLSearchParams(window.location.search);
  if (mode === DEFAULT_MODE) {
    params.delete('mode');
  } else {
    params.set('mode', mode);
  }
  const query = params.toString();
  const next = window.location.pathname + (query ? `?${query}` : '');
  window.history.replaceState(null, '', next);
}
