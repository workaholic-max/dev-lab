# AGENTS.md

Repository guidance for AI coding agents working in this repo.

## What this repo is

A personal, public reference: real TypeScript code worth keeping — Vue 3 by default where a framework's involved — pulled from my working projects and documented with the reasoning behind it (`code/`), the practices and conventions behind how that code is written (`code-style/`), plus the Claude Code toolkit I use day to day (`ai-assisted-dev/`).

This repo is not a runnable application. Nothing here needs a build step unless a specific entry is explicitly wired up to run standalone — don't add tooling, a `package.json`, or a build pipeline unless a task genuinely requires one.

## Operating Principles

- This repo has three independent parts — treat them differently:
  - **`code/`** is reference material — an actual, reusable piece of code. Each subfolder documents one thing worth keeping — a pattern, an algorithm, an animation, a technique. Don't force an entry into a "pattern" framing if that's not what it actually is; name and structure it for what it is.
  - **`code-style/`** is practices and conventions — how code is written and organized, not a specific reusable piece of code. If an entry's value is "here's a rule/shape worth following," not "here's something to import," it belongs here, not in `code/`. (A short illustrative snippet inline in the README is fine; a `code-style` entry doesn't need its own importable source files the way a `code/` entry does.)
  - **`ai-assisted-dev/`** is a portable personal Claude Code toolkit. Its `CLAUDE.md` is meant to be imported into `~/.claude/CLAUDE.md` so it applies across every project on this machine — it is not scoped to this repo, and working in this repo shouldn't be governed by it directly. See `ai-assisted-dev/README.md`.
- When writing, rewriting, or reviewing any `README.md` in `code/` or `code-style/`, read [`DOCUMENTATION.md`](DOCUMENTATION.md) first instead of improvising a one-off structure.
- Ask before restructuring existing folders — the shape of `code/`, `code-style/`, and `ai-assisted-dev/` is intentional, not incidental.
- Keep documentation honest: real trade-offs, not just benefits. A doc that only lists upsides reads as marketing, not engineering, and undermines the ones that are honest.
- Documentation depth and shape can differ per entry. An algorithm might need complexity analysis; an animation might need timing/easing rationale; a UI pattern might need a comparison against alternative approaches. Don't force every entry into an identical template if the content doesn't call for it.
- New `code/` entries that include Vue components use **TypeScript and Tailwind CSS utility classes** for styling. Plain CSS is the fallback only for the handful of things Tailwind utility classes can't express — `modal-system`'s `@apply`-driven transition classes and its `env(safe-area-inset-bottom)` rule, `icon-system`'s dynamic CSS custom properties and `mask-image` rules. `code/scss-token-system` is a separate case entirely, not an exception to this rule: it documents an SCSS token/barrel convention for a project that hand-writes its own SCSS instead of Tailwind, has no Vue component of its own, and so isn't governed by the Tailwind default in the first place. Nothing here is expected to run standalone out of the box, but it should be correct and drop-in-usable in a project that already has TypeScript and Tailwind configured — that's the bar, not "runs with zero setup."

## Deleting things

This repo is edited through a remote tool bridge that can write and move files but cannot actually delete them (no `rm`/`rmdir`/`unlink`). So: nothing gets deleted directly. When a file or folder needs to go — a stale rename target, dead code, anything genuinely obsolete — move it into `.trash/` at the repo root instead (recreate the original relative path under there, e.g. `code/old-thing/` → `.trash/code/old-thing/`). Do this without stopping to ask permission first; moving something into `.trash/` is reversible and safe by construction. `.trash/` is gitignored and not part of the published repo — it's a holding area for things waiting on an actual delete, which only a human can do. Periodically empty it by hand.

## Project Shape

```
dev-lab/
├── DOCUMENTATION.md    # how to write/rewrite/review any code/ or code-style/ README — read first
├── code/
│   └── <entry-name>/
│       ├── README.md      # required: what it is, how it works, real trade-offs
│       └── Example.*      # optional: only if a short demo adds clarity beyond the README
├── code-style/
│   └── <entry-name>/
│       └── README.md      # a practice/convention, illustrated inline — no separate source files
└── ai-assisted-dev/
    ├── CLAUDE.md            # portable personal defaults — import into ~/.claude/CLAUDE.md
    ├── skills/<name>/SKILL.md
    ├── agents/<name>.md
    └── rules/<name>.md
```

## Commands

None — this repo has no build, test, or lint step by default. If a `code/` entry is extended to run standalone, document its own commands in that entry's `README.md`, not here.

## Project And AI Files

- `AGENTS.md`: this file, shared source of truth for agent behavior in this repo.
- `CLAUDE.md`: Claude Code bridge that imports this file, plus a note distinguishing it from `ai-assisted-dev/CLAUDE.md`. Claude Code is the only AI coding tool this repo currently targets.
- `DOCUMENTATION.md`: how to write, rewrite, or review a `code/` or `code-style/` README — read before touching either.
- `code-style/`: practices and conventions, kept separate from `code/`'s importable source — see its own entries for what qualifies.
- `ai-assisted-dev/`: a separate, portable personal toolkit — see its own `README.md`, not scoped to this repo.
- `.trash/`: gitignored holding area for anything moved out rather than deleted — see "Deleting things" above.
