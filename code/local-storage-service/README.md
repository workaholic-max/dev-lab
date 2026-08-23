# Local storage service

A thin, typed wrapper around `window.localStorage` that handles JSON serialization and key namespacing once, in one place — instead of every call site hand-rolling its own `JSON.stringify`/`JSON.parse` and prefix convention around `localStorage.setItem`/`getItem`.

## How it works

```ts
const theme = localStorageService.get<Theme>('theme', 'light');
localStorageService.set('theme', 'dark');
```

Every key passed to `get`, `set`, or `remove` goes through `getPrefixedKey` first, which prepends `ml.app.` — so this app's stored values can't collide with keys some other script on the same origin, or a future version of the same app with an incompatible data shape, happens to also use.

`get<T>` returns `defaultValue` immediately if nothing is stored under the prefixed key — a missing key isn't a failure, just nothing to return. If something *is* stored, it's run through `JSON.parse` inside a `try/catch`; on success it comes back typed as `T`, which is a type assertion the caller is trusting, not something this function verifies — if the stored value's actual shape doesn't match what `T` claims, nothing here catches that, the same trust model as `JSON.parse(x) as T` anywhere else. That includes shape changes across app releases: if what's stored under some key changes between versions, a browser holding onto the old shape hands it back as-is, typed as the *new* `T` by the caller's assertion, with nothing here to detect or migrate the mismatch — rarely a real problem for a low-stakes UI preference (a stale field is just ignored), but this function would need real versioning before it could safely store anything more structurally significant. A parse failure falls back to `defaultValue` too, same outcome as a missing key, reached a different way.

`set<T>` runs `JSON.stringify` and `localStorage.setItem` inside their own `try/catch`, silently discarding whatever throws — quota exceeded, or storage disabled entirely (private/incognito mode in some browsers).

`remove` is the odd one out: it calls `localStorage.removeItem` directly, with no `try/catch` around it. Everything else in this service is fail-soft by construction; `remove` isn't — a call to it while storage is disabled or otherwise throwing propagates that error to the caller instead of swallowing it the way `get` and `set` do, worth remembering before treating all three functions as equally safe to call blind.

## Why read and write failures are both silent, but for different reasons

A read failure — a missing key, or stored JSON that no longer parses — returning `defaultValue` is the safe default: a preference that was never set, or one left behind by an older, incompatible version of the same key, should behave exactly like it was never set, not throw and take down whatever page happened to read a UI preference.

A write failure disappearing without a trace is a different kind of default, not a corollary of the same reasoning — it means data the caller *thinks* it saved never actually landed, and nothing tells it so. It's a deliberate trade, not an oversight: the alternative is every caller wrapping every `set()` call in its own error handling for something that, in practice, is almost always a non-critical preference — a collapsed sidebar, a "don't show this again" flag. Silent failure is the right default for that. It would be the wrong default the moment this service is asked to store something the user would be upset to silently lose — that's a case this implementation doesn't protect against, and a caller reaching for `set()` to persist something more important than a UI preference should know that going in.