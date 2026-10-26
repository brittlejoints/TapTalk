/**
 * "Help improve Tap Talk": optional, anonymous usage counts. Off by default.
 *
 * What can leave the device, once a week and only when the person has switched
 * sharing on (and the app was built with VITE_INSIGHTS_URL): counts such as how
 * many messages were spoken, plus coarse facts like language, text size and
 * phone/tablet. Never words, phrases, names, contacts, photos, location, the
 * time of day, or anything that identifies a person or device. PRIVACY.md lists
 * every field; keep the two in step.
 *
 * Two markers are kept on the device regardless, because they never leave it
 * unless sharing is on: the week of first use (so a report can say "using Tap
 * Talk for 3 weeks" without an ID) and the `ref` marketing tag from the link
 * that first opened the app.
 */
import { loadJSON, saveJSON } from './storage';

/** Where reports go. Empty means the feature is not set up: no switch, no requests. */
export const INSIGHTS_URL: string = (import.meta.env.VITE_INSIGHTS_URL ?? '').trim();
export const insightsAvailable = (): boolean => INSIGHTS_URL.startsWith('https://');

export const COUNTERS = [
  'sessions',
  'tilesTapped',
  'messagesSpoken',
  'typedMessages',
  'phrasesSaved',
  'helpOpened',
  'helpPhrasesSpoken',
  'alertsStarted',
  'customTilesAdded',
] as const;
export type Counter = (typeof COUNTERS)[number];
export type Counts = Record<Counter, number>;

export interface InsightsState {
  optIn: boolean;
  /** Monday (YYYY-MM-DD) of the week Tap Talk was first opened on this device. */
  firstWeek: string;
  /** Marketing tag from the first link that opened the app (?ref=...), if any. */
  ref: string | null;
  /** Monday of the week being counted. */
  week: string;
  counts: Counts;
  /** A finished week waiting to be sent (its counts and Monday). */
  pending: { week: string; counts: Counts } | null;
}

/** Facts read at send time from settings and the device. All coarse, none identifying. */
export interface Snapshot {
  language: string;
  textSize: string;
  customTiles: number;
  hasContacts: boolean;
  playful: boolean;
  speakOnTap: boolean;
  highVisibility: boolean;
}

export interface Report {
  v: 1;
  week: string;
  appVersion: string;
  language: string;
  textSize: string;
  screen: 'phone' | 'tablet' | 'desktop';
  installed: boolean;
  weeksSinceFirstUse: number;
  ref: string | null;
  customTiles: '0' | '1-5' | '6-20' | '21+';
  hasContacts: boolean;
  playful: boolean;
  speakOnTap: boolean;
  highVisibility: boolean;
  counts: Counts;
}

const KEY = 'insights';
const MAX_COUNT = 100_000;
/** A finished week older than this is dropped instead of sent. */
const MAX_PENDING_WEEKS = 8;
export const APP_VERSION = '1';

const emptyCounts = (): Counts => Object.fromEntries(COUNTERS.map((c) => [c, 0])) as Counts;

/** Monday of the week containing `d`, as YYYY-MM-DD in local time. */
export function weekOf(d: Date): string {
  const m = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  m.setDate(m.getDate() - ((m.getDay() + 6) % 7));
  const p = (n: number) => String(n).padStart(2, '0');
  return `${m.getFullYear()}-${p(m.getMonth() + 1)}-${p(m.getDate())}`;
}

export function weeksBetween(fromWeek: string, toWeek: string): number {
  const a = Date.parse(`${fromWeek}T00:00:00Z`);
  const b = Date.parse(`${toWeek}T00:00:00Z`);
  return Number.isFinite(a) && Number.isFinite(b) ? Math.round((b - a) / (7 * 86_400_000)) : 0;
}

/** A marketing tag is only letters, numbers and dashes, at most 32 of them; anything else is dropped. */
export function cleanRef(raw: string | null): string | null {
  if (!raw) return null;
  const v = raw.trim().toLowerCase();
  return /^[a-z0-9-]{1,32}$/.test(v) ? v : null;
}

export function tileBucket(n: number): Report['customTiles'] {
  return n <= 0 ? '0' : n <= 5 ? '1-5' : n <= 20 ? '6-20' : '21+';
}

const isWeek = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
function isCounts(v: unknown): v is Counts {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return COUNTERS.every((c) => typeof o[c] === 'number' && Number.isFinite(o[c]) && (o[c] as number) >= 0);
}
function isState(v: unknown): v is InsightsState {
  if (typeof v !== 'object' || v === null) return false;
  const s = v as Record<string, unknown>;
  const p = s.pending as Record<string, unknown> | null;
  return (
    typeof s.optIn === 'boolean' &&
    isWeek(s.firstWeek) &&
    (s.ref === null || typeof s.ref === 'string') &&
    isWeek(s.week) &&
    isCounts(s.counts) &&
    (p === null || (typeof p === 'object' && isWeek(p.week) && isCounts(p.counts)))
  );
}

export function freshState(now: Date, ref: string | null): InsightsState {
  const week = weekOf(now);
  return { optIn: false, firstWeek: week, ref, week, counts: emptyCounts(), pending: null };
}

export function loadInsights(now = new Date()): InsightsState {
  return loadJSON<InsightsState | null>(KEY, null, (v): v is InsightsState | null => isState(v)) ?? freshState(now, null);
}

function save(state: InsightsState): void {
  saveJSON(KEY, state);
}

const hasAny = (c: Counts) => COUNTERS.some((k) => c[k] > 0);

/** Moves a finished week into `pending` (replacing an older unsent one) and starts the new week. Pure. */
export function rollWeek(state: InsightsState, now: Date): InsightsState {
  const week = weekOf(now);
  if (state.week === week) return state;
  const pending = hasAny(state.counts) ? { week: state.week, counts: state.counts } : state.pending;
  const stale = pending && weeksBetween(pending.week, week) > MAX_PENDING_WEEKS;
  return { ...state, week, counts: emptyCounts(), pending: stale ? null : pending };
}

/**
 * First launch: remembers the week and the link's ?ref= tag (on this device only).
 * Every launch: rolls the week over. Call once at start-up.
 */
export function startInsights(search: string, now = new Date()): InsightsState {
  const existing = loadJSON<InsightsState | null>(KEY, null, (v): v is InsightsState | null => isState(v));
  const ref = cleanRef(new URLSearchParams(search).get('ref'));
  const state = rollWeek(existing ?? freshState(now, ref), now);
  save(state);
  return state;
}

/** Counts one event, only while sharing is on. Nothing is stored for people who have not opted in. */
export function record(counter: Counter, now = new Date()): void {
  if (!insightsAvailable()) return;
  const state = rollWeek(loadInsights(now), now);
  if (!state.optIn) return;
  state.counts = { ...state.counts, [counter]: Math.min(MAX_COUNT, state.counts[counter] + 1) };
  save(state);
}

/** Turning sharing off clears every count and anything waiting to be sent. */
export function setOptIn(on: boolean, now = new Date()): InsightsState {
  const state = rollWeek(loadInsights(now), now);
  const next: InsightsState = on ? { ...state, optIn: true } : { ...state, optIn: false, counts: emptyCounts(), pending: null };
  save(next);
  return next;
}

export function screenClass(width: number, height: number): Report['screen'] {
  const short = Math.min(width, height);
  return short < 600 ? 'phone' : short < 1100 ? 'tablet' : 'desktop';
}

export function isInstalled(): boolean {
  try {
    return window.matchMedia('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true;
  } catch {
    return false;
  }
}

export function buildReport(
  week: string,
  counts: Counts,
  state: Pick<InsightsState, 'firstWeek' | 'ref'>,
  snap: Snapshot,
  device: { screen: Report['screen']; installed: boolean },
): Report {
  return {
    v: 1,
    week,
    appVersion: APP_VERSION,
    language: snap.language,
    textSize: snap.textSize,
    screen: device.screen,
    installed: device.installed,
    weeksSinceFirstUse: Math.max(0, Math.min(520, weeksBetween(state.firstWeek, week))),
    ref: state.ref,
    customTiles: tileBucket(snap.customTiles),
    hasContacts: snap.hasContacts,
    playful: snap.playful,
    speakOnTap: snap.speakOnTap,
    highVisibility: snap.highVisibility,
    counts: { ...counts },
  };
}

const currentDevice = () => ({ screen: screenClass(window.innerWidth, window.innerHeight), installed: isInstalled() });

/** What this week's report would look like if it were sent now: shown in Settings so people can see it. */
export function previewReport(snap: Snapshot, now = new Date()): Report {
  const state = rollWeek(loadInsights(now), now);
  return buildReport(state.week, state.counts, state, snap, currentDevice());
}

let sending = false;

/**
 * Sends the finished week, if there is one, sharing is on and the device is online.
 * Failures are quiet and retried at the next start or when the connection returns;
 * the person is never interrupted.
 */
export async function flushInsights(snap: Snapshot, now = new Date()): Promise<void> {
  if (!insightsAvailable() || sending) return;
  const state = rollWeek(loadInsights(now), now);
  if (!state.optIn || !state.pending || (typeof navigator !== 'undefined' && navigator.onLine === false)) return;
  const report = buildReport(state.pending.week, state.pending.counts, state, snap, currentDevice());
  sending = true;
  try {
    const res = await fetch(INSIGHTS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      keepalive: true,
    });
    if (res.ok) {
      const latest = loadInsights(now);
      if (latest.pending?.week === report.week) save({ ...latest, pending: null });
    }
  } catch {
    // Offline or blocked: try again later.
  } finally {
    sending = false;
  }
}
