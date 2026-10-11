import { describe, expect, it } from 'vitest';
import { addTypedWords, addWord, MAX_MESSAGE_WORDS, removeLastWord, savePhrase, toSentence } from './message';

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

describe('wordIndexAt', () => {
  it('maps a spoken character position to the word on screen', async () => {
    const { wordIndexAt } = await import('./useSpeech');
    const words = ['I want', 'Water'];
    expect(wordIndexAt(words, 0)).toBe(0);
    expect(wordIndexAt(words, 2)).toBe(0); // "want" is still the first chip
    expect(wordIndexAt(words, 7)).toBe(1);
    expect(wordIndexAt(words, 99)).toBe(1);
  });
});

describe('addTypedWords', () => {
  it('splits typed text into one word per chip and ignores extra spaces', () => {
    expect(addTypedWords(['I want'], '  grandma   pizza ')).toEqual(['I want', 'grandma', 'pizza']);
    expect(addTypedWords([], '   ')).toEqual([]);
  });
});
