# Setup

This folder does nothing by itself — Claude Code only looks in `~/.claude/` (on Windows, `C:\Users\<you>\.claude\`; on macOS/Linux, `~/.claude/`). You need to get these files there, and keep them in sync after edits. Pick the section for your OS below.

## Windows

### Option A — sync script (simplest, works everywhere, no permissions needed)

`sync.ps1` mirrors `skills/`, `agents/`, and `rules/` from here into `~/.claude/`, and makes sure your personal `~/.claude/CLAUDE.md` imports this folder's `CLAUDE.md`.

1. Clone `dev-lab` somewhere permanent, e.g. `C:\Users\<you>\dev-lab`.
2. Open PowerShell inside `dev-lab\ai-assisted-dev` and run:
   ```powershell
   .\sync.ps1
   ```
3. Re-run it any time you edit a skill, agent, or rule.

This is a **copy**, not a live link — if you forget to re-run it, `~/.claude/` has stale content. That's a fine tradeoff for how often you'll actually edit these files, and it completely avoids Windows' symlink permission restrictions.

**Heads up:** `robocopy /MIR` *mirrors* — anything already in `~/.claude/skills`, `~/.claude/agents`, or `~/.claude/rules` that isn't part of this folder's contents gets deleted, not merged. If you keep any other skills/agents/rules there that didn't come from `dev-lab`, back them up (or move them into this folder) before the first run.

### Option B — directory junctions (live-linked, no admin needed)

Windows directory junctions don't require Administrator or Developer Mode (unlike symlinks) and update instantly since it's the same files, not a copy. Run once, from PowerShell:

```powershell
New-Item -ItemType Junction -Path "$HOME\.claude\skills" -Target "C:\Users\<you>\dev-lab\ai-assisted-dev\skills"
New-Item -ItemType Junction -Path "$HOME\.claude\agents" -Target "C:\Users\<you>\dev-lab\ai-assisted-dev\agents"
New-Item -ItemType Junction -Path "$HOME\.claude\rules"  -Target "C:\Users\<you>\dev-lab\ai-assisted-dev\rules"
```

Only do this if `~/.claude/skills`, `~/.claude/agents`, and `~/.claude/rules` don't already exist with other content — a junction replaces the whole folder, it doesn't merge into it. Also make sure `~/.claude\` itself already exists first (open Claude Code once, or `New-Item -ItemType Directory -Force -Path "$HOME\.claude"`) — unlike `sync.ps1`, these junction commands don't create it for you, and `New-Item -ItemType Junction` fails if the parent directory is missing.

For `CLAUDE.md`, don't link the file — import it instead (below). Junctions are directory-only.

## macOS / Linux

### Option A — sync script (simplest, works everywhere, no permissions needed)

`sync.sh` does the same job as `sync.ps1` above, using `rsync` instead of `robocopy`.

1. Clone `dev-lab` somewhere permanent, e.g. `~/dev-lab`.
2. From a terminal inside `dev-lab/ai-assisted-dev`, run:
   ```bash
   chmod +x sync.sh   # only needed once
   ./sync.sh
   ```
3. Re-run it any time you edit a skill, agent, or rule.

Same tradeoff as Windows: this is a **copy**, not a live link. `rsync -a --delete` *mirrors* the same way `robocopy /MIR` does — anything already in `~/.claude/skills`, `~/.claude/agents`, or `~/.claude/rules` that isn't part of this folder's contents gets deleted, not merged. Back up or move in any other skills/agents/rules first.

### Option B — symlinks (live-linked, no admin needed)

Unlike Windows junctions, macOS and Linux symlinks don't need elevated permissions. Run once, from a terminal:

```bash
ln -s ~/dev-lab/ai-assisted-dev/skills ~/.claude/skills
ln -s ~/dev-lab/ai-assisted-dev/agents ~/.claude/agents
ln -s ~/dev-lab/ai-assisted-dev/rules  ~/.claude/rules
```

Only do this if `~/.claude/skills`, `~/.claude/agents`, and `~/.claude/rules` don't already exist with other content — a symlink replaces the whole folder, it doesn't merge into it. Make sure `~/.claude/` itself already exists first (open Claude Code once, or `mkdir -p ~/.claude`).

For `CLAUDE.md`, don't link the file — import it instead (below). Symlinks here are directory-only.

## Linking your personal CLAUDE.md (any option, any OS)

Add a single line to your personal `~/.claude/CLAUDE.md` (create it if it doesn't exist).

On Windows, that's `C:\Users\<you>\.claude\CLAUDE.md`:

```
@C:\Users\<you>\dev-lab\ai-assisted-dev\CLAUDE.md
```

On macOS/Linux, that's `~/.claude/CLAUDE.md`:

```
@~/dev-lab/ai-assisted-dev/CLAUDE.md
```

Claude Code's `@path` import syntax pulls the file's contents in at session start — edit the source here, no sync step needed for this one file.

## Verify it worked

Open Claude Code in *any* project and run `/context` — you should see the CLAUDE.md import listed under **Memory files**. Try `/implement-design` or `/fix-typescript-errors` to confirm the skills are visible, and ask "use the code-reviewer subagent on this diff" to confirm the agents loaded.

## Later: turning this into a proper plugin

Everything above makes these available in every Claude Code session on this machine, which is the point for a personal toolkit. If you later want versioned installs, the ability to toggle the whole bundle on/off per project, or a clean install on a second machine, this same folder can become a Claude Code **plugin** (add a `.claude-plugin/plugin.json` manifest) and be added as a marketplace (`/plugin marketplace add workaholic-max/dev-lab`), installed with `/plugin install`. Being public on GitHub already, that's a drop-in upgrade whenever it's worth doing — not before.
