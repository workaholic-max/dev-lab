---
name: implement-design
description: Implement a UI from a design reference (Figma export, screenshot, or mockup) and verify the result against it via a browser screenshot comparison. Use when asked to build, match, or clean up a design, mockup, or Figma frame.
---

# Implement a design

Follow this loop for any "build this design" or "make it match X" request.

1. **Gather the reference.** Ask for the design as a pasted screenshot, an image `@file`, or a Figma export. If only a Figma link is given and no Figma MCP is connected, ask for a PNG export of the frame instead of guessing from the link.
2. **Survey existing patterns before writing anything.** Search for a `components/global` or `components/shared` directory and list which existing components already cover part of the layout (buttons, cards, inputs, spacing scale). State what you're reusing before generating new markup — don't invent a second Button component.
3. **Match the project's actual stack.** Composition vs Options API, Tailwind vs SCSS modules vs a component library's theming, how props are typed. Don't introduce a pattern the project doesn't already use without saying so first.
4. **Implement.**
5. **Verify with a screenshot loop** (needs the Chrome integration — `claude --chrome` or `/chrome`):
   - Open the local dev server route for the new/changed component.
   - Take a screenshot.
   - Compare against the reference: layout, spacing, colors, type, and responsive behavior at least at one narrow viewport.
   - List concrete differences — not "looks close" — and fix them.
   - Repeat until differences are gone or clearly explainable (e.g. dynamic data vs. a static mock).
6. **Check accessibility basics** — semantic elements, alt text, visible focus states, contrast — and call these out even if not explicitly requested.
7. **Report** what you built, what you reused vs. created new, and the final screenshot comparison as evidence.

Do not call the task done without step 5. "Looks right" without an actual screenshot comparison is not verification.
