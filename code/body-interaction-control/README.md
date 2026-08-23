# Body interaction control

Blocks interaction with the page.

## Use cases

**Submitting a form** — the spinner overlay covers only the form itself, but the header navigation next to it stays clickable — locking interaction with the whole page through this is simpler than trying to scope the block to just the form.

## How it works

`lock()` and `unlock()` add and remove an `inert` attribute plus a `ml-body--interaction-locked` class on `document.body`, gated by a `lockCount` so the attribute only comes off once every caller that locked has also unlocked — stacked callers can't unlock each other's interaction block early.

```css
body.ml-body--interaction-locked {
    pointer-events: none;
    user-select: none;
}
```

The class only covers clicks, hovers, and text selection. `inert` is what actually removes keyboard and screen-reader access — without it, someone could still Tab straight into the "blocked" background.

## Recommendation

By convention, this belongs alongside [`body-scroll-control`](../body-scroll-control) under a shared `controls/` folder eventually.
