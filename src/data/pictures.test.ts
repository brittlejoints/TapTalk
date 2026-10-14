import { describe, expect, it } from 'vitest';
import { EMOJI_GROUPS, firstEmoji, isEmoji } from './emoji';
import { ICON_GROUPS, TILE_ICONS } from './icons';
import { LANGUAGES, STRINGS } from './strings';

describe('icon groups', () => {
  it('list every icon exactly once', () => {
    const grouped = ICON_GROUPS.flatMap((g) => g.ids);
    expect(new Set(grouped).size).toBe(grouped.length);
    expect([...grouped].sort()).toEqual(Object.keys(TILE_ICONS).sort());
  });
});

describe('group names', () => {
  it('every icon and emoji group has a name in every language', () => {
    for (const { id: lang } of LANGUAGES) {
      const iconNames = STRINGS[lang].iconGroups as Record<string, string>;
      const emojiNames = STRINGS[lang].emojiGroups as Record<string, string>;
      for (const g of ICON_GROUPS) expect(iconNames[g.id], `${lang} icon group ${g.id}`).toBeTruthy();
      for (const g of EMOJI_GROUPS) expect(emojiNames[g.id], `${lang} emoji group ${g.id}`).toBeTruthy();
    }
  });
});

describe('emoji', () => {
  it('every curated emoji passes the emoji check, with no duplicates', () => {
    const all = EMOJI_GROUPS.flatMap((g) => g.items.map(([e]) => e));
    for (const e of all) expect(isEmoji(e), e).toBe(true);
    expect(new Set(all).size).toBe(all.length);
  });

  it('accepts skin tones, combined emoji and flags, and rejects text', () => {
    expect(isEmoji('👍🏽')).toBe(true);
    expect(isEmoji('🧑‍🦽')).toBe(true);
    expect(isEmoji('🇺🇸')).toBe(true);
    expect(isEmoji('a')).toBe(false);
    expect(isEmoji('hi 👋')).toBe(false);
    expect(isEmoji('')).toBe(false);
  });

  it('pulls the first emoji out of typed text', () => {
    expect(firstEmoji('pizza 🍕 yum')).toBe('🍕');
    expect(firstEmoji('🧑‍⚕️🍎')).toBe('🧑‍⚕️');
    expect(firstEmoji('no emoji here')).toBeNull();
  });
});
