# Dopamine Orchestrator

A dependency-free static sensory alignment game. The app lets a user spin three visual reels, switch sensory intensity, enable auto-stim mode, and build an alignment score through sound, motion, and particle feedback.

## Current Runtime

- Frontend: static HTML, CSS, and browser JavaScript
- Backend: none active
- Database: none active
- Authentication: none active
- Storage: none active
- Package manager: npm, used only for repeatable local scripts
- Recommended hosting: Vercel static hosting
- Supabase status: Prepared for Future Use, not active

## Local Setup

Prerequisites:

- Node.js 20 or newer
- npm

Install and verify:

```bash
npm install
npm run verify
```

Run locally:

```bash
npm run dev
```

Then open:

```txt
http://localhost:4173
```

The current app does not require environment variables. See [.env.example](.env.example) and [docs/environment-variables.md](docs/environment-variables.md) for future backend conventions.

## Project Structure

```txt
index.html                    Static app entrypoint
assets/styles.css             First-party production CSS
assets/app.js                 First-party browser JavaScript
scripts/serve-static.mjs      Dependency-free local static server
scripts/build-static.mjs      Creates the Vercel deployable dist output
scripts/validate-static.mjs   Dependency-free production readiness validation
docs/                         Deployment, backend, env, and production handoff docs
vercel.json                   Static hosting headers and security policy
.github/workflows/ci.yml      GitHub verification workflow
```

## Verification

```bash
npm run lint
npm test
npm run build
npm run verify
```

These scripts currently run the static validator. There is no transpilation step and no active dependency bundle.

## Deployment

Recommended path:

1. Create a GitHub repository.
2. Commit the source files, docs, `package.json`, and `package-lock.json`.
3. Import the GitHub repo into Vercel.
4. Use the static project settings in [docs/deployment.md](docs/deployment.md).
5. Deploy and run the post-deploy checklist in [docs/production-checklist.md](docs/production-checklist.md).

Do not deploy from local `.env` files, `.vercel`, build output folders, or `node_modules`.

## Backend and Supabase

Supabase is not active in this version because the app does not save user accounts, private data, or remote records. It is prepared for future use through documented environment variable conventions, server/client boundary guidance, and activation criteria.

Read [docs/backend-readiness.md](docs/backend-readiness.md) before adding persistence, auth, storage, admin tools, portals, or AI features.

## Security Notes

- No secrets are required for the current static app.
- JavaScript and CSS are first-party files, not CDN runtime scripts.
- Vercel headers include CSP, content-type protection, referrer policy, and restricted browser permissions.
- Future private keys must stay server-side only.

See [SECURITY.md](SECURITY.md) for reporting and future implementation rules.

## Production Readiness Report

The detailed cleanup ledger, deployment recommendation, backend/Supabase status, and verification report are in [docs/production-readiness-report.md](docs/production-readiness-report.md).
