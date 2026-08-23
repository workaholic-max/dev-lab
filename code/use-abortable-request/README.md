# Abortable request tracking

A per-component composable that tracks every in-flight request it sent and cancels whatever's still pending when the component unmounts — replacing an `AbortController` created and stored by hand at each call site, with `.abort()` called manually from `onBeforeUnmount`.

## The problem

A component fires a request, the user navigates away before it resolves, and the `.then()` callback still runs against a component that no longer exists — at best a wasted network response, at worst a "Cannot read property of undefined" error from code that assumed the component was still mounted. Cancelling the request on unmount avoids both.

## How it works

Every request passed through `sendAbortableRequest` gets a numeric id and is stored in a `Map<number, AbortablePromise<unknown>>`. When it settles — success or failure — it removes itself from the map via `.finally()`. `abortRequests()` walks whatever's left in the map and calls `.abort()` on each; `onBeforeUnmount(abortRequests)` wires that to run automatically.

The `.catch()` inside `sendAbortableRequest` is what turns a cancelled request into a clean `null` instead of a thrown error propagating up to the caller — `axios.isCancel(error)` distinguishes "this was aborted on purpose" from an actual failure, which still rethrows normally.

Nothing here ever looks a request up by its id — `abortRequests()` only ever iterates all of them, so a `Set<AbortablePromise<unknown>>` would do the same job with less machinery today. The id earns its keep the moment something needs to cancel one specific in-flight request by reference — a search-as-you-type box cancelling only its previous keystroke's request, not every request the component has sent — but as written, that capability doesn't exist yet, so the id is complexity paid for upfront without being spent.

Called from inside a component's `<script setup>`, where `onBeforeUnmount` (used inside the composable itself) has an active component instance to attach to:

```ts
const { sendAbortableRequest } = useAbortableRequest();

sendAbortableRequest(apiClient.request({ method: 'get', url: '/employees' }))
    .then((employees) => {
        if (employees === null) return; // cancelled — not the same as an empty result

        employeesState.data = employees;
    })
    .catch((error) => {
        // a real failure — cancellation never reaches here
    });
```

## Trade-off against the alternative

The alternative is creating and storing an `AbortController` per request at each call site by hand, and remembering to call `.abort()` in `onBeforeUnmount` yourself, every time. That's not hard once, but it's exactly the kind of small "don't forget to do this" boilerplate that's better centralized once than trusted to be repeated correctly at every call site that fires a request from a component.

## Pairs with

[`axios-api-client`](../axios-api-client) — this composable manages a *batch* of requests over a component's lifetime; `axios-api-client` is what actually produces the cancellable (`AbortablePromise`) request in the first place that gets passed in.
