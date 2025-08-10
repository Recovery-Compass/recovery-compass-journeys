## Summary
- What changed (1–2 lines)

## Reason
- (Required) 1-line reason for any new dependency or infra change

## Checks
- [ ] I ran `npm run verify:rls` (or `npx tsx scripts/verify-rls.ts`)
- [ ] Follows Solo-Dev guardrails (Amplify-only CI, no Workers, no new infra)
- [ ] No secrets in repo (.env stays out)
- [ ] Build output: `dist/` (Vite SPA)
