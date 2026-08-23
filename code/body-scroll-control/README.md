# Body scroll control

Blocks page scroll.

## Use cases

**Opening a modal, drawer, or bottom sheet** — the page behind it would otherwise keep scrolling underneath while the overlay stays fixed in place.

## How it works

`lock()` and `unlock()` add and remove a `ml-body--scroll-locked` class on `document.body`, gated by a `lockCount` so the class only comes off once every caller that locked has also unlocked — stacked callers can't unlock each other's scroll lock early. `isLocked()` exists so a caller can ask whether scroll is currently locked without exposing `lockCount` directly.

```css
body.ml-body--scroll-locked {
    overflow: hidden;
}
```

## Recommendation

By convention, this belongs alongside [`body-interaction-control`](../body-interaction-control) under a shared `controls/` folder eventually.
