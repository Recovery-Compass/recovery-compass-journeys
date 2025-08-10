// scripts/verify-rls.ts
import { createClient } from '@supabase/supabase-js';

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
if (!url || !anon) { console.error('Missing env'); process.exit(1); }

const supa = createClient(url, anon);

async function mustFail(selectRes: any, table: string) {
  if (selectRes.data?.length) throw new Error(`❌ Anon can read ${table}`);
  if (!selectRes.error) throw new Error(`❌ Anon select on ${table} returned empty success (should error)`);
}

(async () => {
  for (const t of ['actualization_profiles','assessments','email_captures']) {
    const res = await supa.from(t).select('*').limit(1);
    await mustFail(res, t);
  }
  console.log('✅ Anon blocked on sensitive tables');
})().catch(e => { console.error(e); process.exit(1); });
