import { describe, expect, it } from 'vitest';
import { periodFor, greetingFor } from './greeting';

describe('greetingFor', () => {
  it('says good morning from 5am to noon', () => {
    expect(greetingFor(5)).toBe('Good morning');
    expect(greetingFor(11)).toBe('Good morning');
  });

  it('says good afternoon from noon to 6pm', () => {
    expect(greetingFor(12)).toBe('Good afternoon');
    expect(greetingFor(17)).toBe('Good afternoon');
  });

  it('says good evening the rest of the day, including early morning', () => {
    expect(greetingFor(18)).toBe('Good evening');
    expect(greetingFor(23)).toBe('Good evening');
    expect(greetingFor(0)).toBe('Good evening');
    expect(greetingFor(4)).toBe('Good evening');
  });

  it('includes a name when one is set, trims whitespace, and skips an empty one', () => {
    expect(greetingFor(9, 'Sam')).toBe('Good morning, Sam');
    expect(greetingFor(9, '  Sam  ')).toBe('Good morning, Sam');
    expect(greetingFor(9, '')).toBe('Good morning');
    expect(greetingFor(9, '   ')).toBe('Good morning');
  });
});

describe('periodFor', () => {
  it('splits the day at 5, 12 and 18', () => {
    expect([4, 5, 11, 12, 17, 18, 23, 0].map(periodFor)).toEqual([
      'evening', 'morning', 'morning', 'afternoon', 'afternoon', 'evening', 'evening', 'evening',
    ]);
  });
});
