// Receives one opted-in device's anonymous counts for a finished week.
// It accepts only the exact fields the app sends (see src/lib/insights.ts) and
// stores them without an IP address, user agent or any identifier. Nothing in the
// request body is logged.
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';
import { corsHeaders, originAllowed } from '../_shared/cors.ts';

const COUNTERS = {
  sessions: 'sessions',
  tilesTapped: 'tiles_tapped',
  messagesSpoken: 'messages_spoken',
  typedMessages: 'typed_messages',
  phrasesSaved: 'phrases_saved',
  helpOpened: 'help_opened',
  helpPhrasesSpoken: 'help_phrases_spoken',
  alertsStarted: 'alerts_started',
  customTilesAdded: 'custom_tiles_added',
} as const;
const TOP = ['v', 'week', 'appVersion', 'language', 'textSize', 'screen', 'installed', 'weeksSinceFirstUse', 'ref', 'customTiles', 'hasContacts', 'playful', 'speakOnTap', 'highVisibility', 'counts'];

const isBool = (v: unknown): v is boolean => typeof v === 'boolean';
const isCount = (v: unknown): v is number => Number.isInteger(v) && (v as number) >= 0 && (v as number) <= 100000;
const sameKeys = (o: Record<string, unknown>, keys: string[]) => {
  const k = Object.keys(o);
  return k.length === keys.length && keys.every((x) => k.includes(x));
};

/** Returns the row to insert, or null if anything is off. */
function toRow(body: unknown): Record<string, unknown> | null {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return null;
  const r = body as Record<string, unknown>;
  if (!sameKeys(r, TOP) || r.v !== 1) return null;
  const c = r.counts as Record<string, unknown>;
  if (typeof c !== 'object' || c === null || !sameKeys(c, Object.keys(COUNTERS))) return null;
  if (!Object.keys(COUNTERS).every((k) => isCount(c[k]))) return null;

  // The week must be a Monday in the last ten weeks, not in the future.
  if (typeof r.week !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(r.week)) return null;
  const week = new Date(`${r.week}T00:00:00Z`);
  const age = (Date.now() - week.getTime()) / 86_400_000;
  if (Number.isNaN(age) || week.getUTCDay() !== 1 || age < -2 || age > 70) return null;

  if (typeof r.appVersion !== 'string' || !/^[0-9a-z.-]{1,16}$/.test(r.appVersion)) return null;
  if (typeof r.language !== 'string' || !/^[a-z]{2}-[A-Z]{2}$/.test(r.language)) return null;
  if (!['medium', 'large', 'x-large'].includes(r.textSize as string)) return null;
  if (!['phone', 'tablet', 'desktop'].includes(r.screen as string)) return null;
  if (!['0', '1-5', '6-20', '21+'].includes(r.customTiles as string)) return null;
  if (!(Number.isInteger(r.weeksSinceFirstUse) && (r.weeksSinceFirstUse as number) >= 0 && (r.weeksSinceFirstUse as number) <= 520)) return null;
  if (!(r.ref === null || (typeof r.ref === 'string' && /^[a-z0-9-]{1,32}$/.test(r.ref)))) return null;
  if (![r.installed, r.hasContacts, r.playful, r.speakOnTap, r.highVisibility].every(isBool)) return null;

  const row: Record<string, unknown> = {
    week: r.week,
    app_version: r.appVersion,
    language: r.language,
    text_size: r.textSize,
    screen: r.screen,
    installed: r.installed,
    weeks_since_first_use: r.weeksSinceFirstUse,
    ref: r.ref,
    custom_tiles: r.customTiles,
    has_contacts: r.hasContacts,
    playful: r.playful,
    speak_on_tap: r.speakOnTap,
    high_visibility: r.highVisibility,
  };
  for (const [k, col] of Object.entries(COUNTERS)) row[col] = c[k];
  return row;
}

Deno.serve(async (req) => {
  const cors = corsHeaders(req);
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (req.method !== 'POST') return new Response(null, { status: 405, headers: cors });
  if (!originAllowed(req)) return new Response(null, { status: 403, headers: cors });

  const text = await req.text();
  if (text.length > 2048) return new Response(null, { status: 413, headers: cors });
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return new Response(null, { status: 400, headers: cors });
  }
  const row = toRow(body);
  if (!row) return new Response(null, { status: 422, headers: cors });

  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
  const { error } = await db.from('insights_reports').insert(row);
  if (error) {
    console.error('insert failed', error.code);
    return new Response(null, { status: 500, headers: cors });
  }
  // PRIVACY.md promises reports are kept at most 24 months: prune as we go.
  const cutoff = new Date();
  cutoff.setUTCMonth(cutoff.getUTCMonth() - 24);
  await db.from('insights_reports').delete().lt('week', cutoff.toISOString().slice(0, 10));
  return new Response(null, { status: 204, headers: cors });
});
