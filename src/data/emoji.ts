/**
 * Emoji a custom tile can use, picked for AAC: feelings, body and care,
 * everyday foods, routines, people and places. Each entry is [emoji, name];
 * the name powers search. Users can also type any emoji from their keyboard.
 *
 * Emoji are drawn by the device's own emoji font, so they look like the
 * emoji the user already knows from their keyboard (and need no download).
 */
export const EMOJI_GROUPS: { id: string; label: string; items: [string, string][] }[] = [
  {
    id: 'feelings',
    label: 'Feelings',
    items: [
      ['😀', 'grinning happy'], ['😄', 'happy joy'], ['😂', 'laughing funny'], ['🙂', 'smile okay'], ['😊', 'pleased blush'],
      ['😍', 'love it'], ['🥰', 'loved adore'], ['😘', 'kiss'], ['😎', 'cool'], ['🤩', 'excited wow'], ['🥳', 'party celebrate'],
      ['🤗', 'hug'], ['🤔', 'thinking wonder'], ['😐', 'neutral meh'], ['🙄', 'annoyed eye roll'], ['😳', 'embarrassed'],
      ['😴', 'sleepy tired'], ['🥱', 'yawn bored'], ['😢', 'sad'], ['😭', 'crying upset'], ['😡', 'angry mad'],
      ['😤', 'frustrated'], ['😨', 'scared worried'], ['😱', 'shocked afraid'], ['🤢', 'sick nauseous'], ['🤒', 'fever ill'],
      ['🤕', 'hurt injured'], ['😷', 'mask sick'],
    ],
  },
  {
    id: 'people',
    label: 'People',
    items: [
      ['👋', 'hello wave goodbye'], ['👍', 'yes good thumbs up'], ['👎', 'no bad thumbs down'], ['👏', 'clap well done'],
      ['🙌', 'hooray yay'], ['🙏', 'please thank you'], ['🤝', 'deal handshake'], ['✋', 'stop wait hand'], ['👉', 'that point'],
      ['💪', 'strong'], ['👀', 'look see'], ['👂', 'ear listen'], ['👄', 'mouth talk'], ['🦷', 'tooth teeth'], ['🧠', 'brain think'],
      ['👶', 'baby'], ['🧒', 'child kid'], ['👧', 'girl'], ['👦', 'boy'], ['👩', 'woman mom'], ['👨', 'man dad'],
      ['👵', 'grandma'], ['👴', 'grandpa'], ['🧑‍⚕️', 'doctor nurse health worker'], ['🧑‍🏫', 'teacher'], ['👪', 'family'],
      ['🧑‍🦽', 'wheelchair user'], ['🧑‍🦯', 'cane user blind'],
    ],
  },
  {
    id: 'food',
    label: 'Food & drink',
    items: [
      ['🍎', 'apple'], ['🍌', 'banana'], ['🍓', 'strawberry'], ['🍇', 'grapes'], ['🍉', 'watermelon'], ['🍊', 'orange'],
      ['🥕', 'carrot'], ['🥦', 'broccoli'], ['🍞', 'bread toast'], ['🧀', 'cheese'], ['🥚', 'egg'], ['🍳', 'breakfast'],
      ['🥞', 'pancakes'], ['🥣', 'cereal bowl'], ['🍕', 'pizza'], ['🍔', 'burger'], ['🍟', 'fries chips'], ['🌭', 'hot dog'],
      ['🌮', 'taco'], ['🍝', 'pasta spaghetti'], ['🍜', 'noodles soup'], ['🍚', 'rice'], ['🍗', 'chicken'], ['🥗', 'salad'],
      ['🥪', 'sandwich'], ['🍪', 'cookie'], ['🍰', 'cake'], ['🍦', 'ice cream'], ['🍫', 'chocolate'], ['🍿', 'popcorn'],
      ['🥛', 'milk'], ['🧃', 'juice box'], ['☕', 'coffee hot drink'], ['🍵', 'tea'], ['💧', 'water'], ['🥤', 'soda drink'],
    ],
  },
  {
    id: 'daily',
    label: 'Daily life',
    items: [
      ['🚽', 'toilet bathroom'], ['🛁', 'bath'], ['🚿', 'shower'], ['🪥', 'toothbrush brush teeth'], ['🧼', 'soap wash hands'],
      ['🛏️', 'bed sleep'], ['🧸', 'teddy bear comfort'], ['👕', 'shirt clothes'], ['👖', 'pants'], ['👟', 'shoes'],
      ['🧥', 'coat jacket'], ['🧢', 'hat cap'], ['🧦', 'socks'], ['🎒', 'backpack school bag'], ['👓', 'glasses'],
      ['💊', 'medicine pill'], ['🩹', 'bandage'], ['🌡️', 'thermometer fever'], ['📱', 'phone'], ['💻', 'computer'],
      ['🎧', 'headphones'], ['🔑', 'keys'], ['💡', 'light'], ['🕐', 'time clock'], ['📅', 'calendar day'], ['⏰', 'alarm wake up'],
    ],
  },
  {
    id: 'play',
    label: 'Play',
    items: [
      ['⚽', 'soccer football'], ['🏀', 'basketball'], ['🎾', 'tennis'], ['🏊', 'swim swimming'], ['🚴', 'bike ride'],
      ['🛝', 'playground slide'], ['🎨', 'art paint'], ['🎵', 'music song'], ['🎤', 'sing karaoke'], ['🎸', 'guitar'],
      ['🥁', 'drum'], ['🎮', 'video games'], ['🧩', 'puzzle'], ['🎲', 'board game'], ['📚', 'books read'], ['✏️', 'write draw'],
      ['📺', 'tv'], ['🎬', 'movie'], ['💃', 'dance'], ['🎂', 'birthday'], ['🎁', 'present gift'], ['🎉', 'celebrate party'],
      ['🎈', 'balloon'], ['🪁', 'kite'],
    ],
  },
  {
    id: 'nature',
    label: 'Nature',
    items: [
      ['🐶', 'dog'], ['🐱', 'cat'], ['🐰', 'rabbit bunny'], ['🐻', 'bear'], ['🐼', 'panda'], ['🦁', 'lion'], ['🐸', 'frog'],
      ['🐵', 'monkey'], ['🐔', 'chicken hen'], ['🐦', 'bird'], ['🐟', 'fish'], ['🐢', 'turtle'], ['🦋', 'butterfly'],
      ['🐝', 'bee'], ['🦄', 'unicorn'], ['🦖', 'dinosaur'], ['🌳', 'tree'], ['🌸', 'flower blossom'], ['🌻', 'sunflower'],
      ['🍀', 'clover lucky'], ['🌈', 'rainbow'], ['☀️', 'sun sunny'], ['🌙', 'moon night'], ['⭐', 'star'], ['☁️', 'cloud'],
      ['🌧️', 'rain'], ['❄️', 'snow cold'], ['🔥', 'fire hot'],
    ],
  },
  {
    id: 'places',
    label: 'Places',
    items: [
      ['🏠', 'home house'], ['🏫', 'school'], ['🏥', 'hospital'], ['🏪', 'store shop'], ['🛒', 'shopping groceries'],
      ['🏞️', 'park'], ['🏖️', 'beach'], ['⛪', 'church'], ['🕌', 'mosque'], ['🕍', 'synagogue'], ['🛕', 'temple'],
      ['🏟️', 'stadium game'], ['🎡', 'fair'], ['🚗', 'car'], ['🚌', 'bus'], ['🚕', 'taxi'], ['🚑', 'ambulance'],
      ['🚲', 'bicycle'], ['🚆', 'train'], ['✈️', 'airplane trip'], ['⛵', 'boat'], ['🗺️', 'map'],
    ],
  },
  {
    id: 'symbols',
    label: 'Symbols',
    items: [
      ['❤️', 'love heart'], ['💛', 'yellow heart'], ['💚', 'green heart'], ['💙', 'blue heart'], ['✅', 'yes done'],
      ['❌', 'no wrong'], ['❓', 'question what'], ['❗', 'important'], ['➕', 'more add'], ['🔁', 'again repeat'],
      ['🔊', 'loud'], ['🔇', 'quiet'], ['⏸️', 'pause break'], ['🛑', 'stop'], ['👌', 'okay fine'], ['💯', 'perfect'],
    ],
  },
];

/** Keeps the first emoji (including combined ones like 🧑‍⚕️ or flags) from typed text, or null. */
export function firstEmoji(text: string): string | null {
  const segments =
    typeof Intl !== 'undefined' && 'Segmenter' in Intl
      ? Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text), (s) => s.segment)
      : Array.from(text);
  return segments.find((s) => isEmoji(s)) ?? null;
}

/** True for a single emoji, including skin tones, ZWJ sequences and flags. */
export function isEmoji(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value.length <= 16 &&
    /^(?:\p{Extended_Pictographic}|\p{Regional_Indicator})/u.test(value) &&
    !/[\p{L}\p{N}\s]/u.test(value.replace(/\p{Emoji_Modifier}|\p{Emoji_Component}/gu, ''))
  );
}
