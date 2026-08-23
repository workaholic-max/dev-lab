# Toast

A toast is a small, auto-hiding message shown to tell the user something just happened — a save succeeded, a request failed — disappearing on its own after a few seconds or on a click, without interrupting whatever they're doing. This entry keeps a queue of them reachable from anywhere in the app, instead of a toast/alert component that every place needing to notify the user has to import and hold its own local show/hide state for.

## How it works

`useToastStore` holds `toasts`, a plain array of `{ id, type, message }`, plus a `Map<id, timeoutId>` of pending auto-hide timers keyed by that same toast id. `showInfo`/`showSuccess`/`showFail` are thin wrappers over one `show(type, message)`, which assigns an incrementing id, pushes the toast, and schedules a three-second `setTimeout` that calls `hide(id)`, storing the timeout's id in the map under that toast's id. `hide(id)` is what both that timeout and a manual click on a toast call — it clears the map entry and removes exactly that one toast from the array. Keeping timeouts in a map rather than counting down on one shared timer is what makes an early manual hide safe: clicking a toast clears only its own pending timeout, without touching whatever's still running for the rest of the queue; a single shared timer restarted on every new toast would instead either hide an older toast early the moment a new one arrives, or never quite fire on time for any toast but the last one queued.

`<Toast />` is the only thing that ever renders `toasts` — a fixed-position list, mounted once, typically a sibling of `<router-view />` inside the app's root component rather than nested inside it, so it survives whatever route happens to be active at the time. The wrapping list itself is `pointer-events-none`, with `pointer-events-auto` set back on each individual toast rendered inside it; without that, the fixed-position container reserved for toasts would sit on top of whatever's normally clickable underneath it for as long as nothing happens to be showing in it — the common case in most sessions — while a toast that is showing still needs to be clickable to hide it early.

A caller anywhere in the app only ever needs the store, never the component:

```ts
const toastStore = useToastStore();

toastStore.showSuccess('Saved.');
toastStore.showFail('Failed to save.');
toastStore.showInfo('Syncing…');
```

`<Toast />` itself is rendered exactly once, typically in `App.vue` near the app root — every other file, however deep in the tree or however far from that mount, only ever calls the store above.

## Files

`types.ts` defines `TOAST_TYPES`, the `ToastType` union derived from it, and the `Toast` shape — the vocabulary both `toast.store.ts` and `Toast.vue` need, kept in its own file so neither has to import the other just to agree on what a toast looks like. `toast.store.ts` owns the queue and its timers, with no rendering concerns of its own. `Toast.vue` is the one place that queue is ever rendered.
