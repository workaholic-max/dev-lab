---
name: spec-from-idea
description: Turn a vague feature idea into a concrete written spec before any code is written, by having Claude interview you about the hard parts. Use at the start of any feature that's more than a small, obvious change.
---

# Turn an idea into a spec

Use this before implementing anything non-trivial — a spec written before code is cheaper to fix than code written before a spec.

1. Start from a minimal description of the feature.
2. Ask Claude to interview you using `AskUserQuestion` (or plain questions if that tool isn't available), covering: technical implementation approach, UI/UX details, edge cases, what's explicitly out of scope, and any real tradeoffs. Push for the hard parts, not the obvious ones — "what should happen if the user does X while Y is loading" beats "what should the button say."
3. Keep answering until the interview naturally runs out of new questions, not a fixed number of rounds.
4. Have Claude write the result to `SPEC.md`: the files/interfaces involved, what's explicitly out of scope, and an end-to-end verification step that proves the feature actually works when done.
5. Start a **fresh session** to implement from `SPEC.md`. Don't implement in the same session as the interview — the new session should have clean context focused only on building, with the spec as its source of truth.
