/** Only the published app (and the portal beside it) may call these functions from a browser. */
export function corsHeaders(req: Request): Record<string, string> {
  const allowed = (Deno.env.get('ALLOWED_ORIGIN') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  const origin = req.headers.get('Origin') ?? '';
  return {
    'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : allowed[0] ?? 'null',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

export function originAllowed(req: Request): boolean {
  const allowed = (Deno.env.get('ALLOWED_ORIGIN') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  return allowed.includes(req.headers.get('Origin') ?? '');
}
