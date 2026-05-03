# Production Checklist

## Source Control

- [ ] Create GitHub repository.
- [ ] Commit only source, docs, config, and lockfile.
- [ ] Confirm `.env`, `.vercel`, `node_modules`, `dist`, and `build` are not committed.
- [ ] Run `npm run verify` before the first commit.

## Local Verification

- [ ] `npm install`
- [ ] `npm run lint`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] `npm run dev`
- [ ] Manual browser smoke test passes.

## Vercel

- [ ] Import GitHub repo into Vercel.
- [ ] Use Node.js 20.x.
- [ ] Use `npm install` as install command.
- [ ] Use `npm run build` as build command.
- [ ] Leave output directory empty.
- [ ] Do not add Supabase keys until backend activation.
- [ ] Deploy preview.
- [ ] Verify headers and browser console.
- [ ] Promote only after preview works.

## Security

- [ ] No secrets in source.
- [ ] No real `.env` files committed.
- [ ] CSP header is active.
- [ ] Third-party runtime scripts are not used.
- [ ] Browser permissions are restricted.
- [ ] Future private keys remain server-only.

## UI/UX

- [ ] Main screen loads on desktop.
- [ ] Main screen loads on mobile.
- [ ] Buttons are keyboard focusable.
- [ ] Score updates after engagement.
- [ ] Sensory mode cycles correctly.
- [ ] Auto-stim can be turned on and off.
- [ ] Reduced-motion preference does not break the app.

## Future Backend Activation

- [ ] Confirm the product now needs saved data, auth, storage, admin, portal, or remote workflows.
- [ ] Choose backend architecture intentionally.
- [ ] Create Supabase project only when needed.
- [ ] Add migrations and RLS policies before production data.
- [ ] Keep service role key server-only.
