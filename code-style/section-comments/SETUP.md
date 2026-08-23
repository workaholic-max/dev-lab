# Editor setup (WebStorm Live Templates)

`Settings → Editor → Live Templates` → create a template:

- **Abbreviation:** `section-comment`
- **Template text:**
  ```
  // ───────────────────────────────────────────────────────
  // $SECTION_TITLE$
  // ───────────────────────────────────────────────────────
  ```
- **Expand with:** `Tab`
- **Applicable context:** JavaScript, TypeScript, and Vue.

## Additional presets

Typing a section title out every time still costs more than it should once the same titles keep recurring — but that's only worth a dedicated template for a title that names one real, recurring block, not one per macro just because a macro exists. `defineProps`, `defineEmits`, and `defineSlots` don't clear that bar individually — none of them is big enough on its own to be "a block," and they're not unrelated to each other either: they're all part of the same thing, a component's declared surface, which is why a component might have just one of them, or two, or all three, with nothing logically separating one from the next when it does. Two presets earn their own template, set up the same way as above:

### Types

- **Abbreviation:** `section-comment-types`
- **Template text:**
  ```
  // ───────────────────────────────────────────────────────
  // Types
  // ───────────────────────────────────────────────────────
  ```
- **Expand with:** `Tab`
- **Applicable context:** JavaScript, TypeScript, and Vue.

### Component API

Covers whichever of `defineProps`/`defineEmits`/`defineSlots` a component actually declares, as one section regardless of which subset that is — not a title per macro, and not a combinatorial name like "Props & Emits" that would need to change every time a component's mix of macros changes.

- **Abbreviation:** `section-comment-component-api`
- **Template text:**
  ```
  // ───────────────────────────────────────────────────────
  // Component API
  // ───────────────────────────────────────────────────────
  ```
- **Expand with:** `Tab`
- **Applicable context:** JavaScript, TypeScript, and Vue.

Add more of your own the same way for whatever else you write often (a confirmation-modal block, a "General" block, etc.).