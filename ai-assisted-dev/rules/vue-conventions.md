# Personal Vue/TS conventions

No `paths:` frontmatter on purpose: path-scoped rules at the user level (`~/.claude/rules/`, where this file lands via `sync.ps1`/`sync.sh`) have documented reliability reports ([anthropics/claude-code#21858](https://github.com/anthropics/claude-code/issues/21858)) that don't affect project-level `.claude/rules/`. This file is small enough that loading it unconditionally in every session costs less than a rule that silently never fires. Revisit this once that's confirmed fixed.

- Composition API with `<script setup lang="ts">` only — no Options API in new code, unless the file you're editing is already Options API and the change is small (match the surrounding style rather than mixing both in one file).
- Type props with `defineProps<{...}>()` and a TS interface, not runtime prop validators, unless the project already relies on runtime validators.
- Destructure props only if the project is on Vue ≥3.5 (reactive props destructure is stable there) — the destructured bindings stay reactive automatically. On older versions, access via `props.foo` or wrap with `toRefs(props)` first; a naive destructure on those versions produces a non-reactive snapshot.
- Before introducing a new state-management pattern in a file, check how the rest of the project manages state and follow that instead.
- Name a Pinia store instance after the store, dropping the `use` prefix — `const authStore = useAuthStore()`, not `store` or `useAuthStore`.
- Prefix booleans with `is`/`has`/`are`/`have` (`isLoading`, `hasError`) rather than a bare noun or adjective — applies to refs, props, and computed alike.
- Separate logical blocks with a one-line section comment in files with more than two or three distinct concerns — it costs almost nothing and makes a file's structure visible before reading a single line of logic:

  ```ts
  // ───────────────────────────────────────────────────────
  // Types
  // ───────────────────────────────────────────────────────
  ```
