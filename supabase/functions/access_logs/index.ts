// supabase/functions/access_logs/index.ts
// Endpoint: /functions/v1/access_logs  (public by default if deployed with --no-verify-jwt)
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { serve } from "jsr:@supabase/functions-js";
import { createClient } from "npm:@supabase/supabase-js";

serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  // Basic CORS allow-list
  const origin = req.headers.get('origin') ?? '';
  const ok = [
    'https://www.wfd-compliance.org',
    'https://wfd-compliance.org',
    'https://app.recovery-compass.org',
    'https://recovery-compass.org',
    'http://localhost:3000',
    'http://localhost:5173',
  ].some(d => origin.startsWith(d));
  if (!ok && origin !== '') return new Response('Forbidden', { status: 403 });

  const body = await req.json().catch(() => ({}));
  const supa = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // server-side only
  );

  const { data, error } = await supa.from('access_logs').insert({
    ts: new Date().toISOString(),
    event: body.event ?? 'client_log',
    payload: body.payload ?? {},
    source: body.source ?? 'web',
  }).select();

  if (error) return new Response(JSON.stringify({ ok:false, error }), { status: 400 });
  return new Response(JSON.stringify({ ok:true, data }), { 
    status: 200, 
    headers: { 
      "content-type": "application/json",
      "access-control-allow-origin": origin || "*"
    } 
  });
});
