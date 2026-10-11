import { useEffect, useState } from 'react';
import { loadJSON, saveJSON } from './storage';

export interface Settings {
  /** Speak each tile as soon as it is tapped, instead of building a message first. */
  speakOnTap: boolean;
  /** Outline tiles and core buttons for users who need clearer edges. */
  highVisibility: boolean;
  voiceURI: string | null;
  rate: number;
  /** The user's name, used in emergency alert messages. */
  yourName: string;
}

export const DEFAULT_SETTINGS: Settings = {
  speakOnTap: false,
  highVisibility: false,
  voiceURI: null,
  rate: 1,
  yourName: '',
};

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
