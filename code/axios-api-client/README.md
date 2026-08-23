# Axios API client

A single, typed wrapper around one `axios` instance, instead of importing `axios` directly all over the codebase — every call goes through `apiClient.request(...)` rather than `axios.get(...)`/`axios.post(...)` scattered at each call site.

- **One configured instance** — every request runs through one `axios` instance, created once with `withCredentials` and the base headers already set, instead of `axios.create()` repeated or configured slightly differently in different places.
- **One place for cross-cutting headers** — set once in the constructor and `_buildHeaders`, not per call site — the natural place to add a project's auth header (a bearer token, an account ID) once real auth is wired in, without touching every call site.
- **Cancellable by default** — every request returns an `AbortablePromise<T>`; `.abort()` comes attached, no call site has to create or track its own `AbortController`.
- **Typed request shape** — method and response-type are closed unions (`'get' | 'post' | ...`), not raw strings, so a typo at a call site is a compile error, not a runtime 404.
- **Reloads on a 401** — the response interceptor treats an unauthorized status as the session being gone and triggers [`app-reload`](../app-reload)'s full-screen reload immediately, rather than leaving the app running against a session that no longer exists server-side.

## How it works

`ApiClient` is a class holding one piece of real state — the configured `axios` instance — created once in the constructor (`withCredentials: true`, the base `X-Requested-With`/`Accept` headers) and exported as a single instance, `apiClient`, that the rest of the app imports rather than each part constructing its own. `request<T>()` is the one method everything goes through: it builds the request's headers and config (`_buildRequestConfig`/`_buildHeaders`), fires it through that shared instance, and resolves to just the response `data` rather than the full axios response envelope.

## About: request cancellation

```ts
export type AbortablePromise<T> = Promise<T> & { abort: () => void };
```

Every call to `request<T>()` creates its own `AbortController`, attaches its `signal` to the axios call, and returns a promise with `.abort()` glued directly onto it — a caller can cancel a request without holding onto the controller separately.

Axios rejects a cancelled request the same way it rejects a real failure — both are just a rejected promise. The interceptor's job is telling those apart: `axios.isCancel(error)` passes a cancellation through as-is; anything else falls through to the rest of the interceptor's handling, covered next. Turning "this was cancelled" into a clean `null` instead of a thrown error happens one layer up, in [`use-abortable-request`](../use-abortable-request) — this client's job stops at correctly labeling the rejection, nothing more.

## About: 401 handling

A 401 means the session this client was using no longer exists server-side — expired, revoked, logged out from another tab, whatever the specific cause, the app is no longer in the state it thinks it's in. The interceptor narrows the error with [`http-error-catchers`](../http-error-catchers)'s own `isHttpBackendError` — the same object-shape-and-known-status check its per-call-site helpers use — then checks `status` against `HTTP_STATUS_CODES.UNAUTHORIZED`, and calls [`app-reload`](../app-reload)'s `trigger()` before rethrowing — the request still rejects normally, so whatever awaited it still sees a failure, but the reload is already locking the page and counting down underneath by the time that rejection reaches its own `.catch()`.

Every other status — a 500, a 403, a 422 — still just gets rethrown, same as before: per-status handling for anything short of "the whole session is gone" stays [`http-error-catchers`](../http-error-catchers)'s job at the call site, opted into per request rather than applied globally. A 401 is the one status that gets a blanket, unconditional reaction here instead: there's no meaningful per-call-site version of "the session is gone" to opt into selectively — if it's true for one request, it's true for all of them, so it belongs in the interceptor rather than repeated at every call site that happens to care.

## Pairs with

- [`use-abortable-request`](../use-abortable-request) — tracks a whole batch of these per component and cancels what's left on unmount.