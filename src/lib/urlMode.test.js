import { beforeEach, describe, expect, it } from 'vitest';
import { getModeFromUrl, setModeInUrl } from './urlMode';

describe('getModeFromUrl', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('defaults to music when no mode param is present', () => {
    expect(getModeFromUrl()).toBe('music');
  });

  it('reads mode=art from the query string', () => {
    window.history.replaceState(null, '', '/?mode=art');
    expect(getModeFromUrl()).toBe('art');
  });

  it('falls back to music for an unrecognized mode value', () => {
    window.history.replaceState(null, '', '/?mode=bogus');
    expect(getModeFromUrl()).toBe('music');
  });
});

describe('setModeInUrl', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('writes ?mode=art to the URL', () => {
    setModeInUrl('art');
    expect(window.location.search).toBe('?mode=art');
  });

  it('removes the mode param entirely when set back to music (the default)', () => {
    setModeInUrl('art');
    setModeInUrl('music');
    expect(window.location.search).toBe('');
  });
});
