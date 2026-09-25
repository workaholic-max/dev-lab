---
name: fix-typescript-errors
description: Systematically resolve TypeScript compiler errors without weakening the type system. Use when asked to fix type errors, resolve a failing typecheck, or clean up any/ts-ignore usage.
---

# Fix TypeScript errors properly

1. Run the project's typecheck command (check CLAUDE.md or package.json scripts — usually `pnpm typecheck` or `vue-tsc --noEmit`). Capture the full error list before fixing anything; don't work from a partial view.
2. Group errors by root cause, not by file. Many unrelated-looking errors often share one cause — a wrong exported type, a missing generic, a stale interface after a refactor.
3. Fix the actual type definition or contract when the error originates upstream, not the call site that merely surfaces it.
4. Never resolve an error by:
   - adding `@ts-ignore` / `@ts-expect-error` without a comment explaining why it's genuinely unavoidable
   - casting to `any` or `as unknown as X` to silence the compiler
   - widening a type to `unknown`/`any` just to make the error disappear
   These are last resorts only, and must be called out explicitly in your final summary so they can be revisited later.
5. Fix at the narrowest correct point — a prop type, a composable's return type, an API response interface — not a blanket type-widening at the top of a file.
6. Re-run the *full* typecheck after each batch of fixes, not just the file you touched. Type fixes commonly ripple to callers.
7. Report: error count before/after, any remaining suppressions and why, and any type-design smell worth a follow-up (e.g. "this store's state should really be a discriminated union").

For a single stubborn inference puzzle rather than a full error list, delegate to the `ts-debugger` subagent instead — it traces one type to its source without flooding this session with every file it has to read to get there.
