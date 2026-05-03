# Environment Variables

## Current Version

No environment variables are required for the current static app.

## Active Public Variables

None.

## Active Private Server Variables

None.

## Future-Ready Public Variables

Use only when backend features are activated.

```env
PUBLIC_APP_URL=
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Notes:

- Public variables can be exposed to browser code.
- The current static app does not read these values.
- If the app later migrates to Next.js, use the correct `NEXT_PUBLIC_` naming for browser-safe values.

## Future-Ready Private Server Variables

Use only in trusted server-side code.

```env
SUPABASE_SERVICE_ROLE_KEY=
```

Rules:

- Never expose private variables to browser JavaScript.
- Never prefix private variables with `VITE_` or `NEXT_PUBLIC_`.
- Never commit real `.env` files.
- Add private variables to Vercel only after server-side code exists to use them safely.

## Vercel Today

No environment variables are required for the current Vercel deployment.
