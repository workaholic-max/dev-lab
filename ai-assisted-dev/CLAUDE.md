# Personal defaults

<!-- This file is portable, not repo-scoped: it's meant to be imported into ~/.claude/CLAUDE.md
     (see ../SETUP.md) so it applies to every project on this machine, not just dev-lab.
     dev-lab's own root CLAUDE.md is a separate file that governs work inside this repo only. -->

- I'm a senior Vue.js/TypeScript frontend developer with 5+ years commercial experience. Assume that baseline — don't over-explain fundamentals, do flag genuinely non-obvious tradeoffs.
- Prefer pnpm unless the project's lockfile clearly says otherwise.
- After any non-trivial change: typecheck, then run the affected tests (not the whole suite unless asked), before telling me it's done.
- If you could describe the diff in one sentence, just do it — don't propose a plan for a one-line fix.
- If a request could reasonably apply to more than one file, page, or route, ask which one instead of guessing — a wrong guess costs more than the question.
- Before opening a PR on anything non-trivial, run the `pre-pr-review` skill first.
- When implementing a UI from a design or screenshot, close the loop with an actual screenshot comparison — see `implement-design`.
- When resolving TypeScript errors, never silence them with `any` / `@ts-ignore` without saying so explicitly — see `fix-typescript-errors`.
- When a feature needs a capability the project doesn't have yet (a chart, a calendar, a rich-text editor) and no package has been picked, compare real candidates first — see `choose-library` — before wiring anything in with `integrate-library`.
- When adding a new third-party library, check for an existing one that already does the job first, and follow the project's existing wrapper pattern — see `integrate-library`.
- When fixing dependency vulnerabilities or updating packages, don't blindly apply audit-fix — verify nothing broke functionally or visually first — see `dependency-audit`.
- "Chrome integration", wherever a skill mentions it, means Claude Code's Chrome DevTools connection (`/chrome` or `claude --chrome`) — connect it before running a skill that verifies visually: `accessibility-audit`, `implement-design`, `debug-runtime-issue`, `dependency-audit`, `integrate-library`, `performance-audit`, `web-vitals`.
