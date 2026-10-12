import { createContext, createElement, useContext, useMemo, type ReactNode } from 'react';
import { DEFAULT_LANGUAGE, LANGUAGES, STRINGS, type LanguageId } from '../data/strings';

/**
 * Translation lookup, keyed on the settings' language. Everything that renders
 * user-facing text goes through `t()` so the whole UI changes when the user
 * switches language. User content (custom tile labels, saved phrases) stays
 * untouched: those are their words, in whatever language they wrote them.
 */

type Strings = (typeof STRINGS)[LanguageId];

interface I18n {
  lang: LanguageId;
  dir: 'ltr' | 'rtl';
  /** t('categories.needs'), t('needs.water'), etc. Falls back to English, then to the key. */
  t: <K extends keyof Strings, SK extends keyof Strings[K]>(section: K, key: SK) => string;
  /** For saved-phrase defaults. */
  defaultSavedPhrases: string[];
}

const I18nContext = createContext<I18n | null>(null);

export function I18nProvider({ lang, children }: { lang: LanguageId; children: ReactNode }) {
  const value = useMemo<I18n>(() => {
    const dir = LANGUAGES.find((l) => l.id === lang)?.dir ?? 'ltr';
    const table = STRINGS[lang] ?? STRINGS[DEFAULT_LANGUAGE];
    const fallback = STRINGS[DEFAULT_LANGUAGE];
    return {
      lang,
      dir,
      t: (section, key) => {
        const sectionTable = table[section] as Record<string, string> | string[];
        if (Array.isArray(sectionTable)) return String(sectionTable[key as unknown as number] ?? '');
        const value = sectionTable?.[key as string];
        if (typeof value === 'string') return value;
        const fallbackSection = fallback[section] as Record<string, string> | string[];
        if (Array.isArray(fallbackSection)) return String(fallbackSection[key as unknown as number] ?? String(key));
        return fallbackSection?.[key as string] ?? String(key);
      },
      defaultSavedPhrases: table.savedPhrases,
    };
  }, [lang]);
  return createElement(I18nContext.Provider, { value }, children);
}

export function useI18n(): I18n {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n must be used inside <I18nProvider>');
  return value;
}
