---
name: write-tests
description: Generate test coverage that follows the project's existing testing conventions and actually tests behavior, not implementation details. Use when asked to add tests, improve coverage, or test a specific component/composable/store.
---

# Write tests

1. **Find the project's existing test conventions first** — look at 1-2 existing test files near what you're testing. Match: runner (Vitest/Jest), assertion style, how components are mounted (Vue Test Utils config), how API calls are mocked.
2. **Test behavior, not implementation.** For a component: what the user sees and can do (renders X, emits Y on click, shows an error state) — not internal method calls or private state. For a composable/store: its public return values and side effects.
3. **Cover the cases that actually matter**: the happy path, at least one realistic edge case (empty state, loading, error, boundary values), and any case explicitly mentioned by the person asking. Don't pad coverage with trivial assertions like "renders without crashing" alone.
4. **Avoid over-mocking.** Mock network/time/external services; don't mock the component's own internals just to make assertions easier — that's a sign the test isn't testing anything real.
5. **Run the new tests and the existing suite for that file/module** to confirm nothing broke.
6. **Report**: what's covered, what's deliberately not covered and why (e.g. "skipped visual regression, out of scope"), and the test run output.
