# Router guards

A way to guard each route before navigating to it.

## How it works

Which guards actually run, and in what order, is entirely up to whatever's listed in `index.ts`'s `guards` array — this entry ships two, `authGuard` and `permissionGuard`, but the mechanism itself doesn't care how many there are or what any one of them checks.

Every guard shares the same contract — take a context, return one of three things:

```ts
export type GuardResult = null | true | RouteLocationRaw;

export type Guard<Context> = (context: Context) => GuardResult;
```

`null` means "not my concern, keep checking the rest." `true` means "this guard has an opinion and it's a hard accept — stop checking, let navigation proceed." A location object means "redirect here instead." `index.ts` holds that array and a loop that walks it in order, stopping at the first non-`null` result and returning it as the verdict for the whole chain; running out of guards with nothing but `null`s means none of them objected, and the chain itself resolves to `null`. `resolveGuards` closes over `guards` rather than taking it as an argument, since `guards` isn't a value anything outside this one file ever needs to see or pass in.

Order is explicit, not buried in nested conditionals — auth is checked first on purpose here, so `permissionGuard` can safely assume an authenticated context by the time it runs; adding a third guard means one new import and one new array entry, not re-deriving the precedence the existing guards already encode. `Guard<Context>`/`GuardResult` stay genuinely generic, since every guard has to satisfy that contract regardless of which app it's written for — it's specifically the list itself, and the loop that walks it, that don't need to be; both live in `index.ts`, closing over this entry's own concrete `Context`/`User` shape from `types.ts`.

## What this deliberately doesn't handle

- **No async guards.** Every guard here is synchronous — if a real project needs a guard that checks something server-side (a fresh permission fetch, a token refresh), this shape needs extending to support returning a `Promise<GuardResult>`, which changes the resolver's control flow non-trivially.
- **No re-running guards against a redirect target.** If a guard redirects to another route, that route's own guards (if it had any) don't automatically get re-evaluated — the resolver returns the redirect and expects Vue Router's normal navigation cycle to handle it as a fresh navigation, not something this chain manages recursively.
- **Guard order is manual, not declared per-guard.** Nothing stops someone from accidentally reordering the array and silently changing precedence — there's no dependency declaration between guards, just documentation (like this file) explaining why the order is what it is.

## Files

`types.ts` holds every type this entry has: the generic `Guard<Context>`/`GuardResult` contract, with the context left as a type parameter instead of hardcoded to a specific domain's user type, and the one concrete `Context`/`User` shape this entry actually ships, shared by every guard and by `index.ts`.

`route-names.ts` is a separate concern from everything else here: not who's allowed on a route, just what a route is *called*. `ROUTE_NAMES` is the one place `'login'`, `'dashboard'`, and `'access-denied'` are spelled out as literal strings — every guard compares `to.name` against it or names a redirect target through it instead of retyping the same string in more than one file, so the login route's name changing is a one-line edit here rather than a search-and-replace across every guard that happens to mention it. It's read at runtime (`to.name === ROUTE_NAMES.LOGIN`, not just used as a type), which is exactly the case [`shared-types`](../shared-types) documents `as const` objects for over a plain string union.

`fragments/auth-guard.ts` and `fragments/permission-guard.ts` hold one guard each, following the [`code-style/fragments-convention`](../../code-style/fragments-convention) shape: `index.ts` is the only file that imports either fragment, and holds the ordered `guards` array and the loop that walks it, exporting `resolveGuards`, the one function anything outside this entry actually calls.

`router-meta.d.ts` augments Vue Router's own `RouteMeta` interface, which ships empty, with the fields this repo's router entries actually read — `permissionGuard` reads `permissionKey` off it, for instance, and without anything more `to.meta.permissionKey` either types as `unknown` or forces a cast at every call site (`to.meta.permissionKey as string | undefined`). It closes that gap with TypeScript's declaration merging instead:

```ts
declare module 'vue-router' {
    interface RouteMeta {
        title: string;
        permissionKey?: string;
        ignoreLastVisited?: boolean;
    }
}

export {};
```

Nothing imports this file — a `.d.ts` inside a project's TypeScript `include` globs is picked up automatically, and `declare module 'vue-router' { interface RouteMeta { ... } }` merges its fields onto the *existing* `RouteMeta` interface rather than replacing it, the same mechanism any third-party module's types get augmented through. The trailing `export {}` is easy to leave out and easy to not notice is missing: without at least one top-level `import`/`export`, TypeScript treats the file as a global script rather than a module, and `declare module` in script scope declares a brand-new ambient module instead of merging into the real one — a silent difference whose only symptom is `to.meta.permissionKey` still not existing, with nothing pointing back at this file as the reason.

`title` is required because every route this repo's router entries touch is expected to have one — [`resolved-route-meta`](../resolved-route-meta) reads it unconditionally, and a route with no title isn't really finished being defined. `permissionKey` and `ignoreLastVisited` are both optional, because most routes need neither: `permissionKey` only matters to a route `permissionGuard` actually gates, `ignoreLastVisited` only to whichever routes [`last-visited-route`](../last-visited-route) shouldn't remember.

This lives here, in `router-guards`, rather than split across the two other entries that also read a field of it — mainly because `permissionKey` is what this entry's own `permissionGuard` needs, but also because `RouteMeta` is one interface, not three, and there's no clean way to divide "the type of `to.meta`" across separate files without either duplicating the interface declaration or having each entry redeclare fields it doesn't use. One file, three fields, is more honest than pretending each entry owns a private slice of the same object.
