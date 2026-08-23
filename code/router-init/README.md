# Router init

Wires an already-defined router into the app in one function, in place of leaving `router.beforeEach`, `router.afterEach`, `router.onError`, and `app.use(router)` scattered across whatever file happens to bootstrap the app.

- **Guard chain wired to every navigation** — every `beforeEach` check runs through [`router-guards`](../router-guards)'s `resolveGuards`, so a route that fails a guard never gets past the check.
- **Last-visited route restored on first load** — a fresh page load can land back on whatever route the user was last on, when it's still reachable, instead of always the app's default, via [`last-visited-route`](../last-visited-route).
- **Stale chunk errors recovered automatically** — the page reloads on its own the moment a post-deploy chunk 404s, instead of leaving the user stuck on a route that can never finish loading.
- **Router registered with the app** — `app.use(router)` happens here too, so nothing calling `initRouter` needs to remember it separately.

## How it works

```ts
export const initRouter = (app: App) => {
    router.beforeEach(onBeforeEach);
    router.afterEach(onAfterEach);
    router.onError(onRouterError);

    app.use(router);
};
```

Each hook Vue Router calls lives in its own file under `fragments/`, following the [`code-style/fragments-convention`](../../code-style/fragments-convention) shape: `index.ts` is the only file that imports any of them, and stays a short, literal list of what `initRouter` wires up, in the order it wires it. Each fragment is named for the hook it backs — `before-each`, `after-each`, `on-error` — rather than for what it currently does: `beforeEach` today only guards and restores, but nothing says it always will, and a name like `navigation-guard.ts` would go stale the moment something unrelated to guarding (an analytics ping, a loading-bar toggle) gets added to that same hook later. `router` is left as an assumed import inside `fragments/before-each.ts` — however a given project creates its router instance (`createRouter(...)`) isn't this entry's concern, only what it does with it once it has it is. The logged-in user comes from `useAuthStore()`, imported from `@/stores/auth.store` — a concrete Pinia store path rather than a generic placeholder, since almost every consuming project already has an auth store shaped this way; the one thing this entry actually depends on is `authStore.user` being `User | null`, the same shape `router-guards`' own `Context` expects.

## About: guards

`before-each.ts`'s `if (to.name === from.name) return;` skips re-running the whole guard chain when a navigation only changes params or query on the route the user's already on (paginating a list, say) — guards are about *which route* is allowed, not about re-validating one they've already been let onto. The guard chain itself isn't defined here: `resolveGuards` is `router-guards`' resolver, specialized to this app's context; this fragment only decides when it runs, not what it checks. `resolveGuards({ to, user: authStore.user })` at the very end is the ordinary case — it runs, and its verdict is the navigation's verdict, whenever `last-visited-route` had nothing to say first.

## About: last-visited-route

`lastVisitedRoute.get` only ever has something to say on the very first navigation of a fresh app instance, and only when it's landing at `/` — every other navigation it returns `undefined` immediately, and `before-each.ts` falls straight through to the ordinary `resolveGuards({ to, user: authStore.user })` call, exactly as if `last-visited-route` weren't wired in at all. When it does have something to say, `isRouteReachable` is where that answer actually comes from: `router.hasRoute(route.name)` first, since a route removed from the app since it was last stored isn't reachable no matter what any guard says about it; then `router.resolve({ name: route.name, params: route.params })`, which turns the bare `{ name, params }` this entry only ever stored back into a real, fully-resolved route — `meta` included — because `resolveGuards` needs that `meta` to do anything at all (`permissionGuard` reads `meta.permissionKey` off exactly this resolved object, and a bare `{ name, params }` never has one). Passing `params` into that `resolve()` call matters here in a way it never has to for [`resolved-route-meta`](../resolved-route-meta): that entry only ever resolves nav-bar-style routes by `name` alone, ones with no dynamic segment to fill in, while a remembered route can be anything the user was last looking at — `/employees/123`, not just `/settings` — and resolving by `name` without its `params` would either fail or land on the wrong location for one that needs them. `resolveGuards({ to: resolvedRoute, user: authStore.user }) === null` is the actual verdict: `null` means every guard passed with nothing to say; anything else — a redirect object, or a guard's own earlier hard `true` no longer applying — means today's state (signed out since, no longer permitted) wouldn't actually let this navigation through, even though it did back when the route was first stored.

## About: chunk-load recovery

`on-error.ts` is narrower than it looks: it doesn't catch routing errors in general, only two known message substrings a browser's dynamic `import()` throws for the same underlying failure — a lazily-loaded route component's chunk 404ing: `'Failed to fetch dynamically imported module'` (Chromium's wording) and `'Importing a module script failed'` (Firefox's). That happens for real after almost every deploy, the moment a user who already has the app open in a stale tab navigates to a route whose JS chunk was built under the old, now-deleted file hash. Reloading the page is a blunt fix — whatever in-memory state the user had is gone, not just the failed navigation — but the alternative, leaving them on a route that can never finish loading until they refresh manually, is worse. Matching on these exact strings, rather than on anything broader, is deliberate too: it keeps an unrelated error (a genuine bug surfacing inside a guard, say) from being silently swallowed into a reload instead of showing up as an actual error.

## Files

`fragments/before-each.ts` holds the `beforeEach` handler — the guard-chain and last-visited-restore capabilities above live in the same file rather than two, because `last-visited-route`'s `isRouteReachable` predicate is built directly from `resolveGuards`; splitting them would mean passing that dependency across a file boundary for no real gain. `fragments/after-each.ts` holds the one-line `afterEach` handler that calls `lastVisitedRoute.set`. `fragments/on-error.ts` holds the `onError` handler and its narrow error-message match. All three take their name from the router hook they implement, not their current behavior, for the reason given in "How it works" above. Per [`code-style/fragments-convention`](../../code-style/fragments-convention), `index.ts` is the only file that imports any of the three.

## How this relates to other entries

- [`resolved-route-meta`](../resolved-route-meta) — resolves routes for a different reason: that entry caches repeated `name`-only lookups for nav-bar titles, while `before-each.ts`'s one-off `router.resolve({ name, params })` call is neither cached nor repeated, and needs `params` that entry never has to pass.
- [`application-init`](../application-init) — `initApp` imports `initRouter` from here as its router step; this is the concrete file that step's call points at.