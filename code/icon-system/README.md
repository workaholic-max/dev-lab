# Icon system

A centralized icon-rendering system built on CSS `mask-image` and `background-image`, instead of one inline SVG component per icon.

## The problem

The obvious way to render an icon in Vue is an inline SVG, either as a raw `<svg>` in the template or as a small wrapper component around it. That's fine at small scale. It stops being fine once icons show up inside repeated, dynamic UI — a table with an edit/delete icon per row, a list with a status icon per item, a nav that re-renders icons on every route change.

Each inline SVG contributes one DOM node *per path/shape inside it*, not one node per icon. An 8-path icon rendered 200 times (a 200-row table) is 1,600 DOM nodes from icons alone, all of them individually diffable by Vue's reactivity system. Multiply that across several icon types on a data-heavy page and the icon layer becomes a real, measurable contributor to render cost — not the first thing anyone profiles, but a real one.

## How it works

Every icon renders through exactly one component, `Icon.vue`, as a single empty `<div>` with a class and one CSS custom property, `--icon-size-base`, set from the component's `size` prop:

```vue
<template>
    <div class="ml-icon" :class="iconClass" :style="iconStyle" />
</template>
```

The visual appearance comes entirely from CSS, not from DOM structure. `--icon-url` points at a static SVG asset via `mask-image` (or `background-image`, see below), and the browser rasterizes and paints it at the target size. Regardless of how complex the source SVG is — 3 paths or 30 — the rendered cost is one DOM node with a CSS paint operation, not N sub-elements Vue has to track.

Because the SVGs are referenced as external file URLs (`url('@/assets/icons/edit.svg')`) rather than inlined into a component, two things follow: Vite fingerprints and caches them as static assets independent of the JS bundle, and the browser only has to decode each distinct icon file once — every instance of `Icon` with the same `name` reuses the same cached, GPU-composited mask, rather than each instance carrying its own copy of the vector data through the JS bundle and the VDOM.

That same div-only approach is decorative by default, not accessible by default: because the icon is a CSS background or mask on an empty element with no text content, it carries no semantic meaning a screen reader can announce — correct for a purely decorative icon paired with visible text, but not for an icon that's the *only* signal of meaning, an icon-only button being the clearest case. Nothing in `Icon.vue` forces an `aria-label` onto that call site; it's on the consumer to add one, worth treating as a real gap rather than an implicit "someone will remember."

## Two rendering modes, and why both exist

**Mask mode** (default) uses `mask-image` with `background-color` providing the visible color. This is what makes runtime recoloring possible — hover states, contextual color overrides, theme changes — all through a CSS custom property, with zero JS. The real constraint: a CSS mask only has one channel of "visible or not," so it collapses the source SVG to a single silhouette. A two-tone icon rendered this way loses its second color entirely.

**Background-image mode** exists specifically for icons that need to keep more than one color. It preserves the SVG exactly as authored, at the cost of runtime recoloring — a background image is genuinely just an image, CSS can't reach into it and change one of its colors.

Which mode an icon uses is a single line in the registry (`BACKGROUND_IMAGE_ICONS`), decided once per icon rather than left to each call site to figure out. There's no icon that gets both multicolor rendering *and* runtime recoloring at the same time — that's a real limitation of the approach, not an oversight. A genuinely duotone, recolorable icon would need a different mechanism (e.g. two stacked masks, each with its own color variable), which this system doesn't currently support because nothing has needed it yet.

## Sizing and color without breaking the component API

```css
.ml-icon {
    --icon-size: var(--icon-size-base);
    --icon-color: currentColor;
}
```

`--icon-color` defaults to `currentColor` rather than one project's brand color, so the component itself carries no dependency on any particular color token — it inherits whatever text color is already in scope, the same default most icon libraries ship with. `--icon-size-base` comes from the component's `size` prop — the one thing that's actually part of the public API. `--icon-size` and `--icon-color` are ordinary custom properties a parent can override contextually:

```css
.some-layout {
    --icon-size: 40px;
    --icon-color: #2f6fed;
}
```

This covers hover states, responsive resizing, and per-context theming without the component ever growing a `sizeVariant`/`colorVariant` prop for every situation someone eventually needs. The API surface stays exactly two props (`name`, `size`); everything contextual happens in CSS, at the call site, without touching the component.

## Comparing it to the alternatives, honestly

**Inline SVG component per icon** — the default choice, and the right one at small scale. Full styling flexibility (any part of the SVG can be targeted), and each icon is independently tree-shakeable. Loses on DOM node count exactly as described above, and on bundle size once dozens of icons' vector data all live inside the JS bundle instead of as separately cacheable static assets.

**Icon font** — one network request for the whole set, trivial `color: currentColor` styling. Real downsides that ruled it out here: accessibility problems (glyphs read strangely or not at all to some screen readers unless carefully marked up), blurriness at non-integer sizes on some platforms, a flash-of-unstyled-icons on font load, and no practical way to do multicolor.

**SVG sprite sheet + `<use>`** — genuinely closer to this system: one file, real SVG semantics, `currentColor` support. What it doesn't solve: each `<use>` reference is still its own DOM node per instance (better than inline paths, still not as flat as a single masked div), and some browsers have historically had bugs with `fill`/`currentColor` on `<use>` references to external sprite files, which pushed toward CSS-driven masking instead.

## Files

`registry.ts` — the single source of truth for icon names, rendering mode, and directions, alphabetically ordered on purpose: readability, discoverability, and merge-conflict friendliness — though that ordering is a convention code review has to catch, not something any tooling here enforces; nothing currently fails if a new entry lands out of place.

`Icon.vue` — the shared renderer. Every icon is one `<div>` with a class and a CSS custom property; the CSS block maps each registered name to its SVG. Adding an icon is a manual, three-part step — an asset file, a `registry.ts` entry, and a hand-written CSS rule pairing the two — with nothing here auto-discovering a new file the way a build-time icon plugin would; fine at the current icon count, worth automating (a small script generating the CSS block from the assets folder) if the set grows into the hundreds.

`ArrowIcon.vue` — a directional variant, composing `Icon.vue` rather than reimplementing rendering — the pattern any future directional icon should follow.

`index.ts` — the intended entry point for anything outside this folder; internal files import each other directly and aren't meant to be reached from outside it.

`Example.vue` — a short usage demo covering the API surface: default usage, an explicit size, a contextual color override, a background-image-mode icon, and both a static and state-driven directional icon.
