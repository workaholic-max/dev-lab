---
description: Add and wire up a new third-party library (e.g. chart.js, a date library, an animation library) following the project's existing conventions for wrapping external dependencies. Use when asked to add, install, or integrate a new package.
---

# Integrate a new library

Use for requests like "add chart.js and show a line chart of X" or "integrate <library>".

1. **Check whether something already covers this.** Search `package.json` and existing components for a library that already does the job before adding a new dependency — avoid ending up with two charting libraries in one project.
2. **Check the project's convention for wrapping third-party UI libraries.** Look for an existing example — how a date-picker or a component-library widget is wrapped: usually a thin component that owns the library's config so the rest of the app never imports the library directly. Follow that pattern; if none exists yet, propose the simplest wrapper and say so explicitly.
3. **Install with the project's package manager** (check CLAUDE.md), pinned consistently with how other dependencies in the project are pinned.
4. **Get the types right first.** Check whether the library ships its own TypeScript types or needs `@types/<lib>`. Read the actual types before writing usage code — library APIs drift between versions, don't reconstruct the API from memory.
5. **Build the smallest working example against real data** from the actual feature request — wire it to real props/state, not a toy placeholder.
6. **Verify it renders** using the Chrome integration: load the page and confirm the widget actually appears. Charting/canvas libraries especially fail silently — an empty canvas with no console error is a common trap.
7. **Note bundle-size impact** for non-trivial libraries and mention it in your summary so lazy-loading/code-splitting can be a deliberate decision, not an afterthought.
8. Report: what was installed, where the wrapper lives, and a screenshot of it working.
