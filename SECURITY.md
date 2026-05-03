# Security Policy

## Current Security Posture

Dopamine Orchestrator is currently a static frontend-only app.

Current active secrets:

- None.

Current active backend:

- None.

Current active database:

- None.

## Supported Version

Only the current `main` branch should be treated as supported after the first GitHub setup.

## Reporting Issues

Report security issues privately to the repository owner. Do not open public issues containing secrets, exploit details, private URLs, tokens, or production credentials.

## Implementation Rules

- Do not commit `.env` files.
- Do not put service role keys or API secrets in browser code.
- Do not add `unsafe-inline` or `unsafe-eval` to CSP unless there is a reviewed reason.
- Do not add third-party runtime scripts unless they are necessary and documented.
- Use server-side code for future private API calls.
- Enable Supabase RLS before exposing tables through Supabase.
- Treat future browser storage as user-controlled and not trusted.

## Future Supabase Rules

If Supabase is activated later:

- Keep `SUPABASE_SERVICE_ROLE_KEY` server-only.
- Use public publishable keys only in browser code.
- Enable RLS on exposed tables.
- Use migrations for schema changes.
- Use `app_metadata` for roles and authorization decisions.
- Review storage policies before allowing uploads.
