# App reload

A full-screen loading overlay shown for a short, fixed delay before the page actually reloads or redirects — instead of calling `window.location.reload()` or `window.location.assign()` directly and letting the page tear down mid-frame, with whatever the user was just looking at disappearing without warning the instant something decides a reload is necessary.

## Use cases

[`axios-api-client`](../axios-api-client)'s response interceptor is the concrete case this exists for: the moment any request comes back with a 401, the session is gone, and the app needs to land back on a fresh, logged-out boot. Calling `window.location.reload()` straight from that interceptor would tear the current screen down the instant the response arrives; routing it through `trigger()` instead locks the page and holds the loading overlay in front of whatever the user was doing until the reload actually replaces it, rather than the screen just vanishing under them mid-request.

## How it works

`trigger` flips `isOverlayVisible` to `true`, locks the page via [`body-scroll-control`](../body-scroll-control) and [`body-interaction-control`](../body-interaction-control) — the same reference-counted locks [`modal-system`](../modal-system) uses, reused here rather than reimplemented — and starts a two-second `setTimeout`. When it fires, `window.location.assign(options.href)` runs if a redirect target was passed, otherwise `window.location.reload()`. A caller redirecting to another route rather than reloading in place typically sources that `href` from [`resolved-route-meta`](../resolved-route-meta)'s `getResolvedHref`, rather than hand-building a path.

`trigger()` doesn't verify anything about why it's being called, or wait on anything itself — it starts the delay and locks the page the moment it's called, full stop. That makes correct sequencing the caller's responsibility: triggering a reload alongside a logout request, rather than once that request has actually resolved, risks the delay running out and the page reloading into a state that, for a moment, is still logged in server-side — whatever action necessitated the reload has to have actually finished before this is called, not just been started.

`<ReloadOverlay />` is the only thing that reads `isOverlayVisible`, and does nothing beyond that — it renders `FullScreenOverlay` when the store says to, and nothing when it doesn't. `FullScreenOverlay` is a plain, prop-less full-screen backdrop and spinner with no awareness of the store or of reloading at all, split out specifically so the same full-screen loading visual can be reused wherever else an app needs one — stacked above every other overlay in the app, `z-[70]` against [`toast`](../toast)'s `z-[60]` and [`modal-system`](../modal-system)'s dialog at `z-50`, since once a reload is imminent nothing else on screen should still read as clickable or on top. `<ReloadOverlay />` itself is mounted once, near the app root, the same shape as [`toast`](../toast) — nothing else in the app imports either component directly; every call site only ever calls `appReloadStore.trigger()`.

There's no corresponding `untrigger` or cleanup path, and that's deliberate, not an oversight: by the time the timeout fires, the page is being replaced outright — either a full reload or a full navigation — so there's nothing to return the scroll/interaction locks to a document that's about to stop existing. The same reasoning [`pull-to-refresh`](../pull-to-refresh) states for its own uncleared listeners applies here for the same reason.

## Files

`app-reload.store.ts` owns `isOverlayVisible` and the delay/redirect-or-reload logic; it renders nothing itself. `FullScreenOverlay.vue` is the plain full-screen backdrop-and-spinner, with no logic of its own beyond its own markup — deliberately split out so the same visual can be reused anywhere else in an app that needs a full-screen loading state, not just for a reload. `ReloadOverlay.vue` is the thin, reload-specific wrapper that renders `FullScreenOverlay` when `isOverlayVisible` is true and nothing when it isn't — the one piece here that's actually reload-aware.
