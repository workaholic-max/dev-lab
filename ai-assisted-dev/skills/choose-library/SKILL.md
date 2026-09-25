---
name: choose-library
description: Compare candidate third-party packages for a UI or utility need (a chart, a calendar/date-picker, drag-and-drop, a rich-text editor) and recommend one with real trade-offs, before any code is written. Use when asked to pick, evaluate, compare, or recommend a library/package for something the project doesn't have yet.
---

# Choose a library

Use this before `integrate-library`, when the package itself isn't decided yet — "we need a calendar view" or "what should we use for charts" — not for "add chart.js," where the choice is already made.

1. **Pin down the actual requirement first.** A calendar showing single-day events and a calendar with drag-to-resize multi-day bookings are different requirements, not the same "calendar" need, and they narrow the field differently. Get this from the person asking rather than assuming from whichever library comes to mind first.
2. **Shortlist 2-4 real candidates**, not one default pick rationalized after the fact. Include at least one option already used elsewhere in similar projects and one purpose-built option even if it's unfamiliar.
3. **Check the project's actual constraints before comparing anything else**: Vue 3 compatibility (rule out anything jQuery-era or React-only), TypeScript types (bundled or a real `@types` package), license (no GPL/AGPL in closed-source work without flagging it first), and whether it's still maintained — last publish date, open-issue backlog, any maintainer note that it's in maintenance mode.
4. **Compare on what actually matters for this use, not a generic checklist**: bundle size from an actual source (bundlephobia or the package's own reported size, not a guess), tree-shaking/ESM support, headless vs. pre-styled (pre-styled costs less time up front, headless costs less fighting the design system later), accessibility out of the box for anything interactive, and how much custom theming the real design actually requires.
5. **Read real usage, not just the README's happy path.** Skim open issues for the exact feature this project needs — recurring events, timezone handling, virtualized rendering for a large dataset. A library that's popular in general can still be wrong for the one feature that matters here.
6. **Recommend one, with the real trade-off named.** "X over Y — Y doesn't tree-shake and adds 40kb gzipped for a feature we'd use 10% of" beats a bare recommendation. If two are genuinely close, say so and give the deciding factor rather than forcing false confidence.
7. **Report**: the shortlist considered, the recommendation, the concrete reasons (bundle size, maintenance, license, fit to the actual requirement), and the handoff — `integrate-library` to actually install it and wire it up following the project's wrapper conventions.

Don't install anything as part of this skill. A decision made here can still change once `integrate-library`'s own step 4 — reading the package's actual shipped types — turns up something the docs didn't mention.
