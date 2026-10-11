import { describe, expect, it } from 'vitest';
import { addWord, MAX_MESSAGE_WORDS, removeLastWord, savePhrase, toSentence } from './message';

describe('message bar helpers', () => {
  it('builds a sentence word by word', () => {
    let words: string[] = [];
    words = addWord(words, 'I want');
    words = addWord(words, 'Water');
    expect(toSentence(words)).toBe('I want Water');
  });

  it('ignores empty words and stops at the limit', () => {
    expect(addWord([], '   ')).toEqual([]);
    const full = Array.from({ length: MAX_MESSAGE_WORDS }, () => 'More');
    expect(addWord(full, 'Stop')).toBe(full);
  });

  it('removes the last word, and is safe on an empty message', () => {
    expect(removeLastWord(['Yes', 'Please'])).toEqual(['Yes']);
    expect(removeLastWord([])).toEqual([]);
  });
});

describe('savePhrase', () => {
  it('puts the newest phrase first and drops case-insensitive duplicates', () => {
    expect(savePhrase(['Thank you', 'All done'], 'all done', 9)).toEqual(['all done', 'Thank you']);
  });

  it('respects the limit', () => {
    expect(savePhrase(['a', 'b', 'c'], 'd', 3)).toEqual(['d', 'a', 'b']);
  });
});
