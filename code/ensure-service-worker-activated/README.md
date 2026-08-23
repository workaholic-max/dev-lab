# Ensure service worker activated

Waits for a newly-activated service worker to actually take control before resolving, instead of letting the rest of app boot proceed on a stale build. A backend deploy takes effect the moment it ships; a frontend behind a service worker doesn't until a new worker actually activates — without this, a page can keep running against an API contract the loaded frontend was never built against.

## How it works

```ts
await ensureServiceWorkerActivated();
await loadAppState();
```

If there's no existing service-worker controller — a fresh install, or a project not using a service worker at all — it resolves immediately: there's nothing to wait for. That covers a project with no service-worker support too, not just no controller: `serviceWorker?.controller` reads safely even when `navigator.serviceWorker` itself is `undefined`, so an environment without service-worker support falls into this same immediate-resolve branch instead of throwing. Otherwise it confirms there's an actual registration, arms a 7-second timeout, and checks for an update: either the check settles cleanly with nothing installing or waiting, a `controllerchange` event fires because a new worker already took over mid-check (in which case the page reloads outright — the only way to guarantee every asset and chunk comes from the new version instead of mixing old and new), or the timeout itself fires as a last resort if the update check hangs. That timeout only covers the update-and-wait step, though, not the `getRegistration()` call that precedes it — a hang in `getRegistration()` itself isn't bounded by anything, so boot can still stall indefinitely in that one narrow case.

## Why this isn't a `.service.ts`

Every other piece of setup a consuming app's `application-init` auto-discovers is a `.service.ts` file exporting an `init()` — its services step calls every one of those unconditionally, in a plain loop, with nothing awaited. That's the wrong shape for this: the entire reason it exists is to be awaited, once, before the rest of boot proceeds — `await ensureServiceWorkerActivated(); await loadAppState();` only holds its guarantee because whatever calls it can actually wait on the promise it returns. Naming it `service-worker.service.ts` and giving it an `init()` so it could join that same auto-discovered set would mean it gets called the exact same way every other service does — fired and forgotten, its return value never awaited — which would silently drop the one thing this entry is actually for. It stays a plain exported function, called by hand at the one call site that needs to block on it, for exactly that reason.

## How this relates to other entries

- [`progressive-web-app`](../progressive-web-app) — this is the counterpart to that entry's `registerType: 'autoUpdate'` plus `skipWaiting` / `clientsClaim` combination: because that configuration lets a new service worker take over an already-open tab mid-session with no prompt, this is what notices it happened and forces a reload instead of leaving the page running against a stale build.
- [`application-init`](../application-init) — deliberately not part of its auto-discovered `*.service.ts` set, for the reason above; this stays a plain function awaited by hand at the call site that needs to block on it, not something fired-and-forgotten alongside every other service at boot.
