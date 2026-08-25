# Dev Lab

A public record of the code worth keeping and the practices behind it — not a CV, that's what my [portfolio's](https://workaholic-max.github.io/portfolio/) for. This is closer to a lab notebook: real pieces of code pulled out of my TypeScript projects — Vue 3 by default where a framework's involved — documented with the actual reasoning and trade-offs, plus the Claude Code toolkit I use to build all of it efficiently.

## Reference Implementation

The [Architecture](https://github.com/workaholic-max/architecture) repository applies selected Dev Lab practices in a runnable Vue 3 application architecture, with documented boundaries, development guides, tests, and CI. Use it to see how these ideas fit together in a complete project.

## Structure

- **[`code/`](code)** — real code worth keeping, one folder per entry. Not everything here is an architectural "pattern" — some entries are algorithms, some are animation techniques, some are just a convention worth writing down. The bar for an entry isn't "is this a pattern," it's "would I want to explain this to someone in six months." See each entry's own `README.md` for the deep dive.
- **[`code-style/`](code-style)** — practices and conventions, not specific reusable code: naming shapes, composable return conventions, tooling choices. If it's a rule worth following rather than something to import, it lives here instead of `code/`.
- **[`ai-assisted-dev/`](ai-assisted-dev)** — a portable personal Claude Code toolkit: skills for recurring scenarios, subagents, and personal conventions. This half is **not scoped to this repo** — see [`ai-assisted-dev/README.md`](ai-assisted-dev/README.md) for what it is and how it's installed across every project on my machine.

## Current entries in `code/`

| Entry                                                                     | What it covers                                                                                                                                        |
|---------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`app-reload`](code/app-reload)                                           | A full-screen loading overlay shown before the page reloads or redirects, instead of the page tearing down instantly with no warning                  |
| [`application-init`](code/application-init)                               | A single ordered entry point for an app's one-time boot setup, instead of scattering it ad hoc across whichever file happens to run first             |
| [`axios-api-client`](code/axios-api-client)                               | A single, typed wrapper around one `axios` instance, instead of importing `axios` directly all over the codebase                                      |
| [`body-interaction-control`](code/body-interaction-control)               | Blocks interaction with the page                                                                                                                      |
| [`body-scroll-control`](code/body-scroll-control)                         | Blocks page scroll                                                                                                                                    |
| [`click-outside-directive`](code/click-outside-directive)                 | A Vue directive that calls a callback when a click lands outside the element it's bound to                                                            |
| [`deep-clone-reactive-state`](code/deep-clone-reactive-state)             | A plain, independent snapshot of Vue reactive state, all the way down — unlike Vue's own `toRaw()`                                                    |
| [`device-type-detection`](code/device-type-detection)                     | Reactive mobile/tablet/desktop device-type detection, instead of every component running its own media-query check                                    |
| [`ensure-service-worker-activated`](code/ensure-service-worker-activated) | Waits for a newly-activated service worker to take control before app boot continues, instead of proceeding on a stale build                          |
| [`group-filter`](code/group-filter)                                       | A search box plus a row of group chips, where options outside the current results stay visible but disabled rather than disappearing                  |
| [`http-error-catchers`](code/http-error-catchers)                         | Named `.catch()` helpers for HTTP statuses that need specific handling, instead of repeated status checks at every call site                          |
| [`icon-system`](code/icon-system)                                         | A centralized icon-rendering system built on CSS, instead of one inline SVG component per icon                                                        |
| [`incremental-item-display`](code/incremental-item-display)               | Renders a long list in chunks as the user scrolls, instead of mounting every item at once                                                             |
| [`last-visited-route`](code/last-visited-route)                           | Remembers the route a user was last on and restores it on the app's next load, instead of always landing on the default route                         |
| [`local-storage-service`](code/local-storage-service)                     | A thin, typed wrapper around `localStorage` that handles JSON serialization and key namespacing once, instead of every call site hand-rolling its own |
| [`modal-system`](code/modal-system)                                       | Two primitives every modal in the app is built from, instead of each modal reimplementing its own lifecycle handling                                  |
| [`progressive-web-app`](code/progressive-web-app)                         | Everything a Vite-built app needs to behave like a well-presented, installable progressive web app                                                    |
| [`pull-to-refresh`](code/pull-to-refresh)                                 | A hand-rolled pull-to-refresh gesture for standalone-mode iOS PWAs, which lose the native one                                                         |
| [`resolved-route-meta`](code/resolved-route-meta)                         | A cached way to read another route's `meta` (its title, for instance) by name                                                                         |
| [`router-guards`](code/router-guards)                                     | A way to guard each route before navigating to it                                                                                                     |
| [`router-init`](code/router-init)                                         | Wires an already-built router into the app in one function, instead of scattering that setup across whatever file bootstraps the app                  |
| [`scss-token-system`](code/scss-token-system)                             | Design tokens reached the same way from any file at any depth through one build-tool alias, split one partial per category under a shared barrel      |
| [`shared-types`](code/shared-types)                                       | A handful of small, reusable TypeScript types                                                                                                         |
| [`shared-utils`](code/shared-utils)                                       | A small, deliberately minimal set of standalone helpers                                                                                               |
| [`toast`](code/toast)                                                     | A queue of small, auto-hiding toast messages, reachable from anywhere in the app                                                                      |
| [`use-abortable-request`](code/use-abortable-request)                     | Tracks a component's in-flight requests and cancels what's left on unmount, instead of a hand-rolled `AbortController` per call site                  |
| [`use-modal-state`](code/use-modal-state)                                 | Gives the component owning a modal its own `{ context, isOpened }` state, instead of hand-rolling that same state differently each time               |

## Current entries in `code-style/`

| Entry                                                     | What it covers                                                                                                                                                                                                    |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`fragments‑convention`](code-style/fragments-convention) | Splitting one whole — a fixed sequence of steps, or a family of components that only work assembled together — into one file per piece under `fragments/`, none importable except by the file that assembles them |
| [`section‑comments`](code-style/section-comments)         | A convention for separating logical blocks inside a file                                                                                                                                                          |
| [`stateful‑composables`](code-style/stateful-composables) | A consistent `xState`/`xGetters`/`xActions` return shape for any composable that owns non-trivial state                                                                                                           |

## Adding something new

Read [`DOCUMENTATION.md`](DOCUMENTATION.md) rather than improvising a folder by hand — it keeps every entry documented to the same depth and consistently structured, without forcing entries into an identical template where the content doesn't call for it.

## For AI agents working in this repo

Read [`AGENTS.md`](AGENTS.md) first — it's the shared source of truth. `CLAUDE.md` bridges to it for Claude Code, which is the only AI coding tool this repo currently targets.

## License

MIT — see [LICENSE](LICENSE). Use whatever's useful, attribution appreciated but not required.
