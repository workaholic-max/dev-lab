# Fragments convention

A convention for splitting one whole that would otherwise live in a single, ever-growing file into several small files under a `fragments/` folder, instead of either one file that keeps absorbing every new addition, or the pieces spread across ordinary modules anyone in the app is free to import on their own. Nothing outside the one file that assembles the fragments back together ever imports one directly: a fragment isn't a public module in its own right, it's one named, focused piece of somebody else's whole. What that whole actually is varies: most often it's a fixed, ordered sequence of steps — a boot sequence, a chain of route guards — assembled by a function that calls each one in order.

```ts
// fragments/step-one.ts
export const stepOne = () => { /* ... */ };

// fragments/step-two.ts
export const stepTwo = () => { /* ... */ };

// index.ts — the only file that imports either fragment
import { stepOne } from './fragments/step-one.ts';
import { stepTwo } from './fragments/step-two.ts';

export const run = () => {
    stepOne();
    stepTwo();
};
```

Sometimes there's no order at all: a small family of components that only mean anything assembled together — an overlay and the dialog it wraps, say — takes the same shape without it, assembled into one barrel object instead of a function that calls things in sequence. [`modal-system`](../../code/modal-system) is the real example of this shape in this repo:

```ts
// modal-system/index.js
import ModalDialog from './fragments/ModalDialog.vue';
import ModalOverlay from './fragments/ModalOverlay.vue';

export default {
    Overlay: ModalOverlay,
    Dialog: ModalDialog,
};
```

## When this earns its keep over one growing function

Two trivial one-line steps don't need this — splitting `stepOne(); stepTwo();` into two files each holding one short function adds navigation overhead, a second file to open to see what a one-liner does, without removing any real complexity from the first. It starts earning its cost once a sequence has enough steps, or any one step has enough of its own reasoning or local state, that reading the whole thing in one function stops being the fastest way to understand any single piece of it. At that point, one file per step means changing or reviewing one step never requires reading past the ones around it, and the assembling file itself becomes a short, accurate table of contents for the whole sequence rather than the sequence's actual implementation.

The component shape earns its keep on a different question — not how many pieces there are, but whether they're actually interdependent. A part that genuinely works standalone, a button or a badge, doesn't belong behind a barrel just to match the pattern; forcing it through one adds indirection for nothing. It's worth reaching for specifically when a part rendered alone wouldn't do anything sensible on its own — no teleport, no backdrop, no shared lifecycle — because then the barrel isn't hiding parts that could just as well stand independently, it's making an already-true fact (these only work together) something a consumer has to go along with instead of discovering by accident.

## Why split into files at all

A single function handling every step inline reads fine at two or three steps and stops reading fine well before ten — each new step either gets appended to the bottom or wedged in wherever felt closest to where it belonged, and the function itself becomes the only place that shows what order things actually happen in, with no boundary between one step's local detail and the next's. Splitting each step into its own file doesn't change that order — the assembling file still states it plainly, as an explicit array or a short, literal sequence of calls — but it does mean a step with enough of its own reasoning, its own local constants, or its own real logic gets a file scoped to exactly that, instead of sharing scope with every other step around it. Adding a new step later costs the same either way it's found: one new file plus one new line in the assembling file, not a decision about where inside an already-crowded function it best belongs.

The "nothing outside the assembling file imports a fragment" half is doing separate work from the file split itself: it's what keeps a fragment from quietly turning into an ordinary reusable module. A piece broken out into its own file looks, at a glance, like anything else in the codebase that's one import away from being reused — nothing about a file on disk announces "this one's private." There's no language-level access modifier to reach for here, the way a private class field has one; the distinction lives in how a fragment is written and read, not in anything the compiler enforces. A fragment is one piece of a specific, fixed whole, not a general-purpose function or component that happens to also get used from one place today.

## Where this shows up in this repo

- [`application-init`](../../code/application-init) — pinia setup, one-off package registration, and service auto-discovery each live under their own `fragments/` file; `index.ts` calls all three, in order, alongside the router step it imports from a separate entry instead.
- [`router-guards`](../../code/router-guards) — `authGuard` and `permissionGuard` each live under their own `fragments/` file; `index.ts` holds the ordered array that walks them and the loop that does the walking.
- [`router-init`](../../code/router-init) — the `beforeEach`/`afterEach`/`onError` handlers Vue Router calls each live under their own `fragments/` file, named for the hook each backs rather than for what it currently does; `index.ts` wires all three to the router instance, in order.
- [`modal-system`](../../code/modal-system) — the component shape: `ModalOverlay` and `ModalDialog` aren't a sequence of steps at all, but the same "nothing outside the assembling file imports a fragment directly" rule already held for them before `fragments/` existed as a folder; the move just gives that existing invariant a home, with `index.js` as the barrel object.
