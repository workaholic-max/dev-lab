# Resolved route meta

A cached way to read any route's `meta` (f.e. its `title`) by route name.

## The problem

`useRoute()` gives the current route's `meta` — fine for a page's own `<h1>{{ route.meta.title }}</h1>`, useless for a nav bar rendering links to *other* routes and needing each of their titles. A route's `meta.title` is already defined once, at the route itself, when it's registered — so without a way to read it by name, the only alternative is hand-copying that same title into a second string wherever the nav bar renders it, with nothing keeping the copy in sync if the route's own title ever changes. `router-link`s point at route names, not at the routes' own `meta.title` values, and there's no built-in way to ask "what's the title of the route named `X`" without resolving it — `router.resolve({ name })` can do that resolution, but calling it fresh on every render (a nav bar re-renders on every route change) means repeating the same resolution work for the same static route metadata over and over.

## How it works

`getResolvedRoute` checks a module-level `Map` cache first, keyed by route `name`. It's a plain cache with no invalidation — fine as long as route `meta` is static (defined once when routes are registered, never changed at runtime, which is the common case), but it would silently serve stale data the moment any route's `meta.title` became dynamic (say, derived from loaded data rather than a static string), since nothing here ever clears or re-checks a cached entry.

On a cache miss, it calls `router.resolve({ name })` and stores both the resolved `href` and `meta` — read straight from however the route itself was registered, not from any second copy of it — under that same `name` key for next time. `getResolvedMeta`/`getResolvedHref` are just narrower accessors over the same cached entry, for callers that only need one or the other.

If `router.resolve` throws — the route name doesn't exist, most likely from a typo or a route that's since been removed but is still referenced somewhere — the `catch` falls back to a synthetic entry: `href: null`, and `meta.title` set to the `name` itself. That keeps a broken reference from crashing whatever's rendering the nav (a wrong-looking label is a far smaller problem than the whole nav bar throwing), while still being visibly wrong enough in the UI — a raw route name showing up where a real title should be — that it's likely to get noticed and fixed rather than silently mask the broken reference forever.
