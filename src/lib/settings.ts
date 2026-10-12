import { useEffect, useState } from 'react';
import { DEFAULT_LANGUAGE, LANGUAGES, type LanguageId } from '../data/strings';
import { loadJSON, saveJSON } from './storage';

export type TextSize = 'medium' | 'large' | 'x-large';
export const TEXT_SIZES: TextSize[] = ['medium', 'large', 'x-large'];

export interface Settings {
  /** Speak each tile as soon as it is tapped, instead of building a message first. */
  speakOnTap: boolean;
  /** Outline tiles and core buttons for users who need clearer edges. */
  highVisibility: boolean;
  voiceURI: string | null;
  rate: number;
  /** The user's name, used in emergency alert messages. */
  yourName: string;
  /** Small celebratory animations. The OS Reduce Motion setting always overrides this. */
  playful: boolean;
  /** UI language and the language the voice reads in. */
  language: LanguageId;
  /** Scales tile and message bar text. */
  textSize: TextSize;
}

export const DEFAULT_SETTINGS: Settings = {
  speakOnTap: false,
  highVisibility: false,
  voiceURI: null,
  rate: 1,
  yourName: '',
  playful: true,
  language: DEFAULT_LANGUAGE,
  textSize: 'medium',
};

const languageIds = LANGUAGES.map((l) => l.id);
const textSizes = TEXT_SIZES as readonly string[];

/**
 * Keeps every valid saved value and fills anything missing or invalid with
 * its default. Adding a new setting later never resets the others.
 */
export function normalizeSettings(raw: unknown): Settings {
  const v = typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>) : {};
  return {
    speakOnTap: typeof v.speakOnTap === 'boolean' ? v.speakOnTap : DEFAULT_SETTINGS.speakOnTap,
    highVisibility: typeof v.highVisibility === 'boolean' ? v.highVisibility : DEFAULT_SETTINGS.highVisibility,
    voiceURI: typeof v.voiceURI === 'string' ? v.voiceURI : DEFAULT_SETTINGS.voiceURI,
    rate: typeof v.rate === 'number' && v.rate >= 0.5 && v.rate <= 2 ? v.rate : DEFAULT_SETTINGS.rate,
    yourName: typeof v.yourName === 'string' ? v.yourName.slice(0, 60) : DEFAULT_SETTINGS.yourName,
    playful: typeof v.playful === 'boolean' ? v.playful : DEFAULT_SETTINGS.playful,
    language: typeof v.language === 'string' && languageIds.includes(v.language as LanguageId) ? (v.language as LanguageId) : DEFAULT_SETTINGS.language,
    textSize: typeof v.textSize === 'string' && textSizes.includes(v.textSize) ? (v.textSize as TextSize) : DEFAULT_SETTINGS.textSize,
  };
}

const anyValue = (_: unknown): _ is unknown => true;

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() =>
    normalizeSettings(loadJSON<unknown>('settings', null, anyValue)),
  );

  useEffect(() => {
    saveJSON('settings', settings);
  }, [settings]);

  const update = (patch: Partial<Settings>) => setSettings((prev) => ({ ...prev, ...patch }));

  return { settings, update };
}
