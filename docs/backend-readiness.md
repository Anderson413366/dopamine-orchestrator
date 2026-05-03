# Backend and Supabase Readiness

## Current Status

Backend Status: Prepared for Future Use

Supabase Status: Prepared for Future Use

The current app is a public static browser experience. It does not currently require accounts, private records, remote persistence, admin workflows, file uploads, payments, email, AI calls, or database writes.

## Current Need

No active backend is required today.

The current score and reel state are session-only browser state. Nothing needs to be saved across devices or shared with other users.

## Future Readiness

The project has been prepared with:

- A clear static source structure
- A Vercel-ready deployment config
- Environment variable conventions for future Supabase activation
- Documentation for server/client boundaries
- A production checklist that separates active features from future features
- No fake database clients
- No fake Supabase calls
- No unused backend folders

## When To Activate Supabase

Activate Supabase when the app needs any of the following:

- User accounts
- Saved scores or progress history
- User-specific preferences
- Admin dashboards
- Customer or employee portals
- Shared challenges or leaderboards
- Private notes or files
- Database-backed content
- Realtime collaborative state

## Expected Future Supabase Shape

If Supabase is activated later, start with a small schema:

| Future Table | Purpose |
| --- | --- |
| `profiles` | One row per authenticated user |
| `alignment_sessions` | Saved score/session summaries |
| `sensory_preferences` | User-specific mode and accessibility settings |

Storage is not needed until the app supports uploaded files or user media.

Realtime is not needed until shared sessions, collaborative gameplay, or live dashboards exist.

## Auth Recommendation

Current version:

- No auth.

Future version:

- Supabase Auth is a good fit if Supabase is also used for data.
- Clerk is a good alternative if team/org management and polished account UI become more important than direct database integration.

## Server/Client Boundary Rules

Future implementation must follow these rules:

- Browser code may use only public publishable Supabase values.
- `SUPABASE_SERVICE_ROLE_KEY` must stay server-only.
- Admin reads and writes must run in trusted server code only.
- Do not put private keys in `index.html`, `assets/app.js`, client bundles, or public config.
- Enable Row Level Security on every table exposed through Supabase.
- Use `app_metadata`, not user-editable metadata, for authorization roles.
- Create migrations before applying schema changes to shared environments.

## Suggested Activation Order

1. Decide the feature that requires persistence or auth.
2. Move from static-only to a framework or serverless architecture if server code is needed.
3. Add Supabase environment variables.
4. Create migrations for the minimum schema.
5. Enable RLS and write policies matching the real access model.
6. Add server-side admin helpers only if admin work is actually needed.
7. Add UI states for loading, empty, error, and signed-out cases.
8. Verify locally before creating production data.

## Recommendation

Supabase is not required for the current version, but the app has been prepared for future Supabase integration through environment variable conventions, clean documentation, deployment boundaries, and a clear activation path.

Do not add active Supabase clients until a real product feature needs saved data, auth, storage, admin controls, or remote workflows.
