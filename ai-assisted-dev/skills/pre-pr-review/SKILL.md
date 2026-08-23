---
description: Run an adversarial review of your own diff before opening a PR, using a fresh-context pass so it isn't biased by the reasoning that produced the change. Use before opening any non-trivial PR.
---

# Self-review before opening a PR

1. Once implementation and its own verification (tests/typecheck/screenshots) pass, do NOT immediately open a PR. Run a review pass first, in a fresh context — either the `code-reviewer` subagent or Claude Code's built-in `/code-review`.
2. Give the reviewer the actual diff plus the original ask/spec, and ask it to check: does every requirement get implemented, do the stated edge cases have tests, did anything outside the task's scope change, is there a security or correctness issue.
3. Tell it explicitly to report only gaps that affect correctness or the stated requirements — not style preferences. A reviewer asked to "find gaps" will find some even in solid work; chasing all of them leads to over-engineering.
4. Fix what's actually a gap. For anything flagged that you disagree with, decide deliberately and note why in the PR description rather than silently ignoring it.
5. Only then: write the commit message and PR description, referencing what was verified.
