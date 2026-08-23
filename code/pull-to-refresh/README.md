# Pull to refresh

A hand-rolled pull-to-refresh gesture — touch down near the top of the page, drag down past a threshold, release, reload.

## Use cases

Mobile Safari gives pull-to-refresh for free in the regular browser tab. An iOS PWA running in **standalone mode** (added to the home screen, launched without Safari's browser chrome) loses that — there's no browser UI left to provide the gesture, and the app has to implement it itself if it wants the behavior back. `navigator.standalone` is the (non-standard, Safari-specific) way to detect that mode, which is what the call site gates on:

```ts
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isStandalone = navigator.standalone === true;

if (isIOS && isStandalone) {
    enableCustomPullToRefreshEvent();
}
```

That check typically lives near wherever the app gets mounted — a `main.js` or equivalent boot file — one gate, run once at boot, deciding whether the gesture gets registered for that session at all.

This is deliberately gated to iOS standalone only, not enabled unconditionally, because the platforms that already have this gesture natively — a regular browser tab, and Android PWAs in standalone mode via Chrome's own handling — shouldn't get a second, custom implementation layered on top. A project targeting other platforms with the same missing-gesture problem would need to verify that assumption for its own target browsers rather than trusting this scoping as-is.

## How it works

`touchstart` records `startY` only when the page hasn't been scrolled down (`window.pageYOffset > 0` skips it — loose enough to also let through the negative values iOS produces during elastic overscroll past the top, not just an exact `0`) — starting a drag anywhere else isn't a pull-to-refresh gesture, it's just scrolling. `touchend` computes how far the finger moved (`deltaY`) and reloads only if it crossed `REFRESH_THRESHOLD` (200px) while the page is *still* not scrolled down when the touch ends. There's no visual feedback during the drag (no pull-down spinner or progress indicator tracking finger position) — this fires the reload or does nothing, all-or-nothing at release, rather than a continuously-tracked gesture. A production pull-to-refresh with a visual indicator would need to track `touchmove` too, not just start/end. The listeners are also installed once, globally, at module scope, with no corresponding `disableCustomPullToRefreshEvent` — this is meant to be called once at app boot and never needs to turn back off, so it's not appropriate to call more than once, or from inside a component that might unmount, without adding cleanup of its own.

## Why it doesn't trigger when scroll is locked

Scroll being locked (via [`body-scroll-control`](../body-scroll-control)) means a modal, drawer, dialog, or some other overlay is currently open. A touch drag happening on top of one of those shouldn't also register as a pull-to-refresh gesture on the page underneath — reloading the whole app out from under an open overlay because of a drag that was actually meant to interact with it would be a jarring, unrelated side effect. Checking `isLocked()` here is what stops that: the gesture is disabled for the whole duration anything else has scroll locked, no coordination needed beyond calling that one shared check.
