---
description: Systematically reproduce and fix a runtime bug (broken UI behavior, console error, incorrect state) using evidence from the browser rather than guessing. Use when asked to fix a bug, investigate unexpected behavior, or chase a reported issue.
---

# Debug a runtime issue

1. **Get a reproduction, not a description.** If the report is vague ("X is broken"), ask for exact steps, or reproduce it yourself using the Chrome integration: open the app, follow the reported flow, and read the actual console/network output rather than assuming the cause.
2. **Write a failing test or a minimal repro case first**, if the project's test setup makes that fast. A failing test is both proof the bug exists and proof it's fixed later.
3. **Find the root cause, not the nearest symptom.** A component re-rendering wrong, a store mutation racing a request, a watcher firing before data loads — trace back to where the actual invariant breaks, don't patch the first place the symptom becomes visible.
4. **Fix at the root cause.** If the fix is a defensive null-check or a `v-if` guard, ask whether that's hiding a deeper state-management bug worth flagging even if not fixing right now.
5. **Verify**: run the failing test (now passing), and if it's UI-visible, reproduce the original steps in the browser and confirm the console is clean.
6. **Report**: root cause in one sentence, the fix, and the verification evidence (test output or reproduction steps confirmed fixed).
