---
description: Plan and execute a mechanical migration across many files (Options API to Composition API, Vuex to Pinia, JS to TS, one library to another). Use when asked to migrate, convert, or batch-update a pattern across the codebase.
disable-model-invocation: true
---

# Migrate across the codebase

1. **Scope first.** Generate the full list of files that need to change and save it to `files.txt`. Don't start editing until you know the real size of the job.
2. **Design the target pattern from one real example**, not from first principles. Write the "before/after" for a single representative file — including its edge cases — and get that exactly right before touching anything else.
3. **Dry-run on 2–3 files.** Apply the pattern, run tests/typecheck/lint on just those, and check the diff matches expectations. This is the step people skip and regret.
4. **Batch the rest**, either in-session file by file with verification after each, or — for large counts — via a scripted loop of `claude -p` calls with `--allowedTools` scoped tightly (Edit plus a per-file git commit), so a bad batch can be `git revert`-ed selectively rather than as one giant commit.
5. **Verify continuously**, not just at the end — typecheck/test/lint after every few files, not once when 200 files have already drifted from the fixed root pattern.
6. **Track exceptions explicitly.** Some files won't fit the mechanical pattern — list them rather than forcing a bad fit or silently skipping them.
7. **Final report**: files migrated, files skipped and why, and the full verification suite run once across everything at the end.
