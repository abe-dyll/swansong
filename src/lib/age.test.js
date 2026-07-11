import { describe, expect, it } from 'vitest';
import { computeAge, hasPassed } from './age';

describe('computeAge', () => {
  it('computes age from birth year at a given date', () => {
    expect(computeAge(1943, null, new Date('2026-07-11'))).toBe(83);
  });

  it('freezes age at time of death when deathYear is present', () => {
    expect(computeAge(1948, 2025, new Date('2026-07-11'))).toBe(77);
  });

  it('defaults atDate to now when omitted', () => {
    const thisYear = new Date().getFullYear();
    expect(computeAge(thisYear - 30, null)).toBe(30);
  });
});

describe('hasPassed', () => {
  it('is true when a death year is present', () => {
    expect(hasPassed(2025)).toBe(true);
  });

  it('is false when death year is null or undefined', () => {
    expect(hasPassed(null)).toBe(false);
    expect(hasPassed(undefined)).toBe(false);
  });
});
