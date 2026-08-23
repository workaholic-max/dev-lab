# Composable state / getters / actions shape

A consistent return shape for any composable that owns non-trivial internal state: split what it returns into three named groups — `xState` (the raw reactive state), `xGetters` (derived, read-only values), and `xActions` (the only functions allowed to change it) — instead of returning a flat grab-bag of refs and functions.

```ts
export const useX = () => {
    const state = reactive({ value: null, isSet: false });

    const isReady = computed(() => state.value !== null);

    const set = (value) => {
        state.value = value;
        state.isSet = true;
    };

    const clear = () => {
        state.value = null;
        state.isSet = false;
    };

    return {
        xState: state,
        xGetters: readonly({ isReady }),
        xActions: { set, clear },
    };
};
```

## Honest trade-off

This is more ceremony than a component just returning `{ isOpened, open, close }` directly, and for a two-line composable the split can feel like overhead for its own sake. It earns its keep once a composable has real internal state plus more than one or two actions — [`use-modal-state`](../../code/use-modal-state) is the current example of this shape under `code/` here. A trivial composable shouldn't be forced into three groups just for consistency; if there's nothing to derive and only one action, a flatter return is more honest than manufacturing groups that don't carry real distinctions.

## Why the split, not just one flat object

A flat `{ isOpened, context, open, close }` return works fine until a template or another composable starts writing to `isOpened` directly instead of calling `open()`/`close()` — nothing stops it, because state and the operations that are supposed to be the only way to change it look identical at the call site. Splitting them into differently-named groups makes that distinction visible everywhere the composable is used: `modalState.isOpened` in a template read is obviously a read; there's no `modalState.isOpened = true` sitting next to it that looks equally legitimate, because the actions live in a separate object under a separate name. It's the same reasoning as a private field with a public setter method, expressed through naming instead of language-level privacy (Vue's `reactive()` doesn't have real private fields to reach for).

## The three groups

**State** (`xState`) — a single `reactive()` object, not a pile of individual `ref`s: the alternative, `{ isOpened: ref(false), context: ref(null) }`, pushes `.value` into every read and write outside the template, for no benefit over the reactive object's plain property access. One object is also one thing to pass around, watch, or reset, and it reads as "this composable's state" as a unit rather than an unlabeled collection of refs that happen to live in the same function. Unlike `xGetters`, `xState` isn't also wrapped in `readonly()` — that guard exists for getters because a `computed` ref assigned into a plain object is silently still just a ref with nowhere to write to; raw state has no equivalent footgun, since its properties are genuinely meant to be written to, just only from inside `xActions`, and that boundary is already the one this whole shape exists to make visible through naming, not through a second layer of enforcement on top of it.

**Getters** (`xGetters`) — `computed` values wrapped in `readonly({...})`. The `readonly()` wrapper is what actually enforces "derived, not settable" — without it, a `computed` ref assigned into a plain object is still just a ref sitting there, and nothing stops a consumer from reaching in — the same reason Pinia's own getters come back read-only to anything outside the store that defines them. Only worth adding this group when a composable actually has derived values; a composable with only raw state and actions skips it (see [`use-modal-state`](../../code/use-modal-state) — no getters group, because there's nothing derived to expose).

**Actions** (`xActions`) — plain named functions, the only sanctioned way to change `xState`. If a composable also needs to expose a narrower subset for `defineExpose` (an imperative open/close a parent template ref can call, versus the full internal action set), that's worth a fourth, explicitly narrower group rather than exposing all actions through `defineExpose` — see [`use-modal-state`](../../code/use-modal-state)'s `modalExpose`, a one-method (`open`) subset of its full `modalActions`.

## Naming

The prefix matches the composable's subject, not the word "state"/"getters"/"actions" alone — `modalState`/`modalActions` here, `cartState`/`cartActions` or similar for whatever else a project adds following the same shape. That matters most when a component uses two composables following this shape at once: `const { modalState, modalActions } = useModalState(); const { cartState, cartActions } = useCartState();` stays unambiguous in the template and in destructuring, where two composables both returning `state`/`actions` would collide or need manual renaming at every call site.

Putting the subject on the group instead of on every individual function inside it also keeps those functions short: `formActions.set(...)` says as much as `setFormState(...)` would, without the subject baked into every exported name the way a flat module of standalone functions would need (`setFormState`, `resetFormState`, `openFormState`, and so on). That difference compounds the moment a subject needs renaming: going from `formState`/`formActions` to `loginFormState`/`loginFormActions`, once a second form shows up in the same place and the first one needs disambiguating, touches two names — not every function `form` happened to be baked into.

A single composable isn't limited to one `xState`/`xGetters`/`xActions` triplet either — one that genuinely owns more than one concern can return several such groups directly, each under its own prefix, decided once inside the composable itself rather than left to whoever calls it:

```ts
export const useXY = () => {
    // ───────────────────────────────────────────────────────
    // X
    // ───────────────────────────────────────────────────────

    const x = reactive({ data: null, isSet: false });
    
    const setX = (value) => {
        x.data = value;
        x.isSet = true;
    };

    // ───────────────────────────────────────────────────────
    // Y
    // ───────────────────────────────────────────────────────

    const y = reactive({ data: null, isSet: false });

    const isDataValid = computed(() => y.data !== null);

    const setY = (value) => {
        y.data = value;
        y.isSet = true;
    };

    return {
        xState: x,
        xActions: { set: setX },

        yState: y,
        yGetters: readonly({ isDataValid }),
        yActions: { set: setY },
    };
};
```

`const { xState, xActions, yState, yGetters, yActions } = useXY();` already reads correctly at the call site, with nothing to rename — `x` and `y` here are two genuinely separate concerns the composable owns together, so it's the one place that actually knows what each should be called. Only `y` gets a `yGetters` group here, and that's deliberate, not an inconsistency: `x` has nothing derived to expose, so it skips the group entirely rather than carrying an empty one for symmetry's sake, the same rule `use-modal-state` follows above. The sections inside the composable are the [`section-comments`](../section-comments) convention, not incidental — a function with more than one concern's worth of state and actions living in it is exactly the kind of function that benefits from marking where one concern ends and the next begins.

That's a different case from a composable reused for two *unrelated* things, though, which is where renaming at the call site earns its place instead. A composable general enough to be reused more than once in the same place — rather than something inherently singular like a page's one modal — can't bake a call-site-specific subject into its own return at all: it returns plain `xState`/`xGetters`/`xActions`, and each call site supplies the actual subject through destructuring instead:

```ts
// ───────────────────────────────────────────────────────
// X
// ───────────────────────────────────────────────────────

const { xState, xGetters, xActions } = useX();

// ───────────────────────────────────────────────────────
// Y
// ───────────────────────────────────────────────────────

const { xState: yState, xGetters: yGetters, xActions: yActions } = useX();
```

Same convention, same reason — marking where one usage ends and the next begins — just at the call site this time instead of inside the composable. The composable's own internals never reference either subject by name, so calling `useX` a third time, or renaming one of the existing usages, is a change at the call site only.

## An idea worth naming, not yet a settled rule

A composable that owns a closed set of valid values for one of its options is sometimes best paired with exporting that vocabulary from the same module — a composable and its own `as const` enum living together, imported as a pair, rather than the enum living in an unrelated shared constants file the composable's caller has to go find separately. Not applied consistently across the entries in this repo yet, and it's not obviously correct for every composable (most of what's here doesn't have a fixed enum-shaped option that would benefit) — worth keeping in mind rather than treating as settled practice.
