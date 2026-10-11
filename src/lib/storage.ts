/**
 * Small, failure-safe wrappers around localStorage.
 * Storage can be unavailable (private mode, full quota), and an AAC app
 * must keep working when it is, so every call falls back instead of throwing.
 */

const PREFIX = 'tap-talk:';

export function loadJSON<T>(key: string, fallback: T, isValid: (value: unknown) => value is T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    const parsed: unknown = JSON.parse(raw);
    return isValid(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function saveJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Not fatal: the app keeps working for this session.
  }
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}
