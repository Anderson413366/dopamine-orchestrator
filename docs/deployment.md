# Deployment Guide

## Recommended Hosting

Use Vercel static hosting for the current version.

The app is a static frontend-only experience. It does not need a persistent server, database, auth provider, or file storage to run today.

## Local Setup

Prerequisites:

- Node.js 20 or newer
- npm

Commands:

```bash
npm install
npm run verify
npm run dev
```

Local URL:

```txt
http://localhost:4173
```

## GitHub Setup

Recommended repository name:

```txt
dopamine-orchestrator
```

Commit:

- `index.html`
- `assets/`
- `scripts/`
- `docs/`
- `package.json`
- `package-lock.json`
- `.gitignore`
- `.env.example`
- `.nvmrc`
- `vercel.json`
- `README.md`
- `SECURITY.md`

Never commit:

- `.env`
- `.env.local`
- `.env.production`
- `.vercel`
- `node_modules`
- `dist`
- `build`
- logs
- real service keys

Recommended branch strategy:

- `main` for deployable source
- short-lived feature branches for changes
- pull requests before production deploys once collaborators are involved

## Vercel Setup

Import the GitHub repository into Vercel.

Use these settings:

| Setting | Value |
| --- | --- |
| Framework preset | Other |
| Root directory | repository root |
| Install command | `npm install` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Development command | `npm run dev` |
| Node.js version | 20.x |

Active environment variables:

- None required.

Future-ready environment variables:

- Do not add Supabase keys until backend features are being implemented.
- If Supabase is activated later, follow [backend-readiness.md](backend-readiness.md) and [environment-variables.md](environment-variables.md).

## Post-Deploy Verification

After Vercel deploys:

1. Open the production URL.
2. Confirm the title and machine card render.
3. Click `Engage Alignment` and confirm all three reels change.
4. Confirm the score changes.
5. Click `Toggle Sensory` until `CHAOS` appears.
6. Click `Auto-Stim Off`, confirm it changes to `Auto-Stim On`, then turn it off again.
7. Test on a mobile viewport.
8. Confirm browser console has no errors.
9. Confirm response headers include CSP, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`.
10. Confirm no `.env` values or private keys are visible in page source.

## Alternative Hosts Considered

Netlify and Cloudflare Pages would also work because the app is static. Vercel is the recommended default because it aligns with the requested deployment ecosystem, supports this static app cleanly, and leaves a direct path to serverless functions or a full framework migration later.
