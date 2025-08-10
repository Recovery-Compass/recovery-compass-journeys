# 🚀 Automation Setup - RLS Guard & Access Logs

## Overview
This PR adds automated RLS (Row Level Security) protection and serverless audit logging to prevent security regressions.

## Setup Instructions

### 1. GitHub Secrets (Required for CI)
After merging this PR, add these secrets to GitHub:
- Go to: Settings → Secrets and variables → Actions
- Add:
  - `SUPABASE_URL`: Your Supabase project URL
  - `SUPABASE_ANON_KEY`: Your Supabase anon/public key

### 2. Deploy Edge Function (One-time)
```bash
# Deploy the access_logs function
supabase functions deploy access_logs --no-verify-jwt

# Set the function secrets (get these from Supabase dashboard)
supabase secrets set --env prod \
  SUPABASE_SERVICE_ROLE_KEY="your-service-role-key" \
  SUPABASE_URL="your-supabase-url"
```

### 3. Install Local Git Hooks (Optional but recommended)
```bash
# Install pre-push hook for local RLS verification
npm run install:hooks

# Test the RLS verification locally
npm run verify:rls
```

## What This Adds

### ✅ CI/CD Protection
- **RLS Guard workflow** blocks PRs if anonymous users can access sensitive tables
- Runs automatically on every PR to main branch
- No service keys in CI - uses anon key only for safety

### ✅ Serverless Audit Logging
- Edge Function at `/functions/v1/access_logs` for audit trails
- No client secrets required - service key stays server-side
- CORS restricted to your domains + localhost

### ✅ Local Development
- Pre-push hook runs RLS checks before you push
- Skips gracefully if env vars not set locally
- Helper function for easy audit logging from React

## Usage Examples

### Client-Side Audit Logging
```typescript
import { logAuditEvent } from '@/lib/audit-logger';

// Log an event (no auth required, no secrets needed)
await logAuditEvent({
  event: 'ASSESSMENT_COMPLETED',
  payload: { 
    score: 85, 
    archetype: 'Steady Builder' 
  }
});
```

### Verify RLS Locally
```bash
# Set your env vars (get from Supabase dashboard)
export NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGc..."

# Run verification
npm run verify:rls
```

## Security Notes

- ✅ Service role key never leaves server (Edge Function only)
- ✅ CI uses anon key only (can't modify data)
- ✅ CORS restricts Edge Function to your domains
- ✅ Audit logging fails gracefully (won't break app)

## Rollback Plan

If issues arise:
1. Disable workflow: Settings → Actions → Disable "RLS Guard"
2. Remove Edge Function: `supabase functions delete access_logs`
3. Uninstall hooks: `rm .git/hooks/pre-push`

---

**Status**: Ready for deployment after GitHub secrets are added
