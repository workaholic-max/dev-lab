# ai-assisted-dev

The Claude Code toolkit I actually use — skills for situations that come up repeatedly, subagents for isolated or adversarial work, and personal conventions.

**This folder is not scoped to `dev-lab`.** Its `CLAUDE.md` is designed to be imported into `~/.claude/CLAUDE.md` (see [`SETUP.md`](SETUP.md)) so it applies to every project on this machine — a new portfolio, `architecture`, freelance work, whatever's next — not just when working inside this repo. Working *inside* `dev-lab` itself is governed by the repo's own root `AGENTS.md`/`CLAUDE.md`, which is a different, repo-scoped file.

## Skills catalog

Each folder under `skills/` is a self-contained workflow Claude Code can run automatically or via `/<name>`:

| Skill                   | Covers                                                                                                                |
|-------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `accessibility-audit`   | Keyboard, screen-reader, contrast, and focus review with concrete fixes                                               |
| `api-integration`       | Wiring a new backend endpoint with proper loading/error/success handling                                              |
| `debug-runtime-issue`   | Reproduce and fix a bug from real evidence, not guesses                                                               |
| `dependency-audit`      | Vulnerability audit with safe fixes applied, risky bumps flagged not auto-applied, verified functionally and visually |
| `fix-typescript-errors` | Systematic type-error resolution, no silent `any`/`ts-ignore`                                                         |
| `implement-design`      | Design/screenshot/Figma → component, verified with a browser screenshot diff                                          |
| `integrate-library`     | Adding a third-party package (e.g. chart.js) following existing wrapper conventions                                   |
| `migrate-codebase`      | Scoped, verified batch migrations (Vuex→Pinia, Options→Composition, etc.)                                             |
| `performance-audit`     | Measured before/after performance fixes, not vibes                                                                    |
| `pre-pr-review`         | Adversarial, fresh-context review of your own diff before opening a PR                                                |
| `refactor-component`    | Restructure code with a safety net, preserving behavior exactly                                                       |
| `spec-from-idea`        | Turn a vague feature idea into a written spec before any code exists                                                  |
| `web-vitals`            | Production Core Web Vitals RUM, attribution, metric-specific diagnosis, fixes, and rollout verification               |
| `write-tests`           | Coverage that tests behavior, matched to the project's existing test conventions                                      |

Not built yet, on the list: onboarding into an unfamiliar codebase, and turning finished code into documentation.

`migrate-codebase` sets `disable-model-invocation: true` — a batch migration is disruptive enough that it should always be invoked on purpose, with `/migrate-codebase`, not triggered by Claude matching a conversational phrase.

## Hooks

Not used yet, deliberately. `CLAUDE.md`, `rules/`, and every skill above are advisory: Claude Code treats them as context it tries to follow, not something it's forced to follow. [Hooks](https://code.claude.com/docs/en/hooks-guide) are the one mechanism that actually enforces something regardless of what Claude decides — a `PreToolUse` hook could, for instance, block a bare `@ts-ignore` the way `fix-typescript-errors` currently only asks Claude not to add one, or run a project's typecheck automatically instead of relying on it being remembered. Worth a real pass once the rest of this toolkit's been lived with for a while, so what gets hard-enforced comes from actual friction rather than a guess.

Also worth knowing: Claude Code's bundled `/run`, `/verify`, and `/run-skill-generator` skills can now launch and drive a project natively once it's recorded a launch recipe once. Several skills above (`implement-design`, `debug-runtime-issue`, `integrate-library`) still describe reaching the dev server by hand through the Chrome integration — that's still what does the actual screenshot/console comparison work, but the "get the app running" step could lean on `/run-skill-generator` instead. Left as written for now rather than rewriting content that's already been tuned through real use.

## Subagents

`agents/code-reviewer.md` — fresh-context adversarial diff review. `agents/ts-debugger.md` — isolated TypeScript root-cause tracing.

## Installing this on a machine

See [`SETUP.md`](SETUP.md). Short version: `sync.ps1` (Windows) or `sync.sh` (macOS/Linux) mirrors `skills/`, `agents/`, and `rules/` into `~/.claude/`, and wires `~/.claude/CLAUDE.md` to import this folder's `CLAUDE.md` via the `@path` syntax so edits here take effect without re-syncing that one file.
