# Last visited route

A small util that remembers which route a user was last on, persisted in `localStorage` across full page reloads, and hands that route back on the app's first navigation if it's still valid to land on — instead of a fresh app load always landing wherever `/` happens to redirect.

## How it works

Two halves, wired to opposite ends of navigation. `lastVisitedRoute.set` runs on every `afterEach`, writing `{ name, params }` for whatever route was just navigated to under one `localStorage` key via [`local-storage-service`](../local-storage-service) — except when the target route's `meta.ignoreLastVisited` is set, an explicit opt-out for a route that shouldn't become "where you left off" (a one-off action route, an error page).

`lastVisitedRoute.get` runs on `beforeEach` and does the opposite: it only ever has something to say on the very first navigation of a fresh app instance. A module-level `isFirstNavigation` flag, read and immediately flipped to `false` inside the function itself, is what makes every navigation after the first one a guaranteed no-op regardless of how many more times the function gets called. Even on that first call, it only acts if the app is actually landing at `/` — if the very first URL loaded was already a specific route, there's nothing to override, since the request was already explicit about where it wanted to go.

When both conditions hold, it reads whatever's stored and hands the caller a way to say no: `isRouteReachable` is a predicate supplied by the caller, not something this module decides on its own, since answering "is this route still valid" means checking things — does the route still exist, would the user's current permissions even allow it — that belong to whatever router and guard setup a specific app already has, not to a small module about persisting a route name to `localStorage`. A remembered route the predicate rejects gets removed from storage immediately, not just ignored for this one navigation — a route that's gone or newly forbidden isn't going to become valid again on its own, so there's no reason to keep re-checking and re-failing it on every future first load until something else happens to clear it. See [`router-init`](../router-init) for what `isRouteReachable` actually looks like once it's built — this entry only defines the shape of that predicate, not a real implementation of one.

## Recommendation

By convention, this belongs alongside [`router-init`](../router-init) and [`router-guards`](../router-guards) under a shared `router/` folder eventually — as a small util, under `router/utils/`.

## How this relates to other entries

- [`router-init`](../router-init) — `lastVisitedRoute.get` and `.set` are called from there, wired to `beforeEach` and `afterEach` respectively; that entry owns the wiring, this one owns the storing and restoring.
- [`router-guards`](../router-guards) — `router-init`'s `isRouteReachable` predicate is built from that entry's `resolveGuards`, and `router-meta.d.ts` there declares `meta.ignoreLastVisited` as a typed, optional `boolean` on `RouteMeta`; this entry reads it, but doesn't declare it.
