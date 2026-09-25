---
name: accessibility-audit
description: Review and fix accessibility issues (keyboard navigation, screen reader support, contrast, focus management) in a component or flow. Use when asked to check, improve, or fix accessibility/a11y.
---

# Accessibility audit

1. **Check semantics first**: correct elements for their role (`button` not `div` with a click handler, real `<label>`s for inputs, headings in order), before reaching for ARIA attributes as a patch.
2. **Verify keyboard operability**: everything clickable is reachable and operable via Tab/Enter/Space/Escape, focus order matches visual order, and nothing traps focus unintentionally (check any modal/dropdown especially).
3. **Verify visible focus states** exist and are not suppressed with `outline: none` without a replacement.
4. **Check contrast** for text and meaningful icons against the actual background, not just against a design system's stated "should be fine."
5. **Check screen-reader basics**: meaningful `alt` text (not filenames), `aria-label` on icon-only buttons, live regions for dynamic content that should be announced (toasts, validation errors).
6. **Verify with the Chrome integration** where practical: tab through the flow, check the accessibility tree via devtools if available.
7. **Report**: findings ordered by severity (broken keyboard access > missing labels > contrast > nice-to-haves), each with a concrete fix.
