// The owner's portal reads its numbers here. Every request must carry the
// DASHBOARD_PASSWORD secret as a bearer token; the answer holds only totals.
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';
import { corsHeaders } from '../_shared/cors.ts';

/** Compares without leaking how much of the password matched. */
function safeEqual(a: string, b: string): boolean {
  const ea = new TextEncoder().encode(a);
  const eb = new TextEncoder().encode(b);
  let diff = ea.length ^ eb.length;
  for (let i = 0; i < Math.max(ea.length, eb.length); i++) diff |= (ea[i] ?? 0) ^ (eb[i] ?? 0);
  return diff === 0;
}

const weeksAgo = (n: number) => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 7 * n);
  return d.toISOString().slice(0, 10);
};

Deno.serve(async (req) => {
  const cors = { ...corsHeaders(req), 'Cache-Control': 'no-store' };
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (req.method !== 'GET') return new Response(null, { status: 405, headers: cors });

  const secret = Deno.env.get('DASHBOARD_PASSWORD') ?? '';
  const given = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (secret.length < 12 || !safeEqual(given, secret)) {
    await new Promise((r) => setTimeout(r, 600)); // slow down guessing
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { ...cors, 'Content-Type': 'application/json' } });
  }

  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
  const since = weeksAgo(13);
  const [weekly, dims] = await Promise.all([
    db.from('insights_weekly').select('*').gte('week', since).order('week'),
    db.from('insights_dimensions').select('*').gte('week', since),
  ]);
  if (weekly.error || dims.error) return new Response(JSON.stringify({ error: 'query failed' }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } });

  return new Response(JSON.stringify({ generatedAt: new Date().toISOString(), weekly: weekly.data, dimensions: dims.data }), {
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
});
