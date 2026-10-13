/** Pure helpers for the message bar, kept separate from React so they are easy to test. */

export const MAX_MESSAGE_WORDS = 12;

export function addWord(words: string[], word: string): string[] {
  const trimmed = word.trim();
  if (!trimmed || words.length >= MAX_MESSAGE_WORDS) return words;
  return [...words, trimmed];
}

export function removeLastWord(words: string[]): string[] {
  return words.slice(0, -1);
}

export function toSentence(words: string[]): string {
  return words.join(' ');
}

/**
 * Adds a phrase to the front of the saved list, without duplicates (case-insensitive).
 * A new phrase is refused when the list is full rather than silently pushing an old one out.
 */
export function savePhrase(saved: string[], phrase: string, limit: number): string[] {
  const trimmed = phrase.trim();
  if (!trimmed) return saved;
  const withoutDuplicate = saved.filter((p) => p.toLowerCase() !== trimmed.toLowerCase());
  if (withoutDuplicate.length >= limit) return saved;
  return [trimmed, ...withoutDuplicate];
}

/** Adds typed text as separate words (one chip each), stopping at the limit. */
export function addTypedWords(words: string[], text: string): string[] {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .reduce((acc, word) => addWord(acc, word), words);
}
