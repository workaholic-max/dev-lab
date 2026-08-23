# Application init

A single ordered entry point that boots an app by running a fixed sequence of independent setup steps exactly once, before the app mounts — replacing the alternative of scattering one-time setup calls (bringing up state management, wiring the router, registering services, one-time third-party package setup) ad hoc across whichever file happens to run first, in whatever order they were added.

- **State ready first** — creates and installs the Pinia instance before any other step runs, since later steps may need a store to already exist.
- **Router delegated, not duplicated** — wires the app's router into boot by importing `initRouter` from [`router-init`](../router-init), a sibling entry; the call lives here, the implementation doesn't.
- **A home for one-off library setup** — one-time, run-once registration for a third-party library that needs global setup before first use.
- **Services auto-discovered, not hand-listed** — any `*.service.ts` file's exported `init()` gets called automatically at boot, with no hand-maintained list of which services exist.

## How it works

`initApp(app)` is called once, from the app's entry file, before `app.mount(...)`, and runs the four steps above in a fixed order:

```ts
export const initApp = (app: App) => {
    initPinia(app);
    initRouter(app);
    initPackages();
    initServices();
};
```

Three of these four steps live in their own file under `fragments/` — pinia, packages, services — following the [`code-style/fragments-convention`](../../code-style/fragments-convention) shape. The router step is the odd one out: `initRouter` is imported from [`router-init`](../router-init), a separate entry, not from a local fragment, because a working guard chain needs real context (an authenticated user, permissions) this entry has no business faking — `router-init` owns that implementation, this one only owns the call. The call order itself is deliberate, too, and worth stating plainly since nothing in the code enforces it: state management goes first because the router's guard chain and any service's `init()` may need a store to already exist, and the router goes before services so a service whose `init()` needs a live route can rely on one. That guarantee only holds as long as whoever edits this function keeps the order correct — reordering two steps that secretly depend on each other fails silently, not with a type error.

## About: packages

Some one-time setup belongs to neither state, routing, nor a service — a charting library that needs its elements registered globally before the first chart renders, say. This step exists for exactly that: a small, argument-less function, called once, that does whatever a specific third-party package needs done before anything in the app can use it (`Chart.register(...)`, in this project's case). There's not much more to say about it in general — what actually belongs here is entirely dictated by whichever library a given project happens to need it for, which is also why it's the one step that resists being made any more generic than "a function that runs once."

## About: services

`initServices` doesn't import and call each service's `init()` by hand. Instead it globs every file in the app matching `*.service.ts` (or `.js`) via `import.meta.glob(..., { eager: true })`, and calls `.init?.()` on anything any of those modules export:

```ts
export const initServices = () => {
    Object.values(serviceModules).forEach((module) => {
        Object.values(module).forEach((service) => {
            service.init?.();
        });
    });
};
```

A service opts in purely by being named `*.service.ts` and exporting something with an `init` method — no registry file to update, no import to add anywhere else, so a new service can't be added and then forgotten from boot the way a hand-maintained list eventually drifts. The cost is the mirror image of that convenience: because there's no explicit list, there's also nothing that fails loudly if a file is misnamed. `device-type.service.ts` gets picked up automatically; a typo like `device-type.servic.ts` silently opts it out of boot with no error anywhere — the only symptom is whatever that service's `init()` was supposed to set up quietly not working. It also calls every matching service's `init()` unconditionally, in whatever order the glob happens to return results, which is fine for setup that's genuinely order-independent but the wrong tool the moment one service's `init()` needs to run after another's, since nothing here expresses or enforces that dependency.

## How this relates to other entries

- [`device-type-detection`](../device-type-detection) — `deviceTypeService.init()` is exactly the kind of step the service auto-init convention picks up automatically; that entry doesn't call its own `init()`, since it's meant to be invoked by whatever init mechanism a consuming project already has, and this is the one it was actually pulled from.
- [`router-init`](../router-init) — this entry's router step imports `initRouter` from there directly; `router-init` owns the implementation, this entry only owns the call.