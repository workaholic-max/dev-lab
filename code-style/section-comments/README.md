# Section comments

A convention for separating logical blocks inside a file.

```ts
// ───────────────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────────────
```

## Why bother

Files that mix state, computed values, handlers, and lifecycle logic without visual separation are slower to scan, both for a human skimming for the right block, to figure out where to insert a change without disturbing an unrelated section. A one-line section comment costs almost nothing and makes the file's structure visible at a glance, before reading a single line of logic.

## Editor setup

Typing the divider out by hand every time defeats the point of a "costs almost nothing" convention — see [`SETUP.md`](SETUP.md) for a WebStorm Live Template that expands it on a keystroke.
