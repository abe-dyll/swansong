import { describe, expect, it } from 'vitest';
import { createGenreMaxStore, estimateTrackScore, scoreFromRatio } from './scoring';

describe('scoreFromRatio', () => {
  it('maps a full ratio to 100', () => {
    expect(scoreFromRatio(1)).toBe(100);
  });

  it('maps a zero ratio to 0', () => {
    expect(scoreFromRatio(0)).toBe(0);
  });

  it('lifts low ratios above their linear value via the power curve', () => {
    const score = scoreFromRatio(0.25);
    expect(score).toBeGreaterThan(25);
  });

  it('returns null for missing input', () => {
    expect(scoreFromRatio(null)).toBeNull();
    expect(scoreFromRatio(undefined)).toBeNull();
  });
});

describe('estimateTrackScore', () => {
  it('returns null when the genre has no known max playcount yet', () => {
    expect(estimateTrackScore(0, 0)).toBeNull();
    expect(estimateTrackScore(undefined, 0)).toBeNull();
  });

  it('ranks the top song highest and later ranks lower', () => {
    const genreMax = 1000000;
    const first = estimateTrackScore(genreMax, 0);
    const second = estimateTrackScore(genreMax, 1);
    const third = estimateTrackScore(genreMax, 2);
    expect(first).toBeGreaterThan(second);
    expect(second).toBeGreaterThan(third);
  });

  it('falls back to the lowest weight for ranks beyond the known list', () => {
    const genreMax = 1000000;
    expect(estimateTrackScore(genreMax, 5)).toBe(estimateTrackScore(genreMax, 2));
  });
});

describe('createGenreMaxStore', () => {
  it('tracks the highest playcount seen per genre', () => {
    const store = createGenreMaxStore();
    store.update('Rock', 500);
    store.update('Rock', 900);
    store.update('Rock', 100);
    store.update('Jazz', 50);

    expect(store.get('Rock')).toBe(900);
    expect(store.get('Jazz')).toBe(50);
    expect(store.get('Pop')).toBeUndefined();
  });

  it('ignores falsy genre or playcount values', () => {
    const store = createGenreMaxStore();
    store.update('', 500);
    store.update('Rock', 0);
    expect(store.get('Rock')).toBeUndefined();
  });
});
