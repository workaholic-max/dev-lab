---
name: refactor-component
description: Safely restructure existing code (extract a composable, split a large component, rename for clarity) while preserving behavior exactly. Use when asked to refactor, clean up, extract, or simplify existing code without changing what it does.
---

# Refactor safely

1. **Establish a safety net before changing anything.** If tests exist for the code being refactored, run them first and confirm they pass. If none exist and the refactor is non-trivial, write characterization tests for current behavior first — you need a way to prove nothing changed.
2. **Make the refactor's goal explicit** (extract a composable, split a 400-line component, remove duplication) and scope it — don't let "refactor this component" turn into rewriting unrelated parts you happened to notice.
3. **Preserve the public contract** — props, emits, exposed methods, composable return shape — unless changing it is explicitly the point. Callers shouldn't need to change.
4. **Move in small, verifiable steps** rather than one big rewrite: extract one piece, verify, extract the next. Easier to pinpoint what broke if something does.
5. **Verify identical behavior**: re-run the safety-net tests, typecheck, and for UI changes, a quick before/after screenshot comparison confirming nothing visually shifted.
6. **Report**: what moved where, why, and the verification that confirms behavior is unchanged — refactors that "also happen to" change behavior are bugs, not refactors.
