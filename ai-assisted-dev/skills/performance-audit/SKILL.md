---
name: performance-audit
description: Investigate and fix a performance problem (slow render, large bundle, unnecessary re-renders, memory growth) with measured before/after evidence. Use when asked to speed something up, reduce bundle size, or fix jank/lag. Use `web-vitals` instead when the actual concern is Core Web Vitals (LCP/INP/CLS, Lighthouse, CrUX, Search Console).
---

# Performance audit

1. **Measure before touching anything.** Get a concrete number: bundle size (`vite build` output or a bundle analyzer), a Chrome Performance/Lighthouse trace, or a simple `console.time` around the suspect code. "It feels slow" isn't a baseline.
2. **Find the actual bottleneck** before optimizing anything. Common Vue-specific culprits: values recomputed unnecessarily in templates, watchers with overly broad dependencies, large lists without `v-memo`/virtualization, unnecessarily deep reactivity on large objects, and heavy imports that could be lazy-loaded/code-split.
3. **Fix the biggest bottleneck first**, not the first thing you notice. One 200ms fix beats five 5ms fixes if the 200ms one exists.
4. **Don't trade correctness for speed silently** — if a fix skips a safety check or a validation for performance, say so explicitly rather than burying it in the diff.
5. **Verify with the same measurement method used in step 1**, so before/after are actually comparable.
6. **Report**: the baseline number, the fix, the new number, and anything you decided not to optimize and why (e.g. "not worth the complexity for the marginal gain").
