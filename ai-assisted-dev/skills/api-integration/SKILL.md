---
name: api-integration
description: Wire a new backend endpoint into the app following the project's existing api layer conventions (types, error handling, loading state). Use when asked to connect to a new API endpoint, fetch data from the backend, or add an API call.
---

# Integrate a new API endpoint

1. **Find the project's existing api layer pattern first** — how are other endpoints called (a dedicated `api.ts` per domain, a shared client, generated types)? Match it exactly rather than inventing a new fetch call inline in a component.
2. **Get the contract right before writing UI code.** Confirm the request/response shape (from an OpenAPI spec, existing similar endpoint, or by asking) and define/import the TypeScript types for it before wiring the component.
3. **Handle all three states explicitly**: loading, success, and error — don't ship a happy-path-only integration. Match the project's existing pattern for each (a shared loading composable, an error boundary, toast notifications, whatever's already there).
4. **Don't swallow errors silently.** A caught error that only does `console.error` and nothing user-visible is usually a bug, not a fix.
5. **Verify against the real backend or its mock/fixture** if one exists in the project — don't assume the contract without checking, backend responses drift from docs.
6. **Report**: the endpoint wired, where the types live, and confirmation that loading/error/success states were all exercised (screenshot or test evidence).
