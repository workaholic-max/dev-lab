---
description: Run a dependency vulnerability audit, apply only the fixes that are actually safe, and verify nothing broke functionally or visually. Use when asked to run an audit, fix vulnerabilities, or update dependencies for security reasons.
---

# Dependency audit

1. **Detect the package manager from the lockfile** (`pnpm-lock.yaml` → pnpm, per CLAUDE.md's default) and run its audit command (`pnpm audit`, `npm audit`, or `yarn audit`) to get the real, current vulnerability list — advisories change constantly, don't reason from memory.
2. **Split findings into safe and risky.** Safe = fixable with a patch or minor bump with no breaking changes in the package's changelog/release notes. Risky = requires a major bump, or the changelog shows a breaking change even within a minor/patch (rare, but happens). Read the actual changelog for anything you're not certain about — don't assume semver was followed correctly.
3. **Apply only the safe fixes**, one dependency at a time where practical — not a blind `--force` that bumps everything the audit tool is willing to touch.
4. **Never auto-apply a risky fix.** List it instead: package, current version, vulnerable range, fixed version, and why it's risky (a one-line summary of the breaking change). Let the user decide whether it's worth the migration effort.
5. **Verify functionally after every batch of safe fixes**: typecheck, then the affected tests — not the whole suite unless asked (per CLAUDE.md).
6. **Verify visually for any package that touches rendering** — UI component libraries, CSS/animation/charting libraries, anything a `<template>` or `.vue` file imports. Use the Chrome integration to load the pages/components that use it and do a real before/after screenshot comparison, the same way `implement-design` closes its loop — a passing typecheck doesn't rule out a visual regression. Skip this step only for packages with no UI surface (e.g. a pure Node/build-tool utility) and say so explicitly.
7. **Re-run the audit at the end** to confirm only the deferred/risky items remain — don't stop checking after step 3 and leave a fixable vulnerability behind.
8. **Report**: what was fixed (package, version range, the advisory it patched), what was deferred and why, and what was verified (typecheck/tests/visual) for each.
