# Ensure service worker activated

Waits for a newly-activated service worker to actually take control before resolving, instead of letting the rest of app boot proceed on a stale build. A backend deploy takes effect the moment it ships; a frontend behind a service worker doesn't until a new worker actually activates — without this, a page can keep running against an API contract the loaded frontend was never built against.

## How it works

```ts
await ensureServiceWorkerActivated();
await loadAppState();
```

If there's no existing service-worker controller — a fresh install, or a project not using a service worker at all — it resolves immediately: there's nothing to wait for. That covers a project with no service-worker support too, not just no controller: `serviceWorker?.controller` reads safely even when `navigator.serviceWorker` itself is `undefined`, so an environment without service-worker support falls into this same immediate-resolve branch instead of throwing. Otherwise it confirms there's an actual registration, arms a 7-second timeout, and checks for an update: either the check settles cleanly with nothing installing or waiting, a `controllerchange` event fires because a new worker already took over mid-check (in which case the page reloads outright — the only way to guarantee every asset and chunk comes from the new version instead of mixing old and new), or the timeout itself fires as a last resort if the update check hangs. That timeout only covers the update-and-wait step, though, not the `getRegistration()` call that precedes it — a hang in `getRegistration()` itself isn't bounded by anything, so boot can still stall indefinitely in that one narrow case.
